// Importiere Order-Modell
const Order = require('../models/ordermodel');

exports.alleOrders = (req, res, next) => {
	//res.send('ich zeige alle Bestellungen des Ladens als Array');
	Order.find().then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch( (fehler) => {
		res.status(500).send("Fehler bei Order.find(): "+fehler);
	});
}

exports.erstelleOrder = (req, res, next) => {
	//res.send("Eine neue Bestellung speichern.")
	const bestellung = req.body;

	Order.create(bestellung).then(
		(ergebnis) => {
			res.status(201).send(ergebnis);
		}
	).catch( (fehler) => {
		res.status(500).send("Fehler bei Order.create(): "+fehler);
	});
}

exports.eineOrder = (req, res, next) => {
	// id aus dem URL-Segment über destrukturierung rausholen.
	const { id } = req.params;

	Order.find({_id: id}).then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch( (fehler) => {
		res.status(500).send(`Fehler bei Order.find(_id: ${id}): `+fehler);
	});
}

exports.aktualisiereOrder = (req, res, next) => {
	// das Segment nach /orders/ ist meine ID zum ändern
	// z.b: localhost:3001/orders/1235 => req.params.id = 1235

	// id aus dem URL-Segment über destrukturierung rausholen.
	const { id } = req.params;
	const neueWerte = req.body;

	Order.findOneAndUpdate({_id: id}, neueWerte).then(
		(ergebnis) => {
			res.status(200).send(ergebnis);
		}
	).catch( (fehler) => {
		res.status(500).send(`Fehler bei Order.findOneAndUpdate(_id: ${id}`+fehler);
	});

}

exports.löscheOrder = (req, res, next) => {
	const { id } = req.params;
	//res.send('ich lösche die Bestellung mit ID:' + id);

	Order.deleteOne({_id : id}).then( (ergebnis) => {
		res.status(200).send(ergebnis);
	}).catch( (fehler) => {
		res.status(500).send(`Fehler bei Order.deleteOne(_id: ${id}`+fehler);
	})
}