const { Schema, model } = require('mongoose');
const { type } = require('os');

const userSchema = Schema({
  name: { type: String, require: true, trim: true },
  email: { type: String, require: true, trim: true },
  passwordHash: { type: String, require: true },
  phone: { type: String, require: true, trim: true },
  isAdmin: { type: Boolean, default: false },
  wishList: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
      productName: { type: String, require: true },
      productPrice: { type: Number, require: true },
    },
  ],
  street: String,
  city: String,
  postalCode: String,
  country: String,
  resetPasswordOtp: Number,
  resetPasswordOtpExpires: Date,
});

userSchema.index({ email: 1 }, { unique: true });

exports.User = model('User', userSchema);
