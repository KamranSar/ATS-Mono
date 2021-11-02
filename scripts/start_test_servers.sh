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
# All containers are run on the host network
echo "Starting Testing containers..."

#* BEGIN - REQUIRED CONTAINERS
#* DO NOT MODIFY - THESE CONTAINERS ARE REQUIRED FOR YOUR SERVER TO RUN SUCCESSFULLY AND THEIR ORDER IS IMPORTANT

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
# mt-auth
IMAGE_NAME="mt-auth"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  docker container rm --force $IMAGE_NAME
fi
echo docker run --name $IMAGE_NAME...
docker run \
--network host \
--env-file scripts/test_env \
--env APP_HOST=localhost \
--env APP_PORT=${MT_AUTH_PORT} \
--expose ${MT_AUTH_PORT} \
--name $IMAGE_NAME \
--detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
# mt-eis-common
IMAGE_NAME="mt-eis-common"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  docker container rm --force $IMAGE_NAME
fi
echo docker run --name $IMAGE_NAME...
docker run \
--network host \
--env-file scripts/test_env \
--env APP_HOST=localhost \
--env APP_PORT=${MT_EIS_COMMON_PORT} \
--env ORACLE_SVR_PORT=1521 \
--env ORACLE_GUI_PORT=5500 \
--env ORACLE_USER=aW50ZXJmYWNlX3VzZXJbZW9taXNfcm9fdXNlcl0= \
--env ORACLE_PASSWORD=VVNFUmlmIyMyMDIw \
--env ORACLE_CONNSTR=vcx1-scan.accounts.cdcr.ca.gov:1521/somstest1.vcx \
--expose ${MT_EIS_COMMON_PORT} \
--name $IMAGE_NAME \
--detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
#
IMAGE_NAME="mt-eds-ats"
if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
  docker container rm --force $IMAGE_NAME
fi
echo docker run --name $IMAGE_NAME...
docker run \
--network host \
--env-file scripts/test_env \
--env APP_HOST=localhost \
--env APP_PORT=${MT_EIS_COMMON_PORT} \
--env ORACLE_SVR_PORT=1521 \
--env ORACLE_GUI_PORT=5500 \
--env ORACLE_USER=aW50ZXJmYWNlX3VzZXJbZW9taXNfcm9fdXNlcl0= \
--env ORACLE_PASSWORD=VVNFUmlmIyMyMDIw \
--env ORACLE_CONNSTR=vcx1-scan.accounts.cdcr.ca.gov:1521/somstest1.vcx \
--expose ${MT_EIS_COMMON_PORT} \
--name $IMAGE_NAME \
--detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_APP}/${IMAGE_NAME}:${IMAGE_VER}
#* END - REQUIRED CONTAINERS

#* BEGIN - OPTIONAL CONTAINERS
#* These are optional DB containers. You may add/remove/change as needed.

# mt-ingress
# IMAGE_NAME="mt-ingress"
# if docker container ls -a | grep -Fq "$IMAGE_NAME" 1>/dev/null; then
#   echo docker start $IMAGE_NAME
#   docker start $IMAGE_NAME
# else
#   echo docker run --name $IMAGE_NAME...
#   docker run \
#   --network host \
#   --expose 8080 \
#   --expose 8443 \
#   --env PGID=1001 \
#   --env PUID=1001 \
#   --volume $(pwd)/dist:/var/www/main/app \
#   --volume $(pwd)/scripts/cfg:/certs \
#   --volume $(pwd)/scripts/cfg/mt-ingress.conf:/opt/bitnami/nginx/conf/nginx.conf \
#   --name $IMAGE_NAME \
#   --detach ${IMAGE_REPO_DOMAIN}/${IMAGE_ENV_CORE}/${IMAGE_NAME}:${IMAGE_VER}
# fi

#* END - OPTIONAL CONTAINERS

#
# Return from whence we came
cd "$CWD"
echo "."
echo "Testing Containers started in background"
echo "."
echo docker container ls
docker container ls
