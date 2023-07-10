import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    user: null,
    otp: {
      email: "",
      phone: "",
      hash: "",
    },
  },
  reducers: {
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setAuth: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      console.log(user);
      if (!user) state.isAuth = false;
      else state.isAuth = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
