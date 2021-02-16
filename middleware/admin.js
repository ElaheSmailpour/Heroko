const jwt = require('jsonwebtoken')
const User = require("../models/usermodel")

module.exports = async (req, res, next) => {
  try{
    const token = req.headers.authorization.split( ' ')[1]
    const lesbaresToken = jwt.verify(token, process.env.JWT)
  // hole mit der  Id den Nutzer
    let user = await User.findOne({ _id: lesbaresToken.userId })
    console.log( 'admin', user);
    // prüfe, ob das Feld admin auf true steht. Wenn ja, darf der Nutzer weiter. Das Feld 'admin' muss noch zum Schema hinzugefügt werden, und du musst einen Admin Nutzer erstellen.
    if(user.admin) {
      next();
    } else {
      // wenn nicht, dann werfen wir einen Fehler
      throw new Error()
    }
  } catch (error) {
    return res.status(401).send("Nicht admin")
  }
}
