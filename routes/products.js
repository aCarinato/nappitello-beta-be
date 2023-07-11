import express from 'express';

const router = express.Router();

import {
  fileUpload,
  uploadFile,
  listFiles,
  getFile,
} from '../controllers/products.js';

router.post('/file-upload', fileUpload.single('test-file'), uploadFile);
router.get('/list-files', listFiles);
router.get('/download/:key', getFile);

export default router;
