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
  bool genKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile);
  bool loadKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile);
  bool genKeyText();
  bool loadKeyText(const std::string& privateKeyFile, const std::string& publicKeyFile);
  std::string encryptText(const std::string& message);
  std::string decryptText(const std::string& message);
  void encryptFile(const std::string& inputFile, const std::string& outputFile);
  void decryptFile(const std::string& inputFile, const std::string& outputFile);
  static void deriveKey(const std::string& longtext);
  std::string getCryptoType();
private:
  CryptoClass* _crypto;
  CryptoType _cryptoType;
};

#endif