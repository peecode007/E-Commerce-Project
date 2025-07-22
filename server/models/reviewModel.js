const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: String, required: true }, // Firebase UID
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: String,
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);
export default Review;
