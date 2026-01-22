// Dữ liệu voucher từ database SQL - Bảng Vouchers
export interface Voucher {
  voucher_code: string;
  voucher_name: string;
  discount_amount?: number;
  discount_percentage?: number;
  max_discount?: number;
  min_order_value: number;
  created_by: string;
  applicable_items?: string[]; // Các món/danh mục áp dụng
  expiry_date?: string;
}

export const vouchers: Voucher[] = [
  {
    voucher_code: 'SALE10',
    voucher_name: 'Giảm 10%',
    discount_percentage: 10,
    max_discount: 30000,
    min_order_value: 100000,
    created_by: 'manager01',
    applicable_items: ['Trà sữa', 'Trà'],
    expiry_date: '2026-02-28'
  },
  {
    voucher_code: 'BUY2GET1',
    voucher_name: 'Mua 2 tặng 1',
    max_discount: 20000,
    min_order_value: 50000,
    created_by: 'manager01',
    expiry_date: '2026-01-30'
  },
  {
    voucher_code: 'NEWUSER50',
    voucher_name: 'Giảm 50% Ly Thứ 1',
    discount_percentage: 50,
    max_discount: 50000,
    min_order_value: 0,
    created_by: 'manager01',
    expiry_date: '2026-01-22'
  }
];

// Tính giá trị giảm của voucher
export const calculateVoucherDiscount = (
  voucher: Voucher,
  orderTotal: number
): number => {
  if (orderTotal < voucher.min_order_value) {
    return 0;
  }

  let discount = 0;

  if (voucher.discount_amount) {
    discount = voucher.discount_amount;
  } else if (voucher.discount_percentage) {
    discount = (orderTotal * voucher.discount_percentage) / 100;
  }

  if (voucher.max_discount && discount > voucher.max_discount) {
    discount = voucher.max_discount;
  }

  return discount;
};
