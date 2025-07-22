import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  slug: { type: String, unique: true }, // optional for SEO/URL
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null } // for subcategories
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
