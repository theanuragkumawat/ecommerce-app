import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    cartCount: 0,
    isLoading: true,
    totalAmount: 0,
    discountAmount:0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addProductsToCart: function (state, action) {
            state.cartItems = action.payload;
        },
        getCartCount: function (state, action) {
            if (state.cartItems.length > 0) {
                let count = 0;
                let tempArr = state.cartItems.slice();
                for (const item of tempArr) {
                    count += item.quantity
                }
                state.cartCount = count;
            } else {
                state.cartCount = 0;

            }
        },
        getTotalAmount: function (state, action) {
            let coupon = action.payload;
            let totalCartAmount =
                state.cartItems && state.cartItems.length > 0
                    ? state.cartItems.reduce(
                        (sum, currentItem) =>
                            sum +
                            (currentItem?.price) *
                            currentItem?.quantity,
                        0
                    )
                    : 0;

            if (action.payload) {
                if (coupon.discountType === "percent") {
                    totalCartAmount = totalCartAmount - (totalCartAmount * coupon.value) / 100;
                    state.totalAmount = totalCartAmount

                    state.discountAmount = (totalCartAmount * coupon.value) / 100
                } else if (coupon.discountType === "flat") {
                    totalCartAmount = state.totalAmount - coupon.value;
                    state.totalAmount = totalCartAmount

                    state.discountAmount = coupon.value
                } 
            } else{
                state.totalAmount = totalCartAmount
            }
        }
    }
})

export const { addProductsToCart, getCartCount,getTotalAmount } = cartSlice.actions;
export default cartSlice.reducer;