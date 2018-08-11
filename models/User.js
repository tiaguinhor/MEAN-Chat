var mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	SALT_WORK_FACTOR = 10;

//MongoDB Schemas
var userSchema = mongoose.Schema({
	name: String,
	username: {type: String, unique: true},
	password: String
});

//sempre antes de salvar qualquer registro de user, gera hash do password
userSchema.pre('save', function(next){
	var user = this;

	//somente hash se password for alterado ou novo usuario
	if(!user.isModified('password')) return next;

	//gera hash
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		//hash password usando novo salt
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);

			//substitui password com novo hash
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return callback(err);
		callback(undefined, isMatch);
	});
};

var User = mongoose.model('users', userSchema);
module.exports = User;