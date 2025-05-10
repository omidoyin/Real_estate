const Service = require('../models/Service');

const seedServices = async () => {
  const serviceData = [
    {
      title: 'Premium Estate Management',
      serviceType: 'Estate Management',
      propertyType: 'Residential',
      description: 'Comprehensive estate management services for residential properties. Our team of professionals handles all aspects of property management to ensure your investment is well-maintained and profitable.',
      price: '$500 - $1,000 monthly',
      location: 'All Cities',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      features: 'Tenant screening, Rent collection, Property maintenance, Financial reporting, 24/7 emergency response',
      benefits: 'Peace of mind, Maximized rental income, Reduced vacancy rates, Professional property care, Detailed financial tracking',
      duration: 'Monthly contract',
      status: 'Active'
    },
    {
      title: 'Commercial Property Management',
      serviceType: 'Estate Management',
      propertyType: 'Commercial',
      description: 'Specialized management services for commercial properties. Our experienced team handles the unique challenges of commercial real estate to maximize your investment returns.',
      price: '$1,000 - $3,000 monthly',
      location: 'Major Cities',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      features: 'Lease negotiation, Tenant relations, Maintenance coordination, Financial management, Regulatory compliance',
      benefits: 'Increased property value, Optimized tenant mix, Reduced operating costs, Streamlined operations, Professional representation',
      duration: 'Annual contract',
      status: 'Active'
    },
    {
      title: 'Modern Residential Design',
      serviceType: 'Architectural Design',
      propertyType: 'Residential',
      description: 'Creative architectural design services for modern homes. Our award-winning architects blend aesthetics with functionality to create living spaces that reflect your lifestyle and preferences.',
      price: '$5,000 - $15,000',
      location: 'All Cities',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      features: 'Custom floor plans, 3D visualization, Material selection, Construction documentation, Permit assistance',
      benefits: 'Personalized living space, Optimized functionality, Energy efficiency, Increased property value, Unique design elements',
      duration: '3-6 months',
      status: 'Active'
    },
    {
      title: 'Commercial Space Planning',
      serviceType: 'Architectural Design',
      propertyType: 'Commercial',
      description: 'Strategic architectural design for commercial spaces. Our team creates functional, attractive commercial environments that enhance productivity and customer experience.',
      price: '$10,000 - $30,000',
      location: 'Major Cities',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      features: 'Space optimization, Workflow analysis, Brand integration, Accessibility compliance, Sustainable design',
      benefits: 'Improved employee productivity, Enhanced customer experience, Reduced operating costs, Brand reinforcement, Future adaptability',
      duration: '4-8 months',
      status: 'Active'
    },
    {
      title: 'Residential Property Valuation',
      serviceType: 'Property Valuation',
      propertyType: 'Residential',
      description: 'Accurate property valuation services for residential real estate. Our certified appraisers provide detailed assessments based on market trends and property characteristics.',
      price: '$300 - $800',
      location: 'All Cities',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      features: 'Comparative market analysis, On-site inspection, Detailed documentation, Market trend analysis, Value enhancement recommendations',
      benefits: 'Accurate pricing for sales, Fair market value for purchases, Documentation for financing, Insurance valuation, Estate planning',
      duration: '1-2 weeks',
      status: 'Active'
    },
    {
      title: 'Real Estate Legal Consultation',
      serviceType: 'Legal Consultation',
      propertyType: 'All',
      description: 'Expert legal advice for real estate transactions. Our experienced attorneys provide guidance on all aspects of property law to protect your interests and ensure smooth transactions.',
      price: '$200 - $500 per hour',
      location: 'All Cities',
      images: ['/placeholder.jpg', '/placeholder.jpg'],
      features: 'Contract review, Title examination, Legal documentation, Dispute resolution, Regulatory compliance',
      benefits: 'Risk mitigation, Legal protection, Transaction security, Conflict resolution, Regulatory compliance',
      duration: 'As needed',
      status: 'Active'
    }
  ];

  const services = await Service.insertMany(serviceData);
  return services;
};

module.exports = seedServices;
