#!/usr/bin/env bash

if [[ -z $1 ]]; then
	echo "Missing parameter"
	exit
fi

folder=$1
text=$(node create_gallery.js ${folder})
echo "${text}" > source/_posts/${folder}.md