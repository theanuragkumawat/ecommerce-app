import databaseService from '@/appwrite/config';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { data, Link } from 'react-router'
import { addProductsToCart } from '@/store/shop/cart-slice';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';

function CartProductCard({ productId, quantity }) {
  const [image,setImage] = useState(null)
  const cartItems = useSelector(state => state.cart.cartItems)
  const {wishlistItems} = useSelector(state => state.wishlist)
  const userData = useSelector(state => state.auth.userData)
  const dispatch = useDispatch()
  const [productDetails, setProductDetails] = useState(false)

  async function getProductDetails() {
    try {
      const data = await databaseService.getProduct(productId);
      if (data) {
        setProductDetails(data)
         const url = await databaseService.getFilePreview(data.image)
         setImage(url.href)
      }
    } catch (error) {
      console.log("CartProductCard error :: " + error);

    }
  }

  async function incrementHandler() {
    try {
      let temp = cartItems.slice();
      temp = temp.map(item => item.productId == productId ? { ...item, quantity: item.quantity + 1 } : item)
      const data = await databaseService.updateCart(userData.$id, temp)
      if (data) {
        dispatch(addProductsToCart(JSON.parse(data.products)))
      }
    } catch (error) {
      console.log("Error while increment quantity" + error);
    }
  }
  
  async function decrementHandler() {
    let temp = cartItems.slice();
    if (quantity > 1) {
      try {
        temp = temp.map(item => item.productId == productId ? { ...item, quantity: item.quantity - 1 } : item)
        const data = await databaseService.updateCart(userData.$id, temp);
        if (data) {
          dispatch(addProductsToCart(JSON.parse(data.products)))
        }
      } catch (error) {
        console.log("Error while decrement quantity" + error);
      }
    } else {
      try {
        temp = temp.filter(item => item.productId != productId );
        const data = await databaseService.updateCart(userData.$id, temp);
        if (data) {
          dispatch(addProductsToCart(JSON.parse(data.products)))
        }
      } catch (error) {
        console.log("Error while decrement quantity" + error);
      }
    }
  }
  
  async function deleteHandler() {
    try {
      let temp = cartItems.slice();
      temp = temp.filter(item => item.productId != productId );
        const data = await databaseService.updateCart(userData.$id, temp);
        if (data) {
          dispatch(addProductsToCart(JSON.parse(data.products)))
        }
    } catch (error) {
      console.log("Error while delete quantity" + error)
    }
  }

  async function moveToWishlist() {
        try {
            let temp = cartItems.slice()
            temp = temp.filter(item => item.productId != productId)
            const data = await databaseService.updateCart(userData.$id, temp);
            dispatch(addProductsToCart(JSON.parse(data.products)))

            let tmp = wishlistItems.slice()
            const existing = tmp.find(item => item == productId)
            if(existing){
                return;
            } else{
                tmp.push(productId)
                const response = await databaseService.updateWishlist(userData.$id,tmp);
                dispatch(addProductsToWishlist(JSON.parse(response.products)))
            }

        } catch (error) {
            console.log(error);
        }
    }

  useEffect(() => {
    getProductDetails();
  }, [])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <Link href="#" className="shrink-0 md:order-1">
          <img
            className="h-20 dark:hidden"
            src={image}
            alt="imac image"
          />

        </Link>
        <label htmlFor="counter-input" className="sr-only">
          Choose quantity:
        </label>
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button
              onClick={decrementHandler}
              type="button"
              id="decrement-button"
              data-input-counter-decrement="counter-input"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            > {
                quantity == 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                ) : (
                  <svg
                    className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1 1h16"
                    />
                  </svg>
                )
              }
            </button>
            <p className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white">
              {quantity}
            </p>
            <button
              onClick={incrementHandler}
              type="button"
              id="increment-button"
              data-input-counter-increment="counter-input"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            >
              <svg
                className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </button>
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              ${productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price}
            </p>
          </div>
        </div>
        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <Link
            href="#"
            className="text-base font-medium text-gray-900 hover:underline dark:text-white"
          >
            {productDetails.title}
          </Link>
          <div className="flex items-center gap-4 mt-1.5">
            <button
            onClick={moveToWishlist}
              type="button"
              className=" cursor-pointer inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="me-1.5 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                />
              </svg>
              Move to Favorites
            </button>
            <button
            onClick={deleteHandler}
              type="button"
              className="cursor-pointer inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="me-1.5 h-5 w-5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProductCard