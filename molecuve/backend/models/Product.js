const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    enum: ['tops', 'bottoms', 'outerwear', 'accessories', ''],
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
