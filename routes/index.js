const express = require('express');
const router = express.Router();
const { 
	landingPage,
	getRegister, 
	postRegister,
	getLogin, 
	postLogin, 
	getLogout } = require('../controllers');
const { asyncErrHandler } = require('../middlewares');

/* GET home/landing page. */
router.get('/', asyncErrHandler(landingPage));

// USER ROUTES
/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', asyncErrHandler(postRegister));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', asyncErrHandler(postLogin));

// GET /logout
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', (req, res, next)=> {
  res.send('GET /profile');
});

/* PUT /profile */
router.put('/profile/:user_id', (req, res, next)=> {
  res.send('PUT /profile/:user_id');
});

/* GET /forgot */
router.get('/forgot', (req, res, next)=> {
  res.send('GET /forgot');
});

/* PUT /forgot */
router.put('/forgot', (req, res, next)=> {
  res.send('PUT /forgot');
});

/* GET /reset/:token */
router.get('reset/:token', (req, res, next)=> {
  res.send('GET /reset/:token');
});

/* PUT /reset/:token */
router.put('reset/:token', (req, res, next)=> {
  res.send('PUT /reset/:token');
});

module.exports = router;
