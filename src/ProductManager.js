class ProductManager {
  constructor() {
    this.products = [
      { id: 1, name: 'Producto 1', price: 100 },
      { id: 2, name: 'Producto 2', price: 150 },
      { id: 3, name: 'Producto 3', price: 200 },
    ];
  }

  getAllProducts() {
    return this.products;
  }

  createNewProduct(newProduct) {
    const product = {
      id: this.products.length + 1,
      ...newProduct,
    };
    this.products.push(product);
    return product;
  }

  deleteProduct(productId) {
    this.products = this.products.filter((product) => product.id !== productId);
  }
}

export { ProductManager };
