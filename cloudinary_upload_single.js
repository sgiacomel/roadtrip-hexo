const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async');

const cloudinary_config = require( "../cloudinary_config.json" );

cloudinary.config(cloudinary_config);

const picture = process.argv[2];
const name = process.argv[3];
if (!picture) {
	console.log("No picture!");
	process.exit();
}
if (!name) {
	console.log("No name!");
	process.exit();
}
cloudinary.v2.uploader.upload(picture, {public_id: name}, function(error, result) { 
	if (error) {
		console.log(error);
	}
	if (result && result.url) {
		console.log(" - " + result.url);
	}
	else {
		console.log(picture + ": no result?");
	}
});
