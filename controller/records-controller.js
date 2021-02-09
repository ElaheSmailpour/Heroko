// Vereinheitlicht Datenbank
const db = require('../db');
// importiere das Model für records: 
const Record = require('../models/recordmodel')

exports.recordsGetAllController = (req, res, next) => {
	//res.send('ich zeige alle Produkte des Ladens als Array');
	const aufnahmen = db
		.get('records')
		.value()
	res.status(200).send(aufnahmen);
}

exports.recordsGetOneController = (req, res, next) => {
	const { id } = req.params;
	const record = db
		.get('records')
		.find({ id });
	res
		.status(200)
		.send(record);
}

// arbeitet schon mit Mongoose:
exports.recordsPostController = async (req, res, next) => {
	try {
		const aufnahme = await Record.create(req.body)
		res.status(200).send(aufnahme);
	} catch (fehler) {
		next(fehler)
	}
}

exports.recordsPutController = (req, res, next) => {
	const { id } = req.params;

	const geänderteWerte = req.body;
	const Aufnahme = db
		.get('records')
		.find({ id })
		.assign(geänderteWerte)
		.write();
	res.status(200).send(Aufnahme);
}

exports.recordsDeleteController = (req, res, next) => {

	const { id } = req.params;
	const record = db
		.get('records')
		.remove({ id })
		.write();
	res.status(200).send(record);
}
