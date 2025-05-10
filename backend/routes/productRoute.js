import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Route to add a new product
productRouter.post('/add', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]), addProduct);


// Route to remove a product
productRouter.post('/remove', adminAuth, removeProduct);

// Route to get a single product details
productRouter.get('/single', singleProduct); // Use GET instead of POST, and use query params


// Route to list all products
productRouter.get('/list', listProducts);

// Route to update an existing product by ID
productRouter.put('/edit/:id', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]), updateProduct);

export default productRouter;
