// import React from 'react';
// import { ContactForm } from '@/components/contact/ContactForm';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Mail, Phone, MapPin, Clock } from 'lucide-react';

// const ContactUs: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Have questions or need assistance? We're here to help. Reach out to us through any of the following channels.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-3 mb-2">
//                 <Mail className="h-6 w-6 text-blue-600" />
//                 <CardTitle>Email Us</CardTitle>
//               </div>
//               <CardDescription>Send us a message anytime</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-blue-600 font-medium">support@disasterguard.org</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-3 mb-2">
//                 <Phone className="h-6 w-6 text-green-600" />
//                 <CardTitle>Call Us</CardTitle>
//               </div>
//               <CardDescription>Available during business hours</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-green-600 font-medium">+95 9 123 456 789</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-3 mb-2">
//                 <MapPin className="h-6 w-6 text-red-600" />
//                 <CardTitle>Visit Us</CardTitle>
//               </div>
//               <CardDescription>Our office location</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-red-600 font-medium">123 Disaster Response St, Yangon, Myanmar</p>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//           <div>
//             <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
//             <p className="text-gray-600 mb-6">
//               Fill out the form and our team will get back to you within 24 hours. 
//               For urgent matters, please call our emergency hotline.
//             </p>
            
//             <div className="flex items-center gap-3 mb-4">
//               <Clock className="h-5 w-5 text-gray-500" />
//               <div>
//                 <p className="font-medium">Response Time</p>
//                 <p className="text-sm text-gray-500">Within 24 hours for non-urgent matters</p>
//               </div>
//             </div>
            
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <h3 className="font-semibold text-blue-800 mb-2">Emergency Contact</h3>
//               <p className="text-blue-700">
//                 For immediate assistance during disasters, please call our 24/7 emergency hotline: 
//                 <span className="font-bold"> 199 | 192 | 191</span>
//               </p>
//             </div>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Send us a Message</CardTitle>
//               <CardDescription>
//                 We'll get back to you as soon as possible
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ContactForm />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;



import type React from "react"
import { ContactForm } from "@/components/contact/ContactForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, Users, Handshake, Globe, Shield, Heart, Award } from "lucide-react"

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to make a difference? Whether you're seeking emergency assistance, exploring partnership
              opportunities, or want to join our mission, we're here to connect and collaborate for a safer tomorrow.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Email Support</CardTitle>
              <CardDescription>Get responses within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-primary font-semibold text-lg mb-2">support@disasterguard.org</p>
              <p className="text-sm text-muted-foreground">For general inquiries and support</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Emergency Hotline</CardTitle>
              <CardDescription>24/7 immediate assistance</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-primary font-semibold text-lg mb-2">+95 9 123 456 789</p>
              <p className="text-sm text-muted-foreground">Available round the clock</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Visit Our Office</CardTitle>
              <CardDescription>Meet our team in person</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-primary font-semibold text-lg mb-2">123 Disaster Response St</p>
              <p className="text-sm text-primary-foreground">Yangon, Myanmar</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and our team will get back to you promptly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Contact Information & Emergency */}
          <div className="space-y-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">General Inquiries</span>
                  <span className="text-muted-foreground">Within 24 hours</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Partnership Requests</span>
                  <span className="text-muted-foreground">Within 48 hours</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Emergency Support</span>
                  <span className="text-muted-foreground font-semibold">Immediate</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-destructive/5 border-destructive/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-destructive flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  For immediate assistance during disasters or emergencies, contact our 24/7 hotline:
                </p>
                <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-2xl font-bold text-destructive mb-2">199 | 192 | 191</p>
                  <p className="text-sm text-muted-foreground">Available 24/7 for emergency response</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partnership Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-lg mb-16">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Handshake className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-4">Partnership Opportunities</CardTitle>
            <CardDescription className="text-lg max-w-3xl mx-auto">
              Join forces with us to create lasting impact in disaster preparedness and response. Together, we can build
              more resilient communities and save lives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Corporate Partners</h3>
                <p className="text-muted-foreground text-sm">
                  Collaborate on large-scale disaster response initiatives and community resilience programs
                </p>
              </div>
              <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">NGO Partnerships</h3>
                <p className="text-muted-foreground text-sm">
                  Join our network of humanitarian organizations working together for disaster relief
                </p>
              </div>
              <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Government Relations</h3>
                <p className="text-muted-foreground text-sm">
                  Partner with us on policy development and emergency response coordination
                </p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Ready to Partner With Us?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you're a corporation looking to make a social impact, an NGO seeking collaboration, or a
                government agency interested in partnership, we'd love to explore how we can work together.
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                  <Heart className="h-5 w-5 mr-2" />
                  Explore Partnerships
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-3 bg-transparent"
                >
                  Download Partnership Guide
                </Button>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContactUs
