#include <iostream>
#include <string>

#include "cryptlib.h"
#include "pwdbased.h"
#include "sha.h"
#include "files.h"
#include "aes.h"
#include "modes.h"
#include "hex.h"
#include "cryptocommon.h"

using namespace CryptoPP;
int string2AESKeyBin(const std::string& passwordString, std::unique_ptr<CryptoPP::SecByteBlock>& key, std::unique_ptr<CryptoPP::SecByteBlock>& iv);
void string2AESKeyBase64(const std::string& passwordString, std::string& key, std::string& iv) 
{
	//std::cout << "password:" << passwordString << std::endl;
	std::unique_ptr<CryptoPP::SecByteBlock> keyblock;
	std::unique_ptr<CryptoPP::SecByteBlock> ivblock;
	string2AESKeyBin(passwordString, keyblock, ivblock);
	key = EncodeBase64(keyblock->data(), keyblock->size());
	iv = EncodeBase64(ivblock->data(), ivblock->size());

}
int string2AESKeyBin(const std::string& passwordString, std::unique_ptr<CryptoPP::SecByteBlock>& key, std::unique_ptr<CryptoPP::SecByteBlock>& iv)
{
  
  //const char* ptr= passwordString.c_str();
	//std::cout << "password:" << passwordString << std::endl;
  const byte* password = (const byte*)&passwordString[0];
  size_t plen = strlen((const char*)password);

  byte info1[] = "PKCS5_PBKDF2_HMAC key derivation";
  size_t ilen1 = strlen((const char*)info1);

  byte info2[] = "PKCS5_PBKDF2_HMAC iv derivation";
  size_t ilen2 = strlen((const char*)info2);

  key.reset(new SecByteBlock(AES::DEFAULT_KEYLENGTH));
  iv.reset(new SecByteBlock(AES::BLOCKSIZE));

  PKCS5_PBKDF2_HMAC<SHA256> pbkdf;
  byte unused = 0;

  pbkdf.DeriveKey(key->data(), key->size(), unused, password, plen, info1, ilen1, 1024, 0.0f);
  pbkdf.DeriveKey(iv->data(), iv->size(), unused, password, plen, info2, ilen2, 1024, 0.0f);

  //std::cout << "Key: ";
  //StringSource(key->data(), key->size(), true, new HexEncoder(new FileSink(std::cout)));
  //std::cout << std::endl;

  //std::cout << "IV: ";
  //StringSource(key->data(), key->size(), true, new HexEncoder(new FileSink(std::cout)));
  //std::cout << std::endl;

  //CBC_Mode<AES>::Encryption enc;
  //enc.SetKeyWithIV(key, sizeof(key), iv, sizeof(iv));

  // Use AES/CBC encryptor

  return 0;
}