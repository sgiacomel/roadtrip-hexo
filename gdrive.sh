#!/usr/bin/env bash
set -e
#Get gdrive
#gdrive about

#Get files in folder
folder_id=$(gdrive-linux-x64 list --no-header -q "mimeType = 'application/vnd.google-apps.folder' and name contains 'GPSLogger'" | awk '{print $1}')
#folder_id=1yhjEL1CPHBKKoVRc12B2Zksk8BKxEhsB
#Get list of folders
gdrive-linux-x64 list --no-header -q "'${folder_id}' in parents and name contains 'geojson'"
