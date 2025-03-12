const { default: mongoose } = require('mongoose');
const { Product } = require('./product');

class ProductRepository {
  #validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid product ID', { cause: { status: 400 } });
    }
  }

  async getProducts(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10, excludeFields = '' } = options;

      // Build MongoDB query from filters
      const query = {};

      // Text search
      if (filters.searchText) {
        // Use MongoDB text search if you have text index set up
        // query.$text = { $search: filters.searchText };
        // Or use regex for simple case-insensitive search:
        query.name = { $regex: filters.searchText, $options: 'i' };
      }

      // Category filter
      if (filters.category) {
        query.category = filters.category;
      }

      // New arrivals filter
      if (filters.isNewArrival) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 14);
        query.dateAdded = { $gte: cutoffDate };
      }

      // Popular filter
      if (filters.isPopular) {
        query.rating = { $gte: 4.5 };
      }

      // Execute query
      const products = await Product.find(query)
        .select(excludeFields)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Count total matching documents
      const count = await Product.countDocuments(query);

      return { products, count };
    } catch (error) {
      console.error('Repository error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getCountProducts() {
    return await Product.countDocuments();
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
