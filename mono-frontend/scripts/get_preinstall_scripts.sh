#!/bin/bash
#####################################################################################################
# ! DO NOT MODIFY
# Copy this file to the scripts folder of your project.
# get_preinstall_scripts.sh
# Version 0.1
#
# This script clones/pulls the preinstall script used for npm package installs in both frontend and backend.
#####################################################################################################

# Clone or pull preinstall repo
echo "."
echo "Retrieving preinstall script"
echo "."
date

# Set variables to be used throughout preinstall scripts
# preinstall scripts expects these environment variables
CYAN='\033[1;36m'
GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
PROJECT_FOLDER=$(pwd)
SCRIPTS_FOLDER=${PROJECT_FOLDER}/scripts
PREINSTALL_FOLDER=${SCRIPTS_FOLDER}/preinstall
CDCR_LIB_FOLDER=local_modules
PREINSTALL_LIB_URL=https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/preinstall-common

# If local_modules folder does not exist (clean install), then remove the preinstall folder as well.
if [ ! -d "${PROJECT_FOLDER}/${CDCR_LIB_FOLDER}" ]; then
  rm -rf ${PREINSTALL_FOLDER}
fi

# If preinstall folder already exists, pull the repo. Otherwise, clone the repo.
if [ -d "${PREINSTALL_FOLDER}" ]; then
  # Preinstall folder exists, do a pull
  cd ${PREINSTALL_FOLDER}
  echo "Pulling changes for $PREINSTALL_FOLDER"
  echo "."
  # Only execute "git" commands when not called from inside a Docker image build process.
  if [ ! -f "${PROJECT_FOLDER}/dockerbuild" ]; then
    git reset --hard
    git clean -fdx
    git pull --all
  fi
else
  # Preinstall folder does not exist, do a clone from main branch
  # Go to scripts folder
  cd ${SCRIPTS_FOLDER}
  echo "Cloning $PREINSTALL_LIB_URL to $PREINSTALL_FOLDER"
  echo "."
  git clone -b main $PREINSTALL_LIB_URL $PREINSTALL_FOLDER
  cd ${PREINSTALL_FOLDER}
fi

# Ensure preinstall scripts have the correct permissions
chmod +x ./*.sh

# Execute frontend preinstall script (propogate env variables)
echo "."
echo "Running preinstall script"
echo "."
. preinstall.sh
echo "."
