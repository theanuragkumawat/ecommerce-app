import { Airplay, ArrowRight, BabyIcon, ChevronLeft, ChevronRight, CloudLightning, Footprints, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import bannerOne from "../../assets/banner-1.webp"
import bannerTwo from "../../assets/banner-2.webp"
import bannerThree from "../../assets/banner-3.webp"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from '../ui/button'
import databaseService from '@/appwrite/config'
import { ShoppingProductCard } from '..'


function ShoppingHero() {
    const slides = [bannerOne, bannerTwo, bannerThree];
    const [currentSlide,setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide(prev => (prev +1) % slides.length)
        },4000)
        return () => clearInterval(slideTimer)
    },[])

    const categoriesWithIcon = [
        { id: "men", label: "Men", icon: ShirtIcon },
        { id: "women", label: "Women", icon: CloudLightning },
        { id: "kids", label: "Kids", icon: BabyIcon },
        { id: "accessories", label: "Accessories", icon: WatchIcon },
        { id: "footwear", label: "Footwear", icon: Footprints },
    ];

    const brandsWithIcon = [
        { id: "nike", label: "Nike", icon: Shirt },
        { id: "adidas", label: "Adidas", icon: WashingMachine },
        { id: "puma", label: "Puma", icon: ShoppingBasket },
        { id: "levi's", label: "Levi's", icon: Airplay },
        { id: "zara", label: "Zara", icon: Images },
        { id: "h%26m", label: "H&M", icon: Heater },
    ];

    const [featureProducts, setFeatureProducts] = useState([])
    const getFeatureProducts = async () => {
        try {
            let limit = 8
            const data = await databaseService.getFilterProducts({limit})
            if(data){
                setFeatureProducts(data.documents)
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getFeatureProducts()
    },[])
    return (
        <section>
            <div className="flex flex-col min-h-screen">
                <div className="relative w-full md:h-[600px] 2xl:h-[800px]">
                    {
                        slides?.map((item, index) => (

                            <img
                                src={item}
                                key={index}
                                className={`${index == currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                            />
                        ))
                    }
                    <Button
                        onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length )}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                        variant="outline"
                        size="icon"
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                     onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length )}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                        variant="outline"
                        size="icon"
                    >
                        <ChevronRight />
                    </Button>
                </div>
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Shop by category
                        </h2>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                            {
                                categoriesWithIcon.map((item) => (
                                    <Link to={`/listing?category=${item.id}`} key={item.label} >
                                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                        <CardContent className="flex flex-col items-center justify-center p-6">
                                            <item.icon className="w-12 h-12 mb-4 text-primary"/>
                                             <span className="font-bold">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                    </Link>
                                ))
                            }
                        </div>
                        <h2 className="text-3xl font-bold text-center mb-8 mt-28">
                            Shop by brands
                        </h2>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                            {
                                brandsWithIcon.map((item) => (
                                    <Link to={`/listing?brand=${item.id}`}  key={item.label}>
                                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                        <CardContent className="flex flex-col items-center justify-center p-6">
                                            <item.icon className="w-12 h-12 mb-4 text-primary"/>
                                             <span className="font-bold">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                    </Link>
                                ))
                            }
                        </div>
                        <h2 className="text-3xl font-bold text-center mb-8 mt-28">
                            Featured products
                        </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {
                                featureProducts?.map(item => (
                                    <ShoppingProductCard 
                                    key={item.$id}
                                    product={item}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
export default ShoppingHero