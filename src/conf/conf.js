const conf = {
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteCartCollectionId: String(import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID),
    appwriteWishlistCollectionId: String(import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    
}

export default conf