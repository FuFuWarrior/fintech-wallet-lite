const router = require('express').Router();
const auth = require('../middlewares/auth');
const withdrawCtrl = require('../controllers/withdrawCtrl');
const validate = require('../middlewares/validator');

router.post('/account/withdraw',auth.verifyUser, validate(withdrawCtrl.validate('withdrawFund')),withdrawCtrl.withdraw);

module.exports = router;