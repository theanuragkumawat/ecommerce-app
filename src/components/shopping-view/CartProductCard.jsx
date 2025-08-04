import databaseService from '@/appwrite/config';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { data, Link } from 'react-router'
import { addProductsToCart, getTotalAmount } from '@/store/shop/cart-slice';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';
import { toast } from 'sonner';
import { Heart, Minus, Plus, Trash } from 'lucide-react';

function CartProductCard({ productId, quantity, className = "" }) {
  const [image, setImage] = useState('i')
  const { cartItems } = useSelector(state => state.cart)
  const { currency } = useSelector(state => state.shopProducts)
  const { wishlistItems } = useSelector(state => state.wishlist)
  const { userData, isAuthenticated } = useSelector(state => state.auth)
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

    if (!isAuthenticated) {
      let temp = cartItems.slice();
      temp = temp.map(item => item.productId == productId ? { ...item, quantity: item.quantity + 1 } : item)
      localStorage.setItem("cart", JSON.stringify(temp))
      dispatch(addProductsToCart(temp))
      return;
    }

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

    if (!isAuthenticated) {

      if (quantity > 1) {
        temp = temp.map(item => item.productId == productId ? { ...item, quantity: item.quantity - 1 } : item)
        localStorage.setItem("cart", JSON.stringify(temp))
        dispatch(addProductsToCart(temp))
      } else if (quantity == 1) {
        temp = temp.filter(item => item.productId != productId);
        if (temp.length == 0) {
          localStorage.removeItem('cart');
          dispatch(addProductsToCart([]))
        } else {
          localStorage.setItem("cart", JSON.stringify(temp))
          dispatch(addProductsToCart(temp))
        }

      }

      return;
    }

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
        temp = temp.filter(item => item.productId != productId);
        if (temp.length == 0) {
          const data = await databaseService.deleteCart(userData.$id);
          toast('deleted')
          dispatch(addProductsToCart([]));
          dispatch(getTotalAmount())
        } else {

          const data = await databaseService.updateCart(userData.$id, temp);
          if (data) {
            dispatch(addProductsToCart(JSON.parse(data.products)))
          }
        }
      } catch (error) {
        console.log("Error while decrement quantity" + error);
      }
    }
  }

  async function deleteHandler() {
    if (!isAuthenticated) {
      let temp = cartItems.slice();
      temp = temp.filter(item => item.productId != productId);
      if (temp.length == 0) {
        localStorage.removeItem('cart');
        dispatch(addProductsToCart([]));
      } else {
        localStorage.setItem("cart", JSON.stringify(temp))
        dispatch(addProductsToCart(temp))
      }
      return
    }
    try {
      let temp = cartItems.slice();
      temp = temp.filter(item => item.productId != productId);
      if (temp.length == 0) {
        const data = await databaseService.deleteCart(userData.$id);

        dispatch(addProductsToCart([]));


      } else {
        const data = await databaseService.updateCart(userData.$id, temp);
        if (data) {

          dispatch(addProductsToCart(JSON.parse(data.products)))
        }
      }
    } catch (error) {
      console.log("Error while delete quantity" + error)
    }
  }

  async function moveToWishlist() {
    try {
      if (!isAuthenticated) {
        toast.error("Please login for wishlisting a product")
        return;
      }
      let temp = cartItems.slice()
      temp = temp.filter(item => item.productId != productId)
      if (temp.length == 0) {
        const response = await databaseService.deleteCart(userData.$id);
        dispatch(addProductsToCart([]));
      } else {
        const data = await databaseService.updateCart(userData.$id, temp);
        dispatch(addProductsToCart(JSON.parse(data.products)));
      }

      let tmp = wishlistItems.slice()
      const existing = tmp.find(item => item == productId)
      if (existing) {
        return;
      } else {
        tmp.push(productId);
        if (wishlistItems.length > 0) {
          const response = await databaseService.updateWishlist(userData.$id, tmp);
          dispatch(addProductsToWishlist(JSON.parse(response.products)));
        } else {
          const response = await databaseService.createWishlist(userData.$id, tmp);
          dispatch(addProductsToWishlist(JSON.parse(response.products)));
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProductDetails();
  }, [])

  return (
    <div className={`${className} rounded-lg border border-gray-200 bg-white p-1.5 sm:p-1 md:p-4 relative shadow-s`}>
      <div className="flex justify-between sm:justify-start items-center gap-7 sm:gap-4 ">
        <Link className="shrink-0">
          <img
            className="sm:h-28 h-20 dark:hidden rounded-md"
            src={image}
          />

        </Link>
        <div className='sm:w-full pr-5  mr-auto'>
          <div className="flex sm:flex-row justify-between flex-col ">
            <Link
              to={`/product/${productId}`}
              className="text-base sm:text-lg mb-2 sm:mb-0 font-medium text-gray-900 hover:underline dark:text-white"
            >
              {productDetails.title}
            </Link>
            <div className='sm:absolute sm:bottom-1/2 sm:translate-y-1/2 sm:right-0  flex gap-3 sm:gap-5 md:gap-7 lg:gap-9'>
              <div className='flex flex-row mb-1'>
                <button
                  onClick={decrementHandler}
                  type="button"
                  id="decrement-button"
                  data-input-counter-decrement="counter-input"
                  className="inline-flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                > {
                    quantity == 1 ? (
                      <Trash />
                    ) : (
                      <Minus className='w-3 h-3' />
                    )
                  }
                </button>
                <p className="w-5 leading-4 sm:leading-5 sm:w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white">
                  {quantity}
                </p>
                <button
                  onClick={incrementHandler}
                  type="button"
                  id="increment-button"
                  data-input-counter-increment="counter-input"
                  className="inline-flex  h-4 w-4 sm:h-5 sm:w-5  shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                >
                  <Plus className='w-3 h-3' />
                </button>
              </div>
              <p className="pr-4 sm:w-16 leading-4 sm:leading-5 text-md font-bold text-gray-900 dark:text-white">
                {currency}{productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price}
              </p>
            </div>
          </div>
          <div className="">

            <div className="flex items-center gap-2 sm:gap-4 mt-1.5">
              <button
                onClick={moveToWishlist}
                type="button"
                className="cursor-pointer inline-flex items-center text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
              >
                <Heart className='w-4 h-4 md:mr-1' />
                Move to Favorites
              </button>
              <button
                onClick={deleteHandler}
                type="button"
                className="cursor-pointer inline-flex items-center text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-500"
              >
                <Trash className='w-4 h-4 md:mr-1' />
                Remove
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CartProductCard