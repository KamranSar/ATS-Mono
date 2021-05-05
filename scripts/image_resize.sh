#!/usr/bin/bash

# Image Resizer
# Author: Nurthin Aziz
# This shell script takes in a single arguement pointing to a .svg or .png
# This shell script ensures that all dependencies are installed before called python3 image_resize.py $1
# Example: ./image_resize.sh ~/Documents/Icons/logo.png

echo "Running image resizer: "
echo "Checking dependencies..."
# Check that pip3 is installed
pip3 --version
if [ $? -eq 0 ]
then
  echo "pip3 installed."
else
  echo "Installing pip3"
  sudo apt install pip3
fi

# Check that cairosvg is installed with python3
pip3 list | grep -F CairoSVG
if [ $? -eq 0 ]
then
  echo "CairoSVG dependency installed."
else
echo "Installing CairoSVG"
  pip3 install CairoSVG
fi

git clone https://cdcr@dev.azure.com/cdcr/Common/_git/image_resize image_resize
cd image_resize
python3 ./image_resize.py ../$1
cd ..




