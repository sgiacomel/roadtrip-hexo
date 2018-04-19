const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async');

const cloudinary_config = require( "../cloudinary_config.json" );

cloudinary.config(cloudinary_config);

const dir = '/home/simone/Pictures/Darwin/resized/';

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
