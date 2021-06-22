#ifndef CRYPTO_LIB
#define CRYPTO_LIB
#include <string>

enum CryptoType{
    LIB_AES, LIB_ECC
};
class CryptoClass;
class CryptoLib
{
public:
  CryptoLib(const std::string& cryptoType);
  CryptoLib(CryptoType cryptoType);
  CryptoLib(CryptoType cryptoType,const std::string& privateKeyFile, const std::string& publicKeyFile);
  ~CryptoLib();
  bool genKey(const std::string& privateKeyFile, const std::string& publicKeyFile);
  bool loadKey(const std::string& privateKeyFile, const std::string& publicKeyFile);
  std::string encryptText(const std::string& message);
  std::string decryptText(const std::string& message);
  void encryptFile(const std::string& inputFile, const std::string& outputFile);
  void decryptFile(const std::string& inputFile, const std::string& outputFile);
  
private:
  CryptoClass* _crypto;   
};

#endif