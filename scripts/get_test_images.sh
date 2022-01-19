#!/bin/bash
# Make sure we're in the root project folder
CWD=$(pwd)
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi
# Set env variables to be passed into the Docker repo:
set -o allexport
. scripts/test_env
set +o allexport

# Login to the Docker repo registry server
echo "."
echo "Login to on-prem Docker Image repo server..."
echo "."
echo docker login ${IMAGE_REPO_DOMAIN}
docker login ${IMAGE_REPO_DOMAIN} --username ${IMAGE_REPO_USER} --password ${IMAGE_REPO_PSWD}
echo "."

#*** DO NOT MODIFY THE CODE BELOW THIS LINE ***#

echo "."
echo "Retrieving Testing Images from Docker Image repo server..."
echo "."

# Run the MT & DB pulls from the on-prem image repo
ALL_ImageArray=(${REQ_ContainerArray[*]} ${OPT_ContainerArray[*]})
for imageName in "${ALL_ImageArray[@]}"
do
    if [[ $imageName == "mt-"* ]] && [[ $imageName != "mt-ingress" ]]; then
       echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${imageName}:${IMAGE_VER}
       docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${imageName}:${IMAGE_VER}
    else
       echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${imageName}:${IMAGE_VER}
       docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${imageName}:${IMAGE_VER}
    fi
    echo "."
done

# Setup all local folders REQUIRED for local DBs
echo "."
echo "Setting up DB storage vols to persistent folders on Host VM..."
echo "."
if [ ! -d "/var/local/cfg" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/cfg/midtier
fi
if [ ! -d "/var/local/log" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/log/midtier
fi
if [ ! -d "/var/local/db/mongodb" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/db/mongodb
fi
if [ ! -d "/var/local/db/mssql" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/db/mssql
fi
if [ ! -d "/var/local/db/mysql" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/db/mysql
fi
if [ ! -d "/var/local/db/oracle" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/db/oracle
fi
if [ ! -d "/var/local/db/postgres" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/db/postgres
fi
if [ ! -d "/var/local/db/redis" ]; then
sudo -S <<< "cdcr"  mkdir -p /var/local/db/redis
fi
sudo -S <<< "cdcr"  chown -R root:root /var/local/cfg/
sudo -S <<< "cdcr"  chown -R root:root /var/local/log/
sudo -S <<< "cdcr"  chown -R root:root /var/local/db/
sudo -S <<< "cdcr"  chown -R 1001:1001 /var/local/db/mongodb
sudo -S <<< "cdcr"  chown -R 1001:1001 /var/local/db/mysql
sudo -S <<< "cdcr"  chown -R 1001:1001 /var/local/db/postgres
sudo -S <<< "cdcr"  chown -R 1001:1001 /var/local/db/redis
sudo -S <<< "cdcr"  chmod -R 777 /var/local/cfg/
sudo -S <<< "cdcr"  chmod -R 777 /var/local/db/
sudo -S <<< "cdcr"  chmod -R 777 /var/local/log/

# Return from whence we came
cd "$CWD"
echo "."
echo "Completed Testing Image Pulls"
echo "."
