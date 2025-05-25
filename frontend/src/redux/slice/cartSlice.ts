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
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.CartArr.push(action.payload);
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.CartArr = state.CartArr.filter((item) => item.id !== action.payload);
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const product = state.CartArr.find((item) => item.id === id);
      if (product) {
        product.quantity = Math.max(1, quantity);
      }
    },
    resetCart: (state) => {
      state.CartArr = [];
    },
  },
});

export const { addProduct, deleteProduct, updateProductQuantity, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
