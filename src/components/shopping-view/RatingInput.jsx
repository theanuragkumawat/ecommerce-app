import { Star } from 'lucide-react'
import React, { useState } from 'react'

function RatingInput({ rating, setRating,setReviewData }) {



    return (
        <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Overall Rating</label>
            <div className="flex items-center gap-1 ">
                {
                    [1, 2, 3, 4, 5].map((currentRating) => {
                        return (
                            <span
                                key={currentRating}
                                className={`${currentRating <= rating ? "text-amber-300" : "text-gray-300 hover:text-amber-300"} `}
                            >
                                <Star
                                    onClick={() => {
                                        setRating(currentRating)
                                        setReviewData((prev) => ({...prev,reviewValue:currentRating}))
                                    }}

                                    size={19}
                                    fill="currentColor"
                                />
                            </span>
                        )
                    })
                }
            </div>
        </>

    )
}

export default RatingInput