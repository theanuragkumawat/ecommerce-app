import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router";
import { Layout } from "./components";
import { AdminDashboard, AdminFeatures, AdminOrders, AdminProducts, Login, Register, ShoppingAccount, ShoppingCart, ShoppingCheckout, ShoppingHome, ShoppingListing, ShoppingProductOverview, ShoppingWishlist, ShoppingOrdersAddress, UnauthPage, ShoppingSearch, AdminLogin } from "./pages";
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
import Cancel from "./pages/stripe/Cancel";
import Success from "./pages/stripe/Success";
import RecoverAccount from "./pages/auth/RecoverAccount";

function App() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const userInfo = useSelector(state => state.auth.userData)
  const cartItems = useSelector(state => state.cart.cartItems)

  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  // console.log(cartItems);

  const [authCheckComplete, setAuthCheckComplete] = useState(false)

  async function getCart() {
    if (!authCheckComplete) {
      return;
    }
    try {
      if (userInfo) {
        const cart = await databaseService.getCart(userInfo.$id);
        cart ? dispatch(addProductsToCart(JSON.parse(cart.products))) : dispatch(addProductsToCart([]))
        const wishlist = await databaseService.getWishlist(userInfo.$id)
        wishlist ? dispatch(addProductsToWishlist(JSON.parse(wishlist.products))) : null
      } else {
        const tempCart = localStorage.getItem('cart')

        tempCart ? dispatch(addProductsToCart(JSON.parse(tempCart))) : null
      }
    } catch (error) {
      console.log("App.jsx getCart error " + error);
    }

  }

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(storeLogin(userData))
          localStorage.removeItem('cart');
          if(location.pathname.includes('admin')){
            if(userData.email == "anurag.kmwt7851@gmail.com"){
              navigate("/admin/dashboard")

            } else{
              navigate("/admin/login")
            }
          } 
          setIsLoading(false)
          // console.log(userData);

        } else {
          dispatch(storeLogout())
          if(location.pathname.includes('admin')){
            navigate("/admin/login")
          } 
          setIsLoading(false)
        }
      })
      .finally(() => {
        setAuthCheckComplete(true)
      })
  }, [])


  useEffect(() => {
    getCart()
  }, [authCheckComplete, isAuthenticated])



  return (
    !isLoading ?
      (<>
        <div className="flex flex-col overflow-hidden bg-white">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/recover" element={<RecoverAccount />} />
            </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="features" element={<AdminFeatures />} />
            </Route>

            <Route path="" element={<ShopingLayout />}>
              <Route path="" element={<ShoppingHome />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/wishlist" element={<ShoppingWishlist />} />
              <Route path="/account" element={<ShoppingAccount />} />
              <Route path="/orders" element={<ShoppingOrdersAddress />} />
              <Route path="/listing" element={<ShoppingListing />} />
              <Route path="/checkout" element={<ShoppingCheckout />} />
              <Route path="/search" element={<ShoppingSearch />} />
              <Route path="/product/:productId" element={<ShoppingProductOverview />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="unauth-page" element={<UnauthPage />} />
          </Routes>
        </div>
      </>) : (
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-center text-2xl text-neutral-900 font-semibold">Loading...</h1>
        </div>
      )
  );
}

export default App;
