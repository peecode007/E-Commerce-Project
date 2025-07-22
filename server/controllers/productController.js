import Product from '../models/productModel.js';
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    let filter = {};
    if (req.query.category) {
      // Validate if it's a valid ObjectId before querying
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        filter.category = req.query.category;
      } else {
        // Optionally, return an empty product list or error
        return res.status(200).json({ success: true, data: [] });
      }
    }
    const products = await Product.find(filter).populate('category');
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error });
  }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching product', error });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: savedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating product', error });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        ).populate('category');
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product', error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting product', error });
    }
};
