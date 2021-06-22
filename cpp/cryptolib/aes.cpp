#include "aes.h"
#include "aesCus.h"
#include "osrng.h"
using CryptoPP::AutoSeededRandomPool;
using CryptoPP::byte;

#include <iostream>
using std::cout;
using std::cerr;
using std::endl;

#include <string>
using std::string;

#include <cstdlib>
using std::exit;

#include "cryptlib.h"
using CryptoPP::Exception;

#include "hex.h"
using CryptoPP::HexEncoder;
using CryptoPP::HexDecoder;

#include "filters.h"
using CryptoPP::StringSink;
using CryptoPP::StringSource;
using CryptoPP::StreamTransformationFilter;

#include "aes.h"
using CryptoPP::AES;

#include "ccm.h"
using CryptoPP::CBC_Mode;

#include "assert.h"

#include "files.h"
using CryptoPP::FileSource;
using CryptoPP::FileSink;

bool AESCrypto::genKey(const std::string& privateKeyFile, const std::string& publicKeyFile) {
	_rng.GenerateBlock(_encryptKey, sizeof(_encryptKey));
	_rng.GenerateBlock(_iv, sizeof(_iv));

	//std::string encryptKey(reinterpret_cast<const char *>(_encryptKey));
	//std::string iv(reinterpret_cast<const char *>(_iv));
  std::ofstream(privateKeyFile, std::ios::binary).write((char*)_encryptKey, sizeof(_encryptKey));
  std::ofstream(publicKeyFile, std::ios::binary).write((char*)_iv, sizeof(_iv));
  
	return true;
}
bool AESCrypto::loadKey(const std::string& privateKeyFile, const std::string& publicKeyFile) {
  if(privateKeyFile != "")
    std::ifstream(privateKeyFile, std::ios::binary).read((char*)_encryptKey, sizeof(_encryptKey));
  if(publicKeyFile != "")
    std::ifstream(publicKeyFile, std::ios::binary).read((char*)_iv, sizeof(_iv));
	/*if (encryptKey != "") {
		std::copy(encryptKey.begin(), encryptKey.end(), _encryptKey);
	}
	if (iv != "") {
		std::copy(iv.begin(), iv.end(), _iv);
	}*/
	return true;
}

bool AESCrypto::encrypt(const byte* message, int length, byte*& newmessage, int& newlength){
	//Encrypt
	try
	{
		cout << "plain text: " << message << endl;

		CBC_Mode< AES >::Encryption e;
		e.SetKeyWithIV(_encryptKey, sizeof(_encryptKey), _iv);

		// The StreamTransformationFilter removes
		//  padding as required.
		string cipher;
		StringSource s(message, true,
			new StreamTransformationFilter(e,
				new StringSink(cipher)
			) // StreamTransformationFilter
		); // StringSource

		std::copy(cipher.begin(), cipher.end(), newmessage);
		newlength = sizeof(cipher);
	}
	catch (const CryptoPP::Exception& e)
	{
		cerr << e.what() << endl;
		return false;
	}
	return true;
}
bool AESCrypto::decrypt(const byte* message, int length, byte*& newmessage, int& newlength){
	try
	{
		CBC_Mode< AES >::Decryption d;
		d.SetKeyWithIV(_encryptKey, sizeof(_encryptKey), _iv);

		// The StreamTransformationFilter removes
		//  padding as required.
		string recovered;
		StringSource s(message, true,
			new StreamTransformationFilter(d,
				new StringSink(recovered)
			) // StreamTransformationFilter
		); // StringSource

		std::copy(recovered.begin(), recovered.end(), newmessage);
		newlength = sizeof(recovered);
	}
	catch (const CryptoPP::Exception& e)
	{
		cerr << e.what() << endl;
		return false;
	}
	return true;
}
int AESCrypto::getCryptBlockSize(int plainSize){
  CBC_Mode< AES >::Decryption d;
  
  return plainSize;
}
