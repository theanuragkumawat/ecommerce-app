const conf = {
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteCartCollectionId: String(import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID),
    appwriteWishlistCollectionId: String(import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID),
    appwriteAddressCollectionId: String(import.meta.env.VITE_APPWRITE_ADDRESS_COLLECTION_ID),
    appwriteOrderCollectionId: String(import.meta.env.VITE_APPWRITE_ORDER_COLLECTION_ID),
    appwriteReviewCollectionId: String(import.meta.env.VITE_APPWRITE_REVIEW_COLLECTION_ID),
    appwriteCouponCollectionId: String(import.meta.env.VITE_APPWRITE_COUPON_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    
}

export default conf