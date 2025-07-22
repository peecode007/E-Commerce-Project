import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  brand: String,
  stock: { type: Number, default: 0 },
  filters: Object, // E.g., { size: ["S", "M"], color: ["Red", "Blue"] }
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;

