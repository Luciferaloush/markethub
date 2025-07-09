const Category = require('../model/category');
const errorHandler = require("../utils/error_handler");

const getCategories = errorHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({ categories });
})
const addCategory = errorHandler(async (req, res) => {
  const { name } = req.body;
  const exist = await Category.findOne({ name });
  if (exist) return res.status(400).json({ message: "التصنيف موجود مسبقًا" });

  const category = new Category({ name });
  await category.save();
  res.status(201).json({ message: "تمت إضافة التصنيف", category });
})

module.exports = { getCategories, addCategory };