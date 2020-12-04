#!/usr/bin/env bash
mkdir -p rs1 rs2 rs3
mongod --replSet myset --logpath "1.log" --dbpath rs1 --port 27017 &
mongod --replSet myset --logpath "2.log" --dbpath rs2 --port 27018 &
mongod --replSet myset --logpath "3.log" --dbpath rs3 --port 27019 &