#ifndef ECC_CRYPTO_LIB
#define ECC_CRYPTO_LIB
#include <string>
#include "cryptolib.h"
#include "eccrypto.h"
using CryptoPP::ECDSA;
using CryptoPP::ECP;
using CryptoPP::SHA1;

class ECDSACrypto : public CryptoClass{
public:
  virtual bool genKey(const std::string& privateKeyFile, const std::string& publicKeyFile);
  virtual bool loadKey(const std::string& privateKeyFile, const std::string& publicKeyFile);
  virtual std::string encryptText(const std::string& message);
  virtual std::string decryptText(const std::string& message);
  virtual void encryptFile(const std::string& inputFile, const std::string& outputFile);
  virtual void decryptFile(const std::string& inputFile, const std::string& outputFile);
private:
  ECDSA<ECP, SHA1>::PrivateKey _privateKey;
  ECDSA<ECP, SHA1>::PublicKey _publicKey;
};

int main_ecc(int argc, char* argv[]);
#endif