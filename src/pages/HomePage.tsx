"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Users, Heart, Loader2 } from "lucide-react"
import nargis8 from "@/images/nargis8.jpg"
import nargis1 from "@/images/nargis1.jpg"
import nargis2 from "@/images/nargis2.jpg"
import hungry1 from "@/images/hungry1.jpg"
import { useActivityStore } from '@/store/activityStore'
import ActivityCard from '@/components/activity/ActivityCard'
import DonationToast from '@/components/donations/DonationToast'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import herosection from "@/images/hero-section.avif"
import herosection1 from "@/images/hero-section1.avif"
import herosection2 from "@/images/hero-section2.avif"

export default function HomePage() {
  const { activities, loading } = useActivityStore()
  const navigate = useNavigate();

  useEffect(() => {
    if (activities.length === 0) {
      useActivityStore.getState().fetchActivities()
    }
  }, [])

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
    .slice(0, 3)

  interface Slide {
    image: string
    title: string
    description: string
  }

  const slides: Slide[] = [
    {
      image: herosection,
      title: "Together We Can Save Lives",
      description:
        "Join hands to provide immediate relief and long-term recovery for families struck by disaster. Your support today means hope for tomorrow.",
    },
    {
      image: herosection1,
      title: "Be the Hope in Times of Crisis",
      description:
        "When disaster strikes, every second counts. Stand with us to deliver food, shelter, and emergency care where it’s needed most.",
    },
    {
      image: herosection2,
      title: "Every Contribution Matters",
      description:
        "From blankets to clean water, your donation fuels life-saving aid. No act of kindness is ever too small in saving lives.",
    },
  ]

  return (
    <div className="min-h-screen text-gray-900">
      {/* Hero Carousel */}
      <section className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[73vh] flex items-center overflow-hidden">
                  {/* Background Image with Motion */}
                  <motion.img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/60" />

                  {/* Text Content */}
                  <motion.div
                    className="relative z-10 max-w-4xl px-6 lg:px-40 text-left text-white"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <motion.h1
                      className="text-3xl md:text-5xl font-extrabold leading-snug mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      className="mb-6 text-base md:text-lg text-gray-200 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    >
                      {slide.description}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                      className="flex flex-wrap gap-3 mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.9 }}
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-red-600 hover:bg-red-700 text-white text-base px-6 py-3 rounded-lg shadow-lg">
                          <Link to="requests/assistant">Emergency Help</Link>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-base px-6 py-3 rounded-lg shadow-lg">
                          <Link to="donations">Donate Now</Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Recent Activities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Activities</h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Stay updated on our latest efforts, community initiatives, and events making a difference across Myanmar.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onView={() => navigate(`/activities/${activity.id}`)}
                isAdmin={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-base md:text-lg">
              No recent activities yet. <span className="font-semibold">Be the first to contribute or join an upcoming event!</span>
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-medium text-base px-6 py-3 rounded-lg shadow-md"
          >
            <Link to="/activities">Explore All Activities</Link>
          </Button>
        </div>
      </section>


      {/* Donation CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative py-16 bg-red-700 overflow-hidden"
      >
        <img
          src={nargis8}
          alt="Disaster Relief"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Make a Difference Today
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-red-100 max-w-2xl mx-auto mb-8"
          >
            Your donations help provide urgent relief, food, shelter, and medical aid to communities affected by disasters across Myanmar.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { title: "Emergency Food", img: hungry1, desc: "Provide essential meals to families in crisis." },
              { title: "Medical Aid", img: nargis1, desc: "Support life-saving healthcare for disaster victims." },
              { title: "Shelter & Supplies", img: nargis2, desc: "Help rebuild homes and provide basic necessities." }
            ].map((item) => (
              <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow border-0">
                <img src={item.img} alt={item.title} className="rounded-t-xl object-cover h-40 w-full" />
                <CardContent className="text-center p-4">
                  <CardTitle className="text-base md:text-lg font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-700">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base px-6 py-3">
              <Link to="/donations">Donate Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-6 py-3 border-white text-red-100 hover:bg-white hover:text-red-700">
              <Link to="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Services</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Disaster management solutions customized for Myanmar's communities: rapid response, preparedness, and relief.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {[
            { title: "Emergency Response", icon: AlertTriangle, color: "red", description: "24/7 emergency coordination and rescue operations." },
            { title: "Disaster Preparedness", icon: Shield, color: "blue", description: "Community training and awareness programs." },
            { title: "Community Support", icon: Users, color: "green", description: "Volunteer coordination and resilience building." },
            { title: "Relief Operations", icon: Heart, color: "purple", description: "Efficient relief distribution and humanitarian aid." },
          ].map((service) => (
            <motion.div
              key={service.title}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto h-14 w-14 bg-${service.color}-100 rounded-full flex items-center justify-center mb-3`}>
                    <service.icon className={`h-7 w-7 text-${service.color}-600`} />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-center">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <DonationToast />
    </div>
  )
}
