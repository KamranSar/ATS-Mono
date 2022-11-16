#!/bin/python3

# Image Resizer for vue-frontend-template
# Author: Nurthin Aziz
#
# ! DO NOT USE THIS FILE
# ! USE the SHELL SCRIPT INSTEAD: ./scripts/image_resize.sh ~/Documents/logo.svg

import sys
from PIL import Image
import cairosvg
import shutil

def main(argv):
  pngImage = argv;

  # If the image is an svg, convert to a PNG
  if ".svg" in pngImage:
    shutil.copyfile(pngImage, "logo.svg")
    print ("Saving " + "logo.svg")

    cairosvg.svg2png(url=pngImage, write_to="logo.png")
    print ("Saving " + "logo.png")
  else:
    shutil.copyfile(pngImage, "logo.png")
    print ("Saving " + "logo.png")

  sizes = [32, 16, 32, 60, 76, 120, 144, 150, 152, 180, 180, 192, 192, 512, 512]
  fileNames = ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon-60x60.png', 'apple-touch-icon-76x76.png', 'apple-touch-icon-120x120.png', 'msapplication-icon-144x144.png', 'mstile-150x150.png', 'apple-touch-icon-152x152.png', 'apple-touch-icon-180x180.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-maskable-192x192.png', 'android-chrome-512x512.png', 'android-chrome-maskable-512x512.png']
  
  for i, size in enumerate(sizes):
    img = Image.open("logo.png")
    wpercent = (size/float(img.size[0]))
    hsize = int((float(img.size[1])*float(wpercent)))
    img = img.resize((size,hsize), Image.ANTIALIAS)
    print ("Saving " + fileNames[i])
    img.save(fileNames[i])

if __name__ == "__main__":
  try:
    main(sys.argv[1])
  except:
    print('Pass in the location of your .png or .svg as an argument.')