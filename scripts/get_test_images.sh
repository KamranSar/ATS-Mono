#!/bin/bash
echo "."
echo "Retrieving Testing Images from Docker repo registry server..."
echo "."
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
echo docker login ${IMAGE_REPO_DOMAIN}
docker login ${IMAGE_REPO_DOMAIN} --username ${IMAGE_REPO_USER} --password ${IMAGE_REPO_PSWD}
# Run the Auth & DB pulls from the on-prem image repo
echo "."
IMAGE_NAME="mongodb"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
echo "."
IMAGE_NAME="mssql"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
# echo "."
# IMAGE_NAME="mysql"
# echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
# docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
echo "."
IMAGE_NAME="oracle"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
echo "."
IMAGE_NAME="postgres"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
echo "."
IMAGE_NAME="redis"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
echo "."
IMAGE_NAME="mt-auth"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
echo "."
IMAGE_NAME="mt-eis-common"
echo docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
docker pull ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
# # Pull the root/public images local
# docker pull bitnami/mongodb:latest
# docker pull mcr.microsoft.com/mssql/server:2017-latest
# docker pull bitnami/mysql:latest
# docker pull bitnami/postgresql:latest
# docker pull store/oracle/database-enterprise:12.2.0.1-slim
# docker pull bitnami/redis:latest
# # Tag the images
# docker image tag bitnami/mongodb:latest  mongodb
# docker image tag mcr.microsoft.com/mssql/server:2017-latest  mssql
# docker image tag bitnami/mysql:latest  mysql
# docker image tag bitnami/postgresql:latest  postgres
# docker image tag store/oracle/database-enterprise:12.2.0.1-slim  oracle
# docker image tag bitnami/redis:latest  redis
echo "."
echo "Setting up DB storage vols to persistent folders on Host VM...(MAY PROMPT FOR PASSWORD)"
echo "."
if [ ! -d "/var/local/cfg" ]; then
sudo mkdir -p /var/local/cfg/midtier
fi
if [ ! -d "/var/local/log" ]; then
sudo mkdir -p /var/local/log/midtier
fi
if [ ! -d "/var/local/db/mongodb" ]; then
sudo mkdir -p /var/local/db/mongodb
fi
if [ ! -d "/var/local/db/mssql" ]; then
sudo mkdir -p /var/local/db/mssql
fi
if [ ! -d "/var/local/db/mysql" ]; then
sudo mkdir -p /var/local/db/mysql
fi
if [ ! -d "/var/local/db/oracle" ]; then
sudo mkdir -p /var/local/db/oracle
fi
if [ ! -d "/var/local/db/postgres" ]; then
sudo mkdir -p /var/local/db/postgres
fi
if [ ! -d "/var/local/db/redis" ]; then
sudo mkdir -p /var/local/db/redis
fi
sudo chown -R root:root /var/local/cfg/
sudo chown -R root:root /var/local/log/
sudo chown -R root:root /var/local/db/
sudo chown -R 1001:1001 /var/local/db/mongodb
sudo chown -R 1001:1001 /var/local/db/mysql
sudo chown -R 1001:1001 /var/local/db/postgres
sudo chown -R 1001:1001 /var/local/db/redis
sudo chmod -R 777 /var/local/cfg/
sudo chmod -R 777 /var/local/db/
sudo chmod -R 777 /var/local/log/
# Return from whence we came
cd "$CWD"
echo "."
echo "Completed Testing Image Pulls"
echo "."
