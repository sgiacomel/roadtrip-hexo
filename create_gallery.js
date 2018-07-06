const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async'),
	moment = require('moment'),
	cloudinary_config = require( "../cloudinary_config.json" );
cloudinary.config(cloudinary_config);
const folder = process.argv[2];

const images = [];
const ratios = {};
const max_pics_to_remove = 5;

function simple_pictures_loop(pictures, fig, no_break) {
	let result = "";
	for (let index in pictures) {
    	const picture = pictures[index];
    	let classes = "left";
    	if (index == pictures.length - 1 && !no_break) {
    		classes += " clear"
    	}
    	result += "{% image fancybox fig-" + fig + " " + classes + " nocaption group:" + folder.toLowerCase() + " " + picture + " %}";
    }
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
	let align_big = "left";
	let no_break = false;
	if (Math.random() < 0.5) {
		//align_big = "right clear";
		//no_break = true;
		align_big = "right";
	}
	switch(option) {
	    case 1:
	        result = simple_pictures_loop(pictures, 100);
	        break;
	    case 2:
	        result = simple_pictures_loop(pictures, 50);
	        break;
	    case 3:
	        if(Math.random() < 0.5) {
		        result = simple_pictures_loop(pictures, 33);
		    }
		    else {
			    // 2 + 1
			    result += "{% image fancybox fig-66 " + align_big + " nocaption group:" + folder.toLowerCase() + " " + pictures[0] + " %}";
		        result += simple_pictures_loop(pictures.splice(1), 33, no_break);
		    }
	        break;
	    case 4:
	        if(Math.random() < 0.5) {
		        result = simple_pictures_loop(pictures, 25);
		    }
		    else {
			    // 3 + 1
			    result += "{% image fancybox fig-75 " + align_big + " nocaption group:" + folder.toLowerCase() + " " + pictures[0] + " %}";
		        result += simple_pictures_loop(pictures.splice(1), 25, no_break);
		    }
	        break;
	    case 5:
	        if(Math.random() < 0.33) {
		        fig = 20;
		        result = simple_pictures_loop(pictures, fig);
		    }
		    else if(Math.random() < 0.66) {
		    	// 4 + 1
		    	result += "{% image fancybox fig-50 " + align_big + " nocaption group:" + folder.toLowerCase() + " " + pictures[0] + " %}";
		        result += simple_pictures_loop(pictures.splice(1), 25, no_break);
		    }
		    else {
		    	// 4 + 1
		    	result += "{% image fancybox fig-80 " + align_big + " nocaption group:" + folder.toLowerCase() + " " + pictures[0] + " %}";
		        result += simple_pictures_loop(pictures.splice(1), 20, no_break);
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
disqusIdentifier: " + folder + "\n\
comments: true\n\
actions: false\n\
no_excerpt_on_index: true\n\
tags:\n\
thumbnailImage: " + images[Math.floor(Math.random() * (images.length - 1))] + "\n\
---\n\
...\n\
<!-- excerpt -->" + output.join('') + "\n\
");
  }
);
