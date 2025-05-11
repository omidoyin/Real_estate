const Team = require('../models/Team');

const seedTeams = async () => {
  const teamData = [
    {
      name: 'John Smith',
      position: 'CEO',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      photo: '/placeholder.jpg',
      bio: 'John has over 20 years of experience in real estate and has led the company to become one of the top real estate firms in the region.',
      status: 'Active',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/johnsmith',
        twitter: 'https://twitter.com/johnsmith',
        facebook: 'https://facebook.com/johnsmith',
        instagram: 'https://instagram.com/johnsmith'
      }
    },
    {
      name: 'Sarah Johnson',
      position: 'Sales Manager',
      email: 'sarah@example.com',
      phone: '(555) 234-5678',
      photo: '/placeholder.jpg',
      bio: 'Sarah specializes in luxury properties and has a proven track record of successful sales in high-end real estate markets.',
      status: 'Active',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        facebook: 'https://facebook.com/sarahjohnson',
        instagram: 'https://instagram.com/sarahjohnson'
      }
    },
    {
      name: 'Michael Brown',
      position: 'Property Consultant',
      email: 'michael@example.com',
      phone: '(555) 345-6789',
      photo: '/placeholder.jpg',
      bio: 'Michael has a deep understanding of the local real estate market and helps clients find properties that perfectly match their needs and preferences.',
      status: 'Active',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/michaelbrown',
        twitter: 'https://twitter.com/michaelbrown',
        facebook: 'https://facebook.com/michaelbrown',
        instagram: 'https://instagram.com/michaelbrown'
      }
    },
    {
      name: 'Emily Davis',
      position: 'Marketing Specialist',
      email: 'emily@example.com',
      phone: '(555) 456-7890',
      photo: '/placeholder.jpg',
      bio: 'Emily creates innovative marketing strategies to showcase properties and reach potential buyers through various digital and traditional channels.',
      status: 'On Leave',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/emilydavis',
        twitter: 'https://twitter.com/emilydavis',
        facebook: 'https://facebook.com/emilydavis',
        instagram: 'https://instagram.com/emilydavis'
      }
    },
    {
      name: 'David Wilson',
      position: 'Property Manager',
      email: 'david@example.com',
      phone: '(555) 567-8901',
      photo: '/placeholder.jpg',
      bio: 'David oversees property management services, ensuring that all properties are well-maintained and that tenant relationships are positive and productive.',
      status: 'Active',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/davidwilson',
        twitter: 'https://twitter.com/davidwilson',
        facebook: 'https://facebook.com/davidwilson',
        instagram: 'https://instagram.com/davidwilson'
      }
    }
  ];

  const teams = await Team.insertMany(teamData);
  return teams;
};

module.exports = seedTeams;
