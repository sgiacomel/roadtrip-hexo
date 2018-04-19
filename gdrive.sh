#!/usr/bin/env bash
set -e

# Get gdrive
#gdrive about

local_files=()
downloaded_files=()
gps_folder="source/map/gps"

# REad files from gps folder
for file in ${gps_folder}/*; do
  if [[ -f ${file} ]]; then
  	file_name=$(basename ${file})
  	local_files+=(${file_name})
  fi
done

# Read dates from alldates
#while read -r line; do
#  local_dates+=($(echo $line | sed 's/\///g'))
#done < <(cat themes/tranquilpeak/layout/_map/alldates.ejs | jq -r '.raw_dates[]')

# Get folder_id from list of folders
#folder_id=$(gdrive list --no-header -q "mimeType = 'application/vnd.google-apps.folder' and name contains 'GPSLogger'" | awk '{print $1}')
folder_id=1yhjEL1CPHBKKoVRc12B2Zksk8BKxEhsB

# Get files in folder
while read -r line; do
  read -r gdrive_id gdrive_file <<<$(echo $line | awk '{print $1,$2}')
  if [[ ! " ${local_files[@]} " =~ " ${gdrive_file} " ]]; then
  	gdrive download --path "${gps_folder}" "${gdrive_id}"
  	downloaded_files+=(${gdrive_file})
  	date=$(echo ${gdrive_file} | sed 's/\.geojson$//g')
  	# Create post
  	#hexo new post $date
  fi
done < <(gdrive list --no-header -q "'${folder_id}' in parents and name contains 'geojson'")

