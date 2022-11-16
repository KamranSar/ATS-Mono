#!/bin/bash

# Merge Squash
# Author: Nurthin Aziz
# This script takes in ZERO arguments but requires a clean working branch.
# This scripts does a `git merge --squash <current_working_branch>` on top of main.
#
# Example: 
#./scripts/merge_squash.sh
# npm run merge-squash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
# Example: echo -e "${GREEN}Hello world${NC}"
# Make sure we're in the root project folder
CWD=$(pwd)
# Current working branch name from git
CWB=$(git rev-parse --abbrev-ref HEAD)
ON_MAIN="_on_main"

if [[ $CWD == *"scripts" ]]; then
  cd ..
fi

echo -e "Running ${GREEN}git merge --squash $CWB${NC} on top of main."

sleep 2

echo -e "\nStep 1/5: ${GREEN}Checking for a clean working branch...${NC}"
sleep 2

if [ -z "$(git status --porcelain)" ]; then 
  # Clean working branch
  echo -e "Looks good!"
else 
  echo -e "\n${RED}Commit these changes before continuing${NC}"
  # Uncommitted changes
  git status
  exit 0;
fi

echo -e "\nStep 2/5: ${GREEN}Pulling latest from main.${NC}"
sleep 2

git checkout main
git pull

echo -e "\nStep 3/5: ${GREEN}Creating new branch from main.${NC}"
sleep 2

BRANCH_EXISTS=$(git branch --list $CWB$ON_MAIN)
if [[ $BRANCH_EXISTS ]]; then

  echo -e "${RED}${CWB}${ON_MAIN} branch already exists${NC}."

  while true; do
    read -p "Do you wish to delete this branch?" yn
    case $yn in
        [Yy]* ) git branch -D $CWB$ON_MAIN; break;;
        [Nn]* ) git checkout $CWB; exit;;
        * ) echo "Please answer yes or no.";;
    esac
  done

fi
git checkout -b $CWB$ON_MAIN;


echo -e "\nStep 4/5: ${GREEN}git merge --squash $CWB${NC}"
sleep 2

git merge --squash $CWB

echo -e "\nStep 5/5: ${GREEN}Ready for you to resolve merge conflicts!${NC}"
sleep 2

echo -e "As a reminder...\n${GREEN}Current Changes${NC} - Are from main \n${BLUE}Incoming Changes${NC} - Are from $CWB."