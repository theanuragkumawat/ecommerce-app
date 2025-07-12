import databaseService from '@/appwrite/config';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

function WishlistProductCard({ productId }) {

    const dispatch = useDispatch()
    const [productDetails, setProductDetails] = useState(false);
    const [image, setimage] = useState(null)
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const {cartItems} = useSelector(state => state.cart)
    const userData = useSelector(state => state.auth.userData)
    async function getProductDetails() {
        try {
            const data = await databaseService.getProduct(productId);
            if (data) {
                setProductDetails(data)
                const image = await databaseService.getFilePreview(data.image);
                setimage(image.href)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function removeProduct() {
        try {
            let temp = wishlistItems.slice()
            temp = temp.filter(item => item != productId)
            const data = await databaseService.updateWishlist(userData.$id, temp);
            dispatch(addProductsToWishlist(JSON.parse(data.products)))

            toast("deleted")
        } catch (error) {
            console.log(error);
        }
    }

    async function moveToCart() {
        try {
            let temp = wishlistItems.slice()
            temp = temp.filter(item => item != productId)
            const data = await databaseService.updateWishlist(userData.$id, temp);
            dispatch(addProductsToWishlist(JSON.parse(data.products)))

            let tmp = cartItems.slice()
            const existing = tmp.find(item => item.productId == productId)
            if(existing){
                return;
            } else{
                tmp.push({productId: productId,quantity:1})
                const response = await databaseService.updateCart(userData.$id,tmp);
                dispatch(addProductsToCart(JSON.parse(response.products)))
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProductDetails()
    }, [])
    return (
        <div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">

                    {/* IMAGE */}
                    <a href="#" className="shrink-0 md:order-1">
                        <img
                            className="h-20 dark:hidden"
                            src={image}
                            alt="Wishlist product image"
                        />
                    </a>

                    {/* RIGHT SIDE CONTENT */}
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">

                        {/* Title */}
                        <a
                            href="#"
                            className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >
                            {productDetails.title}
                        </a>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`h-4 w-4 text-yellow-400`}
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                4.5
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={moveToCart}
                                type="button"
                                className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                            >
                                <svg
                                    className="me-1.5 h-5 w-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={15}
                                    height={15}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                                    />
                                </svg>
                                Move to Cart
                            </button>

                            <button
                                onClick={removeProduct}
                                type="button"
                                className="cursor-pointer inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="me-1.5 h-5 w-5"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6">
                                    </polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                    <line x1="10" y1="11" x2="10" y2="17">
                                    </line>
                                    <line x1="14" y1="11" x2="14" y2="17">

                                    </line>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* PRICE */}
                    <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                            ${productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishlistProductCard