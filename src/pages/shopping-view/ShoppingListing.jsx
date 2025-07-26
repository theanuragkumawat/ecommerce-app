import React, { useEffect, useState } from "react";
import { Filters, ProductDetailsDialog, ShoppingProductCard } from "@/components";
import Sort from "@/components/shopping-view/Sort";
import databaseService from "@/appwrite/config";
import { useSelector, useDispatch } from "react-redux";
import { addProductsToState } from "../../store/shop/products-slice"
import useSort from "@/components/useSort";
import { useNavigate, useLocation } from "react-router";
import { useSearchParams } from "react-router";

export default function ShoppingListing() {
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { productsList } = useSelector(state => state.shopProducts);
  const [currentProducts, setCurrentProducts] = useState([])

  const [searchParams] = useSearchParams()
  const newQuery = new URLSearchParams();

  const [category, setCategory] = useState(searchParams.get("category")?.split(",") || [])
  const [brand, setBrand] = useState(searchParams.get("brand")?.split(",") || [])
  const [selectedSort, setSelectedSort] = useState(false)

  function fetchAllProducts() {
    databaseService.getAllProducts().then((posts) => {
      if (posts) {
        const products = posts.documents;
        // setCurrentProducts(products)
        dispatch(addProductsToState(products));
      }
    });
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])

 useEffect(() => {
  setCategory(searchParams.get("category")?.split(",") || [])
  setBrand(searchParams.get("brand")?.split(",") || [])
 },[location.search])

  async function fetchFilterProducts() {
    if (category.length > 0 || brand.length > 0) {
      
      const posts = await databaseService.getFilterProducts({ category, brand })
      if (posts) {
        let products = posts.documents;
        if (selectedSort) {
          products = useSort(products, selectedSort);
          if (category.length > 0) {
            newQuery.set("category", category.join(","));
          }
          if (brand.length > 0) {
            newQuery.set("brand", brand.join(","));
          }

          navigate(`/listing?${newQuery.toString()}`);
          setCurrentProducts(products)

        } else {

          if (category.length > 0) {
            newQuery.set("category", category.join(","));
          }
          if (brand.length > 0) {
            newQuery.set("brand", brand.join(","));
          }
          navigate(`/listing?${newQuery.toString()}`);
          setCurrentProducts(products)
        }
      }
    } else if (selectedSort) {
      let products = useSort(productsList, selectedSort);
      navigate(`/listing`);
      setCurrentProducts(products)
    } else {

      databaseService.getAllProducts().then((posts) => {
        if (posts) {
          const products = posts.documents;
          setCurrentProducts(products)
        }
      });

      navigate(`/listing`);
    }
  }

  useEffect(() => {
    fetchFilterProducts()
  }, [category, brand])


  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4">
      <ProductDetailsDialog setOpen={"r"} />
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
            fetchFilterProducts={fetchFilterProducts}
            className={"md:mr-10"} productsLength={currentProducts?.length} />
        </div>
        {

          !isLoading ? (
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
            </main>) : (
            <h1 className="text-gray-950 animate-pulse text-center mt-80 text-2xl font-semibold">Loading...</h1>
          )
        }
      </div>
    </div>

  );
}
