import React from 'react'
import img from "../../assets/account.jpg"
import { Address, CartProductCard } from '@/components'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'

import { useNavigate } from 'react-router'
import databaseService from '@/appwrite/config'
import { toast } from 'sonner'


function ShoppingCheckout() {
  const navigate = useNavigate()

  const { cartItems } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.auth)
  const { addressList } = useSelector(state => state.address)
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

  const order = {
    "userId": userData.$id,
    "cartItems": cartItems,
    "addressInfo": addressList[0]?.address,
    "orderStatus": "pending",
    "paymentMethod": "stripe",
    "paymentStatus": "pending",
    "totalAmount": totalCartAmount,
    "orderDate": new Date().toISOString(),
    "orderUpdateDate": new Date().toISOString(),
    "successUrl": "http://localhost:5173/success",
    "failureUrl": "http://localhost:5173/cancel"
  };

  const handleCheckout = async () => {
    if(addressList && addressList.length >= 1){
    try {
      const data = await databaseService.createStripeOrder(order);
      if (data) {
        console.log(data);
      }
      console.log(order);
      
    } catch (error) {
      console.log(error);
    }
  } else{
    toast.error("Please add a address to continue",{
      richColors:true,
      position: 'top-center'
    })
  }
  };

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
              onClick={handleCheckout}
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