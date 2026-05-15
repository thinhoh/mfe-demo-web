import React from 'react';
import { User } from 'lucide-react';

const ProfileForm = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <User /> Thông tin người dùng (Profile MFE)
      </h1>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Nguyễn Văn A" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default ProfileForm;
