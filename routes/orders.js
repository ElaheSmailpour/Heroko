/* Router für meine Bestellungen. Basis Pfad /orders/ (aus App.js) */
const express = require('express');
const router = express.Router();

const {
	alleOrders,
	erstelleOrder,
	aktualisiereOrder,
	löscheOrder,
	eineOrder
} = require('../controller/orders-controller');

router
	.route('/')
	.get(alleOrders)
	.post(erstelleOrder)
	.put((res, req,next) => {
		res.status(422).send("PUT braucht eine ID im URL-Segment")
	})
	.delete((res, req, next) => {
		res.status(422).send("DELETE braucht eine ID im URL-Segment")
	})

router
	// Route mit Parameter.
	// das nächste URL Segment nach /orders/ wird in res.param.id verfügbar
	.route('/:id')
	.get(eineOrder)
	.put(aktualisiereOrder)
	.delete(löscheOrder);

module.exports = router;
