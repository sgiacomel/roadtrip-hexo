const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async');

console.log(  );

const cloudinary_config = require( "../cloudinary_config.json" );

cloudinary.config(cloudinary_config);

const dir = '/home/simone/Pictures/Darwin/resized/';
if (true) {
	fs.readdir(dir, function(err, files) {
		if (err) {
			console.log(err);
		}
		let gallery_index = 0;
		let gallery_name = 'Darwin';
		files.forEach(function(file) {
			console.log("Uploading: " + dir + file);
			cloudinary.v2.uploader.upload(dir + file, {public_id: gallery_name + '/' + gallery_index++}, function(error, result) { 
				console.log(" - " + result.url);
			});
		});
	});
}

if (false) {
	cloudinary.v2.api.resources({max_results: 500}, function(error, result) {
		console.log(result);
		const ids = [];
		result.resources.forEach(function(resource) {
			ids.push(resource.public_id);
		});
		console.log(ids);
		cloudinary.v2.api.delete_resources(ids, function(error, result) {
			console.log(result);
		});
	});
}