import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductManager {
  constructor(fileName = 'products.json') {
    this.filePath = path.join(__dirname, '..', 'data', fileName);
  }

  async #ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  async #read() {
    await this.#ensureFile();
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  async #write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getAll() {
    return await this.#read();
  }

  async getById(id) {
    const products = await this.#read();
    return products.find(p => String(p.id) === String(id)) || null;
  }

  async create(productData) {
    const { title, description, code, price, stock, category, thumbnails = [], status = true } = productData;
    
    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
      const error = new Error("Missing required field");
      error.status = 400;
      throw error;
    }

    const products = await this.#read();
    
    // Check if code already exists
    const existingProduct = products.find(p => p.code === code);
    if (existingProduct) {
      const error = new Error('The "code" field already exists for another product.');
      error.status = 400;
      throw error;
    }

    // Validate thumbnails
    if (thumbnails && !Array.isArray(thumbnails)) {
      const error = new Error('"thumbnails" must be an array of strings');
      error.status = 400;
      throw error;
    }

    const product = {
      id: randomUUID(),
      title,
      description,
      code,
      price: Number(price),
      status: Boolean(status),
      stock: Number(stock),
      category,
      thumbnails: Array.isArray(thumbnails) ? thumbnails : []
    };

    products.push(product);
    await this.#write(products);
    return product;
  }

  async update(id, updateData) {
    const products = await this.#read();
    const idx = products.findIndex(p => String(p.id) === String(id));
    
    if (idx === -1) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    // Don't allow updating the id
    delete updateData.id;

    // Check code uniqueness if code is being updated
    if (updateData.code) {
      const existingProduct = products.find(p => p.code === updateData.code && String(p.id) !== String(id));
      if (existingProduct) {
        const error = new Error('The "code" field already exists for another product.');
        error.status = 400;
        throw error;
      }
    }

    products[idx] = { ...products[idx], ...updateData };
    await this.#write(products);
    return products[idx];
  }

  async deleteById(id) {
    const products = await this.#read();
    const idx = products.findIndex(p => String(p.id) === String(id));
    
    if (idx === -1) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    products.splice(idx, 1);
    await this.#write(products);
    return true;
  }
}