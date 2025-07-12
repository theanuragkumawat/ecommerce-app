import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlistItems: [],
    isLoading: true
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers : {
        addProductsToWishlist: function(state,action){
                state.wishlistItems = action.payload;
        },
        // getCartCount: function(state,action){
        //     if(state.wishlistItems.length > 0){
        //         let count = 0;
        //         let tempArr = state.wishlistItems.slice();
        //         for (const item of tempArr) {
        //             count += item.quantity
        //         }
        //         state.cartCount = count;
        //     } 
        // }
    }
})

export const {addProductsToWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;