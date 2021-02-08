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
// Speichert im MongoDB mit der save Methode, mit async await. 

exports.recordsPostController = async (req, res, next) => {
	try {
		const aufnahme = new Record(req.body)
		await aufnahme.save()
		// Hier ersetze ich die Speicherung in lowdb mit MongoDB
		// wir verwenden mongoose
		res.status(200).send(aufnahme);
	} catch (fehler) {
		next(fehler)
	}
}

exports.recordsGetOneController = (req, res, next) => {
	// das Segment nach /records/ ist meine ID zum ändern
	// z.b: localhost:3001/records/1235 => req.params.id = 1235
	const { id } = req.params;
	const record = db
		.get('records')
		.find({ id });
	res
		.status(200)
		.send(record);

	//res.send('gebe nur das eine Album zurück mit ID:' + id);
}

exports.recordsPutController = (req, res, next) => {
	// das Segment nach /records/ ist meine ID zum ändern
	// z.b: localhost:3001/records/1235 => req.params.id = 1235
	const { id } = req.params;

	const geänderteWerte = req.body;
	const Aufnahme = db
		.get('records')
		.find({ id })
		.assign(geänderteWerte)
		.write();
	res.status(200).send(Aufnahme);

	//res.send('ich ändere das Album mit ID:' + id);

}

exports.recordsDeleteController = (req, res, next) => {

	const { id } = req.params;
	const record = db
		.get('records')
		.remove({ id })
		.write();
	res.status(200).send(record);
	//res.send('ich lösche die Aufnahme mit ID:' + id);
}
