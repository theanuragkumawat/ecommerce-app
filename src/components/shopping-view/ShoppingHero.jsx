import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

function ShoppingHero() {
    return (
        <section>

            <div
                style={
                    {
                        backgroundImage: `url("https://img.freepik.com/free-photo/travel-concept-close-up-portrait-young-beautiful-attractive-ginger-red-hair-girl-with-trendy-hat_1258-124917.jpg?t=st=1745045740~exp=1745049340~hmac=d7880beb0b1ff587af9e78b476b9d2e753cedc99b3068f96ba87d19a62b8525b&w=1380")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                        // height: "100vh"
                    }
                }
                className="bg-cover bg-white dark:bg-gray-900 w-full sm:py-9 md:py-16 lg:py-20 xl:py-36">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="text-gray-800 max-w-2xl mb-5 md:mb-10 text-xl font-semibold tracking-tight leading-none md:text-2xl xl:text-4xl dark:text-white">
                            Discover Trendy Styles That Define You
                        </h1>
                        <h1 className="max-w-2xl mb-4 text-2xl font-medium sm:font-bold tracking-tight md:leading-14 md:text-3xl xl:text-5xl dark:text-white">
                            New Arrivals. Limited Stock.
                        </h1>
                        <p className='mt-1 text-md'>Shop latest fashion essentials delivered fast, fresh, and affordably daily.</p>

                        <Link
                            className="mt-5 md:mt-12 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                            Go to Colection <ArrowRight className='ml-0.5' />
                        </Link>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">

                    </div>
                </div>
            </div>

        </section>
    )
}

export default ShoppingHero