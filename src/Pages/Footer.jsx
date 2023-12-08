import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 font-secondary">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Column 1 */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold">Newsletter</h2>
            <p>
              Subscribe to get seasonal offers, farming tips, articles, news,
              and blogs regularly.
            </p>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full py-2 px-4 rounded-full bg-gray-700 text-white"
              />
              <button className="mt-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600">
                Subscribe
              </button>
            </div>
          </div>

          {/* Column 2 */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold">Information</h2>
            <ul className="mt-4 space-y-4 ">
              <li>
                <a href="#" className="hover:text-blue-600">
                  About Agritell.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Products Ideas, Roadmap, and Announcements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold">Categories</h2>
            <ul className="mt-4 space-y-4 ">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Brands
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Insecticides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Fungicides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Micro-nutrients
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Organic Products
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold">Policies</h2>
            <ul className="mt-4 space-y-4 ">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Cancellation and Refund
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Preventive Policy for COVID-19
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
