import ImageUpload from "@/components/admin-view/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import databaseService from "@/appwrite/config";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { AdminProductTile } from "@/components";
import { addProductsToState } from "@/store/admin/products-slice";

function AdminProducts() {
  const dispatch = useDispatch();

  function fetchAllProducts() {
    databaseService.getAllProducts().then((posts) => {
      if (posts) {
        const products = posts.documents;
        dispatch(addProductsToState(products));
      }
    });
  }
  
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const userData = useSelector((state) => state.auth.userData);
  const productsList = useSelector((state) => state.adminProducts.productsList);
  // console.log("userData : ", userData);

  const [openCreateProductDialoge, setOpenCreateProductDialoge] =
    useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: null,
    salePrice: 0,
    totalStock: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (currentEditedId) {
        const productData = {
          ...formData,
          price: parseInt(formData.price),
          salePrice: parseInt(formData.salePrice),
          totalStock: parseInt(formData.totalStock),
        }
        const dbProduct = await databaseService.updateProduct(
          currentEditedId,
          productData
        );
        if (dbProduct) {
          setOpenCreateProductDialoge(false);
          setFormData(initialFormData);
          toast("Product updated successfully");
          setCurrentEditedId(null);
          fetchAllProducts();
          console.log("updated dbProduct : ", dbProduct);
        }
      } else {
        if (imageFile) {
          const file = await databaseService.uploadFile(imageFile);
          if (file) {
            const fileId = file.$id;

            const productData = {
              ...formData,
              image: fileId,
              price: parseInt(formData.price),
              salePrice: parseInt(formData.salePrice),
              totalStock: parseInt(formData.totalStock),
            };

            const dbProduct = await databaseService.creatProduct(productData);
            if (dbProduct) {
              setOpenCreateProductDialoge(false);
              setFormData(initialFormData);
              toast("Product added successfully");
              setImageFile(null);
              setFormData(initialFormData);
              fetchAllProducts();
              console.log("dbProduct : ", dbProduct);
            }
          }
        }
      }
    } catch (error) {
      console.log("product submit error :: ", error);
    }
  };


  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => setOpenCreateProductDialoge(true)}
          className="cursor-pointer"
        >
          Add New Product
        </Button>
      </div>

      {/* Product Card */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productsList?.map((productItem) => {
          return (
            <AdminProductTile
            setImageFile={setImageFile}
              setOpenCreateProductDialoge={setOpenCreateProductDialoge}
              setCurrentEditedId={setCurrentEditedId}
              setFormData={setFormData}
              fetchAllProducts={fetchAllProducts}
              product={productItem}
              key={productItem.$id}
            />
          );
        })}
      </div>

      <Sheet
        open={openCreateProductDialoge}
        onOpenChange={() => {
          setOpenCreateProductDialoge(false);
          setFormData(initialFormData);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            currentEditedId={currentEditedId}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
          />

          <div className="py-6">
            <form onSubmit={submit}>
              <div className="flex flex-col gap-3 mx-4">
                <div className="grid w-full gap-1.5">
                  <Label className="mb-1">Title</Label>
                  <Input
                    placeholder="Enter product title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    type="text"
                    name="title"
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label className="mb-1">Description</Label>
                  <Textarea
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    type="text"
                    name="description"
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label className="mb-1">Category</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    value={formData.category}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                        <SelectItem value="Kids">Kids</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Footwear">Footwear</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label className="mb-1">Brand</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, brand: value }))
                    }
                    value={formData.brand}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Brand</SelectLabel>
                        <SelectItem value="Adidas">Adidas</SelectItem>
                        <SelectItem value="Nike">Nike</SelectItem>
                        <SelectItem value="Puma">Puma</SelectItem>
                        <SelectItem value="Levi's">Levi's</SelectItem>
                        <SelectItem value="Zara">Zara</SelectItem>
                        <SelectItem value="H&M">H&M</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="grid w-full gap-1.5">
                    <Label className="mb-1">Price</Label>
                    <Input
                      placeholder="Enter product price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.name]: (e.target.value) === "" ? null : parseInt(e.target.value),
                        }))
                      }
                      type="number"
                      name="price"
                      min={0}
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label className="mb-1">Sale Price</Label>
                    <Input
                    
                      placeholder="Enter product sale price(optional)"
                      value={formData.salePrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.name]: (e.target.value) === "" ? null : parseInt(e.target.value),
                        }))
                      }
                      type="number"
                      name="salePrice"
                      min={0}
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label className="mb-1">Total Stock</Label>
                    <Input
                      placeholder="Enter product sale price(optional)"
                      value={formData.totalStock}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.name]: (e.target.value) === "" ? null : parseInt(e.target.value),
                        }))
                      }
                      type="number"
                      name="totalStock"
                      min={1}
                    />
                  </div>
                </div>
                <Button
                  disabled={false}
                  type="submit"
                  className="mt-1 w-full cursor-pointer">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminProducts;
