import React from 'react'
import WishlistProductCard from '@/components/shopping-view/WishlistProductCard'
import { useSelector } from 'react-redux'

function ShoppingWishlist() {

  const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
  console.log(wishlistItems);
  

  return (
    <section className="bg-white pb-8 antialiased dark:bg-gray-900 md:pt-4 md:pb-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              My Wishlist
            </h2>
            <div className="space-y-6">
              
              {
                wishlistItems.length > 0 ?
                wishlistItems?.map(productId => {
                  return(
                    <WishlistProductCard key={productId} productId={productId} />
                  )
                }) : 
                <h1 className='mt-4'>No products in your wishlist</h1>
              }

            </div>
            
          </div>

        </div>
      </div>
    </section>
  )
}

export default ShoppingWishlist