const { default: mongoose } = require('mongoose');
const { Product } = require('../models/product');

class ProductRepository {
  #validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid product ID', { cause: { status: 400 } });
    }
  }

  async getProducts(page = 1, limit = 10,selectedFields = '') {
    try {
      const products = await Product.find().select(selectedFields)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return products;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getProductsCount() {
    try {
      const count = await Product.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
  async getProductById(id) {
    try {
      this.#validateId(id);
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async updateProduct(id, productData) {
    try {
      this.#validateId(id);
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async deleteProduct(id) {
    try {
      this.#validateId(id);
      await Product.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports = ProductRepository;
