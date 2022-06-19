const userControlleur = require("../controlleur/user.js")
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/creatUser', userControlleur.creatUser)
router.post('/connexionUser', userControlleur.connexionUser)
router.post('/verifCodeSms', userControlleur.verifCodeSms)

module.exports = router;
