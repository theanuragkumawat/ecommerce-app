import React, { Fragment, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { addProductsToState } from '@/store/shop/products-slice'

import databaseService from '@/appwrite/config'

function Filters({ category, setCategory, brand, setBrand }) {

    const dispatch = useDispatch()

    const categories = [
        {
            title: "Men",
            name: "men",
            id: "men"
        },
        {
            title: "Women",
            name: "women",
            id: "women"
        },
        {
            title: "Kids",
            name: "kids",
            id: "kids"
        },
        {
            title: "Accessories",
            name: "accessories",
            id: "accessories"
        },
        {
            title: "Footwear",
            name: "footwear",
            id: "footwear"
        },
    ]
    const brands = [
        {
            title: "Adidas",
            id: "adidas",
            name: "adidas"
        },
        {
            title: "Nike",
            id: "nike",
            name: "nike"
        },
        {
            title: "Puma",
            id: "puma",
            name: "puma"
        },
        {
            title: "Levi's",
            id: "levi's",
            name: "levi's"
        },
        {
            title: "Zara",
            id: "zara",
            name: "zara"
        },
        {
            title: "H&M",
            id: "h&m",
            name: "h&m"
        },
    ]



    // console.log(category);
    // console.log(brand);


    return (

        <aside className="lg:w-1/5 w-full bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="mb-4">
                <h3 className="font-semibold text-[1.15rem] mb-2">Category</h3>
                <div className="space-y-3">
                    {
                        categories?.map(item => {

                            return (
                                <Fragment key={item.id} >
                                    <Checkbox
                                        defaultChecked={false}
                                        id={item.id}
                                        name={item.name}
                                        checked={category.includes(item.name)}
                                        onCheckedChange={() =>
                                            setCategory((prev) =>
                                                prev.includes(item.name)
                                                    ? prev.filter((cat) => cat !== item.name)
                                                    : [...prev, item.name]
                                            )
                                        }
                                        className="mr-2"
                                    /> <label htmlFor={item.id}>{item.title}</label><br />
                                </Fragment>
                            )
                        })
                    }

                </div>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold text-[1.15rem] mb-2">Brand</h3>
                <div className="space-y-3">
                    {
                        brands?.map(item => {

                            return (
                                <Fragment key={item.id}>
                                    <Checkbox
                                        defaultChecked={false}
                                        id={item.id}
                                        name={item.name}
                                        checked={brand.includes(item.name)}
                                        onCheckedChange={() =>
                                            setBrand((prev) =>
                                                prev.includes(item.name)
                                                    ? prev.filter((cat) => cat !== item.name)
                                                    : [...prev, item.name]
                                            )
                                        }
                                        className="mr-2"
                                    />
                                     <label htmlFor={item.id}>{item.title}</label><br />
                                </Fragment>
                            )
                        })
                    }
                </div>
            </div>
            
        </aside>

    )
}

export default Filters