#include "cryptolib.h"
#include "cryptocommon.h"
#include "keyderivation.h"
#include "aesCus.h"
#include "ecc.h"

#include "files.h"
using CryptoPP::FileSource;
using CryptoPP::FileSink;

#include "filters.h"
using CryptoPP::StreamTransformationFilter;
using CryptoPP::MeterFilter;
using CryptoPP::Redirector;

#include "modes.h"

#include "base64.h"


CryptoLib::CryptoLib(const std::string& cryptoType){
  if(cryptoType == "aes"){
    _crypto = new AESCrypto();
    _cryptoType = CryptoType::LIB_AES;
  }else if(cryptoType == "ecc"){
    _crypto = new ECCCrypto();
    _cryptoType = CryptoType::LIB_ECC;
  }
}
CryptoLib::CryptoLib(CryptoType cryptoType){
  _cryptoType = cryptoType;
  if(cryptoType == CryptoType::LIB_AES){
    _crypto = new AESCrypto();
  }else if(cryptoType == CryptoType::LIB_ECC){
    _crypto = new ECCCrypto();
  }
}
CryptoLib::CryptoLib(CryptoType cryptoType,const std::string& privateKeyFile, const std::string& publicKeyFile){
  _cryptoType = cryptoType;
  if(cryptoType == CryptoType::LIB_AES){
    _crypto = new AESCrypto();
  }else if(cryptoType == CryptoType::LIB_ECC){
    _crypto = new ECCCrypto();
  }
  loadKeyFile(privateKeyFile, publicKeyFile);
}

bool CryptoLib::genKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile){
  return _crypto->genKeyFile(privateKeyFile, publicKeyFile);
}
bool CryptoLib::loadKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile){
  return _crypto->loadKeyFile(privateKeyFile, publicKeyFile);
}

bool CryptoLib::genKeyText() 
{
    std::string privateKeyFile, publicKeyFile;
    _crypto->genKeyText(privateKeyFile, publicKeyFile);
    std::cout << "{\"privateKey\":\"" << privateKeyFile << "\",\"publicKey\":\"" << publicKeyFile << "\",\"keyType\":\"" << getCryptoType() << "\"}";
    return true;
}

bool CryptoLib::loadKeyText(const std::string& privateKeyFile, const std::string& publicKeyFile) {
    return _crypto->loadKeyText(privateKeyFile, publicKeyFile);
}

std::string CryptoLib::encryptText(const std::string& message){
  int length = message.length();
  byte* newMessage;
  int newLength;
  _crypto->encrypt(reinterpret_cast<const byte*>(message.data()), length, newMessage, newLength);
  //std::string newText(reinterpret_cast<char*>(newMessage));
  std::string newText=EncodeBase64(newMessage, newLength);
  delete[] newMessage;
  return "{\"cipher\":\"" + newText + "\"}";;
}
std::string CryptoLib::decryptText(const std::string& message){
  byte* inputData;
  int length;
  DecodeBase64(message, inputData, length);
  //int length = message.length() + 1;
  byte* newMessage;
  int newLength;
  //_crypto->decrypt(reinterpret_cast<const byte*>(message.data()), length, newMessage, newLength);
  _crypto->decrypt(inputData, length, newMessage, newLength);
  byte* data = new byte[newLength + 1];
  data[newLength] = 0;
  std::copy(newMessage, newMessage + newLength, data);
  std::string newText(reinterpret_cast<char*>(data));
  delete[] newMessage;
  delete[] inputData;
  return "{\"plain\":\"" + newText + "\"}";
}

inline bool EndOfFile(const FileSource& file)
{
  std::istream* stream = const_cast<FileSource&>(file).GetStream();
  return stream->eof();
}

void CryptoLib::encryptFile(const std::string& inputFile, const std::string& outputFile){
  //transformFile(inputFile, outputFile, _crypto->CreateEncryptTransformation());
  //std::cout << "Create file source" << std::endl;
  FileSource ifs(inputFile.c_str(), false);
  FileSink ofs(outputFile.c_str());
  std::vector<byte> buffer;
  
  
    
  //std::cout << "Attach filter" << std::endl;
  ifs.Attach(new CryptoPP::VectorSink(buffer));
  // filter.Attach(new Redirector(meter));
  // meter.Attach(new Redirector(ofs));

  const int BLOCK_SIZE = 4096;
  long processed = 0;

  //std::cout << "Begin each block" << std::endl;
  while(!EndOfFile(ifs) && !ifs.SourceExhausted())
  {
    ifs.Pump(BLOCK_SIZE);
    //filter.Flush(false);
    byte* newMessage; int newLength;
    _crypto->encrypt((byte*)buffer.data(), buffer.size(), newMessage, newLength);
    buffer.clear();

    ofs.Put(newMessage, newLength);
    processed += BLOCK_SIZE;
    delete []newMessage;
    //if (processed % (1024*1024*10) == 0)
    //  std::cout << "Processed: " << meter.GetTotalBytes() << std::endl;
  }

  // Signal there is no more data to process.
  // The dtor's will do this automatically.
  ofs.MessageEnd();
}
void CryptoLib::decryptFile(const std::string& inputFile, const std::string& outputFile){
  //transformFile(inputFile, outputFile, _crypto->CreateDecryptTransformation());
  //transformFile(inputFile, outputFile, _crypto->CreateEncryptTransformation());
  //std::cout << "Create file source" << std::endl;
  FileSource ifs(inputFile.c_str(), false);
  FileSink ofs(outputFile.c_str());
  std::vector<byte> buffer;
      
  //std::cout << "Attach filter" << std::endl;
  ifs.Attach(new CryptoPP::VectorSink(buffer));
  // filter.Attach(new Redirector(meter));
  // meter.Attach(new Redirector(ofs));

  const int BLOCK_SIZE = 4096;
  long processed = 0;
  const int crypt_size = _crypto->getCryptBlockSize(BLOCK_SIZE);
  //std::cout << "Begin each block" << crypt_size << std::endl;
  while(!EndOfFile(ifs) && !ifs.SourceExhausted())
  {
    ifs.Pump(crypt_size);
    //filter.Flush(false);
    byte* newMessage; int newLength;
    _crypto->decrypt((byte*)buffer.data(), buffer.size(), newMessage, newLength);
    buffer.clear();

    ofs.Put(newMessage, newLength);
    processed += crypt_size;
    delete []newMessage;
    //if (processed % (1024*1024*10) == 0)
    //  std::cout << "Processed: " << meter.GetTotalBytes() << std::endl;
  }

  // Signal there is no more data to process.
  // The dtor's will do this automatically.
  ofs.MessageEnd();
}

void CryptoLib::deriveKey(const std::string& longtext)
{
    std::string key, iv;
    string2AESKeyBase64(longtext, key, iv);
    std::cout << "{\"privateKey\":\"" << key << "\",\"publicKey\":\"" << iv << "\",\"keyType\":\"aes\"}";
}

std::string CryptoLib::getCryptoType()
{
    switch (_cryptoType)
    {
    case LIB_AES:
        return "aes";
        break;
    case LIB_ECC:
        return "ecc";
        break;
    default:
        break;
    }
    return "";
}

CryptoLib::~CryptoLib(){
  if(_crypto != nullptr)
    delete (CryptoClass*)_crypto;
}