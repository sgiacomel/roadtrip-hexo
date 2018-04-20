const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async');

const cloudinary_config = require( "../cloudinary_config.json" );

cloudinary.config(cloudinary_config);

cloudinary.v2.api.resource('vs5tubp20dszuenlfmlw', {image_metadata: true}, function(error, result) { console.log(result); } );

cloudinary.v2.uploader.destroy('vs5tubp20dszuenlfmlw', {invalidate: true }, function(error, result) { console.log(result); } );

/*cloudinary.v2.api.resources({max_results: 500}, function(error, result) {
	//console.log(result);
	const ids = [];
	result.resources.forEach(function(resource) {
		if (resource.public_id.indexOf('Darwin') == -1) {
			ids.push(resource.public_id);
		}
	});
	console.log(ids);
	//cloudinary.v2.api.delete_resources(ids, function(error, result) {
	//	console.log(result);
	//});
});*/
