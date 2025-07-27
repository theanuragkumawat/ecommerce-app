import React from 'react'
import img from "../../assets/account.jpg"
import { Address, CartProductCard } from '@/components'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'

function ShoppingCheckout() {

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

  const handleCheckout = async () => {
    const cartItems = [
      { title: "Book", price: 10, quantity: 2 },
      { title: "Headphones", price: 25, quantity: 1 },
    ];
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const userId = userData.$id; // Replace with real Appwrite user ID if needed

    const res = await fetch("https://cloud.appwrite.io/v1/functions/68865f84000611f68271/executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": "67b8188800367c64a091",
        "X-Appwrite-Key": "standard_bbf66e755b3fa9b2d3b57bf66634473b7b2dbc5f9870c9d5884d650a14c9dff0ba82a86f51d04bceed9ed3b2608b1c2eb3cc874596bebcdc98485b3cc1b2358c5115877f367f06caf5c1405376efcdbacce6151e0c359f22ccdcf7af3bde44f8118728cf02689a36b8ade668795bfca654e2c2f8e559823e4d6046e7d3c52df7", // You can also use Appwrite session token if logged-in
      },
      body: JSON.stringify({ cartItems, totalAmount, userId }),
    });

    const data = await res.json();
    if (data?.response) {
      const { url } = JSON.parse(data.response);
      if (url) window.location.href = url;
    } else {
      console.error("Stripe checkout failed", data);
    }

  }
  console.log(cartItems);


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
              onClick={makePayment}
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