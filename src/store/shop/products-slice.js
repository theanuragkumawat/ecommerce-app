import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    currency:"₹",
    productsList: [],
    // productDetails: null
};

const shopProductsSlice = createSlice({
    name: "shopProducts",
    initialState,
    reducers: {
        addProductsToState: function(state,action){
            state.productsList = action.payload;
        },
   
    }
})

export const {addProductsToState,addProductDetails} = shopProductsSlice.actions
export default shopProductsSlice.reducer;