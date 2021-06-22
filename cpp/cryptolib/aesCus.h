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
  virtual bool genKey(const std::string& encryptKey, const std::string& iv);
  virtual bool loadKey(const std::string& encryptKey, const std::string& iv);
  virtual bool encrypt(const byte* message, int length, byte*& newmessage, int& newlength);
  virtual bool decrypt(const byte* message, int length, byte*& newmessage, int& newlength);  
  virtual int getCryptBlockSize(int plainSize);
private:
	byte _encryptKey[AES::DEFAULT_KEYLENGTH];
	byte _iv[AES::BLOCKSIZE];
	CryptoPP::AutoSeededRandomPool _rng;
};

#endif