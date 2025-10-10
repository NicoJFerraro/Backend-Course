const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

class ProductManager {
  constructor(fileName = 'products.json') {
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

  async getAll() { return await this.#read(); }

  async getById(id) {
    const items = await this.#read();
    return items.find(p => String(p.id) === String(id)) || null;
  }

  async create(payload) {
    const required = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const key of required) {
      if (payload[key] === undefined || payload[key] === null) {
        const err = new Error(`Missing required field: ${key}`);
        err.status = 400; throw err;
      }
    }

    const items = await this.#read();
    if (items.some(p => p.code === payload.code)) {
      const err = new Error('The "code" field already exists for another product.');
      err.status = 409; throw err;
    }

    const product = {
      id: randomUUID(),
      title: String(payload.title),
      description: String(payload.description),
      code: String(payload.code),
      price: Number(payload.price),
      status: payload.status === undefined ? true : Boolean(payload.status),
      stock: Number(payload.stock),
      category: String(payload.category),
      thumbnails: Array.isArray(payload.thumbnails) ? payload.thumbnails.map(String) : []
    };

    items.push(product);
    await this.#write(items);
    return product;
  }

  async update(id, updates) {
    const items = await this.#read();
    const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) { const e = new Error('Product not found'); e.status = 404; throw e; }

    const { id: _ignore, ...rest } = updates || {};
    if (rest.thumbnails && !Array.isArray(rest.thumbnails)) {
      const e = new Error('"thumbnails" must be an array of strings'); e.status = 400; throw e;
    }

    const updated = { ...items[idx], ...rest };
    items[idx] = updated;
    await this.#write(items);
    return updated;
  }

  async delete(id) {
    const items = await this.#read();
    const newItems = items.filter(p => String(p.id) !== String(id));
  if (newItems.length === items.length) { const e = new Error('Product not found'); e.status = 404; throw e; }
    await this.#write(newItems);
    return { deleted: id };
  }
}

module.exports = ProductManager;