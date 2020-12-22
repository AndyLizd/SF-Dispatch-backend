const express = require('express');
const mongoose = require('mongoose');
const get_options = require('./routers/plan_route');
const handle_user = require('./routers/user');
const place_order = require('./routers/place_order');
const { DB_pwd } = require('./secret.json');

const PORT = process.env.PROT || 3000;
const mongoDB_url = process.env.DB_URL || `mongodb+srv://andy_dev:${DB_pwd}@sfd-project.lxvmz.mongodb.net/SFD_DB?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());

mongoose.connect(mongoDB_url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => app.listen(PORT, () => console.log(`connect to port ${PORT}`)))
.catch(err => console.log(err));


app.use('/api', get_options);

app.use('/user', handle_user);

app.use('/place-order', place_order);
 