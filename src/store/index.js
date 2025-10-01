import { configureStore } from "@reduxjs/toolkit";
import { GlobalApi } from "./GlobalApi";
// import navigationReducer from "./Slice/navigationSlice"; // Import the slice

const store = configureStore({
  reducer: {
    [GlobalApi.reducerPath]: GlobalApi.reducer,
    // navigation: navigationReducer, // Add navigation slice
  },
  middleware: (middleware) =>
    middleware().concat(GlobalApi.middleware),
});

export default store;
