import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import databaseService from '@/appwrite/config'
import { toast } from 'sonner'

function AdminProductTile({ product,setCurrentEditedId,setOpenCreateProductDialoge,setFormData,setImageFile,fetchAllProducts }) {

    function handleEditProduct(){
        setCurrentEditedId(product.$id);
        setFormData({...product})
        setOpenCreateProductDialoge(true);
        setImageFile(true)
    }
    

    const handleDeleteProduct = async () => {
        const data = await databaseService.deleteProduct(product);
        if(data){
            toast("Product deleted");
            fetchAllProducts()
        }
    }

    const [imageURL, setImageURL] = useState("image")

   async function getImage() {
    const url = await databaseService.getFilePreview(product.image)
    setImageURL(url);
   }

   useEffect(() => {
    getImage()
   },[])

   
    return (
        <Card className="w-full max-w-sm mx-auto pt-0">
            <div>
                <div className='relative'>
                    <img
                        src={imageURL}
                        alt={product?.title}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                </div>
                <CardContent>
                    <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${product?.salePrice > 0 ? "line-through" : ""
                                } text-lg font-semibold text-primary`}
                        >
                            ${product?.price}
                        </span>
                        {product?.salePrice > 0 ? (
                            <span className="text-lg font-bold">${product?.salePrice}</span>
                        ) : null}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                        <Button
                            onClick={handleEditProduct}
                            className="cursor-pointer"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={handleDeleteProduct}
                            className="cursor-pointer"
                        >
                            Delete
                        </Button>
                </CardFooter>
            </div>
        </Card>
    )
}

export default AdminProductTile