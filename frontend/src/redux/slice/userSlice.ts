import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    phone_number: string;
    fullname: string;

  }
  
  const initialState: UserState = {
    phone_number: "",
    fullname: "",
  };
  

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.fullname = action.payload.fullname;
            state.phone_number = action.payload.phone_number;
            
        },
        clearUser: (state) => {
            state.fullname = "";
            state.phone_number = "";
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
