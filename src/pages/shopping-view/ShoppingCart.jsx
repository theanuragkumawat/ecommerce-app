import databaseService from '@/appwrite/config'
import { CartProductCard } from '@/components'
import { Button } from '@/components/ui/button'
import { getTotalAmount } from '@/store/shop/cart-slice'
import { MoveRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

function ShoppingCart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currency } = useSelector(state => state.shopProducts)
  const { isAuthenticated } = useSelector(state => state.auth)
  const { cartItems, totalAmount, discountAmount } = useSelector(state => state.cart);
  const [discountInput, setDiscountInput] = useState('')

  async function handleDiscount(e) {
    e.preventDefault()
    if(discountInput == ""){
      return
    }
    try {
      const exist =  await databaseService.getCoupon(discountInput)
      if(exist && exist.documents.length > 0){
        // console.log(exist);
        dispatch(getTotalAmount(exist.documents[0]))
        
      } else{
        toast.error('Invalid coupon')
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // console.log("this is the end", cartItems);
      dispatch(getTotalAmount())
    }
  }, [cartItems])

  function proceedToCheckout(){
    if(isAuthenticated){
      navigate('/checkout')
    } else{
      toast.error('Please login to proceed')
    }
  }

  return (
    <section className={`${cartItems?.length > 0 ? "mb-20" : "md:mb-96"} bg-white py-8 antialiased dark:bg-gray-900 md:py-16`}>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>
        <div className="mt-6 sm:mt-0 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className=" w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {/* map */}
              {
                cartItems.length > 0 ? (
                  <div className='sm:mt-6'>
                    {
                      cartItems?.map(item => {
                        return (
                          <CartProductCard
                            className={'mt-2'}
                            key={item.productId}
                            productId={item.productId}
                            quantity={item.quantity}
                          />
                        )
                      })
                    }
                  </div>
                ) : <h1 className='mt-4'>No products in your cart</h1>
              }

            </div>

          </div>
          {
            cartItems && cartItems.length > 0 &&
          
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Order summary
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Original price
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {currency}{totalAmount}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Discount
                    </dt>
                    <dd className="text-base font-medium text-green-600">
                      -{currency}{discountAmount}
                    </dd>
                  </dl>


                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    {currency}{totalAmount}
                  </dd>
                </dl>
              </div>
              <Button
                onClick={proceedToCheckout}
                className="flex w-full items-center justify-center rounded-lg bg-gray-900 border border-gray-900 transition duration-150 px-5 py-2.5 text-sm font-medium text-white  hover:text-gray-900 hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary-300 "
              >
                Proceed to Checkout
              </Button>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  or
                </span>
                <Link
                  to="/listing"
                  title=""
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                >
                  Continue Shopping
                  <MoveRight/>
                </Link>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="voucher"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Do you have a voucher or gift card?
                  </label>
                  <input
                    onChange={(e) => setDiscountInput(e.target.value)}
                    value={discountInput}
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  />
                </div>
                <Button

                  onClick={handleDiscount}

                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-gray-900 border border-gray-900 transition duration-150 px-5 py-2.5 text-sm font-medium text-white  hover:text-gray-900 hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Apply Code
                </Button>
              </form>
            </div>
          </div>
          }
        </div>
      </div>
    </section>

  )
}

export default ShoppingCart