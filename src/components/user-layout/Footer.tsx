import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-100 border-t border-blue-800 mt-8 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DisasterGuard</span>
            </div>
            <p className="text-blue-200 text-sm mb-2 max-w-md">
              Connecting communities during disasters. Report incidents, request help, and support recovery efforts through our platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-300 hover:text-blue-500"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-blue-300 hover:text-blue-500"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-blue-300 hover:text-pink-400"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-blue-200 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/report" className="text-blue-200 hover:text-white transition-colors">Report</Link></li>
              <li><Link to="/donate" className="text-blue-200 hover:text-white transition-colors">Donate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-orange-400" /><span>help@disasterguard.org</span></div>
              <div className="flex items-center space-x-2"><Phone className="h-4 w-4 text-orange-400" /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-orange-400" /><span>Emergency Response Center</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-4 text-center">
          <p className="text-blue-400 text-xs">© 2024 DisasterGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
