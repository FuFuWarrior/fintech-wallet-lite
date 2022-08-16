const jwt  = require('jsonwebtoken');
require('dotenv').config()


exports.verifyUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; //! if the token has a Bearer as the prefix than use .split(' ')[1];
    if (!token || token === undefined) {
      return res.status(401).json({
        status: 'error',
        error: 'No token provided.'
      });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({ status: 'error', error: `Failed to authenticate token.${err}` });
      }
      req.user_id = decode.user_id;
      req.account_id = decode.account_id;
      req.email = decode.email;
      next();
    });
 
}