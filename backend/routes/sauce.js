const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const sauceController = require("../controllers/sauces");
const likesCtrl = require("../controllers/likes");

router.post('/', auth, multer, sauceController.createSauce);

router.post('/:id/like', auth, multer, likesCtrl.likeDislikeSauce);

router.put('/:id', auth, multer, sauceController.modifySauce);

router.delete('/:id', auth, sauceController.deleteSauce);

router.get('/:id', auth, sauceController.getOneSauce);

router.get('/', auth, sauceController.getAllSauces);
module.exports = router;


