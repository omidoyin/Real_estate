const Apartment = require('../models/Apartment');

const seedApartments = async () => {
  const apartmentData = [
    {
      title: 'Modern 2-Bedroom Apartment in Tower A',
      location: 'City A, State X',
      price: 350000,
      size: '1200 sqft',
      status: 'Available',
      bedrooms: 2,
      bathrooms: 2,
      floor: 5,
      unit: '5A',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Contemporary apartment with stunning city views. This well-designed unit features an open floor plan, high-end finishes, and access to premium building amenities.',
      features: [
        'Open floor plan',
        'Stainless steel appliances',
        'Quartz countertops',
        'Floor-to-ceiling windows',
        'Walk-in closets'
      ],
      landmarks: [
        {
          name: 'Shopping Mall',
          distance: '0.5 km'
        },
        {
          name: 'Metro Station',
          distance: '0.3 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        },
        {
          name: 'Floor Plan',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2020,
      hasBalcony: true,
      hasParkingSpace: true,
      hasElevator: true,
      buildingAmenities: [
        'Fitness center',
        'Swimming pool',
        'Rooftop terrace',
        '24-hour security'
      ]
    },
    {
      title: 'Luxury Penthouse in Tower B',
      location: 'City B, State Y',
      price: 750000,
      size: '2500 sqft',
      status: 'Available',
      bedrooms: 3,
      bathrooms: 3.5,
      floor: 15,
      unit: 'PH1',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Spectacular penthouse with panoramic views. This premium residence offers luxurious living spaces, high-end finishes, and exclusive access to building amenities.',
      features: [
        'Panoramic views',
        'Gourmet kitchen',
        'Marble bathrooms',
        'Custom cabinetry',
        'Smart home technology'
      ],
      landmarks: [
        {
          name: 'Financial District',
          distance: '1.0 km'
        },
        {
          name: 'Fine Dining',
          distance: '0.2 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2019,
      hasBalcony: true,
      hasParkingSpace: true,
      hasElevator: true,
      buildingAmenities: [
        'Concierge service',
        'Private elevator',
        'Wine cellar',
        'Spa facilities'
      ]
    },
    {
      title: 'Cozy 1-Bedroom Studio in Tower C',
      location: 'City C, State Z',
      price: 220000,
      size: '800 sqft',
      status: 'Available',
      bedrooms: 1,
      bathrooms: 1,
      floor: 3,
      unit: '3C',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Efficient studio apartment perfect for young professionals. This well-designed unit maximizes space and offers modern amenities in a convenient location.',
      features: [
        'Space-saving design',
        'Built-in storage',
        'Modern fixtures',
        'Energy-efficient appliances',
        'Hardwood floors'
      ],
      landmarks: [
        {
          name: 'University',
          distance: '1.5 km'
        },
        {
          name: 'Cafes',
          distance: '0.3 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2018,
      hasBalcony: false,
      hasParkingSpace: true,
      hasElevator: true,
      buildingAmenities: [
        'Laundry facilities',
        'Bike storage',
        'Rooftop garden',
        'Study lounge'
      ]
    },
    {
      title: 'Family Apartment in Tower D',
      location: 'City D, State X',
      price: 450000,
      size: '1800 sqft',
      status: 'Available',
      bedrooms: 3,
      bathrooms: 2,
      floor: 8,
      unit: '8D',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Spacious family apartment in a family-friendly building. This comfortable unit offers generous living spaces and is located near schools, parks, and family amenities.',
      features: [
        'Family room',
        'Eat-in kitchen',
        'Ample storage',
        'Child-friendly design',
        'Soundproofing'
      ],
      landmarks: [
        {
          name: 'Elementary School',
          distance: '0.7 km'
        },
        {
          name: 'Family Park',
          distance: '0.5 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2017,
      hasBalcony: true,
      hasParkingSpace: true,
      hasElevator: true,
      buildingAmenities: [
        'Playground',
        'Family lounge',
        'Storage units',
        'Security system'
      ]
    },
    {
      title: 'Executive Apartment in Tower E',
      location: 'City E, State Y',
      price: 550000,
      size: '1600 sqft',
      status: 'For Rent',
      bedrooms: 2,
      bathrooms: 2.5,
      floor: 12,
      unit: '12E',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Sophisticated apartment for the discerning professional. This premium rental offers elegant living spaces, high-end finishes, and a convenient location near business districts.',
      features: [
        'Home office space',
        'Premium finishes',
        'Guest bathroom',
        'Built-in bar',
        'Custom lighting'
      ],
      landmarks: [
        {
          name: 'Business District',
          distance: '1.0 km'
        },
        {
          name: 'Fine Dining',
          distance: '0.5 km'
        }
      ],
      documents: [
        {
          name: 'Rental Agreement',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2018,
      hasBalcony: true,
      hasParkingSpace: true,
      hasElevator: true,
      buildingAmenities: [
        'Business center',
        'Conference room',
        'Fitness center',
        'Valet parking'
      ],
      rentPrice: 3500,
      rentPeriod: 'Monthly'
    }
  ];

  const apartments = await Apartment.insertMany(apartmentData);
  return apartments;
};

module.exports = seedApartments;
