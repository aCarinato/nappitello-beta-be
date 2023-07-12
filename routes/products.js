import express from 'express';

const router = express.Router();

import {
  getProducts,
  fileUpload,
  uploadFile,
  getProduct,
  newProduct,
  getSignedUrlsFromList,
} from '../controllers/products.js';

router.get('/', getProducts);
router.get('/product/:id', getProduct);
router.post('/file-upload', fileUpload.single('test-file'), uploadFile);
// router.get('/list-files', listFiles);
// router.get('/download/:key', getFile);
router.post('/new', newProduct);
router.post('/images-url', getSignedUrlsFromList);

export default router;
