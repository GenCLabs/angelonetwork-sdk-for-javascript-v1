#ifndef ECC_CRYPTO_LIB
#define ECC_CRYPTO_LIB
#include <string>
#include <cryptoclass.h>
#include "eccrypto.h"
#include "osrng.h"
using CryptoPP::ECDSA;
using CryptoPP::ECP;
using CryptoPP::SHA1;

//#include "modes.h"

#define ECC_ALGORITHM CryptoPP::ECP
// #define ECC_ALGORITHM CryptoPP::EC2N

// ECC Curves over F(p)
// Use when ECC_ALGORITHM is CryptoPP::ECP
//
// #define ECC_CURVE CryptoPP::ASN1::secp112r1()
// #define ECC_CURVE CryptoPP::ASN1::secp112r2()
// #define ECC_CURVE CryptoPP::ASN1::secp128r1()
// #define ECC_CURVE CryptoPP::ASN1::secp128r2()
// #define ECC_CURVE CryptoPP::ASN1::secp160r1()
// #define ECC_CURVE CryptoPP::ASN1::secp160k1()
// #define ECC_CURVE CryptoPP::ASN1::secp160r2()
#define ECC_CURVE CryptoPP::ASN1::brainpoolP160r1()
// #define ECC_CURVE CryptoPP::ASN1::secp192k1()
// #define ECC_CURVE CryptoPP::ASN1::ASN1::brainpoolP192r1()
// #define ECC_CURVE CryptoPP::ASN1::secp224k1()
// #define ECC_CURVE CryptoPP::ASN1::secp224r1()
// #define ECC_CURVE CryptoPP::ASN1::brainpoolP224r1()
// #define ECC_CURVE CryptoPP::ASN1::secp256k1()
// #define ECC_CURVE CryptoPP::ASN1::brainpoolP256r1()
// #define ECC_CURVE CryptoPP::ASN1::brainpoolP320r1()
// #define ECC_CURVE CryptoPP::ASN1::secp384r1()
// #define ECC_CURVE CryptoPP::ASN1::brainpoolP384r1()
// #define ECC_CURVE CryptoPP::ASN1::secp521r1()
// #define ECC_CURVE CryptoPP::ASN1::brainpoolP512r1()

// ECC Curves over GF(2)
// Use when ECC_ALGORITHM is CryptoPP::EC2N
//
// #define ECC_CURVE CryptoPP::ASN1::sect113r1()
// #define ECC_CURVE CryptoPP::ASN1::sect113r2()
// #define ECC_CURVE CryptoPP::ASN1::sect131r1()
// #define ECC_CURVE CryptoPP::ASN1::sect131r2()
// #define ECC_CURVE CryptoPP::ASN1::sect163k1()
// #define ECC_CURVE CryptoPP::ASN1::sect163r1()
// #define ECC_CURVE CryptoPP::ASN1::sect163r2()
// #define ECC_CURVE CryptoPP::ASN1::sect193r1()
// #define ECC_CURVE CryptoPP::ASN1::sect193r2()
// #define ECC_CURVE CryptoPP::ASN1::sect233k1()
// #define ECC_CURVE CryptoPP::ASN1::sect233r1()
// #define ECC_CURVE CryptoPP::ASN1::sect239k1()
// #define ECC_CURVE CryptoPP::ASN1::sect283k1()
// #define ECC_CURVE CryptoPP::ASN1::sect283r1()
// #define ECC_CURVE CryptoPP::ASN1::sect409k1()
// #define ECC_CURVE CryptoPP::ASN1::sect409r1()
// #define ECC_CURVE CryptoPP::ASN1::sect571k1()
// #define ECC_CURVE CryptoPP::ASN1::sect571r1()
  

class ECCCrypto : public CryptoClass{
public:
  virtual bool genKey(const std::string& privateKeyFile, const std::string& publicKeyFile);
  virtual bool loadKey(const std::string& privateKeyFile, const std::string& publicKeyFile);
  virtual bool encrypt(const byte* message, int length, byte*& newmessage, int& newlength);
  virtual bool decrypt(const byte* message, int length, byte*& newmessage, int& newlength);
  virtual int getCryptBlockSize(int plainSize);
private:
  void UpdateEncryptor();
  void UpdateDecryptor();
  CryptoPP::ECIES<ECC_ALGORITHM >::PrivateKey _privateKey;    
  CryptoPP::ECIES<ECC_ALGORITHM >::PublicKey _publicKey;
  CryptoPP::ECIES<ECC_ALGORITHM>::Decryptor _Decryptor;
  CryptoPP::ECIES<ECC_ALGORITHM>::Encryptor _Encryptor;
  //CryptoPP::StreamTransformation* _EncryptorTransform;
  //CryptoPP::StreamTransformation* _DecryptorTransform;
  CryptoPP::AutoSeededRandomPool _rng;
};

int main_ecc(int argc, char* argv[]);
#endif