import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    username: string;
}

const initialState: UserState = {
    username: "", 
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        clearUser: (state) => {
            state.username = "";
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
