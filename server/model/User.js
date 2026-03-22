const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const User = Schema({
	username : {
		type : String,
		unique: true,
		required: true,
        trim: true
	},
    email : {
        type : String,
        unique : true,
        required : true,
        trim: true,
        lowercase: true
    },
	password : {
		type : String,
		required: true
	},
    createdAt : {
        type: Date, 
        default: Date.now
    }
});

User.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = (password, password2) => {
	return bcrypt.compareSync(password, password2);
};

module.exports = model('User', User);