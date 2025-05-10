const Land = require('../models/Land');

const seedLands = async () => {
  const landData = [
    {
      title: 'Premium Land in Location A',
      location: 'City A, State X',
      price: 250000,
      size: '500 sqm',
      status: 'Available',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'This premium land property is located in a prime area with excellent investment potential. The property features easy access to major roads, proximity to essential amenities, and is situated in a rapidly developing region.',
      features: [
        'Prime location',
        'Clear title',
        'Proximity to major roads',
        'Near essential amenities',
        'Rapidly developing area',
        'High appreciation potential'
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
          name: 'Land Title',
          url: '/placeholder.pdf'
        },
        {
          name: 'Survey Plan',
          url: '/placeholder.pdf'
        }
      ]
    },
    {
      title: 'Exclusive Land in Location B',
      location: 'City B, State Y',
      price: 180000,
      size: '450 sqm',
      status: 'Available',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Scenic views with modern amenities nearby. This exclusive land offers a perfect balance of natural beauty and urban convenience.',
      features: [
        'Scenic views',
        'Gated community',
        'Underground utilities',
        'Paved roads',
        'Street lighting'
      ],
      landmarks: [
        {
          name: 'Park',
          distance: '0.5 km'
        },
        {
          name: 'Supermarket',
          distance: '1.0 km'
        }
      ],
      documents: [
        {
          name: 'Land Title',
          url: '/placeholder.pdf'
        }
      ]
    },
    {
      title: 'Strategic Land in Location C',
      location: 'City C, State Z',
      price: 320000,
      size: '600 sqm',
      status: 'Available',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Perfect for commercial development. This strategic land is positioned in a high-traffic area with excellent visibility and accessibility.',
      features: [
        'Commercial zoning',
        'High visibility',
        'Corner lot',
        'Frontage on main road',
        'Suitable for retail'
      ],
      landmarks: [
        {
          name: 'Business District',
          distance: '3.0 km'
        },
        {
          name: 'Highway Access',
          distance: '0.8 km'
        }
      ],
      documents: [
        {
          name: 'Land Title',
          url: '/placeholder.pdf'
        },
        {
          name: 'Zoning Certificate',
          url: '/placeholder.pdf'
        }
      ]
    },
    {
      title: 'Residential Land in Location D',
      location: 'City D, State X',
      price: 210000,
      size: '520 sqm',
      status: 'Available',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Ideal for building your dream home. This residential land is located in a quiet, family-friendly neighborhood with all necessary amenities nearby.',
      features: [
        'Residential zoning',
        'Quiet neighborhood',
        'Family-friendly',
        'Ready for construction',
        'Flat terrain'
      ],
      landmarks: [
        {
          name: 'Elementary School',
          distance: '1.0 km'
        },
        {
          name: 'Community Center',
          distance: '1.5 km'
        }
      ],
      documents: [
        {
          name: 'Land Title',
          url: '/placeholder.pdf'
        }
      ]
    },
    {
      title: 'Commercial Land in Location E',
      location: 'City E, State Y',
      price: 400000,
      size: '900 sqm',
      status: 'Available',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      description: 'Prime commercial land in a rapidly developing business district. Excellent opportunity for investors looking to develop retail or office space.',
      features: [
        'Business district',
        'High foot traffic',
        'Corner property',
        'Multiple access points',
        'Development potential'
      ],
      landmarks: [
        {
          name: 'Shopping Center',
          distance: '2.0 km'
        },
        {
          name: 'Office Park',
          distance: '1.2 km'
        }
      ],
      documents: [
        {
          name: 'Land Title',
          url: '/placeholder.pdf'
        },
        {
          name: 'Environmental Clearance',
          url: '/placeholder.pdf'
        }
      ]
    }
  ];

  const lands = await Land.insertMany(landData);
  return lands;
};

module.exports = seedLands;
