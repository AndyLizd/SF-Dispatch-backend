const express = require('express');
const mongoose = require('mongoose');
const get_options = require('./routers/plan_route');
const place_order = require('./routers/place_order');
const handle_user = require('./routers/user');
const { DB_pwd } = require('./secret.json');

const PORT = process.env.PROT || 3000;
const mongoDB_url = process.env.DB_URL || `mongodb+srv://andy_dev:${DB_pwd}@sfd-project.lxvmz.mongodb.net/SFD_DB?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());

mongoose.connect(mongoDB_url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => app.listen(PORT, () => console.log(`connect to port ${PORT}`)))
.catch(err => console.log(err));


app.use('/api', get_options);

app.use('/place_order', place_order);

app.use('/user', handle_user);



