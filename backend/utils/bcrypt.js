const bcrypt = require('bcrypt')

// Hash value
const hashValue = async (value, saltRounds)=>bcrypt.hash(value, saltRounds || 10)

// Compare Value
const compareValue = async (value, hashedValue)=>bcrypt.compare(value, hashedValue)




module.exports = {
    hashValue,
    compareValue
}