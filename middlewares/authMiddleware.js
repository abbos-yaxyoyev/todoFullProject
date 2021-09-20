const jwt = require('jsonwebtoken')
const config = require('config');

function checkUser(req, res, next) {
  const { authorization } = req.headers;

  if (authorization && authorization.split(" ")[0] === 'Bearer') {
    token = authorization.split(" ")[1];
    if (!token) {
      res.status(401).send({ message: 'Error token not found' });
    }
    let decoded = jwt.verify(token, config.get('SECRET_KEY'))
    req.user = decoded
    next();
  } else {
    res.status(401).send({ message: 'Unauthorization' })
  }
}

function checkToken(req, res, next) {
  const { authorization } = req.headers;
  // let headers = JSON.parse(authorization)
  if (authorization && authorization.split(" ")[0] === 'Bearer') {
    token = authorization.split(" ")[1];
    console.log('token: ', token);
    let decoded = jwt.verify(token, config.get('SECRET_KEY'));
    if (decoded) {
      return res.status(201).send({ message: true });
    }
    return res.status(401).send({ message: false })
  } else {
    return res.status(401).send({ message: false })
  }
}

module.exports = {
  checkUser,
  checkToken
}