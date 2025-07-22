import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const createOrder = async (req, res) => {
  try {
    console.log('Creating order for user:', req.user.uid);
    console.log('Order data:', req.body);

    const { items, shipping, paymentMethod, total } = req.body;

    // Validate required fields
    if (!items || !items.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order must contain at least one item' 
      });
    }

    if (!shipping || !paymentMethod || !total) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required order information' 
      });
    }

    // Verify products exist and have sufficient stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${item.product} not found` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }
    }

    // Create the order
    const order = new Order({
      user: req.user.uid,
      items,
      shipping,
      paymentMethod,
      total,
      status: 'confirmed'
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate product details for response
    await order.populate('items.product');

    console.log('Order created successfully:', order._id);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating order', 
      error: error.message 
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.uid })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ 
      _id: id, 
      user: req.user.uid 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order', 
      error: error.message 
    });
  }
};
