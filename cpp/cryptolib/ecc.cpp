// ECDSA.KeyGen.cpp : Defines the entry point for the console application.
//

//#include "stdafx.h"
#include "ecc.h"

#include <assert.h>

#include <iostream>
using std::cout;
using std::endl;

#include <string>
using std::string;

#include "osrng.h"
//using CryptoPP::byte;
// using CryptoPP::AutoSeededX917RNG;
using CryptoPP::AutoSeededRandomPool;

#include "aes.h"
using CryptoPP::AES;

#include "integer.h"
using CryptoPP::Integer;

#include "sha.h"
using CryptoPP::SHA1;

#include "filters.h"
using CryptoPP::StringSource;
using CryptoPP::StringSink;
using CryptoPP::ArraySink;
using CryptoPP::SignerFilter;
using CryptoPP::SignatureVerificationFilter;

#include "files.h"
using CryptoPP::FileSource;
using CryptoPP::FileSink;

#include "eccrypto.h"
using CryptoPP::ECDSA;
using CryptoPP::ECP;
using CryptoPP::DL_GroupParameters_EC;

#include "base64.h"

#ifdef _MSC_VER
#if _MSC_VER <= 1200 // VS 6.0
using CryptoPP::ECDSA<ECP, SHA1>;
using CryptoPP::DL_GroupParameters_EC<ECP>;
#endif
#endif

#include "oids.h"
using CryptoPP::OID;

using CryptoPP::PrivateKey;
using CryptoPP::PublicKey;

void SavePrivateKey(const PrivateKey& key, const string& file)
{
    FileSink sink(file.c_str());
    key.Save(sink);
}

void SavePublicKey(const PublicKey& key, const string& file)
{
    FileSink sink(file.c_str());
    key.Save(sink);
}

void LoadPrivateKey(PrivateKey& key, const string& file)
{
    FileSource source(file.c_str(), true);
    key.Load(source);
}

void LoadPublicKey(PublicKey& key, const string& file)
{
    FileSource source(file.c_str(), true);
    key.Load(source);
}

void PrintPrivateKey(const CryptoPP::DL_PrivateKey_EC<ECP>& key, std::ostream& out)
{
    // Group parameters
    const DL_GroupParameters_EC<ECP>& params = key.GetGroupParameters();
    // Base precomputation (for public key calculation from private key)
    const CryptoPP::DL_FixedBasePrecomputation<CryptoPP::ECPPoint>& bpc = params.GetBasePrecomputation();
    // Public Key (just do the exponentiation)
    const CryptoPP::ECPPoint point = bpc.Exponentiate(params.GetGroupPrecomputation(), key.GetPrivateExponent());
    
    out << "Modulus: " << std::hex << params.GetCurve().GetField().GetModulus() << endl;
    out << "Cofactor: " << std::hex << params.GetCofactor() << endl;
    
    out << "Coefficients" << endl;
    out << "  A: " << std::hex << params.GetCurve().GetA() << endl;
    out << "  B: " << std::hex << params.GetCurve().GetB() << endl;
    
    out << "Base Point" << endl;
    out << "  x: " << std::hex << params.GetSubgroupGenerator().x << endl;
    out << "  y: " << std::hex << params.GetSubgroupGenerator().y << endl;
    
    out << "Public Point" << endl;
    out << "  x: " << std::hex << point.x << endl;
    out << "  y: " << std::hex << point.y << endl;
    
    out << "Private Exponent (multiplicand): " << endl;
    out << "  " << std::hex << key.GetPrivateExponent() << endl;
}

void PrintPublicKey(const CryptoPP::DL_PublicKey_EC<ECP>& key, std::ostream& out)
{
    // Group parameters
    const DL_GroupParameters_EC<ECP>& params = key.GetGroupParameters();
    // Public key
    const CryptoPP::ECPPoint& point = key.GetPublicElement();
    
    out << "Modulus: " << std::hex << params.GetCurve().GetField().GetModulus() << endl;
    out << "Cofactor: " << std::hex << params.GetCofactor() << endl;
    
    out << "Coefficients" << endl;
    out << "  A: " << std::hex << params.GetCurve().GetA() << endl;
    out << "  B: " << std::hex << params.GetCurve().GetB() << endl;
    
    out << "Base Point" << endl;
    out << "  x: " << std::hex << params.GetSubgroupGenerator().x << endl;
    out << "  y: " << std::hex << params.GetSubgroupGenerator().y << endl;
    
    out << "Public Point" << endl;
    out << "  x: " << std::hex << point.x << endl;
    out << "  y: " << std::hex << point.y << endl;
}

bool ECCCrypto::genKeyFile(const std::string& privateKeyFile, const std::string& publicKeyFile){
    // CryptoPP::ECIES < ECC_ALGORITHM >::PrivateKey privateKey;    
    //     CryptoPP::ECIES < ECC_ALGORITHM >::PublicKey publicKey;    
    

    // Key Generation
    _privateKey.Initialize (_rng, ECC_CURVE);    
    _privateKey.MakePublicKey (_publicKey);
    
    // Key Validation
    if (!_privateKey.Validate (_rng, 3))
    {        
      return false;//throw runtime_error ("Private key validation failed");      
    }
    
    if (!_publicKey.Validate (_rng, 3))
    {        
        return false;//throw runtime_error ("Public key validation failed");      
    }
    // Private and Public keys    
    _privateKey.Save( FileSink( privateKeyFile.c_str(), true /*binary*/ ).Ref() );
    _publicKey.Save( FileSink( publicKeyFile.c_str(), true /*binary*/ ).Ref() );
    UpdateEncryptor();
    UpdateDecryptor();
    return true;
}
bool ECCCrypto::loadKeyFile(const std::string &privateKeyFile, const std::string &publicKeyFile)
{
  
  if(privateKeyFile != ""){
    //std::cout << "load private key " << std::endl;
    _privateKey.Load( FileSource( privateKeyFile.c_str(), true /*pump all*/ ).Ref() );
  }
  if(publicKeyFile != ""){
    //std::cout << "load public key " << std::endl;
    _publicKey.Load( FileSource( publicKeyFile.c_str(), true /*pump all*/ ).Ref() );
  }
  if(publicKeyFile != "")
    UpdateEncryptor();
  if(privateKeyFile != "")  
    UpdateDecryptor();
  return true;
}

bool ECCCrypto::genKeyText(std::string& privateKeyText, std::string& publicKeyText) {
    // CryptoPP::ECIES < ECC_ALGORITHM >::PrivateKey privateKey;    
    //     CryptoPP::ECIES < ECC_ALGORITHM >::PublicKey publicKey;    


    // Key Generation
    _privateKey.Initialize(_rng, ECC_CURVE);
    _privateKey.MakePublicKey(_publicKey);

    // Key Validation
    if (!_privateKey.Validate(_rng, 3))
    {
        return false;//throw runtime_error ("Private key validation failed");      
    }

    if (!_publicKey.Validate(_rng, 3))
    {
        return false;//throw runtime_error ("Public key validation failed");      
    }
    // Private and Public keys    
    {
        CryptoPP::ByteQueue queue;
        _privateKey.Save(queue);
        queue.CopyTo(CryptoPP::Base64Encoder(new StringSink(privateKeyText)));
    }
    {
        CryptoPP::ByteQueue queue;
        _publicKey.Save(queue);
        queue.CopyTo(CryptoPP::Base64Encoder(new StringSink(publicKeyText)));
    }

    UpdateEncryptor();
    UpdateDecryptor();
    return true;
}

bool ECCCrypto::loadKeyText(const std::string& privateKeyText, const std::string& publicKeyText)
{

    if (privateKeyText != "") {
        CryptoPP::ByteQueue queue;        
        StringSource ss(privateKeyText, true, new CryptoPP::Base64Decoder(&queue));
        _privateKey.Load(queue);
    }
    if (publicKeyText != "") {    
        CryptoPP::ByteQueue queue;
        StringSource ss(publicKeyText, true, new CryptoPP::Base64Decoder(&queue));
        _publicKey.Load(queue);
    }
    if (publicKeyText != "")
        UpdateEncryptor();
    if (privateKeyText != "")
        UpdateDecryptor();
    return true;
}

bool ECCCrypto::encrypt(const byte* message, int length, byte*& newmessage, int& newlength)
{
  int plainTextLength = length;// + 1;
  size_t cipherTextLength = _Encryptor.CiphertextLength (plainTextLength);
  //std::cout << "plainTextLength:" << plainTextLength << std::endl;
  //std::cout << "cipherTextLength:" << cipherTextLength << std::endl;
      
  if (0 == cipherTextLength)
  {        
    return "";//throw runtime_error ("cipherTextLength is not valid");      
  }
       
  // cout << "Cipher text length is ";
  // cout << cipherTextLength << endl;

  // Encryption buffer
  byte* cipherText = new byte[cipherTextLength];
  if (NULL == cipherText)
  {        
    //throw runtime_error ("Cipher text allocation failure");      
  }
    
  memset (cipherText, 0xFB, cipherTextLength);

  // Encryption
  //Encryptor.Encrypt(_rng, reinterpret_cast < const byte * > (message.data ()), plainTextLength, cipherText); 
  _Encryptor.Encrypt(_rng, message, plainTextLength, cipherText);
  newmessage = cipherText;
  newlength = cipherTextLength;
  return true;
}

bool ECCCrypto::decrypt(const byte* message, int length, byte*& newmessage, int& newlength){
  //_Decryptor(_privateKey);
    size_t cipherTextLength = length;// + 1;
    // Size
    size_t recoveredTextLength = _Decryptor.MaxPlaintextLength (cipherTextLength);    
    //std::cout << "cipherTextLength:" << cipherTextLength << std::endl;
    //std::cout << "recoveredTextLength:" << recoveredTextLength << std::endl;
    if (0 == recoveredTextLength)      
    {
      std::cout<< ("recoveredTextLength is not valid") << std::endl;
    }

    // Decryption Buffer
    byte * recoveredText = new byte[recoveredTextLength];
    if (NULL == recoveredText)      
    {        
      std::cout << ("recoveredText allocation failure") << std::endl;      
    }    

    memset (recoveredText, 0xFB, recoveredTextLength);

    // Decryption
    _Decryptor.Decrypt (_rng, message, cipherTextLength, recoveredText);     

    // cout << "Recovered text: " << recoveredText << endl;
	// cout << "Recovered text length is " << recoveredTextLength << endl;
    newmessage = recoveredText;
    newlength = recoveredTextLength;
    return true;
}

void ECCCrypto::UpdateEncryptor(){
  //std::cout << "load encryptor" << std::endl;
  _Encryptor = CryptoPP::ECIES<ECC_ALGORITHM>::Encryptor(_publicKey);
}
void ECCCrypto::UpdateDecryptor(){
  //std::cout << "load decryptor" << std::endl;
  _Decryptor = CryptoPP::ECIES<ECC_ALGORITHM>::Decryptor(_privateKey);
}
int ECCCrypto::getCryptBlockSize(int plainSize){
  // if(_Encryptor. != nullptr)
  //   return (int)_Encryptor.CiphertextLength(plainSize);
  // else if(_Decryptor != nullptr)
    return (int)_Decryptor.CiphertextLength(plainSize);
  //return plainSize;
}