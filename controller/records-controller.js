// importiere das Model für records: 
const Record = require('../models/recordmodel')
const createError = require('http-errors')


exports.recordsGetAllController = async (req, res, next) => {
	try {
		let aufnahmen = await Record.find()
		res.status(200).send(aufnahmen)
	} catch (error) {
		next(error)
	}
}

exports.recordsGetOneController = async (req, res, next) => {
	try {
		const { id } = req.params;
		let aufnahme = await Record.find({ _id: id })
		// kommt keine eine aufnahme zurück?
		if (aufnahme.length < 1) throw new Error()
		res.status(200).send(aufnahme)
	} catch (error) {
		console.log(error);
		let fehler = createError(404, `Die Aufnahme mit dem ID ${req.params.id} gibt es nicht`)
		next(fehler)
	}
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

exports.recordsPutController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const geänderteWerte = req.body;
		let antwort = await Record.updateOne({ _id: id }, { ...geänderteWerte })
		res.status(200).send(antwort)
	} catch (error) {
		console.log(error);
		let fehler = createError(404, `Konnte die Aufnahme mit dem ID ${req.params.id}  nicht updaten`)
		next(fehler)
	}
}

exports.recordsDeleteController = async (req, res, next) => {
	try {
		const { id } = req.params;
		let antwort = await Record.deleteOne({ _id: id })
		if (antwort.deletedCount > 0) {
			res.status(200).send('erfolgreich gelöscht')
		} else {
			res.send('Es gab keinen Eintrag zum Löschen!')
		}
	} catch (error) {
		let fehler = createError(404, `Konnte die Aufnahme mit dem ID ${req.params.id}  nicht löschen`)
		next(fehler)
	}
}
