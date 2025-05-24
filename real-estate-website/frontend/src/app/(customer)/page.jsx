import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import("./components/GoogleMap"), {
  ssr: false,
});

// Server component to fetch featured lands
async function getFeaturedLands() {
  // In a real app, this would fetch from your API
  // For now, we'll return mock data
  return [
    {
      id: 1,
      title: "Premium Land in Location A",
      description: "Prime location with excellent investment potential",
      price: 250000,
      image: "/land1.jpg",
    },
    {
      id: 2,
      title: "Exclusive Land in Location B",
      description: "Scenic views with modern amenities nearby",
      price: 180000,
      image: "/land2.jpg",
    },
    {
      id: 3,
      title: "Strategic Land in Location C",
      description: "Perfect for commercial development",
      price: 320000,
      image: "/land3.jpg",
    },
  ];
}

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "John Smith",
    role: "Property Investor",
    content:
      "Working with this real estate company has been a game-changer for my investment portfolio. Their expertise in land acquisition is unmatched.",
    image: "/img1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "The team helped me find the perfect land for my dream home. Their attention to detail and personalized service made the process seamless.",
    image: "/img2.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Business Owner",
    content:
      "As a commercial developer, I appreciate their thorough approach to land surveys and property assessment. Highly recommended!",
    image: "/img3.jpg",
  },
];

export default async function Home() {
  const featuredLands = await getFeaturedLands();

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative py-32 bg-cover bg-center"
        style={{ backgroundImage: 'url("/hero1.jpg")' }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Find Your Dream Land
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white">
            Discover premium land properties in prime locations with the best
            investment potential.
          </p>
          <Link
            href="/lands/available"
            className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-primary-hover"
          >
            View Available Lands
          </Link>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLands.map((land) => (
              <div
                key={land.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-300 relative">
                  {/* Use a placeholder image for now */}
                  <div className="h-48 bg-gray-300">
                    <img
                      src={land.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{land.title}</h3>
                  <p className="text-gray-600 mb-4">{land.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral font-bold">
                      ${land.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/lands/details/${land.id}`}
                      className="bg-neutral text-white px-4 py-2 rounded hover:opacity-70"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card-bg p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Estate Management</h3>
              <p className="text-gray-600">
                Professional management of your real estate assets to maximize
                value and minimize hassle.
              </p>
            </div>

            <div className="bg-card-bg p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Architectural Design
              </h3>
              <p className="text-gray-600">
                Custom architectural solutions tailored to your vision and
                requirements.
              </p>
            </div>

            <div className="bg-card-bg p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Sales of Land & Properties
              </h3>
              <p className="text-gray-600">
                Premium land and property listings with transparent transactions
                and competitive pricing.
              </p>
            </div>

            <div className="bg-card-bg p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Land Survey</h3>
              <p className="text-gray-600">
                Accurate land surveys conducted by certified professionals for
                boundary determination and mapping.
              </p>
            </div>

            <div className="bg-card-bg p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Property Rentals</h3>
              <p className="text-gray-600">
                Houses, offices, and warehouses available for rent with flexible
                terms and professional management.
              </p>
            </div>

            <div className="bg-card-bg p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">General Contracts</h3>
              <p className="text-gray-600">
                Comprehensive contracting services for construction, renovation,
                and property development projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md border-r-2 border-primary border-t-2"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                    <img
                      src={testimonial.image}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 bg-card-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Video Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-3xl shadow-md">
              <div className="aspect-w-16 aspect-h-9  mb-4 rounded">
                {/* Replace with actual video in production */}
                <div className="flex items-center justify-center h-full">
                  <video
                    src={"https://res.cloudinary.com/dp6pmwcqu/video/upload/v1748090417/vid2_mufx44.mp4"}
                    controls
                    className="w-full h-full rounded-3xl"
                  ></video>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Client Success Story: The Johnson Family
              </h3>
              <p className="text-gray-600">
                Hear how we helped the Johnson family find their perfect
                property and navigate the buying process with ease.
              </p>
            </div>
            <div className="bg-white p-4  shadow-md rounded-3xl">
              <div className="aspect-w-16 aspect-h-9  mb-4 rounded">
                {/* Replace with actual video in production */}
                <div className="flex items-center justify-center h-full ">
                  <video
                    src={"https://res.cloudinary.com/dp6pmwcqu/video/upload/v1748090185/vid1_bho9nh.mp4"}
                    controls
                    className="w-full h-full rounded-3xl"
                  ></video>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Business Development: Smith Commercial
              </h3>
              <p className="text-gray-600">
                Learn how our land survey and architectural design services
                helped Smith Commercial develop their new headquarters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're looking to buy, rent, or develop, our team of experts
            is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/lands/available"
              className="bg-white text-primary px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary-hover"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="bg-primary-text text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary-hover"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="pb-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Stay updated with the latest property listings, market trends, and
              exclusive offers.
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover hover:text-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Company Location Map */}
      <section className="py-16 bg-card-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Visit Our Office
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="aspect-video bg-gray-200 mb-6 rounded">
              {/* Leaflet Map container */}
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <LeafletMap />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Our Location</h3>
                <p className="text-gray-600 mb-2">123 Real Estate Avenue</p>
                <p className="text-gray-600 mb-2">
                  Property District, City 12345
                </p>
                <p className="text-gray-600 mb-4">Country</p>
                <Link
                  href="https://maps.google.com"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Get Directions
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Phone:</span> +123 456 7890
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Email:</span>{" "}
                  info@realestate.com
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Hours:</span> Monday-Friday:
                  9am-5pm
                </p>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card-bg p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Premium Locations</h3>
              <p className="text-gray-600">
                We offer land in the most sought-after locations with high
                appreciation potential.
              </p>
            </div>
            <div className="bg-card-bg p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                Verified Properties
              </h3>
              <p className="text-gray-600">
                All our properties are legally verified with clear titles and
                documentation.
              </p>
            </div>
            <div className="bg-card-bg p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                Flexible Payment Plans
              </h3>
              <p className="text-gray-600">
                Choose from various payment options that suit your financial
                situation.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/why-us"
              className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-primary-hover"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
