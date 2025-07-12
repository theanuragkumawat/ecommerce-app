import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    productsList: [],
};

const adminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {
        addProductsToState: function(state,action){
            state.productsList = action.payload;
        }
    },
});


export const {addProductsToState} = adminProductsSlice.actions
export default adminProductsSlice.reducer;
