
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sportnexus-blue">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-white">SportNexus</h2>
            <p className="mt-4 text-base text-gray-300">
              Your all-in-one platform for sports venues, equipment rentals, and expert tutorials.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-300 hover:text-white">
                  Venue Booking
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="text-gray-300 hover:text-white">
                  Equipment Rental
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-300 hover:text-white">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@sportnexus.com</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} SportNexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
