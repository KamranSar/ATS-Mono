#!/bin/bash
#####################################################################################################
# This script clones/pulls the preinstall script used for backend server npm package installs.
#####################################################################################################

# Clone or pull preinstall repo
echo "."
echo "Retrieving Backend preinstall script"
echo "."

# Set variables to be used throughout preinstall scripts
PROJECT_FOLDER=$(pwd)
SCRIPTS_FOLDER=${PROJECT_FOLDER}/scripts
PREINSTALL_FOLDER=${SCRIPTS_FOLDER}/preinstall
EISMT_LIB_URL=https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/preinstall-backend

# If local_modules folder does not exist (clean install), then remove the preinstall folder as well.
if [ ! -d "${PROJECT_FOLDER}/local_modules" ];
then
   rm -rf ${PREINSTALL_FOLDER}
fi

# Go to scripts folder
cd ${SCRIPTS_FOLDER}

# If preinstall folder already exists, pull the repo. Otherwise, clone the repo.
if [ -d "${PREINSTALL_FOLDER}" ];
then
    # Preinstall folder exists, do a pull
    cd ${PREINSTALL_FOLDER}
    echo "Pulling changes for $PREINSTALL_FOLDER"
    echo "."
    git pull --all
else
    # Preinstall folder does not exist, do a clone
    echo "Cloning $EISMT_LIB_URL to $PREINSTALL_FOLDER"
    echo "."
    git clone $EISMT_LIB_URL  $PREINSTALL_FOLDER
    cd ${PREINSTALL_FOLDER}
fi

# Ensure preinstall scripts have the correct permissions
chmod +x ${PREINSTALL_FOLDER}/*.sh

# Execute backend preinstall script (propogate env variables)
echo "."
echo "Running Backend preinstall script"
echo "."
. preinstall.sh
echo "."

# Ensure return to the project root
cd ${PROJECT_FOLDER}
