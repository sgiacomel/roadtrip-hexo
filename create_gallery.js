const cloudinary = require('cloudinary'),
	fs = require('fs-extra'),
	async = require('async');

const cloudinary_config = require( "../cloudinary_config.json" );

cloudinary.config(cloudinary_config);
const folder = "Darwin";

const sizes = ["fig-100", "fig-50", "fig-50", "fig-33", "fig-33", "fig-33", "fig-75", "fig-25", "fig-25", "fig-25", "fig-50", "fig-25", "fig-25", "fig-25", "fig-25"];
const extra_classes = ["", "left", "right", "", "", "", "right", "", "", "clear", "", "right", "right", "right", "right"];
const images = [];

cloudinary.v2.api.resources({folder: folder, max_results: 500, angle: "exif"}, function(error, result) {
	let index = 0;
  	result.resources.forEach(function(resource) {
  		images.push("{% image fancybox " + sizes[index] + " " + extra_classes[index] + " nocaption group:" + folder.toLowerCase() + " " + resource.url.replace("/upload/", "/upload/a_exif/") + " %}");
  		index++;
  		if (index >= sizes.length) {
  			index = 0;
  		}
  	});

  	console.log("\n\
---\n\
title: " + folder + "\n\
date: 2018-04-05 18:56:15\n\
tags:\n\
thumbnail: " + result.resources[0].url + "\n\
thumbnailImage: " + result.resources[0].url + "\n\
---\n\
" + folder + ".\n\
<!-- more -->\n\
" + images.join('') + "\n\
");
  }
);
