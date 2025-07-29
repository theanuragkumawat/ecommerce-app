import React from 'react'
import img from "../../assets/account.jpg"
import { Address, CartProductCard } from '@/components'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'

import { useNavigate } from 'react-router'


function ShoppingCheckout() {
  const navigate = useNavigate()

  const { cartItems } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.auth)
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  async function createCheckout() {


  }


  return (
    <div className='flex flex-col'>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address className={''} />
        <div className="flex flex-col gap-4">
          {
            cartItems?.length > 0 ?
              cartItems.map(item => (
                <CartProductCard
                  className={'mb-2'}
                  key={item.productId}
                  productId={item.productId}
                  quantity={item.quantity}
                />
              )) : <h1>"no products in cart"</h1>
          }
          <dl className="p-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt className="text-base font-bold text-gray-900 dark:text-white">
              Total
            </dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">
              ${totalCartAmount}
            </dd>
          </dl>
          <div className='w-full px-4'>

            <Button
              onClick={createCheckout}
              className={'w-full'}
            >
              Checkout
            </Button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default ShoppingCheckout