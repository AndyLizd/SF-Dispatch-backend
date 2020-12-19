const express = require('express');
const User = require('../models/user');

const router = express.Router();


router.post('/', (req, res) => {
    res.send(req);
})

// mongoose test
// const User = require('./models/user');
// const user_a = new User({
//     fname: 'Andy',
//     lname: 'Li',
//     orders: [{
//         ship_from: '1003 W Aaron Dr., State College, PA',
//         ship_to: 'Old Main, University Park, PA',
//         cost: 12.5,
//         delivery_type: 'drone',
//     }],
// });


// user_a.save()
// .then(result => console.log(result))
// .catch(err => consolge.log(err));

module.exports = router;