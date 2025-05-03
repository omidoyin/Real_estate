import { NextResponse } from 'next/server';

// Mock database of lands
const landsDatabase = [
  {
    id: 1,
    title: 'Premium Land in Location A',
    location: 'City A, State X',
    price: 250000,
    size: '500 sqm',
    sizeValue: 500,
    image: '/placeholder.jpg',
    createdAt: '2023-05-15'
  },
  {
    id: 2,
    title: 'Exclusive Land in Location B',
    location: 'City B, State Y',
    price: 180000,
    size: '450 sqm',
    sizeValue: 450,
    image: '/placeholder.jpg',
    createdAt: '2023-05-20'
  },
  {
    id: 3,
    title: 'Strategic Land in Location C',
    location: 'City C, State Z',
    price: 320000,
    size: '600 sqm',
    sizeValue: 600,
    image: '/placeholder.jpg',
    createdAt: '2023-05-10'
  },
  {
    id: 4,
    title: 'Residential Land in Location D',
    location: 'City D, State X',
    price: 210000,
    size: '520 sqm',
    sizeValue: 520,
    image: '/placeholder.jpg',
    createdAt: '2023-06-01'
  },
  {
    id: 5,
    title: 'Commercial Land in Location E',
    location: 'City E, State Y',
    price: 400000,
    size: '800 sqm',
    sizeValue: 800,
    image: '/placeholder.jpg',
    createdAt: '2023-04-25'
  },
  {
    id: 6,
    title: 'Waterfront Land in Location F',
    location: 'City F, State Z',
    price: 350000,
    size: '550 sqm',
    sizeValue: 550,
    image: '/placeholder.jpg',
    createdAt: '2023-06-05'
  },
  {
    id: 7,
    title: 'Mountain View Land',
    location: 'City A, State X',
    price: 275000,
    size: '480 sqm',
    sizeValue: 480,
    image: '/placeholder.jpg',
    createdAt: '2023-05-28'
  },
  {
    id: 8,
    title: 'Urban Development Land',
    location: 'City C, State Z',
    price: 420000,
    size: '750 sqm',
    sizeValue: 750,
    image: '/placeholder.jpg',
    createdAt: '2023-04-15'
  },
  {
    id: 9,
    title: 'Suburban Paradise',
    location: 'City B, State Y',
    price: 195000,
    size: '520 sqm',
    sizeValue: 520,
    image: '/placeholder.jpg',
    createdAt: '2023-05-18'
  },
  {
    id: 10,
    title: 'Beachfront Property',
    location: 'City F, State Z',
    price: 550000,
    size: '650 sqm',
    sizeValue: 650,
    image: '/placeholder.jpg',
    createdAt: '2023-03-10'
  },
  {
    id: 11,
    title: 'Downtown Lot',
    location: 'City D, State X',
    price: 320000,
    size: '400 sqm',
    sizeValue: 400,
    image: '/placeholder.jpg',
    createdAt: '2023-04-05'
  },
  {
    id: 12,
    title: 'Hillside Retreat',
    location: 'City A, State X',
    price: 280000,
    size: '600 sqm',
    sizeValue: 600,
    image: '/placeholder.jpg',
    createdAt: '2023-05-22'
  },
  {
    id: 13,
    title: 'Lakefront Estate',
    location: 'City E, State Y',
    price: 490000,
    size: '850 sqm',
    sizeValue: 850,
    image: '/placeholder.jpg',
    createdAt: '2023-02-15'
  },
  {
    id: 14,
    title: 'Industrial Zone Plot',
    location: 'City C, State Z',
    price: 380000,
    size: '1200 sqm',
    sizeValue: 1200,
    image: '/placeholder.jpg',
    createdAt: '2023-03-28'
  },
  {
    id: 15,
    title: 'Countryside Acreage',
    location: 'City B, State Y',
    price: 220000,
    size: '1500 sqm',
    sizeValue: 1500,
    image: '/placeholder.jpg',
    createdAt: '2023-06-10'
  }
];

export async function GET(request) {
  // Get search parameters
  const { searchParams } = new URL(request.url);
  
  // Pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  
  // Filter parameters
  const search = searchParams.get('search') || '';
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '1000000');
  const size = searchParams.get('size') || 'any';
  const location = searchParams.get('location') || 'any';
  const sortBy = searchParams.get('sortBy') || 'newest';
  
  // Apply filters
  let filteredLands = [...landsDatabase];
  
  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredLands = filteredLands.filter(land => 
      land.title.toLowerCase().includes(searchLower) || 
      land.location.toLowerCase().includes(searchLower)
    );
  }
  
  // Price range filter
  filteredLands = filteredLands.filter(land => 
    land.price >= minPrice && land.price <= maxPrice
  );
  
  // Size filter
  if (size !== 'any') {
    switch (size) {
      case 'small':
        filteredLands = filteredLands.filter(land => land.sizeValue < 300);
        break;
      case 'medium':
        filteredLands = filteredLands.filter(land => land.sizeValue >= 300 && land.sizeValue < 500);
        break;
      case 'large':
        filteredLands = filteredLands.filter(land => land.sizeValue >= 500 && land.sizeValue < 1000);
        break;
      case 'xlarge':
        filteredLands = filteredLands.filter(land => land.sizeValue >= 1000);
        break;
    }
  }
  
  // Location filter
  if (location !== 'any') {
    filteredLands = filteredLands.filter(land => land.location.includes(location));
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'newest':
      filteredLands.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'priceAsc':
      filteredLands.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      filteredLands.sort((a, b) => b.price - a.price);
      break;
    case 'sizeAsc':
      filteredLands.sort((a, b) => a.sizeValue - b.sizeValue);
      break;
    case 'sizeDesc':
      filteredLands.sort((a, b) => b.sizeValue - a.sizeValue);
      break;
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalPages = Math.ceil(filteredLands.length / limit);
  
  // Get paginated results
  const paginatedLands = filteredLands.slice(startIndex, endIndex);
  
  // Return response with pagination metadata
  return NextResponse.json({
    lands: paginatedLands,
    pagination: {
      total: filteredLands.length,
      page,
      limit,
      totalPages
    }
  });
}
