export const metadata = {
  title: 'About Us | Real Estate Website',
  description: 'Learn more about our real estate company and our mission',
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Our Company</h1>
      
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2010, our real estate company has grown from a small local agency to a trusted name in the property market. We specialize in helping clients find the perfect land for their needs, whether it's for residential development, commercial use, or investment purposes.
          </p>
          <p className="text-gray-700">
            With over a decade of experience, we've helped thousands of clients achieve their real estate goals and build their dreams from the ground up.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to provide exceptional real estate services with integrity, transparency, and professionalism. We aim to help our clients make informed decisions by offering expert advice, detailed property information, and personalized support throughout their real estate journey.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with honesty and transparency, ensuring that our clients can trust us completely.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from property selection to client communication.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Client-Focused</h3>
              <p className="text-gray-600">
                Our clients' needs and satisfaction are at the center of everything we do.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace new technologies and approaches to provide the best possible service.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Our team consists of experienced real estate professionals who are passionate about helping clients find their ideal properties. With diverse expertise in various aspects of real estate, our team is equipped to handle all your property needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team members would be dynamically loaded in a real application */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Jane Smith</h3>
              <p className="text-gray-600">Head of Sales</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Michael Johnson</h3>
              <p className="text-gray-600">Property Consultant</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
