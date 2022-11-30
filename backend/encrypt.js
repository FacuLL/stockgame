var bcrypt = require('bcrypt');

const salt = 10;

encryptionUtil = {}

encryptionUtil.encryptPassword = (password, callback) => {
    bcrypt.genSalt(salt, function(err, salt) {
        if (err) return callback(err);
        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
}

encryptionUtil.comparePassword = (password, hashword, callback) => {
    bcrypt.compare(password, hashword, function(err, match) {
        return callback(err, match);
    });
}

module.exports = encryptionUtil;