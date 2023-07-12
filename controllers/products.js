// libs
import multer from 'multer';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
// models
import Upload from '../models/Upload.js';
import Product from '../models/Product.js';

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// const configAWS = AWS.config({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   region: process.env.AWS_REGION,
// });

// MEMORY STORAGE
// Configure multer for file uploads
const storage = multer.memoryStorage();

// // DISK STORAGE
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/Users/alessandrocarinato/Documents/Projects/TESTONEEE');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname + '-' + uniqueSuffix);
//   },
// });

export const fileUpload = multer({ storage: storage });

// @desc    Upload a file
// @route   POST /api/products/file-upload
// @access  Private (admin only)
export const uploadFile = async (req, res) => {
  try {
    // console.log('req.file');
    // console.log(req.file);
    // console.log('req.body');
    // console.log(req.body);

    // THE FOLLOWING CAN BE DONE TO RESIZE THE IMAGE BEFORE SAVING IT. IT SHOULD GO TO Body: fileBuffer instead of req.file.buffer
    // const fileBuffer = await sharp(file.buffer)
    // .resize({ height: 1920, width: 1080, fit: "contain" })
    // .toBuffer()

    const uploadParams = {
      Bucket: bucketName,
      Body: req.file.buffer,
      Key: req.file.originalname, //fileName,
      ContentType: req.file.mimetype,
    };

    // console.log(req.file.originalname);

    const upload = await s3Client.send(new PutObjectCommand(uploadParams));
    // console.log(upload);

    const newUpload = new Upload({ name: req.file.originalname });

    const savedUpload = await newUpload.save();
    // console.log(savedUpload);
    // savedUpload._id && savedUpload._id.toString().length > 0

    if (savedUpload) {
      // // console.log(newUpload);
      // console.log('dio caaaaan');
      res.status(200).json({ success: true, img: newUpload });
    } else {
      return res.json({
        error: 'Upload failed',
      });
    }

    // const command = new PutObjectAclCommand(uploadParams);
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get a url to visualise an image
// @route   GET /api/products/
// @access  Public
export async function getObjectSignedUrl(key) {
  try {
    const params = {
      Bucket: bucketName,
      Key: req.key,
    };

    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    const seconds = 60;
    const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

    res.status(200).json({ success: true, url });
  } catch (err) {
    console.log(err);
  }
}

// @desc    Get a product with the images urls
// @route   GET /api/product/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    // console.log(req.params);
    const productID = req.params.id;
    // retrieve the product
    const product = await Product.findById(productID);

    if (product) {
      let imagesUrls = [];
      for (let imageID of product.images) {
        // find the image
        const image = await Upload.findById(imageID);
        const params = {
          Bucket: bucketName,
          Key: image.name,
        };
        const command = new GetObjectCommand(params);
        const seconds = 60;
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: seconds,
        });
        const imageItem = { _id: image._id, name: image.name, url };
        imagesUrls = [...imagesUrls, imageItem];
      }
      // const sentProduct = { product, imagesUrls };
      res.status(200).json({ success: true, product: { product, imagesUrls } });
    } else {
      return res.json({
        success: false,
        error: 'Product not found',
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    List files in the bucket
// @route   GET /api/products/list-files
// @access  Private (admin only)
export const listFiles = async (req, res) => {
  try {
    // const input = { Bucket: bucketName };
    // const command = new ListObjectsCommand(input);
    // const response = await s3Client.send(command);
    // res.status(200).json({ success: true, files: response.Contents });
    const uploads = await Upload.find({});
    console.log(uploads);

    let images = [];

    for (let upload of uploads) {
      const params = {
        Bucket: bucketName,
        Key: upload.name,
      };

      // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
      const command = new GetObjectCommand(params);
      const seconds = 60;
      const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
      const imageItem = { _id: upload._id, name: upload.name, url };
      //   images.push(imageItem);
      images = [...images, imageItem];
      // upload.imageUrl = await getObjectSignedUrl(post.imageName)
    }
    res.status(200).json({ success: true, images });
    // console.log(images);
  } catch (err) {
    console.log(err);
  }
};

// @desc    List files in the bucket
// @route   GET /api/products/download/:key
// @access  Private (admin only)
export const getFile = async (req, res) => {
  try {
    // console.log(req.params.key);

    res.attachment(req.params.key);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: req.params.key,
    });

    const item = await s3Client.send(command);
    const str = await item.Body.transformToString('base64');
    console.log(str);

    // const readableSrc = item.Body.transformToWebStream();
    // readableSrc.pipeTo(res);
    // item.Body.pipe(fs.createWriteStream(req.params.key));
    // console.log(item);

    // const stream = item.Body.pipe(
    //   fs.createWriteStream(
    //     'https://nappitello-demo.s3.eu-south-1.amazonaws.com/sail-boat.png'
    //   )
    // );
    // res.pipe(stream);
    // stream.pipe(res);
    // const str = await item.Body.transformToString();
    // console.log(str);

    // const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // res.status(200).json({ stream, url });

    // item.Body.pipe(fs.createWriteStream(req.params.key));

    // // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    // const stream = response.Body.transformToWebStream();
    // stream.pipe(res);

    // //   const input = { Bucket: bucketName };
    // //   const command = new ListObjectsCommand(input);
    // //   const response = await s3Client.send(command);
    // console.log(response.Contents);
    // res.status(200).json({ success: true, files: response.Contents });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Create new product
// @route   POST /api/products/new
// @access  Private (admin only)
export const newProduct = async (req, res) => {
  try {
    // console.log(req.body);
    // res.status(200).json({ success: true });
    const newProduct = new Product(req.body);

    const savedProduct = await newProduct.save();
    // console.log(savedProduct);

    if (savedProduct) res.status(200).json({ success: true, savedProduct });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get the images that have been uploaded from the list of their ids
// @route   POST /api/products/images-url
// @access  Private (admin only)
export const getSignedUrlsFromList = async (req, res) => {
  try {
    const { imageIDs } = req.body;

    let imagesUrls = [];
    for (let imageID of imageIDs) {
      // find the image
      const image = await Upload.findById(imageID);
      const params = {
        Bucket: bucketName,
        Key: image.name,
      };
      const command = new GetObjectCommand(params);
      const seconds = 60;
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: seconds,
      });
      const imageItem = { _id: image._id, name: image.name, url };
      imagesUrls = [...imagesUrls, imageItem];
    }
    res.status(200).json({ success: true, urls: imagesUrls });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all the products
// @route   GET /api/products
// @access  Private (admin only)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products) {
      res.status(200).json({ success: true, products });
    } else {
      return res.json({
        success: false,
        error: 'An error occurred when retrieving products',
      });
    }
  } catch (err) {
    console.log(err);
  }
};
