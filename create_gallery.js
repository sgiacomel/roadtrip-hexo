const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async'),
	moment = require('moment'),
	cloudinary_config = require( "../cloudinary_config.json" );
cloudinary.config(cloudinary_config);
const folder = process.argv[2];
//const folder = "Darwin";
const images = [];
const ratios = {};
const max_pics_to_remove = 5;

function simple_pictures_loop(pictures, fig) {
	let result = "";
	pictures.forEach(function(picture) {
    	result += "{% image fancybox fig-" + fig + " left nocaption group:" + folder.toLowerCase() + " " + picture + " %}";
    });
    return result;
}

function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function print_pictures(pictures, option) {
	let result = "";
	let fig = "";
	switch(option) {
	    case 1:
	        result = simple_pictures_loop(pictures, 100);
	        break;
	    case 2:
	        result = simple_pictures_loop(pictures, 50);
	        break;
	    case 3:
	        result = simple_pictures_loop(pictures, 33);
	        break;
	    case 4:
	        if(Math.random() < 0.5) {
		        result = simple_pictures_loop(pictures, 25);
		    }
		    else {
			    // 3 + 1
			    let align_big = "left";
		    	if(Math.random() < 0.5) {
		    		align_big = "right";
		    	}
		        result += "{% image fancybox fig-75 " + align_big + " nocaption group:" + folder.toLowerCase() + " " + pictures[0] + " %}";
		        result += simple_pictures_loop(pictures.splice(1), 25);
		    }
	        break;
	    case 5:
	        if(Math.random() < 0.5) {
		        fig = 20;
		        result = simple_pictures_loop(pictures, fig);
		    }
		    else {
		    	// 4 + 1
		    	let align_big = "left";
		    	if(Math.random() < 0.5) {
		    		align_big = "right";
		    	}
				result += "{% image fancybox fig-50 " + align_big + " nocaption group:" + folder.toLowerCase() + " " + pictures[0] + " %}";
		        result += simple_pictures_loop(pictures.splice(1), 25);
		    }
	        break;
	    default:
	        console.log("Unhandled!");
	}
	return result;
}

const regex = folder + "\/[0-9]*\.";
const re = new RegExp(regex, "g");

cloudinary.v2.api.resources({folder: folder, max_results: 500, angle: "exif"}, function(error, result) {
	let index = 0;
  	result.resources.forEach(function(resource) {
  		// Skip unwanted pictures
  		if ( resource.public_id.match(re) ) {			
	  		// Group images by ratio
	  		let ratio = Math.round(100 * resource.width / resource.height) / 100;
	  		if(!ratios[ratio]) {
	  			ratios[ratio] = [];
	  		}
	  		images.push(resource.url.replace("/upload/", "/upload/a_exif/"));
	  		ratios[ratio].push(resource.url.replace("/upload/", "/upload/a_exif/"));
	  	}
  	});
  	const output = [];
  	Object.keys(ratios).forEach(function(ratio) {
  		//console.log("Ratio: " + ratio + " - " + ratios[ratio].length);
  		const pictures = ratios[ratio].slice(0);
  		let number_picture_to_remove = max_pics_to_remove;
  		while (pictures.length > 0) {
			//console.log("Photos: " + pictures.length);
			if (number_picture_to_remove <= pictures.length) {
				const removed_pic = pictures.splice(0, number_picture_to_remove);
				shuffle_array(removed_pic)
				output.push(print_pictures(removed_pic, number_picture_to_remove));
				number_picture_to_remove--;
				//console.log(number_picture_to_remove, picture_to_remove);
				if (number_picture_to_remove == 0) {
					number_picture_to_remove = max_pics_to_remove;
				}
			}
			else {
				number_picture_to_remove--;
			}
  		}
  	});
  	shuffle_array(output);
  	moment().format('YYYY-MM-DD HH:mm:ss');
  	console.log("\n\
---\n\
title: " + folder + "\n\
date: " + moment().format('YYYY-MM-DD HH:mm:ss') + "\n\
tags:\n\
thumbnailImage: " + images[Math.floor(Math.random() * (images.length - 1))] + "\n\
---\n\
" + folder + ".\n\
<!-- more -->\n\
" + output.join('') + "\n\
");
  }
);
