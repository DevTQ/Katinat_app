import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VoucherState {
  selectedVoucher: any | null;
}

const initialState: VoucherState = {
  selectedVoucher: null,
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    selectedVoucher: null,
  },
  reducers: {
    setVoucher: (state, action: PayloadAction<any | null>) => {
      state.selectedVoucher = action.payload;
    },
    clearVoucher: (state) => {
      state.selectedVoucher = null;
    },
  },
});

export const { setVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
