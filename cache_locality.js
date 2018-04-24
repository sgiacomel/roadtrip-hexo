const https = require('https'),
	async = require('async'),
	fs = require("fs-extra");

const file_name = process.argv[2];

let location_file = './source/locations.json';
let db = require(location_file);

function getLocality(response) {
	var json_response = JSON.parse(response);
	var locality = "";
	search_for = ["locality", "administrative_area_level_3"];
	if (json_response.results && json_response.results[0]) {
		for (var index_address in json_response.results[0].address_components) {
			if(json_response.results[0].address_components[index_address].types.some(function (v) { return search_for.indexOf(v) >= 0;
		    })) {
				locality = json_response.results[0].address_components[index_address].short_name;
				break;
			}
		}
	}
	return locality;
}

fs.readFile('./' + file_name, 'utf8', function readFileCallback(err, data){
    if (err) {
        console.log(err);
    } 
    else {
	    json_data = JSON.parse(data);
	    let time, old_time, input;
	    const points = [];
	    if (json_data && json_data.features && json_data.features.length) {
	    	if(json_data.features[0].geometry.type == 'Point') {
	    		for (let point_index in json_data.features) {
		    		input = [json_data.features[point_index].geometry.coordinates[1], json_data.features[point_index].geometry.coordinates[0]].join(',');
		    		time = new Date(json_data.features[point_index].properties.time).getTime();
					time_difference = (time - old_time) / 1000;
					if (time_difference > 3600 || time_difference < -3600 || point_index == 0 || point_index == json_data.features.length -1) {
						points.push(input);
						if (time_difference > 3600 || time_difference < -3600) {
							let more_input = [json_data.features[point_index - 1].geometry.coordinates[1], json_data.features[point_index - 1].geometry.coordinates[0]].join(',');
							points.push(more_input);
						}
					}
					old_time = time;
	    		}
	    	}
	    	else if(json_data.features[0].geometry.type == 'LineString') {
	    		for (let point_index in json_data.features[0].geometry.coordinates) {
		    		input = [json_data.features[0].geometry.coordinates[point_index][1], json_data.features[0].geometry.coordinates[point_index][0]].join(',');
		    		time = new Date(json_data.features[0].properties.coordTimes[point_index]).getTime();
					time_difference = (time - old_time) / 1000;
					if (time_difference > 3600 || time_difference < -3600 || point_index == 0 || point_index == json_data.features[0].geometry.coordinates.length -1) {
						points.push(input);
						if (time_difference > 3600 || time_difference < -3600) {
							let more_input = [json_data.features[0].geometry.coordinates[point_index - 1][1], json_data.features[0].geometry.coordinates[point_index - 1][0]].join(',');
							points.push(more_input);
						}
					}
					old_time = time;
	    		}
	    	}
		}
		//console.log(points);
		async.each(points, function(point, callback) {
			https.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + point + "&key=AIzaSyCMETxi9mRjWMt726OBZAAhRyXj1xyuPOs", function(response) {
				let data = '';
				response.on('data', (chunk) => {
				    data += chunk;
				});
				response.on('end', () => {
				    let locality = getLocality(data);
				    if(!db[point]) {
				    	db[point] = locality;
				    }
				    callback();
				});
			});
		}, function(err) {
			fs.writeFile(location_file, JSON.stringify(db), 'utf8', function(err, saved_data) {});
		});
	}
});
