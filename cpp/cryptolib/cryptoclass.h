#ifndef CRYPTOLIB_CRYPTO_CLASS
#define CRYPTOLIB_CRYPTO_CLASS
#include <string>

//typedef unsigned char byte;
#include "eccrypto.h"
using CryptoPP::byte;

class CryptoClass{
public:
  virtual bool genKey(const std::string& privateKeyFile, const std::string& publicKeyFile) = 0;
  virtual bool loadKey(const std::string& privateKeyFile, const std::string& publicKeyFile) = 0;
  virtual bool encrypt(const byte* message, int length, byte*& newmessage, int& newlength) = 0;
  virtual bool decrypt(const byte* message, int length, byte*& newmessage, int& newlength) = 0;  
  virtual int getCryptBlockSize(int plainSize) = 0;
};
#endif