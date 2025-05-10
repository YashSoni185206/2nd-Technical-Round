import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, inStock } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item != undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      sizes: JSON.parse(sizes),
      inStock: inStock === "true" || inStock === true, // handle both string and boolean
      image: imagesUrl,
      date: Date.now()
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// function for list product
const listProducts = async (req, res) => {

     try {

          const products = await productModel.find({});
          res.json({success:true,products})
          
     } catch (error) {
          console.log(error)
          res.json({ success: false, message: error.message })
     }

}

// function for remove product
const removeProduct = async (req, res) => {

     try {

          await productModel.findByIdAndDelete(req.body.id)
          res.json({success:true, message:"Product Removed!"})
          
     } catch (error) {
          console.log(error)
          res.json({ success: false, message: error.message })
     }

}

// function for single product info
const singleProduct = async (req, res) => {
  try {
    // Fetch the productId from query params or URL params
    const { productId } = req.query; // Use query params instead of req.body for productId
    
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, inStock} = req.body;
    const { id } = req.params;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item != undefined);

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update fields, but don't overwrite images unless new images are provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.inStock = inStock !== undefined ? inStock : product.inStock;

    // Only update images if there are new ones
    if (imagesUrl.length > 0) {
      product.image = imagesUrl; // Replace the old image URLs with new ones
    }

    // Save the updated product
    await product.save();

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct }
