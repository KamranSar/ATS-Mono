#!/bin/bash
clear
echo "."
echo "Run DB Images as Container..."
echo "."
# Make sure we're in the root project folder
CWD=$(pwd)
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi
#
# Get the DB server images used by this app server:
./scripts/get_db_images.sh
#
# Set env variables to be passed into the Docker image:
set -o allexport
. .env
. scripts/repo_env
set +o allexport
#
# Run all DB containers requried by your app (REDIS & MongoDb are always required):
# (These containers are run on the host network)
# redis
echo "Starting new DB containers..."
CONTAINER_NAME="redis"
if docker container ls -a | grep -Fq "$CONTAINER_NAME" 1>/dev/null; then
  echo docker start $CONTAINER_NAME
  docker start $CONTAINER_NAME
else
  echo docker run --name $CONTAINER_NAME...
  docker run \
  --network host \
  --expose ${REDIS_PORT} \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env REDIS_PORT_NUMBER=${REDIS_PORT} \
  --volume /var/local/db/redis:/bitnami/redis \
  --name $CONTAINER_NAME \
  --detach ${IMAGE_REPO_URL}redis:latest
fi
# mongodb
CONTAINER_NAME="mongodb"
if docker container ls -a | grep -Fq "$CONTAINER_NAME" 1>/dev/null; then
  echo docker start $CONTAINER_NAME
  docker start $CONTAINER_NAME
else
  echo docker run --name $CONTAINER_NAME...
  docker run \
  --network host \
  --expose ${MONGO_PORT} \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MONGODB_PORT_NUMBER=${MONGODB_PORT} \
  --env MONGODB_SYSTEM_LOG_VERBOSITY=0 \
  --volume /var/local/db/mongodb:/bitnami/mongodb \
  --name $CONTAINER_NAME \
  --detach ${IMAGE_REPO_URL}mongodb:latest
fi
# mssql
CONTAINER_NAME="mssql"
if docker container ls -a | grep -Fq "$CONTAINER_NAME" 1>/dev/null; then
  echo docker start $CONTAINER_NAME
  docker start $CONTAINER_NAME
else
  echo docker run --name $CONTAINER_NAME...
  docker run \
  --network host \
  --expose ${MSSQL_PORT} \
  --env ACCEPT_EULA=Y \
  --env MSSQL_PID=Standard \
  --env MSSQL_TCP_PORT=${MSSQL_PORT} \
  --env SA_PASSWORD=${MSSQL_PASSWORD} \
  --env PATH=$PATH:/opt/mssql-tools/bin/ \
  --volume /var/local/db/mssql:/var/opt/mssql \
  --name $CONTAINER_NAME \
  --detach ${IMAGE_REPO_URL}mssql:latest
fi
# mysql
CONTAINER_NAME="mysql"
if docker container ls -a | grep -Fq "$CONTAINER_NAME" 1>/dev/null; then
  echo docker start $CONTAINER_NAME
  docker start $CONTAINER_NAME
else
  echo docker run --name $CONTAINER_NAME...
  docker run \
  --network host \
  --expose ${MYSQL_PORT} \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MYSQL_PORT_NUMBER=${MYSQL_PORT} \
  --env MYSQL_DATABASE=midtier \
  --volume /var/local/db/mysql:/bitnami/mysql \
  --name $CONTAINER_NAME \
  --detach ${IMAGE_REPO_URL}mysql:latest
fi
# oracle
CONTAINER_NAME="oracle"
if docker container ls -a | grep -Fq "$CONTAINER_NAME" 1>/dev/null; then
  echo docker start $CONTAINER_NAME
  docker start $CONTAINER_NAME
else
  echo docker run --name $CONTAINER_NAME...
  docker run \
  --publish 127.0.0.1:${ORACLE_SVR_PORT}:${ORACLE_SVR_PORT} \
  --publish 127.0.0.1:${ORACLE_GUI_PORT}:${ORACLE_GUI_PORT} \
  --env DB_SID=ORCLCDB \
  --env DB_PDB=ORCLPDB1 \
  --env DB_PASSWD=${ORACLE_PASSWORD} \
  --env DB_DOMAIN=localdomain \
  --env DB_MEMORY=2G \
  --volume /var/local/db/oracle:/ORCL \
  --name $CONTAINER_NAME \
  --detach ${IMAGE_REPO_URL}oracle:latest
fi
# postgres
CONTAINER_NAME="postgres"
if docker container ls -a | grep -Fq "$CONTAINER_NAME" 1>/dev/null; then
  echo docker start $CONTAINER_NAME
  docker start $CONTAINER_NAME
else
  echo docker run --name $CONTAINER_NAME...
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
  --name $CONTAINER_NAME \
  --detach ${IMAGE_REPO_URL}postgres:latest
fi
#
# Return from whence we came
cd "$CWD"
echo "."
echo "DB Containers started in background"
echo "."
echo docker container ls -a
docker container ls -a
