const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();
const {token_private_key} = require('../secret.json');

const saltRounds = 10;

// sign up new user
router.post('/sign-up', async (req, res) => {
	
	const { error } = validate(req.body);
	
	if (error) res.send(error.details[0].message);
	
	let user = await User.findOne({email: req.body.email});
	if (user) res.send('Email account already registered.')

  try {
		req.body.password = await bcrypt.hash(req.body.password, saltRounds);
		user = new User(req.body)
		await user.save();
    res.send({user_email: user.email, status: 'success'});
  } catch (err) {
		console.log(err)
    res.status(400).send('Cannot write to database.');
  }
});


// log in user
router.post('/login', async (req, res) => {
	const user = await User.findOne({email: req.body.email});
	if (!user) res.status(400).send('Account does not exist.')
	
	const is_pwd_correct = await bcrypt.compare(req.body.password, user.password);

	if (!is_pwd_correct) {
		res.status(400).send('Access denied. Invalid password or account.')
	} else {
		const token = jwt.sign({_id: user._id}, token_private_key);
		res.send(token);
	}
});


router.post('/test', (req, res) => {
	res.send(req);
})


module.exports = router;