const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // Im header authorization: Bearer unserToken
    let token = req.headers.authorization.split(' ')[1]
    let tokenLesbar = jwt.verify(token, process.env.JWT || 'ein Geheimnis')
    // im req in den Cotroller funktionen haben wir auf dem token zugriff unter req.tokenNutzer
    req.tokenNutzer = tokenLesbar
    next()
  } catch (error) {
    return res.status(401).send('Konnte nicht einloggen!')
  }
}