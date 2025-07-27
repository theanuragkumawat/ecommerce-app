import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth-slice"
import adminProductsReducer from "./admin/products-slice"
import shopProductsReducer from "./shop/products-slice"
import cartReducer from "./shop/cart-slice"
import wishlistReducer from "./shop/wishlist-slice"
import addressReducer from "./shop/address-slice"
import orderReducer from "./shop/order-slice"

const store = configureStore({
    reducer : {
        auth: authReducer,
        adminProducts: adminProductsReducer,
        shopProducts: shopProductsReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        address: addressReducer,
        order:orderReducer
    }
})


export default store