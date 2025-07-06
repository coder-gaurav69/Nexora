import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const images = [
  'https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2025/GW/BAU/Unrec/PC/934044815._CB551384116_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/img24/Media/BAU/PC_Hero_2x-toys_1._CB582765723_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Unrec/TallHero_3000X1200_Unrec._CB593464763_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/uber_new_high._CB537689643_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Softlines_JWL_SH_GW_Assets/2024/BAU_BTF/Nov/Unrec/Shoes/1/30001._CB542120021_.jpg'
];

const ImageCarousel: React.FC = () => {
  return (
    <div className="relative w-full mt-[70px]">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={3500}
        showArrows={true}
        swipeable={true}
        emulateTouch={true}
      >
        {images.map((img, index) => (
          <div key={index} className="w-full h-[300px] sm:h-[400px] md:h-[535px] overflow-hidden">
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </Carousel>

      {/* Text Overlay */}
      <div className="absolute bottom-0 md:bottom-7 left-6 transform -translate-y-1/2 text-left w-[90%] max-w-[700px]">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-black drop-shadow-md">
          Discover Amazing Products
        </h1>
        <p className="text-sm sm:text-lg lg:text-2xl font-medium text-black mt-3 drop-shadow">
          Shop the latest in fashion, electronics, home decor, and lifestyle
        </p>
      </div>
    </div>
  );
};

export default ImageCarousel;
