import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import databaseService from '@/appwrite/config';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { addProductsToWishlist } from '@/store/shop/wishlist-slice';
import { toast } from 'sonner';
import { Heart, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RatingInput from '@/components/shopping-view/RatingInput';
import { Button } from '@/components/ui/button';

function ShoppingProductOverview() {

    const { productId } = useParams()
    const [image, setImage] = useState("i")
    const [product, setProduct] = useState(false);
    const dispatch = useDispatch()
    const { userData, isAuthenticated } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const { wishlistItems } = useSelector(state => state.wishlist)
    const { currency } = useSelector(state => state.shopProducts)
    const [allProductsReview, setAllProductsReview] = useState([])
    const [rating, setRating] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const initialReviewData = {
        productId: "",
        userId: "",
        userName: "",
        reviewTitle: "",
        reviewMessage: "",
        reviewValue: 0
    }

    useEffect(() => {
        setIsWishlisted(wishlistItems?.some(item => item == product.$id))
    }, [wishlistItems, product])

    const [reviewsToShow, setReviewsToShow] = useState(2)
    const [reviewData, setReviewData] = useState(initialReviewData)
    async function handleAddReview(e) {
        e.preventDefault()
        if (!isAuthenticated) {
            toast.error("Please login to add your review")
            return;
        }
        if (reviewData.reviewTitle == "" || reviewData.reviewMessage == "") {
            toast.error("Please fill all fields")
            return
        }
        if (rating == 0) {
            toast.error("Please select a rating")
            return
        }
        try {
            const exist = await databaseService.checkUserReview({ userId: userData.$id, productId: productId })
            if (exist.documents.length > 0) {
                toast.warning("You have already added a review")
                // console.log(exist);
                return
            }

            const data = await databaseService.addProductReview(reviewData)
            if (data) {
                setReviewData(initialReviewData)
                toast.success("Your review added successfully")
                setRating(0)
                getProductDetails()
            }
        } catch (error) {
            console.log(error);
        }
    }

    // console.log(product);


    async function getProductDetails() {
        const data = await databaseService.getProduct(productId)
        if (data) {
            setReviewData((prev) => ({ ...prev, productId: productId, userId: userData.$id, userName: userData.name }))
            setProduct(data)
            const url = await databaseService.getFilePreview(data.image)
            setImage(url)
        }

        const productReviews = await databaseService.getProductReviews(productId)
        if (productReviews) {
            setAllProductsReview(productReviews.documents)
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
                        // console.log(existing);

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
                        // console.log(response, "wishlist deleted");

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
    return product ? (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <img
                            className="w-3/4 mx-auto rounded-3xl"
                            src={image}
                        />

                    </div>
                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            {product.title}
                        </h1>
                        <div className="mt-4 sm:items-center sm:gap-1 sm:flex">
                            <p className={`${product.salePrice > 0 ? "text-2xl line-through text-gray-500 font-semibold" : "text-2xl sm:text-3xl font-extrabold text-gray-900"}  dark:text-white`}>
                                {currency}{product.price}
                            </p>
                            {
                                product.salePrice > 0 ? <p className={`text-3xl text-gray-900 font-extrabold leading-tight  dark:text-white`}>
                                    {currency}{product.salePrice}
                                </p> : null
                            }
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <div className="ml-2 flex items-center gap-1">
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
                                <p className="-ml-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    {product?.averageReview?.toFixed(1)}
                                </p>
                                <p
                                    className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white">
                                    {product.totalReview ? `(${product.totalReview + " Reviews"})` : "No Reviews"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 sm:gap-3 sm:items-center sm:flex sm:mt-8">
                            <Link
                                onClick={addToWishlistHandler}
                                title=""
                                className={` transition  duration-150 flex items-center justify-center py-2.5 px-5 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-700 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100`}
                                role="button"
                            >
                                <Heart fill={`${isWishlisted ? "#f02730" : "white"}`} className={`${isWishlisted ? "text-red-500" : ""} w-5 h-5 -ms-2 me-2`} />
                                {/* <Heart fill={`${isWishlisted ? "red" : ""} `} color={`${isWishlisted ? "red" : ""} `}  className={` w-5 h-5 -ms-2 me-2`}/> */}
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
                            {product.description}
                        </p>

                        {/* Reviews Section */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>
                            <div className="space-y-3">
                                {
                                    allProductsReview.length > 0 &&
                                    allProductsReview?.slice(0, reviewsToShow).map((item, index) => {

                                        const date = new Date(item.$createdAt).toLocaleDateString('en-in', { year: 'numeric', month: 'long', day: 'numeric' })
                                        return (
                                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 ">
                                                <div className="flex items-center mb-2">
                                                    <div className="flex items-center gap-1">
                                                        {
                                                            [1, 2, 3, 4, 5].map((currentRating) => (
                                                                <span key={currentRating} className={`${currentRating <= item.reviewValue ? "text-amber-300" : "text-gray-300"}`} >
                                                                    <Star size={16} fill='currentColor' />
                                                                </span>
                                                            ))
                                                        }
                                                    </div>
                                                    <p className="ms-2 text-sm font-medium text-gray-900 dark:text-white">{item.userName}</p>
                                                    <p className="ms-auto text-sm text-gray-500 dark:text-gray-400">{date}</p>

                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.reviewTitle}</h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {item.reviewMessage}
                                                </p>
                                            </div>
                                        )
                                    }
                                    )
                                }
                                {allProductsReview.length > 0 && allProductsReview.length > reviewsToShow && (
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setReviewsToShow(allProductsReview?.length)}
                                            className="-mt-2 px-2"
                                        >
                                            Show more reviews
                                        </Button>
                                    </div>
                                )}
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                                    <div>
                                        <div className="mb-4">
                                            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review Title</label>
                                            <Input
                                                onChange={(e) => setReviewData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                                                value={reviewData.reviewTitle}
                                                name="reviewTitle"
                                                id="review-title"
                                                placeholder="Summarize your experience"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
                                            <Textarea
                                                value={reviewData.reviewMessage}
                                                onChange={(e) => setReviewData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                                                id="review-text"
                                                placeholder="Share your thoughts on the product..."
                                                name="reviewMessage"
                                            >

                                            </Textarea>
                                        </div>
                                        <div className="mb-3">
                                            <RatingInput rating={rating} setRating={setRating} setReviewData={setReviewData} />
                                        </div>


                                        <Button
                                            onClick={handleAddReview}
                                            className="transition duration-150 py-2.5 px-5 text-sm font-medium bg-gray-900 text-white hover:bg-primary-800 focus:outline-none rounded-lg border border-gray-700 hover:bg-white hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                        >
                                            Submit Review
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>

    ) : null
}

export default ShoppingProductOverview