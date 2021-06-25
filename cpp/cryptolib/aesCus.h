#ifndef AES_CRYPTO_LIB
#define AES_CRYPTO_LIB
#include <string>
#include "cryptoclass.h"
#include "aes.h"
using CryptoPP::AES;
#include "osrng.h"
using CryptoPP::AutoSeededRandomPool;
using CryptoPP::byte;

class AESCrypto : public CryptoClass{
public:
  virtual bool genKeyFile(const std::string& encryptKey, const std::string& iv);
  virtual bool loadKeyFile(const std::string& encryptKey, const std::string& iv);
  virtual bool genKeyText(std::string& encryptKey, std::string& iv);
  virtual bool loadKeyText(const std::string& encryptKey, const std::string& iv);
  virtual bool encrypt(const byte* message, int length, byte*& newmessage, int& newlength);
  virtual bool decrypt(const byte* message, int length, byte*& newmessage, int& newlength);  
  virtual int getCryptBlockSize(int plainSize);
private:
    std::unique_ptr<CryptoPP::SecByteBlock> _encryptKey;// (AES::DEFAULT_KEYLENGTH);
    std::unique_ptr<CryptoPP::SecByteBlock> _iv;// (AES::BLOCKSIZE);
};

#endif