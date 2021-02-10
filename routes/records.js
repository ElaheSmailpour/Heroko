/* Router für meine Musikaufnahmen. Basis Pfad /records/ (aus App.js) */
const express = require('express');
const router = express.Router();
 
// wir importieren die Check Funktion von express vaildator:
const { check } = require('express-validator')

const {
	recordsGetAllController,
	recordsPostController,
	recordsPutController,
	recordsDeleteController,
	recordsGetOneController
} = require('../controller/records-controller');

// Wir werden auf der route post eine Validierung hinzufügen: 
// Wie sieht eine gültige Datensatz aus: 

let valideDatenRecord = [
	// band: soll zeichenkette sein
	check('band').not().isEmpty().withMessage('Band muss angegeben werden'),
	// titel: soll zeichenkette sein
	check('titel', 'Titel muss angegeben werden').not().isEmpty(),
	// jahr: soll Nummer/Zahl sein
	check('jahr', 'Jahr muss da sein').isNumeric(),
	check('bild', 'Bild muss da sein').isURL()
]

router
	.route('/')
	.get(recordsGetAllController)
	.post(valideDatenRecord,recordsPostController);

router
	// Hier definieren wir ein Stück Route mit Parameter.
	// das nächste URL Segment nach /router/ wird in einen Parameter namens id eingelesen
	.route('/:id')
	.get(recordsGetOneController)
	.put(recordsPutController)
	.delete(recordsDeleteController);

module.exports = router;
