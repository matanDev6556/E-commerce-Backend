const { Schema, model } = require('mongoose');

const categorySchema = Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  colour: { type: String, default: '#000000' },
  markedForDeletion: { type: Boolean, default: false },
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

exports.Category = model('Category', categorySchema);
