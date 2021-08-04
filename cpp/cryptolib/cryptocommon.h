#ifndef CRYPTO_COMMON_LIB
#define CRYPTO_COMMON_LIB
#include <string>

#include "aes.h"
#include "ecc.h"

std::string EncodeBase64(const byte* message, int length);
void DecodeBase64(const std::string& message, byte*& outMessage, int& outlength);
std::string EncodeFile(const std::string& encodeType, const std::string& file);
void DecodeFile(const std::string& encodeType, const std::string& code, const std::string& file);
std::string Hex(const byte* message, int length);

#endif