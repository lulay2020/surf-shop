const Post = require('../models/post');
const Review = require('../models/review');


module.exports = {
	// Reviews create
	async reviewCreate (req, res, next){
		// find post by it id
		let post = await Post.findById(req.params.id).populate('reviews').exec();
		let haveReviewed = post.reviews.filter(review =>{
			return review.author.equals(req.user._id);
		}).length;
		if (haveReviewed) {
			req.session.error = 'You can create only one review per post';
			return res.redirect(`/posts/${post.id}`);
		}
		// create the review
		req.body.review.author = req.user._id;
		let review = await Review.create(req.body.review);
		// assign review to post
		post.reviews.push(review);
		// save the post
		await post.save();
		// redirect to the post
		req.session.success = 'Review Created successfully';
		res.redirect(`/posts/${post.id}`)
	},

	// Reviews update
	async reviewUpdate(req, res, next){
		// update the review
		let review = await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
		// redirect to the post
		req.session.success = 'Review Updated successfully';
		res.redirect(`/posts/${req.params.id}`)
	},

	// Review destroy
	async reviewDestroy(req, res, next){
		await Post.findByIdAndUpdate(req.params.id, {
			$pull: { reviews: req.params.review_id}
		});
		await Review.findByIdAndRemove(req.params.review_id);
		// redirect to posts index
		req.session.success = 'Review Deleted successfully';
		res.redirect(`/posts/${req.params.id}`);

	}
}