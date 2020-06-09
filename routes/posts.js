const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary, storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrHandler, isLoggedIn, isAuthor } = require('../middlewares');
const { 
	postIndex, 
	postNew, 
	postCreate, 
	postShow,
	postEdit,
	postUpdate,
	postDestroy
} = require('../controllers/posts');

/* GET posts page /posts */
router.get('/', asyncErrHandler(postIndex));

/* GET posts new /posts/new */
router.get('/new', isLoggedIn, postNew);

/* POST posts create /posts/ */
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrHandler(postCreate));

/* GET posts show /posts/:id */
router.get('/:id', asyncErrHandler(postShow));

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrHandler(isAuthor), postEdit);

/* PUT posts update /posts/:id */
router.put('/:id', isLoggedIn, asyncErrHandler(isAuthor), upload.array('images', 4), asyncErrHandler(postUpdate));

/* DELETE posts destroy /posts/:id */
router.delete('/:id', isLoggedIn, asyncErrHandler(isAuthor), asyncErrHandler(postDestroy));

module.exports = router;