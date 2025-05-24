import Image from "next/image";
import Link from "next/link";

export default function WhyUs() {
  const reasons = [
    {
      title: "Premium Locations",
      description:
        "We carefully select properties in prime locations with high appreciation potential and excellent investment returns.",
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Legal Verification",
      description:
        "All our properties undergo rigorous legal verification to ensure clear titles and proper documentation.",
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Flexible Payment Plans",
      description:
        "We offer customized payment plans to suit your financial situation, making land ownership accessible to more people.",
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Expert Guidance",
      description:
        "Our team of real estate experts provides personalized guidance throughout your investment journey.",
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      title: "Transparent Process",
      description:
        "We maintain complete transparency in all our dealings, with no hidden fees or unexpected charges.",
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "After-Sales Support",
      description:
        "Our relationship doesn't end with the sale. We provide ongoing support and assistance even after your purchase.",
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.5 9.5c.32-1.283 1.323-1.5 2.5-1.5 1.172 0 2.181.22 2.5 1.5.32 1.283-.363 2.5-2.5 3.5-2.137-1-2.82-2.217-2.5-3.5z"
          />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      name: "David Johnson",
      role: "Property Investor",
      content:
        "I've invested in multiple properties with this company, and each experience has been exceptional. Their attention to detail and commitment to quality is unmatched in the industry.",
      image: "/placeholder.jpg",
    },
    {
      name: "Sarah Williams",
      role: "First-time Buyer",
      content:
        "As a first-time land buyer, I was nervous about the process. The team guided me through every step, making it simple and stress-free. I couldn't be happier with my investment.",
      image: "/placeholder.jpg",
    },
    {
      name: "Michael Thompson",
      role: "Real Estate Developer",
      content:
        "The quality of land and the strategic locations offered by this company have been instrumental in the success of our development projects. Their professional approach sets them apart.",
      image: "/placeholder.jpg",
    },
  ];

  const stats = [
    { value: "10+", label: "Years of Experience" },
    { value: "500+", label: "Properties Sold" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "5000+", label: "Happy Clients" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-card-bg py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Us</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            We're committed to providing the best real estate experience with
            premium properties, transparent processes, and exceptional customer
            service.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-card-bg rounded-lg">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">{reason.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-card-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
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

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Land?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Browse our available properties or contact us to discuss your
            specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/lands/available"
              className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-primary-hover"
            >
              View Available Lands
            </Link>
            <Link
              href="/contact"
              className="bg-white border border-primary text-primary px-6 py-3 rounded-lg text-lg hover:bg-card-bg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
