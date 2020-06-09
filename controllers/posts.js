const Post = require('../models/post.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports = {
	async postIndex (req, res, next){
		let posts = await Post.paginate({}, {
			page: req.query.page || 1,
			limit: 10,
			sort: '-_id'
		});
		posts.page = Number(posts.page);
		res.render('posts/index', { 
			posts,
			mapBoxToken, 
			title: 'Posts index'
		});
	},

	postNew (req, res, next){
		res.render('posts/new');
	},

	async postCreate (req, res, next){
		req.body.post.images = [];
		for(const file of req.files) {
			req.body.post.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
			console.log(req.file);
		}
		let response = await geocodingClient
			.forwardGeocode({
				query: req.body.post.location,
				limit: 1
			})
			.send();
		req.body.post.geometry = response.body.features[0].geometry;
		req.body.post.author = req.user._id;
		let post = new Post(req.body.post);
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
		req.session.success = 'Post created';
		res.redirect(`posts/${post.id}`);
	},

	async postShow(req, res, next){
		let post = await Post.findById( req.params.id ).populate({
			path: 'reviews',
			options: { sort: {'_id': -1} },
			populate: {
				path: 'author',
				model: 'User'
			}
		});
		const floorRating = post.calculateAvgRating();
		res.render('posts/show', {
			post, 
			floorRating,
		});
	},

	postEdit(req, res, next){
		res.render('posts/edit');		
	},

	async postUpdate(req, res, next){
		// destructre post from post.locals
		const { post } = res.locals;	
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
			for(const file of req.files) {
				post.images.push({
					url: file.secure_url,
					public_id: file.public_id
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
			post.geometry = response.body.features[0].geometry;
			post.location = req.body.post.location;
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
		res.redirect(`/posts/${post.id}`);
	},

	async postDestroy(req, res, next){
		const { post } = res.locals;
		for(const image of post.images){
			await cloudinary.uploader.destroy(image.public_id);
		}
		await post.deleteOne();
		req.session.seccess = 'Post deleted successfully';
		res.redirect('/posts');
	}
}