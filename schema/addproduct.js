const mongoose = require('mongoose');

const addproductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  selling_price: {
    type: Number,
    required: true,
    min: 0
  },
  cost_price: {
    type: Number,
    required: true,
    min: 0
  },
  // Assuming you're storing the image as a file path or URL
  image: {
    type: String,
    required: true
  }
});

const Addproduct = mongoose.model('Product', addproductSchema);

module.exports = Addproduct;
