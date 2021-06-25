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

#include "rijndael.h"
#include "modes.h"
#include "osrng.h"
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

#include "cryptocommon.h"

bool AESCrypto::genKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile) 
{
	AutoSeededRandomPool prng;
	CryptoPP::SecByteBlock key(AES::DEFAULT_KEYLENGTH);
	CryptoPP::SecByteBlock iv(AES::BLOCKSIZE);

	prng.GenerateBlock(key, key.size());
	prng.GenerateBlock(iv, iv.size());

	//std::string encryptKey(reinterpret_cast<const char *>(_encryptKey));
	//std::string iv(reinterpret_cast<const char *>(_iv));
	
  std::ofstream(privateKeyFile, std::ios::binary).write((char*)key.BytePtr(), key.size());
  std::ofstream(publicKeyFile, std::ios::binary).write((char*)iv.BytePtr(), iv.size());
  
	return true;
}

bool AESCrypto::loadKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile) 
{
	if (privateKeyFile != "") {
		byte key[AES::DEFAULT_KEYLENGTH];
		int length = AES::DEFAULT_KEYLENGTH;
		std::ifstream(privateKeyFile, std::ios::binary).read((char*)&key[0], length);
		_encryptKey.reset(new CryptoPP::SecByteBlock(key, length));
	}
	if (publicKeyFile != "") {
		byte key[AES::BLOCKSIZE];
		int length = AES::BLOCKSIZE;
		std::ifstream(publicKeyFile, std::ios::binary).read((char*)&key[0], length);
		_iv.reset(new CryptoPP::SecByteBlock(key, length));
	}
	

	return true;
}

//void Test() {
//	AutoSeededRandomPool prng;
//	HexEncoder encoder(new FileSink(std::cout));
//
//	CryptoPP::SecByteBlock key(AES::DEFAULT_KEYLENGTH);
//	CryptoPP::SecByteBlock iv(AES::BLOCKSIZE);
//
//	prng.GenerateBlock(key, key.size());
//	prng.GenerateBlock(iv, iv.size());
//
//	std::string plain = "CBC Mode Test";
//	std::string cipher, recovered;
//
//	std::cout << "plain text: " << plain << std::endl;
//
//	/*********************************\
//	\*********************************/
//
//	try
//	{
//		CBC_Mode< AES >::Encryption e;
//		e.SetKeyWithIV(key, key.size(), iv);
//
//		StringSource s(plain, true,
//			new StreamTransformationFilter(e,
//				new StringSink(cipher)
//			) // StreamTransformationFilter
//		); // StringSource
//	}
//	catch (const Exception& e)
//	{
//		std::cerr << e.what() << std::endl;
//		exit(1);
//	}
//
//	/*********************************\
//	\*********************************/
//
//	std::cout << "key: ";
//	encoder.Put(key, key.size());
//	encoder.MessageEnd();
//	std::cout << std::endl;
//
//	std::cout << "iv: ";
//	encoder.Put(iv, iv.size());
//	encoder.MessageEnd();
//	std::cout << std::endl;
//
//	std::cout << "cipher text: ";
//	encoder.Put((const byte*)&cipher[0], cipher.size());
//	encoder.MessageEnd();
//	std::cout << std::endl;
//
//	std::cout << "cipher base64: " << EncodeBase64((const byte*)&cipher[0], cipher.size()) << std::endl;
//
//	/*********************************\
//	\*********************************/
//
//	try
//	{
//		CBC_Mode< AES >::Decryption d;
//		d.SetKeyWithIV(key, key.size(), iv);
//
//		StringSource s(cipher, true,
//			new StreamTransformationFilter(d,
//				new StringSink(recovered)
//			) // StreamTransformationFilter
//		); // StringSource
//
//		std::cout << "recovered text: " << recovered << std::endl;
//	}
//	catch (const Exception& e)
//	{
//		std::cerr << e.what() << std::endl;
//		exit(1);
//	}
//
//	{
//		std::cout << "TEST" << std::endl;
//		string privateKeyText = EncodeBase64(key.BytePtr(), key.size());
//		string publicKeyText = EncodeBase64(iv.BytePtr(), iv.size());
//		std::cout << "private: " << privateKeyText << std::endl;
//		std::cout << "public: " << publicKeyText << std::endl;
//		std::cout << Hex(key.BytePtr(), key.size()) << std::endl;
//		std::cout << Hex(iv.BytePtr(), iv.size()) << std::endl;
//
//		byte* keybyte;
//		int length;
//		DecodeBase64(privateKeyText, keybyte, length);
//
//		//if (length == sizeof(_encryptKey))
//		
//			//std::copy(key, key + length, _encryptKey);
//			CryptoPP::SecByteBlock key2(keybyte, length);
//		
//		//else
//		//	return false;
//		DecodeBase64(publicKeyText, keybyte, length);
//		//if (length == sizeof(_iv))
//		//{
//			//std::copy(key, key + length, _iv);
//			CryptoPP::SecByteBlock iv2(keybyte, length);
//		//}
//			cout << "plain text: " << plain << endl;
//			cout << "plain size: " << plain.length() << endl;
//			cout << "plain size: " << plain.size() << endl;
//			std::cout << Hex(key2.BytePtr(), key2.size()) << std::endl;
//			std::cout << Hex(iv2.BytePtr(), iv2.size()) << std::endl;
//
//			/*CBC_Mode< AES >::Encryption e;
//			e.SetKeyWithIV(*_encryptKey, _encryptKey->size(), *_iv);*/
//
//			// The StreamTransformationFilter removes
//			//  padding as required.
//			string cipher;
//			//StringSource s(message, true,
//			//	new StreamTransformationFilter(e,
//			//		new StringSink(cipher)
//			//	) // StreamTransformationFilter
//			//); // StringSource
//
//			try
//			{
//				CBC_Mode< AES >::Encryption e;
//				e.SetKeyWithIV(key2, key2.size(), iv2);
//
//				StringSource s((const byte*)&plain[0], plain.size(), true,
//					new StreamTransformationFilter(e,
//						new StringSink(cipher)
//					) // StreamTransformationFilter
//				); // StringSource
//			}
//			catch (const Exception& e)
//			{
//				std::cerr << e.what() << std::endl;
//				exit(1);
//			}
//
//			std::cout << "cipher hex: " << Hex((const byte*)&cipher[0], cipher.size()) << std::endl;
//			std::cout << "cipher base64: " << EncodeBase64((const byte*)&cipher[0], cipher.size()) << std::endl;
//			byte* newmessage = new byte[sizeof(cipher)];
//			const byte* ptr = (const byte*)&cipher[0];
//			std::copy(ptr, ptr + cipher.size(), newmessage);
//			int newlength = sizeof(cipher);
//			std::cout << "cipher hex: " << Hex(ptr, cipher.size()) << std::endl;
//	}
//}

bool AESCrypto::genKeyText(std::string& privateKeyText, std::string& publicKeyText) {
	AutoSeededRandomPool prng;
	CryptoPP::SecByteBlock key(AES::DEFAULT_KEYLENGTH);
	CryptoPP::SecByteBlock iv(AES::BLOCKSIZE);

	prng.GenerateBlock(key, key.size());
	prng.GenerateBlock(iv, iv.size());

	privateKeyText = EncodeBase64(key.BytePtr(), key.size());
	publicKeyText = EncodeBase64(iv.BytePtr(), iv.size());
	//std::cout << Hex(key.BytePtr(), key.size()) << std::endl;
	//std::cout << Hex(iv.BytePtr(), iv.size()) << std::endl;

	//CryptoPP::SecByteBlock key(reinterpret_cast<const byte*>(&str[0]), str.size());

	//Test();
	return true;
}

bool AESCrypto::loadKeyText(const std::string& privateKeyText, const std::string& publicKeyText) {
	byte* key;
	int length;
	DecodeBase64(privateKeyText, key, length);
	
	//if (length == sizeof(_encryptKey))
	{
		//std::copy(key, key + length, _encryptKey);
		_encryptKey.reset(new CryptoPP::SecByteBlock(key, length));
	}
	//else
	//	return false;
	DecodeBase64(publicKeyText, key, length);
	//if (length == sizeof(_iv))
	{
		//std::copy(key, key + length, _iv);
		_iv.reset(new CryptoPP::SecByteBlock(key, length));
	}	
	//std::cout << Hex(_encryptKey->BytePtr(),_encryptKey->size()) << std::endl;
	//std::cout << Hex(_iv->BytePtr(), _iv->size()) << std::endl;
	return true;
}

bool AESCrypto::encrypt(const byte* message, int length, byte*& newmessage, int& newlength){
	//Encrypt
	try
	{
		//cout << "plain text: " << message << endl;
		//cout << "plain length: " << length << endl;
		//std::cout << Hex(_encryptKey->BytePtr(), _encryptKey->size()) << std::endl;
		//std::cout << Hex(_iv->BytePtr(), _iv->size()) << std::endl;

		string cipher;
		try
		{
			CBC_Mode< AES >::Encryption e;
			e.SetKeyWithIV(*_encryptKey, _encryptKey->size(), *_iv);

			CryptoPP::StringSource s(message, length, true,
				new StreamTransformationFilter(e,
					new StringSink(cipher)
				) // StreamTransformationFilter
			); // StringSource
		}
		catch (const Exception& e)
		{
			std::cerr << e.what() << std::endl;
			exit(1);
		}
		//std::cout << "cipher length:" << cipher.size() << std::endl;
		//std::cout << Hex((const byte*)&cipher[0], cipher.size()) << std::endl;
		newmessage = new byte[sizeof(cipher)];
		const byte* ptr = (const byte*)&cipher[0];
		std::copy(ptr, ptr + cipher.size(), newmessage);
		newlength = cipher.size();
		//std::cout << Hex(ptr, cipher.size()) << std::endl;
	}
	catch (const CryptoPP::Exception& e)
	{
		cerr << e.what() << endl;
		return false;
	}
	return true;
}

bool AESCrypto::decrypt(const byte* message, int length, byte*& newmessage, int& newlength)
{
	try
	{
		//std::cout << "msg length: " << length << std::endl;
		CBC_Mode< AES >::Decryption d;
		d.SetKeyWithIV(*_encryptKey, _encryptKey->size(), *_iv);

		// The StreamTransformationFilter removes
		//  padding as required.
		string recovered;
		StringSource s(message, length, true,
			new StreamTransformationFilter(d,
				new StringSink(recovered)
			) // StreamTransformationFilter
		); // StringSource

		//std::cout << recovered << std::endl;
		newmessage = new byte[recovered.size()];
		std::copy(recovered.begin(), recovered.end(), newmessage);
		newlength = recovered.size();
		//std::cout << newlength << std::endl;
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
