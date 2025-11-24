import mongoose from 'mongoose';
import { Product } from './src/models/Product.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const sampleProducts = [
  {
    title: 'Mouse Gaming RGB',
    description: 'Mouse ergonómico con iluminación RGB y 6 botones programables',
    code: 'MOUSE-001',
    price: 2500,
    stock: 15,
    category: 'gaming-peripherals',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Teclado Mecánico',
    description: 'Teclado mecánico con switches blue, retroiluminado',
    code: 'KB-001',
    price: 4500,
    stock: 8,
    category: 'gaming-peripherals',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'NVIDIA RTX 4070',
    description: 'Tarjeta gráfica NVIDIA GeForce RTX 4070 12GB GDDR6X',
    code: 'GPU-001',
    price: 180000,
    stock: 3,
    category: 'graphics-cards',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'AMD Radeon RX 7800 XT',
    description: 'Tarjeta gráfica AMD Radeon RX 7800 XT 16GB',
    code: 'GPU-002',
    price: 165000,
    stock: 5,
    category: 'graphics-cards',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Intel Core i7-14700K',
    description: 'Procesador Intel Core i7 14va generación, 20 cores',
    code: 'CPU-001',
    price: 125000,
    stock: 10,
    category: 'processors',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'AMD Ryzen 9 7950X',
    description: 'Procesador AMD Ryzen 9 7950X, 16 cores, 32 threads',
    code: 'CPU-002',
    price: 145000,
    stock: 7,
    category: 'processors',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'SSD NVMe 1TB',
    description: 'Disco sólido NVMe Gen4 1TB, 7000MB/s lectura',
    code: 'SSD-001',
    price: 35000,
    stock: 20,
    category: 'storage',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'HDD 4TB',
    description: 'Disco duro mecánico 4TB 7200RPM',
    code: 'HDD-001',
    price: 28000,
    stock: 12,
    category: 'storage',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'RAM DDR5 32GB',
    description: 'Memoria RAM DDR5 32GB (2x16GB) 6000MHz RGB',
    code: 'RAM-001',
    price: 52000,
    stock: 15,
    category: 'memory',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'RAM DDR4 16GB',
    description: 'Memoria RAM DDR4 16GB (2x8GB) 3200MHz',
    code: 'RAM-002',
    price: 22000,
    stock: 25,
    category: 'memory',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Auriculares Inalámbricos',
    description: 'Auriculares gaming inalámbricos con sonido 7.1 virtual',
    code: 'AUDIO-001',
    price: 8500,
    stock: 0,
    category: 'gaming-peripherals',
    status: false,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Webcam 4K',
    description: 'Webcam 4K con micrófono integrado y autoenfoque',
    code: 'CAM-001',
    price: 15000,
    stock: 6,
    category: 'gaming-peripherals',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Monitor 27" 144Hz',
    description: 'Monitor gaming 27 pulgadas QHD 144Hz 1ms',
    code: 'MON-001',
    price: 95000,
    stock: 4,
    category: 'gaming-peripherals',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Silla Gaming',
    description: 'Silla ergonómica gaming con reposabrazos 4D',
    code: 'CHAIR-001',
    price: 75000,
    stock: 0,
    category: 'gaming-peripherals',
    status: false,
    thumbnails: ['https://via.placeholder.com/150']
  },
  {
    title: 'Fuente 850W 80+ Gold',
    description: 'Fuente modular 850W certificación 80+ Gold',
    code: 'PSU-001',
    price: 42000,
    stock: 8,
    category: 'processors',
    status: true,
    thumbnails: ['https://via.placeholder.com/150']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);

    console.log('\nSample products created:');
    console.log('- Gaming peripherals: 7 products (2 unavailable)');
    console.log('- Graphics cards: 2 products');
    console.log('- Processors: 3 products');
    console.log('- Storage: 2 products');
    console.log('- Memory: 2 products');

    await mongoose.disconnect();
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
