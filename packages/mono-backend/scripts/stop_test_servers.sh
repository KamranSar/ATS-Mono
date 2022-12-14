#!/bin/bash
clear
echo "."
echo "Stop All Testing Containers"
echo "."
# Make sure we're in the root project folder
RED='\033[1;31m'
NC='\033[0m' # No Color
CWD=$(pwd)
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi

#*** DO NOT MODIFY THE CODE BELOW THIS LINE ***#

# Set env variables to be passed into the Docker image:
set -o allexport
. scripts/test_env
set +o allexport

# Stop all containers
ALL_ContainerArray=(${REQ_ContainerArray[*]} ${OPT_ContainerArray[*]})
for containerName in "${ALL_ContainerArray[@]}"
do
  if docker container ls -a | grep -Fq "$containerName" 1>/dev/null; then
     # If container name starts with "mt-", then it's an MT object and must be removed
     if [[ $containerName = "mt-"* ]]; then
        echo docker container rm --force ${containerName}
        docker container rm --force ${containerName}
     else
        echo docker container stop ${containerName}
        docker container stop ${containerName}
     fi
     echo "."
  else
     echo -e "${RED}Container (${containerName}) Not Found!${NC}"
     echo "."
  fi
done
echo "All Test containers should now be stopped...waiting a few seconds to make sure:"
sleep 4s
echo "."
echo docker container ls -a
docker container ls -a

# Return from whence we came
cd "$CWD"
echo "."
echo "Testing Containers stopped"
echo "."
