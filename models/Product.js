import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    nameIT: { type: String },
    nameEN: { type: String },
    nameDE: { type: String },
    // slugIT: { type: String },
    // slugEN: { type: String },
    // slugDE: { type: String },
    images: [{ type: Schema.Types.ObjectId, ref: 'Upload' }],
    // categoryIT: { type: String },
    // categoryEN: { type: String },
    // categoryDE: { type: String },
    // descriptionIT: { type: String },
    // descriptionEN: { type: String },
    // descriptionDE: { type: String },
    // price: { type: Number },
    // countInStock: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
