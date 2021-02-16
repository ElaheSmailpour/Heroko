## Die Liste der Schritte, die gegangen werden

Diese Datei enthält die Liste der Änderungen, die in jeder Phase gemacht werden müssen. 
Sie ist zeitlich umgekehrt sortiert, also stehen die letzten / neusten Änderungen oben in der Datei. 
So muss nicht immer bis ganz runter gescrollt werden.

## Aufgabe 08 - Sicherheit

Unser Server arbeitet ganz gut bisher, aber er ist alles andere als Sicher. Jeder kann Konten anderer Nutzer löschen mit deren IDs, passwörter sind lesbar so, dass sie einfach kompromittiert werden können und es gibt nirgendwo Sicherheit. 
Wir werden eine Authentifizierung einführen für jede Anfrage indem wir [JSON Web Tokens](https://de.wikipedia.org/wiki/JSON_Web_Token) verwenden. So dass jeder Nutzer nur seine eigenen Informationen ändern kann. Außerdem führen wir Rollen für unsere Nutzer ein. Wir werden eine Administrator Rolle haben und eine Nutzer-Rolle und deren Rechte festlegen.

Die Rechte sollen so aussehen:

**Nicht eingeloggte Kunde:** 
(Diese Pfade sind für alle Offen)
- Records
    - GET
- Records/id
    - GET
- Users: 
    - POST
- Users/login
    - POST

**Nur Eingeloggte Kunden Rolle**

- Users/id
    - nur bei eigener ID: 
  - GET/PUT/DELETE.

**Nur Administrator Rolle**

- Records
  - POST
- Records/id
    - PUT/DELETE
- Users: 
    - GET

**Schritte**

### Aufgabe 8-1: Verschlüssele dein Passwort! 

Speichere das Passwort nicht im Klartext, sondern als Hash (Streuwert) mit einem Salt währen der Nutzer erstellt wird.

Dazu werden wir das Paket [`bcrypt`](https://www.npmjs.com/package/bcrypt) benutzen. Die muss zuerst installiert werden `npm install bcrypt`. 
Bevor wir einen neuen Nutzer speichern, müssen wir das Passwort verschlüsseln. 
Auch bei einem Update müssen wir sicherstellen, dass das Passwort nicht im Klartext gespeichert wird. 

## Aufgabe 07 - Beziehungen (relations)

MongoDB ist eine NoSQL Datenbank, heißt sie ist nicht relational (auf Relationen/Beziehungen basiert), neben anderen Dingen. Um eine Art von Beziehungen zwischen Dokumenten herzustellen, werden Referenzen entlang von IDs benutzt, oder Dokumente direkt in andere eingebettet. In dieser Aufgabe erweitern wir unsere Datenmodelle um Beziehungen zwischen ihnen herzustellen. Wir können sehen, dass eine Bestellung eine Referenz auf Aufnahmen hat, aber wenn wir eine Bestellung aus der Datenbank laden sehen wir bisher nur die ID der Aufnahme, aber nicht die Daten der Aufnahme (Band, Titel, Jahr) selbst. 

Wir schauen uns die Beziehung "1 zu vielen" zwischen unseren Modellen (ein Album kann in vielen Bestellungen enthalten sein) an und die 1-zu-1-Beziehung zwischen Nutzern und ihren Adressen.

**Hintergrund** Unser Kunde, der Musikladen, will zu jedem Nutzer eine Adresse in einem bestimmten Format speichern. Und er möchte die Daten von Aufnahmen bei Abruf von Bestellungen sehen, um den Einkaufskorb sinnvoll anzuzeigen.

**Schritte:**

1. Erstelle ein neues Schema für ein Modell der Adresse, es soll Straße und Stadt enthalten.
2. Verbinde das Adressmodell mit dem Nutzermodell über eine 1-zu-1 Beziehung.
3. Aktualisiere die Controller so, dass beim erstellen/löschen/ändern/abfragen von Nutzern auch eine Adresse erstellt/gelöscht/geändert/abgefragt wird.
4. Benutze Referenzen, um Aufnahmen und Bestellungen in eine 1-zu-viele Beziehung zu setzen.


## Task 06 - Validierung und Sanitization ("Bereinigung/Harmonisieren")

In dieser Aufgabe kümmern wir uns um zwei Aspekte der Datenpflege.
Zunächst um die Validierung von Daten. Mit der stellen wir z.B. sicher, dass es sich bei Eingaben für bestimmte Felder auch um gültige Eingaben für den erwarteten Typ handelt. So wäre z.B. "http://dingdong.de" keine gültige E-mailadresse und "vier" oder 300.00,00.99 keine gültige Zahl.
Wir werden hierfür das NPM Paket `express-validator` verwenden um unsere Daten zu prüfen, bevor wir etwas in die Datenbank schreiben.
Wenn etwas nicht gültig ist, geben wir den Nutzern unserer API sinnvolle Fehlermeldungen.

Die sog. Sanitization, die man wortwörtlich als Desinfektion oder Bereinigung übersetzbar ist, hingegen sorgt dafür dass Werte immer in einer gewünschten Form verwendet werden, auch wenn Alternativen möglich sind. z.B. das entfernen von Leerzeichen vor oder nach Nutzernamen, das grundsätzliche speichern von E-Mails und Internetadressen in kleinbuchstaben und derartige Dinge. Auch dafür hat das Paket `express-validator` Funktionen.

**Die Schritte**

1. Installe das Paket `express-validator` mit npm.
2. Validiere die Daten für das Nutzer-Schema
3. Wenn die Daten gültig sind säubere Sie auch (insbesondere das Email-Feld für den Nutzer)


## Aufgabe 05 - mit Mongoose in die Controller

In dieser Aufgabe werde nwir die Controller so umschreiben, dass sie über Mongoose mit MongoDB arbeiten. LowDB werden wir dabei los und entfernen es komplett aus unserem Server. Wir schauen uns an, wie die Datenbankverbindung aufgebaut wird und wie Daten mit Hilfe der Modell-Schemas geladen und gespeichert werden können. 
Wir schauen uns auch MongoDB Compass an, um unsere Daten in einem grafischen Clienten anzusehen.

**Die Schritte**:
0. Bau die Datenbankverbindung zentral in deiner Express App ein. Protokolliere den Verbindungsaufbau oder eventuelle Fehler.

1. Aktualisiere deine Controller so, dass sie die passenden Methoden von Mongoose-Modellen verwenden, um Daten zu verändern.
2. Teste ob alle API Endpunkte für `records` richtig funktionieren.
3. Wiederhole das für die Controller für `users` und `orders`

**Tipps:**

Importiere dein Mongoosemodell.
Rufe am Modell die passenden Methoden auf (z.B. create(), find(), findOneAndUpdate(), deleteOne() oder andere )
Du kannst sowohl die Callbackschreibweisen als auch die Promises verwenden. Wenn du magst nutze asynch/await um die Promiseschreibweise übersichtlich zu gestalten.


## Aufgabe 04 - Mongoose und Seeding

Unter Seeding versteht man dass anfängliche Füllen einer neu eingerichteten Datenbank. (engl. für Sähen)

In dieser Aufgabe führen wir Mongoosee ein. Mongoose ist eine Bibliothek für Objekt-Daten-Modellierung (ODM) für MongoDB und Node.js.
Es verwaltet die Beziehung zwischen Daten, stellt Schemen-Validierung bereit und wird benutzt, um Objekte im Code und deren Repräsentation in der Datenbank (MongoDB) zu übersetzen.

Wir installieren und konfigurieren Mongoose für unser Projent und verbinden es mit unserer App. Wir erstellen unsere Modelle und Schemas und definieren damit genau, wie eine Aufnahme, ein Nutzer und eine Bestellung (record / user / order ) aussehen werden.

Zusätzlich werden wir eine Funktion schreiben, die unsere Datenbank mit Startdaten füllt (Seeding oder auch Feeding genannt). So können wir später alle Endpunkte direkt nach Initalisierung unseres Servers testen.

**Die Schritte**:

1. Konfiguriere Mongoose für unseren Datenserver. Dazu installiere zunächst das Paket [mongoose](https://www.npmjs.com/package/mongoose)
2. Erstelle Datenschemen und Modelle für unsere Aufnahmen, Nutzer und Bestellungen (records / user / orders)
3. Schreib ein Pflanz/Futter-Script mit Hilfe des npm-Pakets [faker](https://www.npmjs.com/package/faker). Wenn die Datenbank leer ist (z.B. nach einem frischen Clonen, füll es mit ein paar Alben Nutzern und Bestellungen.

**Noch nicht**:
Du musst noch _nicht deine Controller umbauen_, um die Daten aus MongoDB statt lowdb zu laden und dorthin zu speichern, das kommt in erst Aufgabe 5.


## Aufgabe 03 - Routing und Fehlerbehandlung

In der ersten Aufgabe haben wir gesehen, dass es Anfragen wie `GET` und `POST` gibt, die bestimmen, was die Funktion des Endpunktes ist. (Abfragen, Erstellen in unserem Fall)
Jetzt wollen wir uns `PUT` und `DELETE` anschauen.

* `PUT` aktualisiert eine Ressource, die es schon gibt.
* `DELETE` löscht eine existierende Ressource.

Nachdem wir die obigen Anfragen für unseren Musikladen eingeführt haben, werden wir uns Fehlerbehandlung anschauen.
Was ist, wenn was schief geht, während eine Anfrage bearbeitet wird?
Wir wollen den User (bzw. das Programm, das unsere API benutzt) wissen lassen, was schief ging auf konsistente Art. Wir erreichen so eine Fehlerbehandlung, indem wir Middleware-Funktionen schreiben, die sich um Fehlerbehandlung kümmern.

**Hintergrund**:
Unser Kunde, der Musikladen, möchte gern Produkte aktualisieren und aus dem Angebot löschen können. Neben den Produkt-Datenmodell, möchte unser Kunde zwei weitere Datenmodelle bekommen. Eins für Nutzer (users) und eins für Bestellungen (orders)

**Die Schritte**:

1. Erstelle drei weitere Endpunkte (Routen) für das Produkt-Datenmodell (record)

   - `records/:id` -> eine `GET`-Anfrage, die ein Produkt anhand der übergebenen `id` liefert
   - `records/:id` -> eine `PUT`-Anfrage, die anhand einer `id` ein Produkt aktualisiert
   - `records/:id` -> eine `DELETE`-Anfrage, die das Produkt mit der `id` löscht

2. Erstelle neue Endpunkte für Nutzer (`users`) und Bestellungen (`orders`). 

    Ein Nutzer enthält eine ID, Vor-, Nachname, Email und Passwort. (first name, last name, email, password). 
    Eine Bestellung enthält eine Produkt-Id (id) und eine Anzahl (quantity).
    Später fügen wir den Modellen weitere Eigenschaften hinzu.

    Nutzer Modell (users)
    - `users` -> `GET` alle Nutzer ausgeben
    - `users/:id` -> `GET` ein bestimmter Nutzer ausgeben
    - `users` -> `POST` einen Nutzer erstellen
    - `users/:id` -> `PUT` einen Nutzer aktualisieren
    - `users/:id` -> `DELETE` einen Nutzer löschen

    Bestellungen Modell (orders)
    - `orders` -> `GET` alle Bestellungen ausgeben
    - `orders/:id` -> `GET` eine Bestellung ausgeben
    - `orders` -> `POST` eine Bestellung anlegen
    - `orders/:id` -> `PUT` eine Bestellung aktualisieren
    - `orders/:id` -> `DELETE` eine Bestellung löschen 

3. Wenn diese Endpunkte alle funktionieren und unsere Datenbank richtig aktualisieren, wird es Zeit eine Middleware-Funktion zu erstellen, die mit möglichen Fehlern umgeht.

- Sucht die passenden Fehler-Codes aus: https://de.wikipedia.org/wiki/HTTP-Statuscode#Liste_der_HTTP-Statuscodes

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

- Verwende das Paket http-errors um die Fehler eleganter zu schreiben: https://www.npmjs.com/package/http-errors

## Aufgabe 02 - Middleware und CORS

Middleware-Funktionen, sind Funktionen die Zugriff auf das Anfrageobjekt (request, kurz `req`), das Antwortobjekt (response, kurz `res`) und die folgende Middleware-Funktion (`next`) im Anfrage/Antwort-Zyklus erhalten. Dadurch können sie z.B. die ankommende Anfrage verarbeiten oder verändern, oder die erstellte Antwort (etwa deren Header) verändern.

Middleware-Funktionen, werden in der Reihenfolge abgearbeitet, in der sie mit app.use() hinzugefügt werden. Standard-Middlewares für Express sind z.B.
* Die Protokoll-Middleware [morgan](http://expressjs.com/en/resources/middleware/morgan.html)
* Der Request-Parser für JSON (`express.json()`)

Das sog. Cross-Origin Resource Sharing (CORS) (de: teilen von Ressourcen von verschiedenen Quellen/Herkunft) ist ein Mechanismus, der zusätzliche Angaben im HTTP header benutzt. Diese teilen dem Browser mit, dass er einer Anwendung, mit einer bestimmten Herkunft, den Zugriff auf Ressourcen einer anderen Herkunft zu verbieten.

Von einer `cross-origin` Anfrage wird gesprochen, wenn eine HTTP-Anfrage auf ein anderes Ziel schaut. (z.B. überall wo Ressourcen von anderen Seiten eingebunden werden, wie Social Plugins, Twitter-Beiträge, Facebook-Likes oder dergleichen). Also immer dann, wenn Domain (meineseite.de), Protokoll (http/https), oder Port (3000, 8080, ...) nicht identisch sind, mit der Seite die Anfrage startet.

**Die Schritte**:
1. Erstelle deine eigene Sicherheits-Middleware-Funktion. Die sich darum kümmert über HTTP-Header für die Response-Objekte, dem Browser zu sagen, dass du Cross-Origin Resource Sharing (CORS) erlaubst.
    * Erstelle dafür ein `/middleware/` Verzeichnis. 
    * Erzeuge darin eine Datei für deine Middleware.
    * Schreib eine Middleware-Funktion, der folgenden Form :
    ```javascript
    const meineMiddleware = (request, response, next) => {
        /* ... Response-Header für CORS-Aktivierung bauen*/ 
        next();
    }
    ```
    * Importiere deine Middleware-Funktion in deiner App
    * Sag deiner Express-App, dass sie die Middleware verwenden soll. (`app.use( ... )`)

## Aufgabe 01 - Aller Schein trügt, Scheindatenbanken und Controller

Das englische Nomen mock oder verb (to) mock, bedeutet sinngemäß "nur zum Schein", angeblich, vorgespielt.

Die meisten Anwendungen, die für das Internet gemacht sind, haben es irgendwann mit der Manipulation von Daten zu tun.
Um unsere Daten zu ändern, werden wir zunächst zwei Dinge tun.

* Wir definieren die sog. Endpunkte (engl. endpoints) unserer Anwendung, an die Nutzer ihre Anfragen schicken (GET, POST, DELETE, etc.) zu deutsch (abfragen, hinsenden, löschen, u.s.w.)
* Wir müssen festlegen wie unsere Daten aussehen sollen und natürlich auch, wo wir sie speichern können.

**Die Geschichte**: Unser Kunde ist Inhaber eines Musikgeschäfts, der seine Produkte auf der Hauptseite seiner Shop-Webseite anzeigen will.
Wir wissen, dass wir Titel, Interpret, Jahr und ein Coverbild, sowie den Preis unserer Produkte anzeigen wollen, die wir auf Lager haben.
Bisher hat der Kunde noch keine volle Liste seiner Produkte. Er möchte also auch neue Produkte zu seinem Angebot hinzufügen können.

**Die Schritte**:

1. Erstelle zwei Endpunkte (Routen) für den oder die Ladeninhaber_in.

- `api/records` -> eine `GET` Anfrage wird alle Produkte des Ladens zurückgeben
- `api/records` -> eine `POST` Anfrage, wird ein neues Produkt zum Angebot hinzufügen.

Zunächst kannst Du hier einfach Meldungen zurückgeben, die die Antwort beschreiben, nur um zu sehen ob alles geht.

2. Als Scheindatenbank für unser Angebot können wir `lowdb` (de: low=niedrig, db=datenbank) benutzen [lowdb auf npmjs.com](https://www.npmjs.com/package/lowdb). Die kann leer sein oder auch Fakedaten enthalten. Aktualisiere deine Routen aus 1. also so, dass sie nun Daten aus der lowdb-Datenbank lesen oder dort reinschreiben.
