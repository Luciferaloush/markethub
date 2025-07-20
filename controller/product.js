const moment = require('moment')
const errorHandler = require("../utils/error_handler");
const Product = require('../model/product');
const Users = require('../model/users');

const addProduct = errorHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    title,
    description,
    price,
    category,
    type,
    fileUrl,
    location,
    conactInfo,
    isPinned,
  } = req.body;

  // تحقق من نوع المنتج وشروطه
  if (type === "local" && (!location || !conactInfo)) {
    return res.status(400).json({
      message: "المنتج المحلي يتطلب موقع ووسيلة تواصل",
    });
  }

  if (type === "digital" && !fileUrl) {
    return res.status(400).json({
      message: "المنتج الرقمي يتطلب رابط شراء",
    });
  }

  const cover = req.files?.cover?.[0]?.path || null;
  const images = req.files?.images?.map((img) => img.path) || [];

  const product = new Product({
    title,
    description,
    price,
    category,
    type,
    fileUrl,
    location,
    conactInfo,
    cover,
    images,
    isPinned: isPinned === 'true' || isPinned === true,
    owner: userId,
  });

  await product.save();

  // إضافة المنتج للـ user
  await Users.findByIdAndUpdate(userId, {
    $push: { productsPosted: product._id },
  });

  res.status(201).json({ message: "✅ تمت إضافة المنتج بنجاح", product });
});

const myProduct = errorHandler(async (req, res) => {
     const userId = req.user.id;
     const user = await Users.findById(userId).populate('productsPosted');
     console.log(user.name);
             const product = user.productsPosted.map((p) => {
               const base = {
                    _id: p._id,
         title: p.title,
         description: p.description,
         price: p.price, 
         category: p.category,
         type: p.type,
         cover: p.cover,
               };
               if(p.type === "digital"){
                    base.fileUrl = p.fileUrl || null;
               }
               if(p.type === "local"){
                    base.location = p.location || null;
                    base.contact = p.contact || null;
               }
               return base;
             })
     
res.status(200).send(product);
});

const updateProduct = errorHandler(async (req, res) => {
     const userId = req.user.id;
     const productId = req.params.id;
     const updates = req.body;
     const product = await Product.findById(productId);
     if(!product){
          res.status(404).json({
               message: "المنتج غير موجود"
          })
     }
     if(product.owner.toString() !== userId){
          return res.status(403).json({
               message: "غير مصرح لك بتعديل هذا المنتج"
          })
     }
     const allowedFields = [
          'title',
           'description',
           'price',
           'category',
           'cover',
           'fileUrl',
           'location',
           'conactInfo'
     ];
     allowedFields.forEach(field => {
          if(updates[field] !== undefined){
               product[field] = updates[field];
          }
     })
     await product.save();
     res.status(200).json({
          message: "تم تعديل المنتج بنجاح",
          product
     })
})
const deleteProduct = errorHandler(async (req, res) => {
     const userId = req.user.id;
     const productId = req.params.id;
     const product = await Product.findById(productId);
     if(!product){
         return res.status(404).json({
               message: "المنتج غير موجود"
          })
     }
     if(product.owner.toString() !== userId){
        return  res.status(403).json({
               message: "غير مصرح لك بحذف هذا المنج"
          })
     }
     await product.deleteOne();
     await Users.findByIdAndUpdate(userId, {
          $pull: {productPosted: productId}
     })
res.status(200).json({
               message: "تم حذف المنج"
          })})
const allProduct = errorHandler(async (req, res) => {
     const { type, category, search } = req.query;
     let filter = {};

     if(type){
          filter.type = type;
     }
     if(category){
          filter.category = category;
     }
     if(search){
          filter.title = { $regex: search, $options: 'i'};
     }
     const products = await Product.find(filter)
       .populate('owner', 'name image')
       .sort({createdAt: -1});
       res.status(200).json({
          products
       })
})

const singleProduct = errorHandler(async (req, res) => {
     const productId = req.params.id;
     const product = await Product.findById(productId);
     res.status(200).json({
          product
     })
})



module.exports = {
          addProduct,
          myProduct,
          updateProduct,
          deleteProduct,
          allProduct,
          singleProduct
}