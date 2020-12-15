const express = require('express');
const planRoute = require('./routers/plan_route');

const app = express();

app.use('/api', planRoute);

const PORT = process.env.PROT || 3000;
app.listen(PORT, () => console.log(`connect to port ${PORT}`));



