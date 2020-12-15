const express = require('express')
const router = express.Router();



router.get('/dispatchDeliveryBackend/Login/option', (req, res) => {
    
    const shipFrom = req.query.from; 
    const shipTo = req.query.to; 

    


    res.send({shipFrom: shipFrom, shipTo: shipTo});
})

module.exports = router;