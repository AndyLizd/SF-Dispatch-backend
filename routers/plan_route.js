const express = require('express')
const fetch = require('node-fetch');

const { google_api_key } = require('../secret.json');
const cost_per_km = 2;

const router = express.Router();


// helper functions
function cal_cost(distance) {
    return distance*cost_per_km;
}

function cal_drone_distance(start_coord, end_coord) {
    const lat1 = start_coord.lat;
    const lon1 = start_coord.lng;
    const lat2 = end_coord.lat;
    const lon2 = end_coord.lng;
    const unit =  'K'; // 'M' for mile, 'K' for km

    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }    
}

router.get('/getOptions', (req, res) => {    
    const shipFrom = req.query.from; 
    const shipTo = req.query.to; 
 
    const query = `https://maps.googleapis.com/maps/api/directions/json?origin=${shipFrom}&destination=${shipTo}&key=${google_api_key}`;
    
    fetch(query)
    .then(res => res.json())
    .then(res => {
        let coords = [];
        for (leg of res.routes[0].legs) {
            for (step of leg.steps) {
                coords.push(step.start_location);
            }
        }
        let cart = {coords: coords, cost: cal_cost(res.routes[0].legs[0].distance.value/1000)};
        let drone = {
                        coords: [coords[0], coords[coords.length-1]], 
                        cost: cal_cost(cal_drone_distance(res.routes[0].legs[0].start_location, 
                                                        res.routes[0].legs[0].end_location))
                    };
        return {cart: cart, drone: drone};
    })
    .then(options => res.send(options))
    .catch(console.error);
})

module.exports = router;