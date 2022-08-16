const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const validate = require('../middlewares/validator');



// const validate = (validations) => {
//     return async (req, res, next) => {
//         await Promise.all(validations.map((validation) => validation.run(req)))

//         const errors = validationResult(req)
//         if (errors.isEmpty()) {
//             return next()
//         }

//         res.status(422).json({ errors: errors.array() })
//     }
// }

router.post('/user/create', validate(userCtrl.validate('createNewUser')), userCtrl.createUser)

module.exports = router