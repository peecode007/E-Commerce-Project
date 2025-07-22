import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: String, // Firebase UID
    required: true
  },
  items: [orderItemSchema],
  shipping: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'cod']
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
