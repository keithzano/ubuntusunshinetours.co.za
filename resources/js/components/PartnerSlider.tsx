import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Partner {
  name: string;
  logo: string;
  alt: string;
}

const partners: Partner[] = [
  {
    name: 'TripAdvisor',
    logo: '/images/partners/tripadvisor.webp',
    alt: 'TripAdvisor'
  },
  {
    name: 'South African Tourism',
    logo: '/images/partners/south-african-tourism.webp',
    alt: 'South African Tourism'
  },
  {
    name: 'SATSA Member',
    logo: '/images/partners/satsa-member.webp',
    alt: 'SATSA Member'
  },
  {
    name: 'SATSA',
    logo: '/images/partners/satsa-logo.webp',
    alt: 'SATSA'
  },
  {
    name: 'Tourism Grading',
    logo: '/images/partners/tourism-grading.webp',
    alt: 'Tourism Grading Council of South Africa'
  },
  {
    name: 'Partner 6',
    logo: '/images/partners/partner-6.webp',
    alt: 'Tourism Partner'
  }
];

export default function PartnerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === partners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? partners.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const getVisiblePartners = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % partners.length;
      visible.push(partners[index]);
    }
    return visible;
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Our Trusted Partners
          </h2>
          <p className="text-gray-600">
            We work with leading tourism organizations to ensure quality service
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out">
              {getVisiblePartners().map((partner, index) => (
                <div
                  key={`${partner.name}-${currentIndex}-${index}`}
                  className="flex-shrink-0 w-1/3 px-4"
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-24">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Previous partners"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Next partners"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {partners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#00AEF1]' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
