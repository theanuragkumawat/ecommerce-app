import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import databaseService from '@/appwrite/config';
import { Link } from 'react-router';
import { useSelector, useDispatch} from 'react-redux';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';
import { toast } from 'sonner';

function ShoppingProductOverview() {

    const { productId } = useParams()
    const [image, setImage] = useState("i")
    const [productData, setProductData] = useState(false);
    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.auth)
    const {cartItems} = useSelector(state => state.cart)
    const {wishlistItems} = useSelector(state => state.wishlist)
    console.log("HJer",wishlistItems);
    
    async function getProductDetails() {
        const data = await databaseService.getProduct(productId)
        if (data) {
            setProductData(data)
            const url = await databaseService.getFilePreview(data.image)
            setImage(url)
        }
    }
    useEffect(() => {
        getProductDetails()
    }, [])
    async function addToCartHandler(e) {
        e.stopPropagation();
        try {
            if (userData) {
                let temp = cartItems.slice()
                if (temp.length > 0) {
                    const existing = temp.find(
                        (i) => i.productId === productData.$id
                    );
                    if (existing) {
                        temp = temp.map(item => item.productId == existing.productId ? { ...item, quantity: item.quantity + 1 } : item)
                        const data = await databaseService.updateCart(userData.$id, temp);
                        if (data) {
                            toast("Product added to cart")
                            dispatch(addProductsToCart(JSON.parse(data.products)))
                        }
                    } else {
                        temp.push({ productId: productData.$id, quantity: 1 });
                        const data = await databaseService.updateCart(userData.$id, temp);
                        if (data) {
                            dispatch(addProductsToCart(JSON.parse(data.products)))
                        }
                    }
                } else {
                    let productArr = [
                        { productId: productData.$id, quantity: 1 }
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
                const existing = temp.find((i) => (i == productData.$id));
                if (existing) {
                    temp = temp.filter(item => item != productData.$id)
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
                    temp.push(productData.$id);
                    const data = await databaseService.updateWishlist(userData.$id, temp);
                    if (data) {
                        dispatch(addProductsToWishlist(JSON.parse(data.products)))
                        toast("Product added to Wishlist")
                    }
                }
            } else {

                let productArr = [productData.$id]
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
    return productData ? (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <img
                            className="w-3/4 mx-auto border-2 dark:hidden"
                            src={image}
                            alt=""
                        />

                    </div>
                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            {productData.title}
                        </h1>
                        <div className="mt-4 sm:items-center sm:gap-1 sm:flex">
                            <p className={`${productData.salePrice > 0 ? "text-2xl line-through text-gray-500 font-semibold" : "text-2xl sm:text-3xl font-extrabold text-gray-900"}   dark:text-white`}>
                                ${productData.price}
                            </p>
                            {
                                productData.salePrice > 0 ? <p className={`text-3xl text-gray-900 font-extrabold leading-tight  dark:text-white`}>
                                    ${productData.salePrice}
                                </p> : null
                            }
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <div className="mx-2 flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4 text-yellow-300"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                    </svg>
                                    <svg
                                        className="w-4 h-4 text-yellow-300"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                    </svg>
                                    <svg
                                        className="w-4 h-4 text-yellow-300"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                    </svg>
                                    <svg
                                        className="w-4 h-4 text-yellow-300"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                    </svg>
                                    <svg
                                        className="w-4 h-4 text-yellow-300"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                                    (5.0)
                                </p>
                                <a
                                    href="#"
                                    className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                                >
                                    345 Reviews
                                </a>
                            </div>
                        </div>
                        <div className="mt-6 sm:gap-3 sm:items-center sm:flex sm:mt-8">
                            <Link
                            onClick={addToWishlistHandler}
                                href="#"
                                title=""
                                className="transition duration-150 flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-700 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                role="button"
                            >
                                <svg
                                    className="w-5 h-5 -ms-2 me-2"
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
                                        d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                    />
                                </svg>
                                Add to favorites
                            </Link>
                            <Link
                            onClick={addToCartHandler}
                                href="#"
                                title=""
                                className="transition duration-150 flex items-center justify-center py-2.5 px-5 text-sm font-medium bg-gray-900 text-white hover:bg-primary-800 focus:outline-none rounded-lg border border-gray-700 hover:bg-white hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                role="button"
                            >
                                <svg

                                    className="w-5 h-5 -ms-2 me-2"
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
                            </Link>
                        </div>
                        <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            {productData.description}
                        </p>

                    </div>
                </div>
            </div>
        </section>

    ) : null
}

export default ShoppingProductOverview