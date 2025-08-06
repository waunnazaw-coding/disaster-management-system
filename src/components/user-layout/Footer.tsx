import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-700 mt-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DisasterGuard</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Connecting communities during disasters. Report incidents, request help, 
              and support recovery efforts through our platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/preparedness" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Preparedness Guides
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">response@disasterguard.org</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Emergency Hotline: 1-800-DISASTER</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Global Response Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-500 mb-2 md:mb-0">
              © 2024 DisasterGuard. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-gray-500 hover:text-red-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-red-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-red-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}