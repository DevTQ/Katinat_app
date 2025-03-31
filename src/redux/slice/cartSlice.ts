import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  toppings: { [key: string]: number };
  sugar?: string;
  ice?: string; 
}

interface CartState {
  CartArr: Product[];
}

const initialState: CartState = {
  CartArr: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.CartArr.find((item) => item.id === action.payload.id);

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingProduct.quantity += action.payload.quantity;
      } else {
        // Nếu sản phẩm chưa có trong giỏ, thêm mới
        state.CartArr.push(action.payload);
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.CartArr = state.CartArr.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addProduct, deleteProduct } = cartSlice.actions;
export default cartSlice.reducer;
