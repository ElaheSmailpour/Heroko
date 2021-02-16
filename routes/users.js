const express = require('express');
const router = express.Router();
const { check }  = require('express-validator')

const auth = require('../middleware/auth')

const {
  alleNutzer, erstelleNutzerAsync, einNutzer, aktualisiereNutzer, löscheNutzer, nutzerEinloggen, 
} = require('../controller/users-controller');

const validUser = [
  check('vorname')
    .not()
    .isEmpty()
    .withMessage('Vorname muss angegeben werden.')
    .trim(),
  check('nachname')
    .not()
    .isEmpty()
    .withMessage('Nachname muss angegeben werden.')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('E-Mail-Format ist ungültig.')
    .trim()
    .normalizeEmail(),
  check('passwort')
    .not()
    .isEmpty()
    .isStrongPassword()
    .withMessage('Passwort muss angegeben werden.')
    .trim(),
    check('admin').optional().isBoolean()
];

// Wir haben hier noch eine Array für die Validierung von PUT auf User/id. Mit der Methode optional
const validUserUpdate = [
  check('vorname')
    .not()
    .isEmpty()
    .optional()
    .withMessage('Vorname muss angegeben werden.')
    .trim(),
  check('nachname')
    .not()
    .isEmpty()
    .optional()
    .withMessage('Nachname muss angegeben werden.')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('E-Mail-Format ist ungültig.')
    .optional()
    .trim()
    .normalizeEmail(),
  check('passwort')
    .not()
    .isEmpty()
    .optional()
    .isStrongPassword()
    .withMessage('Passwort muss angegeben werden.')
    .trim(),
    check('admin').optional().isBoolean()
];

router
    .route('/')
        .get(alleNutzer)
        .post(validUser, erstelleNutzerAsync)
        .put((req,res,next) => {
          res.status(422).send("bitte PUT auf /users/ nur mit _id");
        })
        .delete((req,res,next) => {
          res.status(422).send("bitte DELETE auf /users/ nur mit _id");
        })

router
    .route('/:_id')
        .get(einNutzer)
        // nur ein eingeloggter Nutzer soll seine eigenen Daten ändern können:
        .put(auth,validUserUpdate,aktualisiereNutzer)
         // nur ein eingeloggter Nutzer soll seine eigenen Daten ändern können:
        .delete(auth,löscheNutzer);
 // Pfad für Nutzer einloggen:       
router.route('/login').post(nutzerEinloggen)


module.exports = router;
