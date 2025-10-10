const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

class CartManager {
  constructor(fileName = 'carts.json') {
    this.filePath = path.join(__dirname, '..', 'data', fileName);
  }

  async #ensureFile() {
    try { await fs.access(this.filePath); }
    catch { await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8'); }
  }

  async #read() {
    await this.#ensureFile();
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  async #write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async createCart() {
    const carts = await this.#read();
    const cart = { id: randomUUID(), products: [] };
    carts.push(cart);
    await this.#write(carts);
    return cart;
  }

  async getCartById(id) {
    const carts = await this.#read();
    return carts.find(c => String(c.id) === String(id)) || null;
  }

  async addProduct(cartId, productId, quantity = 1) {
    const carts = await this.#read();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
  if (idx === -1) { const e = new Error('Cart not found'); e.status = 404; throw e; }

    const cart = carts[idx];
    const itemIdx = cart.products.findIndex(i => String(i.product) === String(productId));
    if (itemIdx === -1) cart.products.push({ product: String(productId), quantity: Number(quantity) || 1 });
    else cart.products[itemIdx].quantity += Number(quantity) || 1;

    carts[idx] = cart;
    await this.#write(carts);
    return cart;
  }
}

module.exports = CartManager;