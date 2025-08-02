import databaseService from '@/appwrite/config';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';
import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'sonner';

function WishlistProductCard({ productId }) {

    const dispatch = useDispatch()
    const [productDetails, setProductDetails] = useState(false);
    const [image, setimage] = useState(null)
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const { cartItems } = useSelector(state => state.cart)
    const userData = useSelector(state => state.auth.userData)
    const {currency} = useSelector(state => state.shopProducts)
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
            if (temp.length == 0) {
                const response = await databaseService.deleteWishlist(userData.$id);
                dispatch(addProductsToWishlist([]))
                toast("deleted")
            } else{
                const data = await databaseService.updateWishlist(userData.$id, temp);
                dispatch(addProductsToWishlist(JSON.parse(data.products)))
                toast("deleted")
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function moveToCart() {
        try {
            let temp = wishlistItems.slice()
            temp = temp.filter(item => item != productId)

            if (temp.length == 0) {
                const response = await databaseService.deleteWishlist(userData.$id);
                dispatch(addProductsToWishlist([]))

            } else{
                const data = await databaseService.updateWishlist(userData.$id, temp);
                dispatch(addProductsToWishlist(JSON.parse(data.products)));
            }


            let tmp = cartItems.slice()
            const existing = tmp.find(item => item.productId == productId)
            if (existing) {
                return;
            } else {
                tmp.push({ productId: productId, quantity: 1 })
                const response = await databaseService.updateCart(userData.$id, tmp);
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
            <div className="rounded-lg border border-gray-200 bg-white md:py-2 md:px-1 md:pr-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">

                    {/* IMAGE */}
                    <Link className="shrink-0 md:order-1">
                        <img
                            className="h-32 dark:hidden rounded-md"
                            src={image}
                        />
                    </Link>

                    {/* RIGHT SIDE CONTENT */}
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">

                        {/* Title */}
                        <Link
                        to={`/product/${productId}`}
                          
                            className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >
                            {productDetails.title}
                        </Link>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-0.5">
                                 {
                                    (productDetails && productDetails.averageReview) ?
                                        [1, 2, 3, 4, 5].map((currentRating) => {
                                            return (
                                                <span key={currentRating} className={`${currentRating <= productDetails.averageReview ? "text-amber-300" : "text-gray-300"}`} >
                                                    <Star size={16} fill='currentColor' />
                                                </span>
                                            )
                                        }) : <>

                                            <span className={`text-gray-300`} >
                                                <Star size={16} fill='currentColor' />
                                            </span>
                                            <span className={`text-gray-300`} >
                                                <Star size={16} fill='currentColor' />
                                            </span>
                                            <span className={`text-gray-300`} >
                                                <Star size={16} fill='currentColor' />
                                            </span>
                                            <span className={`text-gray-300`} >
                                                <Star size={16} fill='currentColor' />
                                            </span>
                                            <span className={`text-gray-300`} >
                                                <Star size={16} fill='currentColor' />
                                            </span>
                                        </>
                                }
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {productDetails?.averageReview ? productDetails.averageReview.toFixed(1) : "No Reviews"}
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
                            {currency}{productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishlistProductCard