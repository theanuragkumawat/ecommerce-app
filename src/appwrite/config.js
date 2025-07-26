import { Client, Databases, Storage, ID, Query } from "appwrite";
import conf from "@/conf/conf";

export class DatabaseService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) // Your API Endpoint
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
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

  async getFilterProducts({category, brand, limit=0}) {
    const queries = [];

    if (category?.length > 0) {
      queries.push(Query.equal("category", category));
    }
    if (brand?.length > 0) {
      queries.push(Query.equal("brand", brand));
    }
    if(limit){
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
      console.log("get cart error",error);
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

  //Address Service---------------------

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

  async updateAddress({address,pincode,phone,notes,city},id) {
    try {
      const data = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteAddressCollectionId,
        id,
          {address,pincode,phone,notes,city}
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

}

const databaseService = new DatabaseService();

export default databaseService;
