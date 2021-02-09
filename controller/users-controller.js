// Mongoose Modell zum Erstellen, Lesen, Aktualisieren, Löschen
const User = require("../models/usermodel")

// für GET /user 
exports.alleNutzer = (req, res, next) => {

	User.find().then( (ergebnis) => {
		res.status(200).send(ergebnis)
	} ).catch(
		(fehler) => {
			res.status(500).send(fehler);
		}
	);
}

// für POST /user
exports.erstelleNutzer = (req, res, next) => {
	const nutzer = req.body;

	User.create(nutzer).then(
		(ergebnis) => {
			res.status(201).send(ergebnis);
		}
	).catch( 
		(fehler) => {
			res.status(500).send(fehler);
		}
	)

}

// für GET /user/:nutzerID
exports.einNutzer = (req, res, next) => {
	const { _id } = req.params;

	User.findOne({ _id }).then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch(
		(fehler) => {
			res.status(500).send({ message: "Fehler bei GET:/_id", objekt: fehler});
		}
	)
}

// für PUT /user/:nutzerID
exports.aktualisiereNutzer = (req, res, next) => {
	const { _id } = req.params;
	const nutzerDaten = req.body;

	// Option upsert: true, erstellt ein Dokument, wenn keins gefunden wird.
	User.findOneAndUpdate({_id}, nutzerDaten, {new: true, upsert: true}).then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch(
		(fehler) => {
			res.status(500).send({ message: "Fehler bei PUT /users/_id ", objekt: fehler})
		}
	)

}

// für DELETE /user/:nutzerID
exports.löscheNutzer = (req, res, next) => {
	const { _id } = req.params;

	User.deleteOne( { _id }).then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch(
		(fehler) => {
			res.status(500).send({ message: "Fehler bei DELETE /users/_id", objekt: fehler})
		}
	)
}
