#!/bin/bash
cd cryptopp/src
make
cd ../..
gn-node args
gn-node gen 
gn-node build 
