const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { 
	landingPage,
	getRegister, 
	postRegister,
	getVerify,
	getLogin, 
	postLogin, 
	getLogout,
	getProfile,
	updateProfile,
	getForgotPw,
	putForgotPw,
	getReset,
	putReset
} = require('../controllers');
const {
	asyncErrHandler, 
	isLoggedIn,
	isValidPassword,
	changePassword,
	isVerified
} = require('../middlewares');

/* GET home/landing page. */
router.get('/', asyncErrHandler(landingPage));

// USER ROUTES

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', upload.single('image'), asyncErrHandler(postRegister));

// GET /email-verify
router.get('/verify-email', asyncErrHandler(getVerify));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', isVerified, asyncErrHandler(postLogin));

// GET /logout
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrHandler(getProfile));

/* PUT /profile */
router.put('/profile',
	isLoggedIn,
	upload.single('image'),
	asyncErrHandler(isValidPassword),
	asyncErrHandler(changePassword),
	asyncErrHandler(updateProfile)
);

/* GET /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT /forgot */
router.put('/forgot-password', asyncErrHandler(putForgotPw));

/* GET /reset/:token */
router.get('/reset/:token', asyncErrHandler(getReset));

/* PUT /reset/:token */
router.put('/reset/:token', asyncErrHandler(putReset));

module.exports = router;
