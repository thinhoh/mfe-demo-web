/**
 * Event Bus giúp các MFE nói chuyện với nhau mà không cần biết nhau là ai.
 * Giống như một cái loa phát thanh: một người nói, nhiều người nghe.
 */

export const EventBus = {
  // Phát đi một thông báo
  emit(eventName: string, data: any) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
    console.log(`[EventBus] Emitted: ${eventName}`, data);
  },

  // Đăng ký lắng nghe thông báo
  subscribe(eventName: string, callback: (data: any) => void) {
    const handler = (event: Event) => {
      callback((event as CustomEvent).detail);
    };
    window.addEventListener(eventName, handler);
    // Trả về hàm để huỷ lắng nghe khi không cần nữa (tránh rò rỉ bộ nhớ)
    return () => window.removeEventListener(eventName, handler);
  }
};

// Định nghĩa kiểu dữ liệu chung
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity?: number; // Thêm số lượng (tùy chọn)
}
