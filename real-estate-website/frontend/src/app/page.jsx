import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-blue">
            Real Estate
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-accent-green">
              Home
            </Link>
            <Link href="/about" className="hover:text-accent-green">
              About
            </Link>
            <Link href="/lands/available" className="hover:text-accent-green">
              Available Lands
            </Link>
            <Link href="/why-us" className="hover:text-accent-green">
              Why Us
            </Link>
            <Link href="/blog" className="hover:text-accent-green">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-accent-green">
              Contact
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="/auth/login" className="hover:text-accent-green">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-light-blue py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Dream Land
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Discover premium land properties in prime locations with the best
              investment potential.
            </p>
            <Link
              href="/lands/available"
              className="bg-primary-blue text-white px-6 py-3 rounded-lg text-lg hover:bg-accent-green"
            >
              View Available Lands
            </Link>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* This would be populated with data from an API */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Premium Land in Location A
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Prime location with excellent investment potential
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-blue font-bold">
                      $250,000
                    </span>
                    <Link
                      href="/lands/details/1"
                      className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Exclusive Land in Location B
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Scenic views with modern amenities nearby
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-blue font-bold">
                      $180,000
                    </span>
                    <Link
                      href="/lands/details/2"
                      className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Strategic Land in Location C
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Perfect for commercial development
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-blue font-bold">
                      $320,000
                    </span>
                    <Link
                      href="/lands/details/3"
                      className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Real Estate</h3>
              <p className="text-gray-600">
                Your trusted partner in finding the perfect land property for
                your needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-primary-blue"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lands/available"
                    className="text-gray-600 hover:text-primary-blue"
                  >
                    Available Lands
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-primary-blue"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/book-inspection"
                    className="text-gray-600 hover:text-primary-blue"
                  >
                    Book Inspection
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <address className="not-italic text-gray-600">
                <p>123 Real Estate Street</p>
                <p>City, State 12345</p>
                <p>Email: info@realestate.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} Real Estate. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
