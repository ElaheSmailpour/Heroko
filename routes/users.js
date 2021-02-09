const express = require('express');
const router = express.Router();

const {
  alleNutzer, erstelleNutzer, einNutzer, aktualisiereNutzer, löscheNutzer 
} = require('../controller/users-controller');

router
    .route('/')
        .get(alleNutzer)
        .post(erstelleNutzer)
        .put((req,res,next) => {
          res.status(422).send("bitte PUT auf /users/ nur mit _id");
        })
        .delete((req,res,next) => {
          res.status(422).send("bitte DELETE auf /users/ nur mit _id");
        })

router
    .route('/:_id')
        .get(einNutzer)
        .put(aktualisiereNutzer)
        .delete(löscheNutzer);

module.exports = router;
