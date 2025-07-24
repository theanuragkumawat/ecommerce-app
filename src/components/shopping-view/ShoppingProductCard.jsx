import databaseService from '@/appwrite/config';
import { Heart, Import } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';


function ShoppingProductCard({ product }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const cartItems = useSelector(state => state.cart.cartItems)
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)

    const [imageURL, setImageURL] = useState("image")

    async function getImage() {
        const url = await databaseService.getFilePreview(product.image)
        setImageURL(url);
    }

    useEffect(() => {
        getImage()
    }, [])

    async function handleGetProductDetails($id){
            // console.log(id);
           
            navigate(`/shop/product/${$id}`)
            
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
                        temp.push({ productId: product.$id, quantity: 1 });
                        const data = await databaseService.updateCart(userData.$id, temp);
                        if (data) {
                            dispatch(addProductsToCart(JSON.parse(data.products)))
                            toast("Product added to cart")
                        }
                    }
                } else {
                    let productArr = [
                        { productId: product.$id, quantity: 1 }
                    ]
                    const response = await databaseService.createCart(userData.$id, productArr);
                    if (response) {
                        let cart = JSON.parse(response.products)
                        dispatch(addProductsToCart(cart))

                        toast("Product added to cart")
                    }
                }
            } else {
                toast("Please log in to add products to cart!")
                console.log("Please log in to add products to cart");
            }
        } catch (error) {
            console.log(error);
        } 
    }

    async function addToWishlistHandler(e) {
        e.stopPropagation()
        try {
            let temp = wishlistItems.slice()
            if (temp.length > 0) {
                const existing = temp.find((i) => (i == product.$id));
                if (existing) {
                    temp = temp.filter(item => item != product.$id)
                    if(temp.length == 0){
                        const response = await databaseService.deleteWishlist(userData.$id);
                        dispatch(addProductsToWishlist([]))
                        console.log(response,"wishlist deleted");
                        
                    } else{

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
                className="rounded-lg border border-gray-200 bg-white pb-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="h-56 w-full">
                    <Link >
                        <img
                            className="w-full h-[270px] object-cover rounded-t-lg "
                            src={imageURL}
                            alt={product.title}
                        />

                    </Link>
                </div>
                <div className="pt-5 px-5">
                    <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="flex items-center justify-end gap-1">
                            <button
                                onClick={addToWishlistHandler}
                                type="button"
                                data-tooltip-target="tooltip-add-to-favorites"
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <span className="sr-only"> Add to Favorites </span>
                                <svg
                                    className="h-6 w-6 overflow-hidden"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"  // <- fill color added
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="#121829" // <- stroke color also changed to red
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Link
                        className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                    >
                        {product.title}
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                            <svg
                                className="h-4 w-4 text-yellow-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                            <svg
                                className="h-4 w-4 text-yellow-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                            <svg
                                className="h-4 w-4 text-yellow-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                            <svg
                                className="h-4 w-4 text-yellow-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                            <svg
                                className="h-4 w-4 text-yellow-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            5.0
                        </p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            (455)
                        </p>
                    </div>
                    <ul className="mt-2 flex items-center gap-4">

                    </ul>
                    <div className="mt-0 flex items-center justify-start gap-1">
                        <p className={`${product.salePrice > 0 ? "line-through text-xl text-gray-500 font-semibold" : "text-2xl text-gray-900 font-extrabold "}  leading-tight  dark:text-white`}>
                            ${product.price}
                        </p>
                        {
                            product.salePrice > 0 ? <p className={`text-2xl text-gray-900 font-extrabold leading-tight  dark:text-white`}>
                                ${product.salePrice}
                            </p> : null
                        }


                    </div>
                    <div className='justify-center flex'>

                        <button
                            onClick={addToCartHandler}
                            type="button"
                            className="cursor-pointer mt-2 flex w-full items-center justify-center rounded-lg bg-gray-900 border border-gray-900 transition duration-150 px-5 py-2.5 text-sm font-medium text-white  hover:text-gray-900 hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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