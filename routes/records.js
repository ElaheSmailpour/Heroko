/* Router für meine Musikaufnahmen. Basis Pfad /records/ (aus App.js) */
const express = require('express');
const router = express.Router();
 
// wir importieren die Check Funktion von express validator:
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
	// trim methode zu Bereinigung
	// escape wandelt html Zeichen um: entfernt.
	check('band','Band muss angegeben werden').not().isEmpty().blacklist('\$\{\}\<\>\&').trim(),
	// titel: soll zeichenkette sein
	check('titel', 'Titel muss angegeben werden').not().isEmpty().trim(),
	// jahr: soll Nummer/Zahl sein
	check('jahr', 'Jahr muss da sein').trim().isNumeric(),
	check('bild', 'Bild muss da sein').isURL().trim()
]

router
	.route('/')
	.get(recordsGetAllController)
	.post(valideDatenRecord,recordsPostController)
	// Antons Vorschlag bei PUT und DELETE ohne ID einen anderen Fehler als 404 zu geben.
	.put((res, req,next) => {
		res.status(422).send("PUT braucht eine ID im URL-Segment")
	})
	.delete((res, req, next) => {
		res.status(422).send("DELETE braucht eine ID im URL-Segment")
	})

router
	// Hier definieren wir ein Stück Route mit Parameter.
	// das nächste URL Segment nach /router/ wird in einen Parameter namens id eingelesen
	.route('/:id')
	.get(recordsGetOneController)
	.put(recordsPutController)
	.delete(recordsDeleteController);

module.exports = router;
