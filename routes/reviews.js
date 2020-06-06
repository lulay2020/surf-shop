const express = require('express');
const router = express.Router({ mergeParams: true});
const { asyncErrHandler, isReviewAuthor } = require('../middlewares');
const {
	reviewCreate,
	reviewUpdate,
	reviewDestroy
} = require('../controllers/reviews');


/* POST reviews create /posts/:id/reviews */
router.post('/', asyncErrHandler(reviewCreate));

/* PUT reviews update /posts/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrHandler(reviewUpdate));

/* DELETE reviews destroy /posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrHandler(reviewDestroy));

module.exports = router;