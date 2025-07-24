import React, { useEffect, useState } from "react";
import { Filters, ProductDetailsDialog, ShoppingProductCard } from "@/components";
import Sort from "@/components/shopping-view/Sort";
import databaseService from "@/appwrite/config";
import { useSelector, useDispatch } from "react-redux";
import { addProductsToState } from "../../store/shop/products-slice"
import useSort from "@/components/useSort";
import { useNavigate } from "react-router";

export default function ShoppingListing() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productsList = useSelector(state => state.shopProducts.productsList);
  const [currentProducts, setCurrentProducts] = useState([])

  function fetchAllProducts() {
    databaseService.getAllProducts().then((posts) => {
      if (posts) {
        const products = posts.documents;
        setCurrentProducts(products)
        dispatch(addProductsToState(products));
      }
    });
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const [category, setCategory] = useState([])
  const [brand, setBrand] = useState([])
  const [selectedSort, setSelectedSort] = useState(false)

  async function fetchFilterProducts() {
    if (category.length > 0 || brand.length > 0) {
      const posts = await databaseService.getFilterProducts({category, brand})
      if (posts) {
        let products = posts.documents;
        if (selectedSort) {
          products = useSort(products, selectedSort);
          dispatch(setCurrentProducts(products));
        } else {

          dispatch(setCurrentProducts(products));
        }
        console.log(products);
      }
    } else if(selectedSort){
      let products = useSort(productsList, selectedSort);
      dispatch(setCurrentProducts(products));
    } else{
      setCurrentProducts(productsList)
    }
  }

  


  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4">
      <ProductDetailsDialog setOpen={"r"}/>
      {/* Filters Sidebar */}
      <Filters
        category={category}
        setCategory={setCategory}
        brand={brand}
        setBrand={setBrand}
        fetchFilterProducts={fetchFilterProducts}
      />

      {/* Products Grid */}
      <div className="flex-1">
        <div className="my-5 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-gray-950 font-semibold text-2xl">All Products</h3>
          <Sort
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            fetchFilterProducts ={fetchFilterProducts}
            className={"md:mr-10"} productsLength={currentProducts?.length} />
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {
            currentProducts?.map((product) => {

              return (
                <ShoppingProductCard
                 key={product.$id} 
                 product={product}
                  />
              )
            })
          }
        </main>
      </div>
    </div>
  );
}
