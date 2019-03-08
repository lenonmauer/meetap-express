const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_login: {
    type: Boolean,
    default: true,
  },
  categories: [
    {
      type: String,
      enum: ['front-end', 'back-end', 'mobile', 'dev-ops', 'gestao', 'marketing'],
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password);
  },
  generateToken () {
    return jwt.sign({ id: this.id }, authConfig.secret, {
      expiresIn: authConfig.ttl,
    });
  },
};

module.exports = mongoose.model('User', UserSchema);
