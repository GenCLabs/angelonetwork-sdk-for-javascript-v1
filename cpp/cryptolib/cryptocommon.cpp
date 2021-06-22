#include "cryptolib.h"
#include "aes.h"
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
std::string EncodeBase64(byte* message, int length){
  std::string encoded;
  //CryptoPP::StringSource ss(message, length, true, new CryptoPP::Base64Encoder(new CryptoPP::StringSink(encoded)));
  CryptoPP::Base64Encoder encoder;
  encoder.Put(message, length);
  encoder.MessageEnd();

  auto size = encoder.MaxRetrievable();
  if(size){
    encoded.resize(size);
    encoder.Get((byte*)&encoded[0],encoded.size());
  }
  return encoded;
}
void DecodeBase64(const std::string& message, byte*& outMessage, int& outlength){
  std::string encoded;
  //CryptoPP::StringSource ss(message, length, true, new CryptoPP::Base64Encoder(new CryptoPP::StringSink(encoded)));
  CryptoPP::Base64Decoder decoder;
  decoder.Put((byte*)message.data(), message.size());
  decoder.MessageEnd();

  outlength = 0;
  auto size = decoder.MaxRetrievable();  
  if(size && size <= SIZE_MAX){
    outMessage = new byte[size];
    decoder.Get(outMessage, size);
    outlength = size;
  }
}

std::string EncodeFile(const std::string& encodeType, const std::string& file) {
  std::string basestr;
  std::vector<byte> buffer;
  FileSource ifs(file.c_str(), true, new CryptoPP::VectorSink(buffer), true);
  
  ifs.PumpAll();  
  std::string text = EncodeBase64((byte*)buffer.data(), buffer.size());  
  buffer.clear();
  return text;
}

void DecodeFile(const std::string& encodeType, const std::string& code, const std::string& file) {
  FileSink ofs(file.c_str(), true);  
  
  byte* newMessage; int newLength;
  DecodeBase64(code, newMessage, newLength);
  
  ofs.Put(newMessage, newLength);  
  delete[]newMessage;    

  ofs.MessageEnd();  
}
