#!/bin/bash
clear
echo "."
echo "Stop DB Containers..."
echo "."
# Make sure we're in the root project folder
CWD=$(pwd)
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi
echo docker container stop mongodb
docker container stop mongodb
echo docker container stop mssql
docker container stop mssql
echo docker container stop oracle
docker container stop oracle
echo docker container stop postgres
docker container stop postgres
echo docker container stop redis
docker container stop redis
# Delete the old DB containers, if desired (comment out if not):
# echo "Deleting previous DB containers..."
#echo docker container rm --force mongodb
#docker container rm --force mongodb
#echo docker container rm --force mssql
#docker container rm --force mssql
#echo docker container rm --force oracle
#docker container rm --force oracle
#echo docker container rm --force postgres
#docker container rm --force postgres
#echo docker container rm --force redis
#docker container rm --force redis
# Return from whence we came
cd "$CWD"
echo "."
echo "DB Containers stopped"
echo "."
