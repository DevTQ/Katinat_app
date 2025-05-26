<<<<<<< HEAD
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
=======
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
>>>>>>> d4fc372ebe50ec2a1c5934010fdbbe5faea0f48e

interface VoucherState {
  selectedVoucher: any | null;
}

const initialState: VoucherState = {
  selectedVoucher: null,
};

const voucherSlice = createSlice({
<<<<<<< HEAD
  name: "voucher",
  initialState: {
    selectedVoucher: null,
  },
  reducers: {
    setVoucher: (state, action: PayloadAction<any | null>) => {
=======
  name: 'voucher',
  initialState,
  reducers: {
    setSelectedVoucher: (state, action: PayloadAction<any>) => {
>>>>>>> d4fc372ebe50ec2a1c5934010fdbbe5faea0f48e
      state.selectedVoucher = action.payload;
    },
    clearVoucher: (state) => {
      state.selectedVoucher = null;
    },
  },
});

<<<<<<< HEAD
export const { setVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
=======
export const { setSelectedVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
>>>>>>> d4fc372ebe50ec2a1c5934010fdbbe5faea0f48e
