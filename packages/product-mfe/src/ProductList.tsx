import React, { useState, useEffect } from 'react';
import productsData from './data.json';
import { EventBus, Product } from '../../shared/eventBus';
import { ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'motion/react';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    setProducts(productsData);
  }, []);

  const addToCart = (product: Product) => {
    // Khi nhấn nút, chúng ta phát đi sự kiện 'ADD_TO_CART'
    // Cart MFE sẽ lắng nghe sự kiện này
    EventBus.emit('ADD_TO_CART', product);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="text-blue-600" /> Danh sách Sản phẩm (Remote MFE)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  id={`add-to-cart-${product.id}`}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
