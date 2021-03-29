#!/bin/bash
#####################################################################################################
# This script allows us to install our EIS-MiddleTier libraries as local npm packages.
# This allows for much simpler access of package assets within our code.
#####################################################################################################

# Make & move into local_modules & cdcr folders
CWD=$(pwd)
CDCR_LIB_FOLDER=local_modules
EISMT_LIB_URL=https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git

echo "."
echo "Making sure local EIS-MiddleTier library folders exist"
[ ! -d "$CDCR_LIB_FOLDER" ] && mkdir -p "$CDCR_LIB_FOLDER"

# This function checks out a CDCR library
# the double ,, convert the variable to lowercase
# First param is the library to clone
# Second optional param is the branch
clone_cdcr_library() {
    local LIBNAME=$1
    local BRANCHNAME=$2
    cd "$CWD"
    cd "$CDCR_LIB_FOLDER"
    if [ -d "${LIBNAME,,}" ];
    then
        cd ${LIBNAME,,}
        echo "Pulling changes for $LIBNAME"
        echo "."
        git pull --all
    else
        if [ -z "${BRANCHNAME}" ];
        then
            #empty branch name
            echo "Cloning $EISMT_LIB_URL/$LIBNAME ${LIBNAME,,}"
            echo "."
            git clone $EISMT_LIB_URL/$LIBNAME ${LIBNAME,,}
        else
            echo "Cloning branch ${BRANCHNAME} for $EISMT_LIB_URL/$aLIBNAME ${LIBNAME,,}"
            echo "."
            #git clone -b ${BRANCHNAME} $EISMT_LIB_URL/$LIBNAME ${LIBNAME,,}
            git clone $EISMT_LIB_URL/$LIBNAME ${LIBNAME,,}
            git checkout ${BRANCHNAME}
        fi
        cd ${LIBNAME,,}
    fi
    echo "."
    if [ -e package.json ]
    then
       echo "Installing library $LIBNAME"
       npm install
    fi
}

echo "."
echo "Clone our EIS-MiddleTier libraries locally..."
echo "."
clone_cdcr_library CDCRHelpers
clone_cdcr_library CDCRHooks
echo "."

cd "$CWD"
if [ -f ".env" ];
then
    echo ".env file exists."
else
    echo "Copying env.sample to .env. Remember to make changes to .env before running the server"
    cp env.sample .env 
fi
echo "."
echo "EIS-MiddleTier library installs completed"
echo "."
