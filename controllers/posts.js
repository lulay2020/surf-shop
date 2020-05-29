const Post = require('../models/post.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_Token});
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'ddpcvjr6j',
	api_key: '673569767454839',
	api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
	async postIndex (req, res, next){
		let posts = await Post.find({});
		res.render('posts/index', { posts })
	},

	postNew (req, res, next){
		res.render('posts/new');
	},

	async postCreate (req, res, next){
		req.body.post.images = [];
		for(const file of req.files){
			let image = await cloudinary.v2.uploader.upload(file.path);
			req.body.post.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
		let response = await geocodingClient
			.forwardGeocode({
				query: req.body.post.location,
				limit: 1
			})
			.send();
		req.body.post.coordinates = response.body.features[0].geometry.coordinates;
		let post = await Post.create(req.body.post);
		console.log(post, post.coordinates);
		res.redirect(`posts/${post.id}`);
	},

	async postShow(req, res, next){
		let post = await Post.findById( req.params.id );
		res.render('posts/show', { post });
	},

	async postEdit(req, res, next){
		let post = await Post.findById( req.params.id );
		res.render('posts/edit', { post });		
	},

	async postUpdate(req, res, next){
		// find the post by id
		let post = await Post.findByIdAndUpdate( req.params.id, req.body.post );
		// check if there is images to delete
		if (req.body.deleteImages && req.body.deleteImages.length) {
			// assign deleteImages to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages){
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				// delete images from post.images
				for(const image of post.images){
					if (image.public_id === public_id) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are new images to upload
		if (req.files) {
			// upload images
			for(const file of req.files){
				// upload images to cloudinary
				let image = await cloudinary.v2.uploader.upload(file.path);
				// add images to post.images array
				post.images.push({
					url: image.secure_url,
					public_id: image.public_id
				});
			}
		}
		// check if location is updated
		if (req.body.post.location !== post.location) {
			let response = await geocodingClient
				.forwardGeocode({
					query: req.body.post.location,
					limit: 1
				})
				.send();
			post.coordinates = response.body.features[0].geometry.coordinates;
			post.location = req.body.post.location;
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		await post.save();
		res.redirect(`/posts/${post.id}`);
	},

	async postDestroy(req, res, next){
		let post = await Post.findById(req.params.id);
		for(const image of post.images){
			await cloudinary.uploader.destroy(image.public_id);
		}
		await post.remove();
		res.redirect('/posts');
	}
}