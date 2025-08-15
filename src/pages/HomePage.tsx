import {Link} from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle, Users, Heart, Phone, MapPin, Clock } from 'lucide-react'
import myanmar from '@/images/myanmar-disaster.png'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Protecting
                  <span className="text-red-600"> Myanmar</span>
                  <br />
                  Together
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Comprehensive disaster management and emergency response system for communities across Myanmar. 
                  Stay prepared, stay safe, stay connected.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8">
                  <Link to="/requests/assistant">
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency Help
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/awareness">
                    Learn More
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              {/* <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">24/7</div>
                  <div className="text-sm text-gray-600">Emergency Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">50+</div>
                  <div className="text-sm text-gray-600">Regions Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1000+</div>
                  <div className="text-sm text-gray-600">Lives Protected</div>
                </div>
              </div> */}
            </div>

            <div className="relative">
              <img
                src={myanmar}
                alt="Disaster response team in Myanmar"
                className="rounded-2xl shadow-2xl"
              />

            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive disaster management solutions tailored for Myanmar's unique challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Emergency Response</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  24/7 emergency response coordination with local authorities and rescue teams
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Disaster Preparedness</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Community education and training programs for disaster preparedness
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Volunteer coordination and community resilience building programs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Relief Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Coordinated relief distribution and humanitarian assistance
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Recent Events
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with the latest disaster events and responses
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4" />
                  2 days ago
                </div>
                <CardTitle className="text-lg">Flood Response in Mandalay</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Emergency response teams deployed to assist flood-affected communities in Mandalay region.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">Mandalay Region</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4" />
                  1 week ago
                </div>
                <CardTitle className="text-lg">Earthquake Preparedness Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Community training program conducted in Yangon to improve earthquake preparedness.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">Yangon Region</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4" />
                  2 weeks ago
                </div>
                <CardTitle className="text-lg">Cyclone Mocha Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ongoing recovery efforts in Rakhine State following Cyclone Mocha impact.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">Rakhine State</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Help us build a more resilient Myanmar. Volunteer, donate, or simply stay informed 
            to make a difference in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/activities">Become a Volunteer</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-red-400 hover:bg-white hover:text-red-600">
              <Link to="/donations">Make a Donation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
