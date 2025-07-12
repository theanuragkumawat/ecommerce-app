import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    cartCount: 0,
    isLoading: true

}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers : {
        addProductsToCart: function(state,action){
                state.cartItems = action.payload;
        },
        getCartCount: function(state,action){
            if(state.cartItems.length > 0){
                let count = 0;
                let tempArr = state.cartItems.slice();
                for (const item of tempArr) {
                    count += item.quantity
                }
                state.cartCount = count;
            } 
        }
    }
})

export const {addProductsToCart,getCartCount} = cartSlice.actions;
export default cartSlice.reducer;