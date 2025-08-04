import React, { useEffect, useState } from 'react'
import databaseService from '@/appwrite/config'
import { ShoppingProductCard } from '@/components'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'react-router'
import { X } from 'lucide-react'
function ShoppingSearch() {
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const searchQuery = new URLSearchParams(window.location.search).get('query')
    const [keyword, setKeyword] = useState(searchQuery)

    const [searchParams, setSearchParams] = useSearchParams()

    async function fetchSearchResults() {
        try {
            if(!keyword || keyword.length < 3){
                return
            }
            const data = await databaseService.searchProducts(keyword)
            setSearchParams(new URLSearchParams(`?query=${keyword}`))
            setSearchResults(data.documents)
        } catch (error) {
            console.error("Error fetching search results:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {

        fetchSearchResults()
    }, [keyword])



    return (
        <div className={`${searchResults.length > 0 ? "mb-20" : "mb-96"} container w-5/6 md:w-9/10 lg: xl:w-3/4 2xl:w-2/3 mx-auto justify-center items-center mt-2`}>
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center relative"> {/* Added 'relative' for potential absolute positioning of icons */}
                    <label htmlFor="productSearch" className="sr-only">Search Products</label> {/* Added a visually hidden label for accessibility */}
                    <Input
                        id="productSearch" // Linked label to input with an ID
                        value={keyword}
                        name="keyword"
                        onChange={(event) => setKeyword(event.target.value)}
                        className={"py-6 pr-4 lg:text-lg"} 
                        placeholder="Search products, brands, or categories..." 
                        aria-label="Search products, brands, or categories" 
                        type="search" 
                        autoComplete="off" 
                    />
                    {keyword && ( 
                        <button
                            type="button"
                            onClick={() => setKeyword('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 "
                            aria-label="Clear search"
                        >
                            <X />

                        </button>
                    )}

                </div>
            </div>
            {searchResults.length > 0 ? (
                <div className='grid grid-cols-1 xs sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {

                        searchResults?.map((product) => (
                            <ShoppingProductCard key={product.$id} product={product} />
                        ))
                    }
                </div>
            ) : (
                <h1 className='text-2xl font-semibold md:text-4xl md:font-bold'>No products found...</h1>
            )}
        </div>
    )
}

export default ShoppingSearch