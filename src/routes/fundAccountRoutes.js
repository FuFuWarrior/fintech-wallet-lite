const router = require('express').Router();
const fundAccountCtrl = require('../controllers/fundAccountCtrl');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validator');

router.post('/account/fund', auth.verifyUser, validate(fundAccountCtrl.validate('fundAccount')), fundAccountCtrl.fundAccountWithCard);

module.exports = router;