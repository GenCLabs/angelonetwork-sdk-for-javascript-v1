#include "cryptolib.h"
#include "cryptocommon.h"
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
  }else if(cryptoType == "ecc"){
    _crypto = new ECCCrypto();
  }
}
CryptoLib::CryptoLib(CryptoType cryptoType){
  if(cryptoType == CryptoType::LIB_AES){
    _crypto = new AESCrypto();
  }else if(cryptoType == CryptoType::LIB_ECC){
    _crypto = new ECCCrypto();
  }
}
CryptoLib::CryptoLib(CryptoType cryptoType,const std::string& privateKeyFile, const std::string& publicKeyFile){
  if(cryptoType == CryptoType::LIB_AES){
    _crypto = new AESCrypto();
  }else if(cryptoType == CryptoType::LIB_ECC){
    _crypto = new ECCCrypto();
  }
  loadKey(privateKeyFile, publicKeyFile);
}

bool CryptoLib::genKey(const std::string& privateKeyFile, const std::string& publicKeyFile){
  return _crypto->genKey(privateKeyFile, publicKeyFile);
}
bool CryptoLib::loadKey(const std::string& privateKeyFile, const std::string& publicKeyFile){
  return _crypto->loadKey(privateKeyFile, publicKeyFile);
}
std::string CryptoLib::encryptText(const std::string& message){
  int length = message.length() + 1;
  byte* newMessage;
  int newLength;
  _crypto->encrypt(reinterpret_cast<const byte*>(message.data()), length, newMessage, newLength);
  //std::string newText(reinterpret_cast<char*>(newMessage));
  std::string newText=EncodeBase64(newMessage, newLength);
  delete[] newMessage;
  return newText;
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
  std::string newText(reinterpret_cast<char*>(newMessage));
  delete[] newMessage;
  delete[] inputData;
  return newText;
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

CryptoLib::~CryptoLib(){
  if(_crypto != nullptr)
    delete (CryptoClass*)_crypto;
}