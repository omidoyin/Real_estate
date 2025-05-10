const House = require('../models/House');

const seedHouses = async () => {
  const houseData = [
    {
      title: 'Modern 3-Bedroom House in Location A',
      location: 'City A, State X',
      price: 450000,
      size: '250 sqm',
      status: 'Available',
      propertyType: 'Detached',
      bedrooms: 3,
      bathrooms: 2,
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'This beautiful property offers modern living spaces with high-quality finishes throughout. Featuring an open floor plan, abundant natural light, and premium fixtures, this home provides the perfect balance of comfort and style.',
      features: [
        'Open floor plan',
        'Hardwood floors',
        'Granite countertops',
        'Stainless steel appliances',
        'Walk-in closets',
        'Central air conditioning'
      ],
      landmarks: [
        {
          name: 'Shopping Mall',
          distance: '1.5 km'
        },
        {
          name: 'Hospital',
          distance: '2.8 km'
        },
        {
          name: 'School',
          distance: '1.2 km'
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
      garage: true,
      garageCapacity: 2,
      hasGarden: true,
      hasPool: false
    },
    {
      title: 'Luxury Villa with Pool',
      location: 'City B, State Y',
      price: 750000,
      size: '400 sqm',
      status: 'Available',
      propertyType: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Spacious villa with private pool and garden. This luxury property offers elegant living spaces, premium finishes, and resort-style amenities for the discerning buyer.',
      features: [
        'Private pool',
        'Landscaped garden',
        'Gourmet kitchen',
        'Home theater',
        'Smart home technology',
        'Marble flooring'
      ],
      landmarks: [
        {
          name: 'Beach',
          distance: '2.0 km'
        },
        {
          name: 'Golf Course',
          distance: '1.5 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2019,
      garage: true,
      garageCapacity: 3,
      hasGarden: true,
      hasPool: true
    },
    {
      title: 'Apartment for Rent',
      location: 'City C, State Z',
      price: 1500,
      size: '120 sqm',
      status: 'For Rent',
      propertyType: 'Detached',
      bedrooms: 2,
      bathrooms: 1,
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Modern apartment in the city center. This well-appointed rental offers contemporary living spaces in a convenient location with easy access to public transportation, shopping, and dining.',
      features: [
        'City views',
        'Modern kitchen',
        'In-unit laundry',
        'Balcony',
        'Secure building access'
      ],
      landmarks: [
        {
          name: 'Metro Station',
          distance: '0.3 km'
        },
        {
          name: 'Supermarket',
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
      garage: false,
      garageCapacity: 0,
      hasGarden: false,
      hasPool: false,
      rentPrice: 1500,
      rentPeriod: 'Monthly'
    },
    {
      title: 'Family Home in Location D',
      location: 'City D, State X',
      price: 550000,
      size: '280 sqm',
      status: 'Available',
      propertyType: 'Detached',
      bedrooms: 4,
      bathrooms: 3,
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Spacious family home in a quiet neighborhood. This well-maintained property offers generous living spaces, a large backyard, and is located in an excellent school district.',
      features: [
        'Family room',
        'Fireplace',
        'Finished basement',
        'Large backyard',
        'Updated kitchen',
        'Energy-efficient windows'
      ],
      landmarks: [
        {
          name: 'Elementary School',
          distance: '0.8 km'
        },
        {
          name: 'Park',
          distance: '1.0 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2015,
      garage: true,
      garageCapacity: 2,
      hasGarden: true,
      hasPool: false
    },
    {
      title: 'Executive Home in Location E',
      location: 'City E, State Y',
      price: 750000,
      size: '320 sqm',
      status: 'Available',
      propertyType: 'Detached',
      bedrooms: 4,
      bathrooms: 3.5,
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Elegant executive home in a prestigious neighborhood. This impressive property features high-end finishes, spacious rooms, and a premium location close to business districts and upscale amenities.',
      features: [
        'Home office',
        'Gourmet kitchen',
        'Master suite',
        'Custom cabinetry',
        'Crown molding',
        'Heated floors'
      ],
      landmarks: [
        {
          name: 'Business District',
          distance: '3.0 km'
        },
        {
          name: 'Country Club',
          distance: '2.5 km'
        }
      ],
      documents: [
        {
          name: 'Property Title',
          url: '/placeholder.pdf'
        },
        {
          name: 'Home Inspection Report',
          url: '/placeholder.pdf'
        }
      ],
      yearBuilt: 2017,
      garage: true,
      garageCapacity: 3,
      hasGarden: true,
      hasPool: true
    }
  ];

  const houses = await House.insertMany(houseData);
  return houses;
};

module.exports = seedHouses;
