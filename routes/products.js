import express from 'express';

const router = express.Router();

import {
  fileUpload,
  uploadFile,
  listFiles,
  getFile,
  newProduct,
} from '../controllers/products.js';

router.post('/file-upload', fileUpload.single('test-file'), uploadFile);
router.get('/list-files', listFiles);
router.get('/download/:key', getFile);
router.post('/new', newProduct);

export default router;
