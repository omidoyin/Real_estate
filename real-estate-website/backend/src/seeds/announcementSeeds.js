const Announcement = require('../models/Announcement');

const seedAnnouncements = async () => {
  const announcementData = [
    {
      title: 'New Properties Available',
      content: 'We have just added several new premium properties to our listings. Check them out in the available properties section!',
      type: 'News',
      startDate: new Date('2023-05-01'),
      endDate: new Date('2023-06-30'),
      status: 'Active',
      target: 'All Users',
      image: '/placeholder.jpg'
    },
    {
      title: 'Special Discount on Selected Properties',
      content: 'For a limited time, enjoy special discounts on selected premium properties. Contact our sales team for more information.',
      type: 'Promotion',
      startDate: new Date('2023-05-15'),
      endDate: new Date('2023-07-15'),
      status: 'Active',
      target: 'Customers',
      image: '/placeholder.jpg'
    },
    {
      title: 'Website Maintenance Notice',
      content: 'Our website will undergo scheduled maintenance on June 10, 2023, from 2:00 AM to 5:00 AM. During this time, the website may be temporarily unavailable.',
      type: 'Update',
      startDate: new Date('2023-06-05'),
      endDate: new Date('2023-06-11'),
      status: 'Scheduled',
      target: 'All Users',
      image: null
    },
    {
      title: 'New Payment Options Available',
      content: 'We have added new payment options to make your property purchases more convenient. You can now pay using various digital payment methods.',
      type: 'Update',
      startDate: new Date('2023-04-20'),
      endDate: new Date('2023-06-20'),
      status: 'Active',
      target: 'Customers',
      image: '/placeholder.jpg'
    },
    {
      title: 'Holiday Office Hours',
      content: 'Please note that our offices will be closed on May 29, 2023, for the Memorial Day holiday. We will resume normal business hours on May 30, 2023.',
      type: 'General',
      startDate: new Date('2023-05-25'),
      endDate: new Date('2023-05-30'),
      status: 'Active',
      target: 'All Users',
      image: null
    }
  ];

  const announcements = await Announcement.insertMany(announcementData);
  return announcements;
};

module.exports = seedAnnouncements;
