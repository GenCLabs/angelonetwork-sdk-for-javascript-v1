#include <iostream>
#include <stdio.h>
#include "cryptolib.h"
#include "cryptocommon.h"
using namespace std;

int main(int argc, char ** argv) {
  // command: 
  if(argc > 3){
    string cmd = argv[1];
    string encrypt_type = argv[2];
    if(cmd == "encrypt"){
      string input_type = argc > 3 ? argv[3] : "";
      if(input_type == "file"){
        string file_input = argc > 4 ? argv[4] : "";
        string file_output = argc > 5 ? argv[5] : "";
        string public_key_file = argc > 6 ? argv[6] : "";        
        CryptoLib clib(encrypt_type);
        //std::cout << "load key" << std::endl;
        clib.loadKey("", public_key_file);
        //std::cout << "encrypt file" << std::endl;
        clib.encryptFile(file_input, file_output);
      }else if(input_type=="text"){
        string msg_input = argc > 4 ? argv[4] : "";
        string public_key_file = argc > 5 ? argv[5] : "";
        CryptoLib clib(encrypt_type);
        //std::cout << "load key" << std::endl;
        clib.loadKey("", public_key_file);
        //std::cout << "encrypt key" << std::endl;
        std::string output = clib.encryptText(msg_input);
        std::cout << output << std::endl;
      }
    }if(cmd == "decrypt"){
      string input_type = argc > 3 ? argv[3] : "";
      if(input_type == "file"){
        string file_input = argc > 4 ? argv[4] : "";
        string file_output = argc > 5 ? argv[5] : "";
        string private_key_file = argc > 6 ? argv[6] : "";
        CryptoLib clib(encrypt_type);
        clib.loadKey(private_key_file, "");
        clib.decryptFile(file_input, file_output);
      }else if(input_type=="text"){
        string msg_input = argc > 4 ? argv[4] : "";
        string private_key_file = argc > 5 ? argv[5] : "";
        CryptoLib clib(encrypt_type);
        clib.loadKey(private_key_file, "");
        std::string output = clib.decryptText(msg_input);
        std::cout << output << std::endl;
      }
    }else if(cmd == "genkey"){
      string private_key_file = argc > 3 ? argv[3]: "";
      string public_key_file = argc > 4 ? argv[4] : "";
      CryptoLib clib(encrypt_type);
      clib.genKey(private_key_file, public_key_file);
    }
    else if (cmd == "readbin") {
      string binary_file = argc > 3 ? argv[3] : "";       
      string output = EncodeFile(encrypt_type, binary_file);
      std::cout << output << std::endl;
    }
    else if (cmd == "writebin") {
      string text = argc > 3 ? argv[3] : "";
      string binaryFile = argc > 4 ? argv[4] : "";
      DecodeFile(encrypt_type, text, binaryFile);
    }
  }
  return 0;
}

void help(){
  cout << "crypto encrypt [ecc|aes] file fileinput fileoutput [publickeyfile] " << endl;
  cout << "crypto decrypt [ecc|aes] file fileinput fileoutput [privatekeyfile] " << endl;
  cout << "crypto encrypt [ecc|aes] text message messageoutput [publickeyfile] " << endl;
  cout << "crypto decrypt [ecc|aes] text messageoutput message [privatekeyfile] " << endl;
  cout << "crypto genkey [ecc|aes] privatekeyFile publickeyFile " << endl;
  cout << "crypto readbin base64 binaryFile " << endl;
  cout << "crypto writebin base64 text binaryFile " << endl;
}
