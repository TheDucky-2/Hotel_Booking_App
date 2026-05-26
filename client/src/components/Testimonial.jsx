import React from 'react'
import Title from './Title'
import {assets} from "../assets/assets.js"
import { testimonials } from '../assets/assets.js'
import StarRating from './StarRating.jsx'


const Testimonial = () => {
  return (
    <div>

        <Title 
        title="What our Guests Say" 
        subTitle="Discover why discerning travelers choose QuickStay for their luxury accommodations around the world."
        align="center"/>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mt-4'>
                            <StarRating/>

                        </div>

                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>

    </div>
  )
}

export default Testimonial