import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mac1 from "../../assets/mac.jpg";
import mac2 from "../../assets/mac2.jpg";
import mac3 from "../../assets/mac3.jpg";

const TodaysDeal = () => {
  const navigate = useNavigate();

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Convert seconds to HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const laptops = [
    {
      id: 1,
      title: 'Apple MacBook Air Laptop',
      specs: 'Apple Intelligence, 10 Core GPU',
      ram: '24 GB RAM / 512 GB SSD GPU',
      price: 470980,
      image: mac1,
    },
    {
      id: 2,
      title: 'Apple MacBook Air Laptop',
      specs: 'Apple Intelligence, 10 Core GPU',
      ram: '24 GB RAM / 512 GB SSD GPU',
      price: 530680,
      image: mac2,
    },
    {
      id: 3,
      title: 'Apple MacBook Air Laptop',
      specs: 'Apple Intelligence, 10 Core GPU',
      ram: '24 GB RAM / 512 GB SSD GPU',
      price: 670930,
      image: mac3,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-[#3674B5]">
        ⚡ TODAY'S HOT DEALS
      </h1>

      {/* Countdown Timer */}
      <div className="flex justify-center items-center mb-8">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold px-6 py-2 rounded-full shadow-lg animate-pulse">
          ⏳ Offer Ends in: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {laptops.map((laptop) => (
          <div 
            key={laptop.id} 
            className="relative bg-white/90 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            {/* Floating Sale Tag */}
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-md">
              🔥 Hot Deal
            </div>

            {/* Laptop Image */}
            <div className="mb-6 w-full flex justify-center">
              <img 
                src={laptop.image} 
                alt={laptop.title} 
                className="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition duration-300"
                onClick={() => navigate(`/product/${laptop.id}`, { state: laptop })}
              />
            </div>

            {/* Laptop Details */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{laptop.title}</h2>
              <p className="text-gray-600">{laptop.specs}</p>
              <p className="text-gray-600 font-medium">{laptop.ram}</p>
            </div>

            {/* Price */}
            <div className="text-center">
              <p className="text-red-600 font-bold text-2xl">
                LKR {laptop.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysDeal;
