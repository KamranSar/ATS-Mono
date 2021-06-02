#!/bin/bash
clear
echo "."
echo "Run Testing Servers as Containers..."
echo "."
# Make sure we're in the root project folder
CWD=$(pwd)
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi
#
# Get the DB server images used by this app server:
./scripts/get_test_images.sh
#
# Set env variables to be passed into the Docker image:
set -o allexport
. scripts/test_env
set +o allexport
#
# Run all containers requried by your app (REDIS, MongoDb & Auth are always required):
# (These containers are run on the host network)
echo "Starting Testing containers..."
# redis
IMAGE_NAME="redis"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --network host \
  --expose ${REDIS_PORT} \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --volume /var/local/db/redis:/bitnami/redis \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
fi
# mongodb
IMAGE_NAME="mongodb"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --network host \
  --expose ${MONGO_PORT} \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MONGODB_SYSTEM_LOG_VERBOSITY=0 \
  --volume /var/local/db/mongodb:/bitnami/mongodb \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
fi
# mssql
IMAGE_NAME="mssql"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --network host \
  --expose ${MSSQL_PORT} \
  --env ACCEPT_EULA=Y \
  --env MSSQL_PID=Standard \
  --env MSSQL_TCP_PORT=${MSSQL_PORT} \
  --env SA_PASSWORD=${MSSQL_PASSWORD} \
  --env PATH=$PATH:/opt/mssql-tools/bin/ \
  --volume /var/local/db/mssql:/var/opt/mssql \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
fi
# mysql
# IMAGE_NAME="mysql"
# if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
#   echo docker start $IMAGE_NAME
#   docker start $IMAGE_NAME
# else
#   echo docker run --name $IMAGE_NAME...
#   docker run \
#   --network host \
#   --expose ${MYSQL_PORT} \
#   --env ALLOW_EMPTY_PASSWORD=yes \
#   --env MYSQL_PORT_NUMBER=${MYSQL_PORT} \
#   --env MYSQL_DATABASE=midtier \
#   --volume /var/local/db/mysql:/bitnami/mysql \
#   --name $IMAGE_NAME \
#   --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
# fi
# oracle
IMAGE_NAME="oracle"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --publish 127.0.0.1:${ORACLE_SVR_PORT}:${ORACLE_SVR_PORT} \
  --publish 127.0.0.1:${ORACLE_GUI_PORT}:${ORACLE_GUI_PORT} \
  --env DB_SID=ORCLCDB \
  --env DB_PDB=ORCLPDB1 \
  --env DB_PASSWD=${ORACLE_PASSWORD} \
  --env DB_DOMAIN=localdomain \
  --env DB_MEMORY=2G \
  --volume /var/local/db/oracle:/ORCL \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
fi
# postgres
IMAGE_NAME="postgres"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --network host \
  --expose ${POSTGRESQL_PORT} \
  --env POSTGRESQL_PORT_NUMBER=${POSTGRESQL_PORT} \
  --env POSTGRESQL_PASSWORD=${POSTGRESQL_POSTGRES_PASSWORD} \
  --env POSTGRESQL_USERNAME=${POSTGRESQL_USERNAME} \
  --env POSTGRESQL_POSTGRES_PASSWORD=${POSTGRESQL_POSTGRES_PASSWORD} \
  --env POSTGRESQL_DATABASE=midtier \
  --env POSTGRES_HOST_AUTH_METHOD=trust \
  --volume /var/local/db/postgres:/bitnami/postgresql \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
fi
# mt-auth
IMAGE_NAME="mt-auth"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --network host \
  --env-file scripts/test_env \
  --env APP_HOST=localhost \
  --env APP_PORT=${MT_AUTH_PORT} \
  --expose ${MT_AUTH_PORT} \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
fi
# mt-eis-common
IMAGE_NAME="mt-eis-common"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  echo docker start $IMAGE_NAME
  docker start $IMAGE_NAME
else
  echo docker run --name $IMAGE_NAME...
  docker run \
  --network host \
  --env-file scripts/test_env \
  --env APP_HOST=localhost \
  --env APP_PORT=${MT_EIS_COMMON_PORT} \
  --env ORACLE_SVR_PORT=1521 \
  --env ORACLE_GUI_PORT=5500 \
  --env ORACLE_USER=interface_user[eomis_ro_user] \
  --env ORACLE_PASSWORD=USERif##2020 \
  --env ORACLE_CONNSTR=vcx1-scan.accounts.cdcr.ca.gov:1521/somstest1.vcx \
  --expose ${MT_EIS_COMMON_PORT} \
  --name $IMAGE_NAME \
  --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
fi
#
# Return from whence we came
cd "$CWD"
echo "."
echo "Testing Containers started in background"
echo "."
echo docker container ls -a
docker container ls -a
