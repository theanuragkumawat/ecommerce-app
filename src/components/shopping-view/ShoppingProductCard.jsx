import databaseService from '@/appwrite/config';
import { Heart, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';


function ShoppingProductCard({ product }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userData, isAuthenticated } = useSelector(state => state.auth)
    const cartItems = useSelector(state => state.cart.cartItems)
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)

    const [imageURL, setImageURL] = useState("i")

    async function getImage() {
        const url = await databaseService.getFilePreview(product.image)
        setImageURL(url);
    }

    useEffect(() => {
        getImage()
    }, [])

    async function handleGetProductDetails($id) {
        navigate(`/product/${$id}`)
    }

    async function addToCartHandler(e) {
        e.stopPropagation();
        try {
            if (userData) {
                let temp = cartItems.slice()
                if (temp.length > 0) {
                    const existing = temp.find(
                        (i) => i.productId === product.$id
                    );
                    if (existing) {
                        temp = temp.map(item => item.productId == existing.productId ? { ...item, quantity: item.quantity + 1 } : item)
                        const data = await databaseService.updateCart(userData.$id, temp);
                        if (data) {
                            toast("Product added to cart")
                            dispatch(addProductsToCart(JSON.parse(data.products)))
                        }
                    } else {
                        temp.push({ productId: product.$id, quantity: 1, price: product.price });
                        const data = await databaseService.updateCart(userData.$id, temp);
                        if (data) {
                            dispatch(addProductsToCart(JSON.parse(data.products)))
                            toast("Product added to cart")
                        }
                    }
                } else {
                    let productArr = [
                        { productId: product.$id, quantity: 1, price: product.price }
                    ]
                    const response = await databaseService.createCart(userData.$id, productArr);
                    if (response) {
                        let cart = JSON.parse(response.products)
                        dispatch(addProductsToCart(cart))

                        toast("Product added to cart")
                    }
                }
            } else {
                //for local storage
                if (cartItems.length > 0) {
                    let temp = cartItems.slice()
                    const existing = temp.find((i) => i.productId === product.$id)
                    if (existing) {
                        console.log(existing);

                        temp = temp.map(item => item.productId == product.$id ? { ...item, quantity: item.quantity + 1 } : item)
                        localStorage.setItem("cart", JSON.stringify(temp))
                        dispatch(addProductsToCart(temp))
                    } else {
                        temp.push({ productId: product.$id, quantity: 1, price: product.price });
                        localStorage.setItem("cart", JSON.stringify(temp))
                        dispatch(addProductsToCart(temp))
                    }


                } else {
                    let productArr = [
                        { productId: product.$id, quantity: 1, price: product.price }
                    ]
                    localStorage.setItem("cart", JSON.stringify(productArr))
                    dispatch(addProductsToCart(productArr))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function addToWishlistHandler(e) {
        e.stopPropagation()
        if (!isAuthenticated) {
            toast.error("Please login for wishlisting a product")
        }
        try {
            let temp = wishlistItems.slice()
            if (temp.length > 0) {
                const existing = temp.find((i) => (i == product.$id));
                if (existing) {
                    temp = temp.filter(item => item != product.$id)
                    if (temp.length == 0) {
                        const response = await databaseService.deleteWishlist(userData.$id);
                        dispatch(addProductsToWishlist([]))
                        console.log(response, "wishlist deleted");

                    } else {

                        const data = await databaseService.updateWishlist(userData.$id, temp);
                        if (data) {
                            dispatch(addProductsToWishlist(JSON.parse(data.products)))
                            toast("Product removed from Wishlist")
                        }
                    }

                } else {
                    temp.push(product.$id);
                    const data = await databaseService.updateWishlist(userData.$id, temp);
                    if (data) {
                        dispatch(addProductsToWishlist(JSON.parse(data.products)))
                        toast("Product added to Wishlist")
                    }
                }
            } else {

                let productArr = [product.$id]
                if (userData) {
                    const data = await databaseService.createWishlist(userData.$id, productArr);
                    if (data) {
                        dispatch(addProductsToWishlist(JSON.parse(data.products)))
                        toast("Product added to Wishlist")
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div
                onClick={() => handleGetProductDetails(product.$id)}
                className="relative rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
                    <Link>
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            src={imageURL}
                            alt={product.title}
                        />
                    </Link>
                    {/* Wishlist Button - Positioned on top of the image */}
                    <button
                        onClick={addToWishlistHandler}
                        type="button"
                        data-tooltip-target="tooltip-add-to-favorites"
                        className="absolute top-3 right-3 rounded-full p-2 text-gray-300 bg-white/70 backdrop-blur-sm hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        aria-label="Add to Favorites"
                    >
                        <Heart color="currentColor" fill="currentColor" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-5">
                    {/* Product Title */}
                    <Link
                        className="block max-w-96 text-xl font-bold leading-tight text-gray-900 hover:underline truncate"
                    >
                        {product.title}
                    </Link>


                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                            <div className=" flex items-center gap-1">
                                {
                                    (product && product.averageReview) ?
                                        [1, 2, 3, 4, 5].map((currentRating) => {
                                            return (
                                                <span key={currentRating} className={`${currentRating <= product.averageReview ? "text-amber-300" : "text-gray-300"}`} >
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
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {product.averageReview}
                        </p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {product.totalReview ? `(${product.totalReview + " Reviews"})` : ""}
                        </p>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-start gap-2">
                        <p
                            className={`${product.salePrice > 0
                                ? 'line-through text-xl text-gray-500 font-semibold'
                                : 'text-2xl text-gray-900 font-extrabold'
                                } leading-tight dark:text-white`}
                        >
                            ${product.price}
                        </p>
                        {product.salePrice > 0 && (
                            <p className="text-2xl text-neutral-900 font-extrabold leading-tight dark:text-neutral-900">
                                ${product.salePrice}
                            </p>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="justify-center flex mt-4">
                        <button
                            onClick={addToCartHandler}
                            type="button"
                            className="cursor-pointer flex w-full items-center justify-center rounded-lg bg-gray-900 border border-gray-900 transition-all duration-200 px-1 py-2 text-base font-medium text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            <svg
                                className="-ms-2 me-2 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                />
                            </svg>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShoppingProductCard