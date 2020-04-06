'use strict'

const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');

const controller = require('../app/controllers/devController');
const validations = require('../validators/devValidator');

router.post('/create', celebrate(validations.create), controller.create);
router.post('/confirm', celebrate(validations.confirm), controller.confirm);
router.post('/sendemail', celebrate(validations.sendEmail), controller.sendEmail);
router.get('/index', celebrate(validations.index), controller.index);
router.delete('/delete', celebrate(validations.delete), controller.delete);
router.post('/forgotpassword', celebrate(validations.sendEmail), controller.forgotPassword);
router.get('/validpasswordtoken', celebrate(validations.validPasswordToken), controller.validPasswordToken);
router.post('/updatepassword', celebrate(validations.updatepassword), controller.updatepassword);
router.post('/updateuser', celebrate(validations.updateuser), controller.updateuser);

module.exports = router;
