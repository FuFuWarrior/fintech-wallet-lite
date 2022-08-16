const router = require('express').Router();
const transferCtrl = require('../controllers/transferCtrl');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validator');

router.post( '/account/transfer', auth.verifyUser, validate(transferCtrl.validate('transferFund')),transferCtrl.transfer);

module.exports = router;