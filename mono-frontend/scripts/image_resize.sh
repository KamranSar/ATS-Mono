#!/bin/bash

# Image Resizer
# Author: Nurthin Aziz
# This script takes in a single argument pointing to your .svg or .png file.
# A backup of your old public/img/icons folder is created.
# The final product is an updated public/img/icons folder with all the appropriate sizes for PWA.
# Example: 
#./scripts/image_resize.sh ~/Documents/Icons/logo.png

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
# Example: echo -e "${GREEN}Hello world${NC}"
# Make sure we're in the root project folder
CWD=$(pwd)
if [[ $CWD == *"scripts" ]]; then
  cd ..
fi

# Must be an absolute path
if [[ $1 == "../"* ]]; then
  echo -e "${RED}First argument must be an absolute path${NC}"
  echo "./scripts/image_resize.sh /home/cdcr/Documents/Icons/logo.png"
  echo -e "\t\t\t\tOR"
  echo "./scripts/image_resize.sh ~/Documents/Icons/logo.png"
  exit 0
fi

echo -e "${GREEN}Running the image resizer: ${NC}"
echo "User passed in $1"

if [[ $1 == *".png" ]]; then
  echo -e "${RED}NOTE:${NC} PNG passed in, cannot create a logo.svg."
fi

sleep 2
echo -e "\n${GREEN}Checking dependencies...${NC}"

# Check that pip3 is installed
pip3 --version
if [ $? -eq 0 ]
then
  echo "pip3 installed."
else
  echo -e "${GREEN}Installing pip3${NC}"
  sudo apt install python3-pip
fi

# Check that cairosvg is installed with python3
pip3 list | grep -F CairoSVG
if [ $? -eq 0 ]
then
  echo "CairoSVG dependency installed."
else
echo -e "${GREEN}Installing CairoSVG${NC}"
  pip3 install CairoSVG
fi

# Backup the /public/img/icons folder
num=1
backup_dir=img_BACKUP
while [[ -d $backup_dir$num ]] ; do
    let num++
done

echo -e "\n${GREEN}Backing up public/img/icons to $backup_dir$num${NC}"
mkdir $backup_dir$num
mv public/img/icons $backup_dir$num/.
mv public/img/logo.* $backup_dir$num/.
sleep 2

echo -e "\n${GREEN}Resizing images, please wait...${NC}"
mkdir icons
cd icons
python3 ../scripts/image_resize.py $1

# Keep only the .png .svg and .ico
find . -type f ! -name '*.png' \
  -type f ! -name '*.svg' \
  -type f ! -name '*.ico' \
  -delete
cd ..

echo -e "\n${GREEN}Moving images to /public/img/icons folder...${NC}"
mv icons public/img/.
mv public/img/icons/logo.* public/img/.

echo -e "${GREEN}Done.${NC}"

