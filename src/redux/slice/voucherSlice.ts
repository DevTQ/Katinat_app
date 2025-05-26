import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoucherState {
  selectedVoucher: any | null;
}

const initialState: VoucherState = {
  selectedVoucher: null,
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    setSelectedVoucher: (state, action: PayloadAction<any>) => {
      state.selectedVoucher = action.payload;
    },
    clearVoucher: (state) => {
      state.selectedVoucher = null;
    },
  },
});

export const { setSelectedVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;