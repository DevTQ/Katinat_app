import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./slice/userSlice";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import voucherReducer from "./slice/voucherSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["user", "voucher"],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedVoucherReducer = persistReducer(persistConfig, voucherReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    auth: authReducer,
    cart: cartReducer,
<<<<<<< HEAD
    voucher: persistedVoucherReducer,
=======
    voucher: voucherReducer,
>>>>>>> d4fc372ebe50ec2a1c5934010fdbbe5faea0f48e
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["user.register"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;