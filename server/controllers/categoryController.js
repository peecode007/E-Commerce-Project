import Category from '../models/categoryModel.js';
import slugify from 'slugify'; 

export const createCategory = async (req, res) => {
  try {
    let { name, description } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Name required" });

    const slug = slugify(name, { lower: true, strict: true });
    const category = new Category({ name, description, slug });

    await category.save();
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error creating category', error: err });
  }
};


export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent');
        res.status(200).json({ success: true, message: 'Categories fetched', data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching categories', error: err });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent');
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category fetched', data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching category', error: err });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category updated', data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error updating category', error: err });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting category', error: err });
    }
};
