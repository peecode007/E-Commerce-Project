import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.uid; // From Firebase auth middleware

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart', error });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.uid;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart', error });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.uid;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing from cart', error });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error clearing cart', 
      error: error.message 
    });
  }
};
