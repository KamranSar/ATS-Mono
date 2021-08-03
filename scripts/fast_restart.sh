#!/bin/bash
clear
echo "."
echo "Restart Testing Containers..."
echo "."
RED='\033[1;31m'
NC='\033[0m' # No Color
CWD=$(pwd)
# Make sure we're in the root project folder
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi

#*** DO NOT MODIFY THE CODE BELOW THIS LINE ***#

# Set env variables to be passed into the Docker image:
set -o allexport
. scripts/test_env
set +o allexport

# First Stop all containers
echo "."
echo "Stopping All Test Containers..."
echo "."
ALL_ContainerArray=(${REQ_ContainerArray[*]} ${OPT_ContainerArray[*]})
for containerName in "${ALL_ContainerArray[@]}"
do
  if docker container ls -a | grep -Fq "$containerName" 1>/dev/null; then
     echo docker container stop ${containerName}
     docker container stop ${containerName}
     echo "."
  else
     echo -e "${RED}Container (${containerName}) Not Found!${NC}"
     echo "."
  fi
done
echo "All Test containers should now be stopped...waiting a few seconds to make sure:"
sleep 4s
echo "."
docker container ls -a
echo "."
echo "Starting All Test Containers..."
echo "."
# Then Start all containers
for containerName in "${ALL_ContainerArray[@]}"
do
  if docker container ls -a | grep -Fq "$containerName" 1>/dev/null; then
     echo docker start ${containerName}
     docker start ${containerName}
  fi
done
echo "."
echo docker container ls -a
docker container ls -a

# Return from whence we came
cd "$CWD"
echo "."
echo "Testing Containers Restarted"
echo "."
