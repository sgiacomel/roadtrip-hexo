const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async');

const cloudinary_config = require( "../cloudinary_config.json" );

cloudinary.config(cloudinary_config);

const folder = process.argv[2];
if (!folder) {
	console.log("No folder!");
	process.exit();
}
const dir = '/home/simone/Pictures/' + folder + '/resized/';

fs.readdir(dir, function(err, files) {
	if (err) {
		console.log(err);
	}
	let gallery_index = 0;
	let gallery_name = folder;
	files.forEach(function(file) {
		cloudinary.v2.uploader.upload(dir + file, {public_id: gallery_name + '/' + gallery_index++}, function(error, result) { 
			if (error) {
				console.log(error);
			}
			if (result && result.url) {
				console.log(" - " + result.url);
			}
			else {
				console.log(file + ": no result?");
			}
		});
	});
});
