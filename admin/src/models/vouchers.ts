export interface Voucher {
  id?: number;
  voucher_name: string;
  image: string;
  type: string;
  discount_value: number;
  conditions: string[];
  endDate: string;
}