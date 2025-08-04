import React, { useState } from 'react'
import img from "../../assets/account.jpg"
import { Address, CartProductCard } from '@/components'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'

import { useNavigate } from 'react-router'
import databaseService from '@/appwrite/config'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'


function ShoppingCheckout() {
  const navigate = useNavigate()

  const { cartItems,totalAmount } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.auth)
  const { addressList } = useSelector(state => state.address)
  const { currency } = useSelector(state => state.shopProducts)
  const [isDisabled, setIsDisabled] = useState(false)

  // const totalCartAmount =
  //   cartItems && cartItems.length > 0
  //     ? cartItems.reduce(
  //       (sum, currentItem) =>
  //         sum +
  //         (currentItem?.price) *
  //         currentItem?.quantity,
  //       0
  //     )
  //     : 0;

  const order = {
    "userId": userData.$id,
    "cartItems": cartItems,
    "addressInfo": addressList[0]?.address,
    "orderStatus": "pending",
    "paymentMethod": "stripe",
    "paymentStatus": "pending",
    "totalAmount": totalAmount,
    "orderDate": new Date().toISOString(),
    "orderUpdateDate": new Date().toISOString(),
    "successUrl": "https://ecommerce-app-lilac-three.vercel.app/success",
    "failureUrl": "https://ecommerce-app-lilac-three.vercel.app/cancel",
    // "successUrl": "http://localhost:5173/success",
    // "failureUrl": "http://localhost:5173/cancel",
  };

  const handleCheckout = async () => {
    if (cartItems.length != 0) {
      
      if (addressList && addressList.length >= 1) {
        if (addressList.find(item => item.isDefault)) {
          
          try {
            setIsDisabled(true)
            const data = await databaseService.createStripeOrder(order);
            if (data) {
              // console.log(data);
            }
            // console.log(order);

          } catch (error) {
            console.log(error);
            setIsDisabled(false)
          }
        } else {
          toast.error("Please select a address to continue", {
            richColors: true,
            position: 'top-center'
          })
        }
      } else {
        toast.error("Please add a address to continue", {
          richColors: true,
          position: 'top-center'
        })

      }
    } else {
      toast.error("You don't have any product in your cart", {
        richColors: true,
        position: 'top-center'
      })
    }

  };
  return (
    <div className='flex flex-col'>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 p-5">
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
              {currency}{totalAmount}
            </dd>
          </dl>
          <div className='w-full px-4'>

            <Button
              disabled={isDisabled}
              onClick={handleCheckout}
              className={'w-full'}
            >
             {
              isDisabled ? <>Processing <LoaderCircle className='mr-3 size-6 animate-spin' /> </> : "Checkout"
             } 
            </Button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default ShoppingCheckout