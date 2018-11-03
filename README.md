# roadtrip

This is the source code for a hexo blog.

I used the tranquilpeak theme (https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak) which I heavily modified (I basically really liked the galleries).

There are script to upload images to cloudinary, to create posts and maps and thumbnails automatically.

The flow is:
- record a day of gps location with either an IPhone or an Android. I tried and coded for a few different options but I mainly used GPSLogger for Android
- drop the geojson data (or convert gpx to geojson with a tool like https://github.com/mapbox/togeojson) inside source->map->gps
- call the script create_posts.sh with the right parameter (I initially wanted to compute a difference with local data and a google drive folder but I was having trouble so for now the parameter is hardcoded)
- once it's done, you can call create_map.js and drop the result map-all.jpg in source, something like `node create_map.js ; cp map-all.jpg source/map-all.jpg`
- after this, when you call `hexo clean; hexo generate -d`; the -d flag deploys to a separate repo called `roadtrip` which is monitored by netlify which is where the website is automatically deployed

To create a gallery, use the `resizer.sh` script to generate smaller versions of a gallery and then you can use the script `create_gallery.sh`: 
for example ./create_gallery.sh -f Alberta -r -g -u