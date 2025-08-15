import { Link } from 'react-router-dom'
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl">DisasterGuard</span>
                <p className="text-sm text-red-400">Myanmar</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Protecting communities across Myanmar through comprehensive disaster management and emergency response systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Event History
                </Link>
              </li>
              <li>
                <Link
                  to="/activities"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  to="/awareness"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Awareness
                </Link>
              </li>
              <li>
                <Link
                  to="/donation"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Donation
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Emergency</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-red-400" />
                <span>199 (Fire)</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-red-400" />
                <span>192 (Police)</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-red-400" />
                <span>191 (Medical)</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 text-red-400" />
                <span>info@disasterguard.mm</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-red-400" />
                <span>Yangon, Myanmar</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com/disasterguard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/disasterguard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/disasterguard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DisasterGuard Myanmar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
