#!/usr/bin/env bash

## Usage: SCRIPT -u -r
##     Disable the given account as Sensibill Admin
##     -f   Folder
##     -u   Upload
##     -r   Resize
##     -g   Gallery

help=$(grep "^## " "${BASH_SOURCE[0]}" | cut -c 4-)

show_help() {
  echo "$help"
}

upload=""
resize=""
folder=""
gallery=""

while getopts ":h:gurf:" opt; do
  case "$opt" in
    h)
      show_help
      exit 0
      ;;
    u)
      upload=1
      ;;
    f)
      folder=$OPTARG
      ;;
    r)
      resize=1
      ;;
    g)
      gallery=1
      ;;
    '?')
      show_help >&2
      exit 1
      ;;
  esac
done

if [[ ! -z ${resize} ]]; then
	./resizer.sh -f ~/Pictures/${folder} -d ~/Pictures/${folder}/resized -s 1500
fi
if [[ ! -z ${upload} ]]; then
	node cloudinary_upload.js ${folder}
fi
if [[ ! -z ${gallery} ]]; then
	hexo new post ${folder}
fi
text=$(node create_gallery.js ${folder})
echo "${text}" > source/_posts/${folder}.md