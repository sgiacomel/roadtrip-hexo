#!/usr/bin/env bash

while getopts d:f:s: option
do
 case "${option}"
 in
 d) DESTINATION=${OPTARG};;
 f) FOLDER=${OPTARG};;
 s) SIZE=${OPTARG};;
 esac
done

if [[ -z $FOLDER || -z $DESTINATION || -z $SIZE ]]; then
  echo "Arg missing"
  exit 1
fi

if [[ ! -d ${DESTINATION} ]]; then
  mkdir ${DESTINATION}
fi

for pic in ${FOLDER}/*; do
  if [[ -f ${pic} ]]; then
  	file_name=$(basename ${pic})
  	convert ${pic} -verbose -quality 75 -resize "${SIZE}^" ${DESTINATION}/${file_name}
  fi
done

#resize to either height or width, keeps proportions using imagemagick
#find ${FOLDER} -iname '*.jpg' -o -iname '*.png' -exec convert \{} -verbose -resize $WIDTHx$HEIGHT\> \{} \;

#find ${FOLDER} -iname '*.jpg' -exec identify -format '%[EXIF:Orientation]' {} \;
#find ${FOLDER} -iname '*.jpg' -exec echo {} \;

# alternative
#mogrify -path ${FOLDER} -resize ${WIDTH}x${HEIGHT}% *.png -verbose
