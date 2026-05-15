import React from 'react';
import { ShoppingBag } from 'lucide-react';

const CartPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <ShoppingBag /> Trang Giỏ hàng (Cart MFE)
      </h1>
      <p className="text-gray-600">Đây là một trang độc lập được quản lý bởi Cart MFE.</p>
    </div>
  );
};

export default CartPage;
