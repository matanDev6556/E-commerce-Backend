const { deleteImages } = require('../helpers/media_helper');
const { BASE_URL } = require('../config/index');

class ProductService {
  constructor(productRepository, categoryRepository) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  #handleProductImages(existingProduct, files) {
    let mainImageUrl = existingProduct?.image || '';
    let additionalImageUrls = existingProduct?.images || [];

    if (files['image']?.[0]) {
      mainImageUrl = `${BASE_URL}/${files['image'][0].path}`;
      if (existingProduct?.image) deleteImages([existingProduct.image]);
    }

    if (files['images']) {
      additionalImageUrls = files['images'].map(
        (image) => `${BASE_URL}/${image.path}`
      );
      if (existingProduct?.images) deleteImages(existingProduct.images);
    }

    return { mainImageUrl, additionalImageUrls };
  }

  async getProducts() {
    const products = await this.productRepository.getProducts();
    return products;
  }

  async getProductsCount() {
    const count = await this.productRepository.getProductsCount();
    if (!count)
      throw new Error('Could not count products', { cause: { status: 500 } });
    return count;
  }

  async addProduct(productData, files) {
    const mainImage = files['image']?.[0];
    if (!mainImage)
      throw new Error('No main image found!', { cause: { status: 400 } });

    // check that this is valid category
    const categoryId = productData.category;
    const category = await this.categoryRepository.findById(categoryId);
    if (!category)
      throw new Error('Category ID is required', { cause: { status: 404 } });

    if (category.markedForDeletion)
      throw new Error(
        'Category marked for deletion,canot upload for this category',
        { cause: { status: 404 } }
      );

    // images
    const { mainImageUrl, additionalImageUrls } = this.#handleProductImages(
      null,
      files
    );

    // Prepare final product data
    const finalProductData = {
      ...productData,
      image: mainImageUrl,
      images: additionalImageUrls,
    };

    // Create a new product in the DB through the Repository
    const product = await this.productRepository.createProduct(
      finalProductData
    );
    if (!product)
      throw new Error('Product couldnt be created', { cause: { status: 500 } });
    return product;
  }

  async editProduct(productId, productData, files) {
    // check that this is product exist in db
    console.log(productId);
    const product = await this.productRepository.getProductById(productId);
    if (!product)
      throw new Error('Invalid product!', { cause: { status: 404 } });

    //check that the category is valid
    const category = await this.categoryRepository.findById(product.category);
    if (!category)
      throw new Error('Invalid Category!', { cause: { status: 404 } });
    if (category.markedForDeletion) {
      throw new Error(
        'Category marked for deletion,cant add to this category',
        { cause: { status: 404 } }
      );
    }

    // handle images
    const { mainImageUrl, additionalImageUrls } = this.#handleProductImages(
      product,
      files
    );

    const updateData = {
      ...productData,
      image: mainImageUrl,
      images: additionalImageUrls,
    };

    const updatedProduct = await this.productRepository.updateProduct(
      productId,
      updateData
    );
    if (!updatedProduct)
      throw new Error('Product not found', { cause: { status: 404 } });
    return updatedProduct;
  }

  async deleteProduct(productId) {
    const product = await this.productRepository.getProductById(productId);
    if (!product)
      throw new Error('Product not found!', { cause: { status: 404 } });

    // delete images of this product
    console.log(product);

    if (String(product.image)) {
      await deleteImages([product.image]);
    }
    if (String(product.images)) {
      await deleteImages(product.images);
    }

    // delete the product
    await this.productRepository.deleteProduct(productId);
  }

  async deleteProductImages(productId, imageUrls) {
    const product = await this.productRepository.getProductById(productId);
    if (!product)
      throw new Error('Product not found!', { cause: { status: 404 } });

    const nonExistentImages = imageUrls.filter(
      (img) => !product.images.includes(img)
    );

    if (nonExistentImages.length > 0) {
      throw new Error(
        `The following images do not exist in the product: ${nonExistentImages.join(
          ', '
        )}`,
        { cause: { status: 400 } }
      );
    }

    // delete the images from the server
    await deleteImages(imageUrls);

    // delete only the imageurls given from the product images
    product.images = product.images.filter((img) => !imageUrls.includes(img));

    // save the new product after deleted the images
    await this.productRepository.updateProduct(productId, product);
  }
}

module.exports = ProductService;
