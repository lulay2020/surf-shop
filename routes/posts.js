const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const { asyncErrHandler } = require('../middlewares');
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
router.get('/new', postNew);

/* POST posts create /posts/ */
router.post('/', upload.array('images', 4), asyncErrHandler(postCreate));

/* GET posts show /posts/:id */
router.get('/:id', asyncErrHandler(postShow));

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', asyncErrHandler(postEdit));

/* PUT posts update /posts/:id */
router.put('/:id', upload.array('images', 4), asyncErrHandler(postUpdate));

/* DELETE posts destroy /posts/:id */
router.delete('/:id', asyncErrHandler(postDestroy));

module.exports = router;