import React from 'react';
import Slider from "react-slick";

// Import banner images (ensure paths are correct)
import BannerImage1 from "../../assets/banner5.png";
import BannerImage2 from "../../assets/banner7.png";

// Array of banner images
const BannerList = [
    {
        id: 1,
        img: BannerImage1,
    },
    {
        id: 2,
        img: BannerImage2,
    },
];

const Banner = () => {
    const bannerSettings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: true,
                    arrows: true,
                }
            }
        ]
    };

    return (
        <div className='relative w-[90%] mx-auto rounded-lg overflow-hidden'>
            <Slider {...bannerSettings}>
                {BannerList.map((banner) => (
                    <div key={banner.id} className='relative'>
                        {/* Container to maintain equal width and height */}
                        <div className='w-full h-[300px] md:h-[400px] lg:h-[600px]'>
                            {/* Image with border, blue color, and object-cover to ensure it fills the container */}
                            <img 
                                src={banner.img} 
                                alt={`Banner ${banner.id}`} 
                                className='w-full h-full object-cover rounded-lg border-2 border-[#3674B5]' 
                            />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Banner;
