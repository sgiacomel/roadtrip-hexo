#!/usr/bin/env bash
set -x
pid_hexo_server=""

start_hexo_server() {
  nohup hexo server &> /dev/null &
  pid_hexo_server=$(echo $!)
  curl_response=""
  while [[ "${curl_response}" != "200" ]]; do
    curl_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000)
    sleep 3
  done
}

stop_hexo_server() {
  kill -9 ${pid_hexo_server} &> /dev/null
}

local_files=()
new_files=()
alldates=()
gps_folder="source/map/gps"
declare -A gdrive_files
declare -A titles

# Read files from gps folder
read_local_files() {
  for file in ${gps_folder}/*; do
    if [[ -f ${file} ]]; then
    	file_name=$(basename ${file})
    	local_files+=(${file_name})
      date_param=${file_name:0:4}/${file_name:4:2}/${file_name:6:2}
      alldates+=($date_param)
    fi
  done
}

# Get folder_id from list of folders
get_folder_id() {
  gdrive list --no-header -q "mimeType = 'application/vnd.google-apps.folder' and name contains 'GPSLogger'" | awk '{print $1}'
}

get_gdrive_files() {
  while read -r line; do
    read -r gdrive_id gdrive_file <<<$(echo $line | awk '{print $1,$2}')
    gdrive_files[${gdrive_file}]=${gdrive_id}
  done < <(gdrive list --no-header -q "'$1' in parents and name contains 'geojson'")
}

download_missing_files() {
  for gfile in "${!gdrive_files[@]}"; do 
    if [[ ! "${local_files[@]}" =~ "${gfile}" ]]; then
      gdrive download --path "${gps_folder}" "${gdrive_files[${gfile}]}"
      new_files+=(${gfile})
    fi
  done
}

new_files+=("20180729.geojson")

cache_results() {
  for file in ${new_files[@]}; do
    node cache_locality.js ${gps_folder}/${file}
  done
}

create_maps() {
  start_hexo_server
  for file in ${new_files[@]}; do
    date=$(echo ${file} | sed 's/\.geojson$//g')
    date_param=${date:0:4}/${date:4:2}/${date:6:2}
    titles[$date]=$(node create_map.js ${date_param})
  done
  stop_hexo_server
}

create_posts() {
  start_hexo_server
  for file in ${new_files[@]}; do
    date=$(echo ${file} | sed 's/\.geojson$//g')
    date_param=${date:0:4}/${date:4:2}/${date:6:2}
    date_post=${date:0:4}-${date:4:2}-${date:6:2}
    hexo new post ${date}
    title=${titles[$date]}
    mv ${date_post}.jpg source/_posts/${date}/map.jpg
    cat > source/_posts/${date}.md << EOM
---
title: ${title}
date: ${date_post} 00:00:00
tags:
thumbnailImage: map.jpg
link: map/?dates=${date_param}
---
<!-- excerpt -->
EOM
  done
  stop_hexo_server
}

create_alldates() {
  if [[ ${#new_files[@]} > 0 ]]; then
    alldates_json='{"raw_dates":['
    count=0
    for date in "${alldates[@]}"; do
      alldates_json="${alldates_json}"'"'"${date}"'", '
      ((count++))
      if [[ ${#alldates[@]} != $count ]]; then
        alldates_json="${alldates_json}"', '
      fi
    done
    alldates_json="${alldates_json}"']}'
    echo "${alldates_json}"
    echo "${alldates_json}" > themes/tranquilpeak/layout/_map/alldates.ejs
  fi
}

#folder_id=$(get_folder_id)
folder_id=1yhjEL1CPHBKKoVRc12B2Zksk8BKxEhsB
#read_local_files
#get_gdrive_files ${folder_id}
#download_missing_files
#new_files=() && new_files+=("20180608.geojson")
cache_results
create_maps
create_posts
#create_alldates
