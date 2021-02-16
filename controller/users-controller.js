const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// Mongoose Modell zum Erstellen, Lesen, Aktualisieren, Löschen
const User = require("../models/usermodel")


// für GET /user 
exports.alleNutzer = (req, res, next) => {

	User.find().then((ergebnis) => {
		res.status(200).send(ergebnis)
	}).catch(
		(fehler) => {
			res.status(500).send(fehler);
		}
	);
}

// für POST /user
exports.erstelleNutzer = (req, res, next) => {
	const nutzer = req.body;
	// validierung druchführen: 
	const errors = validationResult(req)
	// wenn fehler, dann schicke eine Fehlermeldung zurück: 
	if (!errors.isEmpty()) {
		// schicken wir eine fehlermeldung:
		return res.status(422).json({
			fehlerBeiValidierung: errors.array()
		})
	}

	// bevor wir speichern, muss das passwort verschlüsselt werden!!!
	// die Hash methode nimmt 2 parameter: dass passwort und anzahl von Prisen Salz!
	bcrypt.hash(nutzer.passwort, 10)
		.then(passwortGehashed => {
			User.create({ ...nutzer, passwort: passwortGehashed })
				.then(
					(ergebnis) => {
						res.status(201).send(ergebnis);
					}
				).catch(
					(fehler) => {
						res.status(500).send(fehler);
					}
				)
		}).catch(fehler => res.status(500).send('Da lief was schief!'))
}


// für POST /user
exports.erstelleNutzerAsync = async (req, res, next) => {
	try {
		const nutzer = req.body;
		// validierung druchführen: 
		const errors = validationResult(req)
		// wenn fehler, dann schicke eine Fehlermeldung zurück: 
		if (!errors.isEmpty()) {
			// schicken wir eine fehlermeldung:
			return res.status(422).json({
				fehlerBeiValidierung: errors.array()
			})
		}
		// Wir wolle nur ein mal die selbe email-adresse speichern können: 
		let schonVorhandenUser = await User.find({ email: nutzer.email })
		if (schonVorhandenUser.length >= 1) {
			return res.status(409).send('Es gib schon einen Nutzer mit dieser Email')
		}

		let passwortGehashed = await bcrypt.hash(nutzer.passwort, 10)
		let erstelleNutzer = await User.create({ ...nutzer, passwort: passwortGehashed })
		res.status(201).send(erstelleNutzer);

	} catch (fehler) {
		res.status(500).send('Da lief was schief!')
	}
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
			res.status(500).send({ message: "Fehler bei GET:/_id", objekt: fehler });
		}
	)
}

// für PUT /user/:nutzerID
exports.aktualisiereNutzer = async (req, res, next) => {

	try {
		const { _id } = req.params;
		const nutzerDaten = req.body;
		const errors = validationResult(req)
		// wenn fehler, dann schicke eine Fehlermeldung zurück: 
		if (!errors.isEmpty()) {
			// schicken wir eine fehlermeldung:
			return res.status(422).json({
				fehlerBeiValidierung: errors.array()
			})
		}
		// kommt mit dem Update ein passwort mit? 
		if (nutzerDaten.passwort) {
			// Ja: 
			let hashPasswort = await bcrypt.hash(nutzerDaten.passwort, 10)
			let nutzerNeu = await User.findOneAndUpdate({ _id }, { ...nutzerDaten, passwort: hashPasswort })
			return res.status(200).send(nutzerNeu)
		} else {
			// Nein:
			let nutzerNeu = await User.findOneAndUpdate({ _id }, nutzerDaten)
			return res.status(200).send(nutzerNeu)
		}

	} catch (fehler) {
		res.status(500).send({ message: "Fehler bei PUT /users/_id ", objekt: fehler })
	}

}

// für DELETE /user/:nutzerID
exports.löscheNutzer = (req, res, next) => {
	const { _id } = req.params;

	User.deleteOne({ _id }).then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch(
		(fehler) => {
			res.status(500).send({ message: "Fehler bei DELETE /users/_id", objekt: fehler })
		}
	)
}

// funktion zum Loggin:

exports.nutzerEinloggen = async (req, res, next) => {
	let nutzer = req.body
	try {
		// gibt es den Nutzer? Wir suchen nach email
		let userVonDatenbank = await User.findOne({ email: nutzer.email })
		console.log(userVonDatenbank);
		// wenn es kein Nutzer gibt: 
		if (userVonDatenbank === null) {
			return res.status(401).send('Du konntest nicht eingeloggt werden')
		}
		// wenn es den Nutzer gibt, dann vergleiche die Passwörter
		let vergleichVonPasswort = await bcrypt.compare(nutzer.passwort, userVonDatenbank.passwort)
		// wenn passwort korrekt ist:
		if (vergleichVonPasswort) {
// damit wir den Nutzer wiedererkennen, schicken wir eine Token zurück:
// 3 parameter: objekt mit infos über den Nutzer, ein gehemniss, wie lange soll es gültig sein
			let token = jwt.sign({
				email: userVonDatenbank.email,
				userId: userVonDatenbank._id,
			}, 'ein Geheimniss', {expiresIn: '3h'})
			res.status(200).json({
				nachricht: 'Du bist eingeloggt',
				token: token
			})
		} else {
			res.status(401).send('Du konntest nicht eingeloggt werden')
		}
	} catch (error) {
		res.status(401).send('Du konntest nicht eingeloggt werden')
	}
}

