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

function prepare_options(ship_from, ship_to, google_routes) {
	const ship_from_coord = google_routes.routes[0].legs[0].start_location;
	const ship_to_coord = google_routes.routes[0].legs[0].end_location;

	let coords = [];
		for (leg of google_routes.routes[0].legs) {
			for (step of leg.steps) {
				coords.push(step.start_location);
			}
		}
		let cart = {coords: coords, cost: cal_cost(google_routes.routes[0].legs[0].distance.value/1000)};
		let drone = {
							coords: [coords[0], coords[coords.length-1]], 
							cost: cal_cost(cal_drone_distance(google_routes.routes[0].legs[0].start_location, 
											google_routes.routes[0].legs[0].end_location))
		};
	const options = {cart: cart, drone: drone};
	return	{
			ship_from: {address:ship_from, lat: ship_from_coord.lat, lng: ship_from_coord.lng}, 
			ship_to: {address:ship_to, lat: ship_to_coord.lat, lng: ship_to_coord.lng},
			options: options,
		}
}

router.get('/get-options', async (req, res) => {    
	const ship_from = req.query.from; 
	const ship_to = req.query.to; 

	const query = `https://maps.googleapis.com/maps/api/directions/json?origin=${ship_from}&destination=${ship_to}&key=${google_api_key}`;

	let google_routes = await fetch(query).catch(err => res.send('Fail to fetch routes from the map'));
	google_routes = await google_routes.json();
		
	res.send(prepare_options(ship_from, ship_to, google_routes));
})

module.exports = router;