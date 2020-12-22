const express = require('express');
const auth = require('../middleware/auth');
const {User} = require('../models/user');
const {Visitor_Order} = require('../models/orders');
const router = express.Router();

// require token header
router.post('/as-user', auth, async (req, res) => {
	const user = await User.findOne({_id: req.user._id});

	if (!user) {
		res.send('Invalid token. Cannot find user indicated.');
		return;
	}

	user.orders.push(req.body);
	try {
		await user.save();
	} catch(err) {
		res.send(err);
	} 
	
	res.send(user);
})

// does not require token header
router.post('/as-visitor', async (req, res) => {
	const order = new Visitor_Order(req.body);

	try {
		await order.save();
		res.send(order);
	} catch(err) {
		console.log(err);
		res.status(400).send('Cannot write to database');
	}
})


module.exports = router;