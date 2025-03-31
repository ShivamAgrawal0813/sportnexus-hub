
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sportnexus-darkGray text-white">
      <div className="container mx-auto p-8 sm:p-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-md bg-sportnexus-green flex items-center justify-center text-white font-bold mr-2">
                SN
              </div>
              <h3 className="text-xl font-bold">SportNexus</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Your all-in-one platform for sports venues, equipment rentals, and expert tutorials.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  Venue Booking
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  Equipment Rental
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-sportnexus-green transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-3 text-sportnexus-green" />
                <span>info@sportnexus.com</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3 text-sportnexus-green" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SportNexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
