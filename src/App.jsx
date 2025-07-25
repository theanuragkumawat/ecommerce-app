import React, { useEffect, useState } from "react";
import { Routes, Route,useLocation, useNavigate } from "react-router";
import { Layout } from "./components";
import { AdminDashboard, AdminFeatures, AdminOrders, AdminProducts, Login, Register, ShoppingAccount, ShoppingCart, ShoppingCheckout, ShoppingHome, ShoppingListing, ShoppingProductOverview, ShoppingWishlist, UnauthPage } from "./pages";
import AdminLayout from "./components/admin-view/AdminLayout";
import ShopingLayout from "./components/shopping-view/ShopingLayout";
import NotFound from "./pages/NotFound";
import { useSelector, useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login as storeLogin, logout as storeLogout } from "./store/auth-slice"
import databaseService from "./appwrite/config";
import { addProductsToCart } from "./store/shop/cart-slice";
import { addProductsToWishlist } from "./store/shop/wishlist-slice";
import Verify from "./pages/verify/Verify";

function App() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const userInfo = useSelector(state => state.auth.userData)
const cartItems = useSelector(state => state.cart.cartItems)

  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  // console.log(cartItems);

  async function getCart() {
    if (userInfo) {
      try {
        const cart = await databaseService.getCart(userInfo.$id);
        dispatch(addProductsToCart(JSON.parse(cart.products)))
        const wishlist = await databaseService.getWishlist(userInfo.$id)
        dispatch(addProductsToWishlist(JSON.parse(wishlist.products)))
      } catch (error) {
        // console.log("App.jsx getCart error " + error);
      }
    }
  }
  

  useEffect(() => {
    getCart();
  }, [userInfo])
  

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(storeLogin(userData ))
          console.log("User logged in, details:",userData);
          setIsLoading(false)

        } else {
          dispatch(storeLogout())
          setIsLoading(false)
        }
      })

  }, [])


  return (
    !isLoading ?
      (<>
        <div className="flex flex-col overflow-hidden bg-white">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />

            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="features" element={<AdminFeatures />} />
            </Route>

            <Route path="" element={<ShopingLayout />}>
              <Route path="" element={<ShoppingHome />} />
              <Route path="/shop/cart" element={<ShoppingCart />} />
              <Route path="/shop/wishlist" element={<ShoppingWishlist />} />
              <Route path="/shop/account" element={<ShoppingAccount />} />
              <Route path="/shop/listing" element={<ShoppingListing />} />
              <Route path="/shop/checkout" element={<ShoppingCheckout />} />
              <Route path="/shop/product/:productId" element={<ShoppingProductOverview />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="unauth-page" element={<UnauthPage />} />
          </Routes>
        </div>
      </>) : (
        <h1 className="text-center mt-96 text-2xl">Loading...</h1>
      )
  );
}

export default App;
