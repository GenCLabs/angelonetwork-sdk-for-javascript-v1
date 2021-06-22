#include <iostream>
#include <string>

#include "cryptlib.h"
#include "pwdbased.h"
#include "sha.h"
#include "files.h"
#include "aes.h"
#include "modes.h"
#include "hex.h"

int main(int argc, char* argv[])
{
  using namespace CryptoPP;

  byte password[] ="password";
  size_t plen = strlen((const char*)password);

  byte info1[] = "PKCS5_PBKDF2_HMAC key derivation";
  size_t ilen1 = strlen((const char*)info1);

  byte info2[] = "PKCS5_PBKDF2_HMAC iv derivation";
  size_t ilen2 = strlen((const char*)info2);

  byte key[AES::DEFAULT_KEYLENGTH];
  byte iv[AES::BLOCKSIZE];

  PKCS5_PBKDF2_HMAC<SHA256> pbkdf;
  byte unused = 0;

  pbkdf.DeriveKey(key, sizeof(key), unused, password, plen, info1, ilen1, 1024, 0.0f);
  pbkdf.DeriveKey(iv, sizeof(iv), unused, password, plen, info2, ilen2, 1024, 0.0f);

  std::cout << "Key: ";
  StringSource(key, sizeof(key), true, new HexEncoder(new FileSink(std::cout)));
  std::cout << std::endl;

  std::cout << "IV: ";
  StringSource(iv, sizeof(iv), true, new HexEncoder(new FileSink(std::cout)));
  std::cout << std::endl;

  CBC_Mode<AES>::Encryption enc;
  enc.SetKeyWithIV(key, sizeof(key), iv, sizeof(iv));

  // Use AES/CBC encryptor

  return 0;
}