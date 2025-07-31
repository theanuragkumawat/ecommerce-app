import authService from '@/appwrite/auth'
import databaseService from '@/appwrite/config'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { login } from '@/store/auth-slice'
import { addAddress } from '@/store/shop/address-slice'
import { addProductsToCart } from '@/store/shop/cart-slice'
import { addOrdersToState } from '@/store/shop/order-slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'

function Success() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [displayData, setDisplayData] = useState({
  })
  const [orderData, setOrderData] = useState({
    userId: "",
    cartItems: "",
    addressInfo: "",
    orderStatus: "pending",
    paymentMethod: "stripe",
    paymentStatus: "done",
    totalAmount: "",
    orderDate: "",
    orderUpdateDate: ""
  })
  const [tempData, setTempData] = useState({})
  async function createNewOrder() {
      console.log(orderData);
    try {
      const data = await databaseService.createOrder(orderData)
      setDisplayData(data)
      dispatch(addOrdersToState(data))
      setIsLoading(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }
  }

  async function fetchAllDetails() {
    try {
      const data1 = await authService.getCurrentUser();
      if (data1) {
        setTempData({ userInfo: data1 });

        const data2 = await databaseService.getCart(data1.$id);
        if (data2) {
          setTempData((prev) => ({ ...prev, cartInfo: data2 }));

          const data3 = await databaseService.getAddress(data1.$id);
          if (data3) {
            setTempData((prev) => ({ ...prev, addressInfo: data3 }));

            const cartItems = JSON.parse(data2.products)
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
            setOrderData((prev) => ({ ...prev, orderDate: new Date().toLocaleDateString(), orderUpdateDate: new Date().toLocaleDateString(), userId: data1.$id, cartItems: data2.products, addressInfo: data3.documents[0].address, totalAmount: JSON.stringify(totalCartAmount) }))

          }
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (orderData.userId && orderData.cartItems && orderData.addressInfo && orderData.totalAmount && orderData.orderDate && orderData.orderUpdateDate) {
      createNewOrder()
    }
  }, [orderData])

  useEffect(() => {
    fetchAllDetails()
  }, [])

  return (
    !isLoading ?
      (<section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">Thanks for your order!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">Your order <Link className="font-medium text-gray-900 dark:text-white hover:underline">{displayData?.$id}</Link> will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.</p>
          <Card className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Date</dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{displayData?.orderDate}</dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Method</dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{displayData?.paymentMethod}</dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Status</dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{displayData?.paymentStatus}</dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Address</dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{displayData && displayData.addressInfo ? displayData.addressInfo : "No"}</dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Phone</dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">+(123) 456 7890</dd>
            </dl>
          </Card>
          <div className="flex items-center space-x-4">
            <Button>
              Track your order
            </Button>
            <Button>
              Return to shopping
            </Button>
          </div>
        </div>
      </section>) : <div className='h-screen flex items-center justify-center'>
        <h1 className='font-semibold text-center text-neutral-950'>Loading..</h1>
      </div>
  )
}

export default Success