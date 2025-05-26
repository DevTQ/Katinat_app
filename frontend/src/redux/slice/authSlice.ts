import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  fullname: string;
  phone_number: string;
  gender: string;
  birth_date: string; // ISO date string
  city: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// Export actions và reducer
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
