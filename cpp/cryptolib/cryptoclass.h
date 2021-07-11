#ifndef CRYPTOLIB_CRYPTO_CLASS
#define CRYPTOLIB_CRYPTO_CLASS
#include <string>

//typedef unsigned char byte;
#include "eccrypto.h"
using CryptoPP::byte;

class CryptoClass{
public:
  virtual bool genKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile) = 0;
  virtual bool loadKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile) = 0;
  virtual bool genKeyText(std::string& privateKeyText, std::string& publicKeyText) = 0;
  virtual bool loadKeyText(const std::string& privateKeyText, const std::string& publicKeyText) = 0;
  virtual bool encrypt(const std::vector<byte>& message, int length, std::vector<byte>& newmessage, int& newlength) = 0;
  virtual bool decrypt(const std::vector<byte>& message, int length, std::vector<byte>& newmessage, int& newlength) = 0;  
  virtual int getCryptBlockSize(int plainSize) = 0;
};
#endif