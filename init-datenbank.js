// Das ist der Zufallsgenerator für Namen, Passwörter und Mailadressen
const faker = require("faker");
// Das ist das Paket für die Verbindung mit MongoDB
const mongoose = require("mongoose");
// Hier holen wir das vorbereitete Modell für Nutzer.
const User = require("./models/usermodel.js");

console.log("Datenbank wird mit Demodaten befüllt");

const uri = process.env.mongo || 'mongodb://localhost:27017/record-shop';

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Verbindungsfehler:'));
db.once('open', () => {
	// Verbunden
	console.log("Mit MongoDB verbunden");

	// deleteMany nimmt ein Kriterienobjekt, ist es leer, werden alle gelöscht
	// die Methode gibt ein Promise zurück.
	console.log("Versuche bisherige Nutzer löschen");
	User.deleteMany({})
		.then((ergebnis) => { console.log("Nutzer sind gelöscht", ergebnis); })
		.catch((fehler) => { console.error("beim Löschen ging was schief:", fehler); });

	const zufallsNutzer = [];

	for (index = 0; index < 10; index++) {
		// Ich erstelle aus meinem Mongo-Schema ein Nutzerobjekt
		const neuerNutzer = {
			// Alle Werte, werden mit Hilfe vom Paket faker zufällig ausgewürfelt
			vorname: faker.name.firstName(),
			nachname: faker.name.lastName(),
			email: faker.internet.email(),
			passwort: faker.internet.password()
		};
		zufallsNutzer.push(neuerNutzer);
	}

	// die insertOne-Methode unseres Schemas gibt ein Promise zurück.
	// Ich sammle diese Promises mit einem Map, damit ich sie dann
	// über Promise.all() zusammenführen kann, um auf das Ende aller Speichervorgänge zu warten

	const speicherPromises = zufallsNutzer.map((einZufallsUser) => {
		return User.create(einZufallsUser)
	})

	// Mit Promise.all, erstelle ich einen Promise der auf Erfolg aller reingegebenen Promisses wartet.

	Promise.all(speicherPromises).then((ergebnis) => {
		console.log(ergebnis);
		console.log("Erfolgreich gespeichert", ergebnis.length);
		db.close();
		console.log("Datenbankverbindung getrennt");
	}).catch((fehler) => {
		console.error("Fehler in Speicher-Promises", fehler);
	});

});
