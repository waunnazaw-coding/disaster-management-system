'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Facebook, Send, Building } from 'lucide-react'

export default function PartnerModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          variant="outline" 
          className="text-lg px-8 border-white text-black hover:bg-white hover:text-red-600"
        >
          Partner With Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden">
        <div className="grid md:grid-cols-1">
          {/* Contact Information Side */}
          <div className="bg-red-600 p-8 text-white">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl mb-2">Get In Touch</DialogTitle>
              <DialogDescription className="text-red-100">
                Reach out to discuss partnership opportunities with DisasterGuard Myanmar.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mt-0.5 mr-3" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-red-100">info@disasterguard-mm.org</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mt-0.5 mr-3" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-red-100">+95 1 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mt-0.5 mr-3" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-red-100">
                    123 Disaster Preparedness Road<br />
                    Yangon, Myanmar
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Facebook className="h-5 w-5 mt-0.5 mr-3" />
                <div>
                  <p className="font-semibold">Facebook</p>
                  <p className="text-red-100">fb.com/DisasterGuardMyanmar</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Side */}
          {/* <div className="p-8">
            <h3 className="text-xl font-semibold mb-6">Partnership Inquiry</h3>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="organization" className="pl-10" placeholder="Your organization" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Full name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" className="pl-10" placeholder="your.email@example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="phone" type="tel" className="pl-10" placeholder="+95 ..." />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your organization and how you'd like to partner with us..." 
                  rows={4}
                />
              </div>
              
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                <Send className="mr-2 h-4 w-4" /> Send Inquiry
              </Button>
            </form>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}