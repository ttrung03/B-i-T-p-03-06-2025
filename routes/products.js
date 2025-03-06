var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj) {
  let query = {  }; 

  if (obj.name) {
    query.name = new RegExp(obj.name, 'i');
  }

  if (obj.price_gte || obj.price_lte) {
    query.price = {};
    if (obj.price_gte) query.price.$gte = Number(obj.price_gte);
    if (obj.price_lte) query.price.$lte = Number(obj.price_lte);
  }

  return query;
}


router.get('/', async function(req, res, next) {
  let products = await productModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
  res.status(200).send({
    success: true,
    data: products
  });
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price:req.body.price,
      quantity: req.body.quantity,
      category:req.body.category
    })
    await newProduct.save();
    res.status(200).send({
      success:true,
      data:newProduct
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).send({ success: false, message: 'Product not found' });
    }
    res.status(200).send({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let deletedProduct = await productModel.findById(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({ success: false, message: 'Product not found' });
    }
    deletedProduct.isDeleted = true;
    deletedProduct.updatedAt = new Date();
    await deletedProduct.save();
    res.status(200).send({ success: true, message: 'Product soft deleted', data: deletedProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;