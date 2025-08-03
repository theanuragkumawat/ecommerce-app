import { Client, Databases, Storage, ID, Query, Functions } from "appwrite";
import conf from "@/conf/conf";
// import paypal from "../paypal/paypal.js"  
export class DatabaseService {
  client = new Client();
  databases;
  bucket;
  functions;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) // Your API Endpoint
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
    this.functions = new Functions(this.client);
  }

  async creatProduct({
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  }) {
    try {
      const data = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          title,
          image,
          description,
          category,
          brand,
          price,
          salePrice,
          totalStock,
        }
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: createProduct :: error", error);
    }
  }

  async updateProduct(
    id,
    {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    }) {
    try {
      const data = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id,
        {
          image,
          title,
          description,
          category,
          brand,
          price,
          salePrice,
          totalStock
        }
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: updateProduct :: error", error);
    }
  }

  async deleteProduct({ $id }) {
    try {
      const data = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        $id
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: deleteProduct :: error", error);
    }
  }

  async getProduct($id) {
    try {
      const data = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        $id
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getProduct :: error", error);
    }
  }

  async getAllProducts() {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getAllProducts :: error", error);
    }
  }

  async getFilterProducts({ category, brand, limit = 0 }) {
    const queries = [];

    if (category?.length > 0) {
      queries.push(Query.equal("category", category));
    }
    if (brand?.length > 0) {
      queries.push(Query.equal("brand", brand));
    }
    if (limit) {
      queries.push(Query.limit(8))
    }
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getFilterProducts :: error", error);
    }

    console.log(queries);

  }

  //   --------- PRODUCT FILE UPLOAD SERVICE----------

  async uploadFile(file) {
    try {
      const data = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      return data;
    } catch (error) {
      console.log("Apwrite service :: uploadFile :: error", error);
    }
  }

  async deleteFile(fileId) {
    try {
      const data = await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return data;
    } catch (error) {
      console.log("Apwrite service :: deleteFile :: error", error);
    }
  }

  async getFilePreview(fileId) {
    try {
      const data = await this.bucket.getFileView(
        conf.appwriteBucketId,
        fileId
      );
      // console.log(data);
      return data;
    } catch (error) {
      console.log("Apwrite service :: getFilePreview :: error", error);

    }
  }

  // ----------- CART SERVICE ------------------
  async createCart(userId, productArr) {
    try {
      const data = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        userId,
        {
          products: JSON.stringify(
            productArr
          )
        }
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: createCart :: error", error);
    }
  }

  async updateCart(userId, productArr) {
    try {
      const data = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        userId,
        {
          products: JSON.stringify(
            productArr
          )
        }
      );
      return data;
    } catch (error) {
      console.log("Apwrite service :: updateCart :: error", error);
    }
  }

  async deleteCart(userId) {
    try {
      const data = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        userId
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: deleteCart :: error", error);
    }
  }

  async getCart(userId) {
    try {
      const data = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        userId,
      );
      return data;
    } catch (error) {
      console.log("get cart error", error);
      return false
    }
  }

  // ----------WISHLIST SERVICE-----------

  async createWishlist(userId, productArr) {
    try {
      const data = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteWishlistCollectionId,
        userId,
        {
          products: JSON.stringify(productArr)
        }
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: createWishlist :: error", error);
    }
  }

  async updateWishlist(userId, productArr) {
    try {
      const data = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteWishlistCollectionId,
        userId,
        {
          products: JSON.stringify(productArr)
        }
      );
      return data;
    } catch (error) {
      console.log("Apwrite service :: updateWishlist :: error", error);
    }
  }

  async deleteWishlist(userId) {
    try {
      const data = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteWishlistCollectionId,
        userId
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: deleteWishlist :: error", error);
    }
  }

  async getWishlist(userId) {
    try {
      const data = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteWishlistCollectionId,
        userId,
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getWishlist :: error", error);
      return false
    }
  }

  //_____________Address Service---------------------

  async createAddress(addressdata) {
    try {
      const data = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteAddressCollectionId,
        ID.unique(),
        addressdata
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: createAddress :: error", error);
    }
  }

  async updateAddress({ address, pincode, phone, notes, city,isDefault }, id) {
    try {
      const data = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteAddressCollectionId,
        id,
        { address, pincode, phone, notes, city,isDefault }
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: updateAddress :: error", error);
    }
  }

  async deleteAddress(addressId) {
    try {
      const data = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteAddressCollectionId,
        addressId
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: deleteAddress :: error", error);
    }
  }


  async getAddress(userId) {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteAddressCollectionId,
        [Query.equal("userId", userId)]
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getAddress :: error", error);
    }
  }

  //------------------Order service--------
  async createStripeOrder(order) {
    console.log(order);

    try {
      const response = await this.functions.createExecution(
        "6887a3e400317363932d",
        JSON.stringify(order),
        false,
        "/checkout",
        "POST"
      )
      // console.log(JSON.parse(response.responseBody));
      window.location.href = JSON.parse(response.responseBody).checkout_url;
      return true

    } catch (error) {
      console.log("Apwrite service :: createStripeOrder :: error", error);

    }
  }

  async createOrder({ userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate }) {
    try {
      const data = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        ID.unique(),
        {
          userId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate
        }
      );
      return data;
    } catch (error) {
      console.log("Apwrite service :: createOrder :: error", error);
      return false;
    }
  }

   async getAllOrders(userId) {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        [Query.equal("userId", userId)]
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getAllOrders :: error", error);
    }
  }
   async getAllAdminOrders() {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getAllAdminOrders :: error", error);
    }
  }
   async updateOrder(status,id) {
    try {
      const data = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        id,
        {
          orderStatus:status
        }
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getAllAdminOrders :: error", error);
    }
  }

  // -----------------product Search Service-----------------

  async searchProducts(searchQuery) {
    try {

      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.or([
          Query.search("title", searchQuery),
          Query.search("category", searchQuery),
          Query.search("brand", searchQuery),
          Query.search("description", searchQuery),
        ])]
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: search :: error", error);
    }
  }

  async addProductReview({ productId, userId, userName, reviewTitle, reviewMessage, reviewValue }) {
    try {
      //  console.log("Updating productId:", productId,userId, userName, reviewTitle, reviewMessage, reviewValue);
      const data = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReviewCollectionId,
        ID.unique(),
        {
          productId,
          userId,
          userName,
          reviewTitle,
          reviewMessage,
          reviewValue: parseInt(reviewValue.toFixed(1))
        }
      );

      const reviews = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReviewCollectionId,
        [Query.equal("productId", productId)]
      )

      const totalReviewsLength = reviews.documents.length
      const averageReview = reviews.documents.reduce((acc, review) => acc + review.reviewValue, 0) / totalReviewsLength;
      console.log("averageReview", averageReview);



      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        productId,
        {
          averageReview: parseFloat(averageReview.toFixed(1)),
          totalReview: parseInt(totalReviewsLength)
        }
      );
      // console.log(response);


      return data;
    } catch (error) {
      console.log("Apwrite service :: addReview :: error", error);
    }
  }

  async checkUserReview({ productId, userId }) {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReviewCollectionId,
        [
          Query.and([
            Query.equal("productId", productId),
            Query.equal("userId", userId)
          ])
        ]
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: checkUserReview :: error", error);
    }
  }

  async getProductReviews(productId) {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReviewCollectionId,
        [Query.equal("productId", productId)]
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getProductReviews :: error", error);
    }
  }

  async getUserReviews(userId) {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReviewCollectionId,
        [Query.equal("userId", userId)]
      );

      return data;
    } catch (error) {
      console.log("Apwrite service :: getUserReviews :: error", error);
    }
  }


  //-------COUPON Service

  async getAllCoupons() {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCouponCollectionId
      );
      return data;
    } catch (error) {
      console.log("Apwrite service :: getAllCoupons :: error", error);
    }
  }

  async getCoupon(code) {
    try {
      const data = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCouponCollectionId,
        [Query.equal("code", code)]
      );
      return data;
    } catch (error) {
      console.log("Apwrite service :: getCoupon :: error", error);
    }
  }

}

const databaseService = new DatabaseService();

export default databaseService;
