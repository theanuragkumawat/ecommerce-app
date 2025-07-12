import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowDownUp } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'


function Sort({className,productsLength, selectedSort, setSelectedSort,fetchFilterProducts}) {

    

    const sortOptions = [
        {
            title: "High to Low",
            name: "high to low",
            id: "high_to_low",
        },
        {
            title: "Low to High",
            name: "low to high",
            id: "low_to_high",
        },
        {
            title: "A to Z",
            name: "a to z",
            id: "a_to_z",
        },
        {
            title: "Z to A",
            name: "z to a",
            id: "z_to_a",
        }
    ];


    // console.log(selectedSort);
    useEffect(() => {
        fetchFilterProducts()
    },[selectedSort])

    return (
        <>
            <div className={className}>
                <span className='text-gray-600  mr-2 sm:mr-4 '>{productsLength && productsLength} products</span>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild>
                        <Button variant="outline"><ArrowDownUp />  {selectedSort ? selectedSort : 'Sort by'} </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {
                            sortOptions?.map((item) => {

                                return (
                                
                                        <DropdownMenuCheckboxItem
                                            key={item.id}
                                            name={item.name}
                                            checked={selectedSort == item.name}
                                            onCheckedChange={() =>
                                                { 
                                                    if(selectedSort == item.name){
                                                        setSelectedSort(false)
                                                    } else{
                                                        setSelectedSort(item.name)
                                                        // fetchFilterProducts()
                                                    }
                                                }
                                                }
                                        >
                                            {item.title}
                                        </DropdownMenuCheckboxItem>
                                   
                                )
                            })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}

export default Sort