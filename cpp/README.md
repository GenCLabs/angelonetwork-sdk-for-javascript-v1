```
crypto genkeyText aes
crypto genkeyText ecc
```

```
crypto textkeyencrypt aes|ecc file file_input file_output private_key public_key 
crypto textkeyencrypt aes|ecc text message_input private_key public_key
```

```
crypto textkeydecrypt aes|ecc file file_input file_output private_key public_key 
crypto textkeydecrypt aes|ecc text message_input private_key public_key
```
