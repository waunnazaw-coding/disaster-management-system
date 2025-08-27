
// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Shield,
//   Users,
//   Heart,
//   Award,
//   Target,
//   Eye,
//   Globe,
//   Handshake,
// } from "lucide-react";
// import PublicPartners from "@/components/partner/publicPartners";
// import { Link } from "react-router-dom";

// const teamMembers = [
//   {
//     name: "Wanna Zaw",
//     role: "Director",
//     image: "/placeholder.svg?height=200&width=200",
//     bio: "Leading disaster management expert with 15+ years experience in Myanmar.",
//   },
//   {
//     name: "Thant Htoo Zaw",
//     role: "Operations Manager",
//     image: "/placeholder.svg?height=200&width=200",
//     bio: "Coordinates emergency response operations across all regions of Myanmar.",
//   },
//   {
//     name: "Aung Zin Htet",
//     role: "Community Outreach",
//     image: "/placeholder.svg?height=200&width=200",
//     bio: "Builds partnerships with local communities and volunteer networks.",
//   },
//   {
//     name: "Aye Thida Aung",
//     role: "Training Coordinator",
//     image: "/placeholder.svg?height=200&width=200",
//     bio: "Develops and delivers disaster preparedness training programs.",
//   },
// ];

// const achievements = [
//   {
//     number: "50+",
//     label: "Regions Covered",
//     icon: <Globe className="h-6 w-6" />,
//   },
//   {
//     number: "1000+",
//     label: "Lives Protected",
//     icon: <Shield className="h-6 w-6" />,
//   },
//   {
//     number: "500+",
//     label: "Volunteers Trained",
//     icon: <Users className="h-6 w-6" />,
//   },
//   {
//     number: "24/7",
//     label: "Emergency Response",
//     icon: <Heart className="h-6 w-6" />,
//   },
// ];

// const values = [
//   {
//     title: "Community First",
//     description:
//       "We prioritize the needs and safety of Myanmar communities above all else.",
//     icon: <Users className="h-8 w-8" />,
//   },
//   {
//     title: "Rapid Response",
//     description:
//       "Quick and effective emergency response when disasters strike.",
//     icon: <Shield className="h-8 w-8" />,
//   },
//   {
//     title: "Local Knowledge",
//     description:
//       "Deep understanding of Myanmar's unique geographical and cultural context.",
//     icon: <Heart className="h-8 w-8" />,
//   },
//   {
//     title: "Collaboration",
//     description:
//       "Working together with government, NGOs, and communities for better outcomes.",
//     icon: <Handshake className="h-8 w-8" />,
//   },
// ];

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
//             About DisasterGuard Myanmar
//           </h1>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
//             We are dedicated to protecting communities across Myanmar through
//             comprehensive disaster management, emergency response, and community
//             resilience building programs.
//           </p>
//         </div>

//         {/* Mission & Vision */}
//         <div className="grid lg:grid-cols-2 gap-12 mb-16">
//           <Card className="border-0 shadow-lg">
//             <CardHeader className="text-center pb-6">
//               <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                 <Target className="h-8 w-8 text-red-600" />
//               </div>
//               <CardTitle className="text-2xl">Our Mission</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription className="text-center text-lg leading-relaxed">
//                 To build resilient communities across Myanmar by providing
//                 comprehensive disaster management services, emergency response
//                 coordination, and community-based preparedness programs that
//                 save lives and reduce suffering.
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-lg">
//             <CardHeader className="text-center pb-6">
//               <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <Eye className="h-8 w-8 text-blue-600" />
//               </div>
//               <CardTitle className="text-2xl">Our Vision</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription className="text-center text-lg leading-relaxed">
//                 A Myanmar where every community is prepared, protected, and
//                 resilient against disasters, with the knowledge and resources
//                 needed to respond effectively to emergencies and recover
//                 quickly.
//               </CardDescription>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Our Story */}
//         <div className="mb-16">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-6">
//                 Our Story
//               </h2>
//               <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
//                 <p>
//                   DisasterGuard Myanmar was founded in 2018 following the
//                   devastating impacts of Cyclone Nargis and subsequent natural
//                   disasters that highlighted the critical need for comprehensive
//                   disaster management in Myanmar.
//                 </p>
//                 <p>
//                   Our organization emerged from the recognition that Myanmar's
//                   unique geographical position, diverse topography, and monsoon
//                   climate create specific disaster risks that require
//                   locally-adapted solutions and community-centered approaches.
//                 </p>
//                 <p>
//                   Since our inception, we have worked tirelessly to build
//                   partnerships with local communities, government agencies, and
//                   international organizations to create a robust disaster
//                   management ecosystem that protects lives and livelihoods
//                   across Myanmar.
//                 </p>
//               </div>
//             </div>
//             <div className="relative">
//               <img
//                 src="/placeholder.svg?height=500&width=600"
//                 alt="Our story"
//                 className="rounded-2xl shadow-2xl"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Our Values */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
//             Our Values
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {values.map((value, index) => (
//               <Card
//                 key={index}
//                 className="border-0 shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 <CardHeader className="text-center pb-4">
//                   <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                     {value.icon}
//                   </div>
//                   <CardTitle className="text-xl">{value.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className="text-center">
//                     {value.description}
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Team */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
//             Our Leadership Team
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {teamMembers.map((member, index) => (
//               <Card
//                 key={index}
//                 className="border-0 shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 <CardHeader className="text-center pb-4">
//                   <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
//                     <img
//                       src={member.image || "/placeholder.svg"}
//                       alt={member.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <CardTitle className="text-xl">{member.name}</CardTitle>
//                 </CardHeader>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Partners Section */}
//         <div className="mb-16">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Our Valued Partners
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               We collaborate with organizations that share our commitment to
//               building resilience and protecting communities across Myanmar.
//             </p>
//           </div>

//           {/* Public Partners Component */}
//           <PublicPartners />
//         </div>

//         {/* CTA */}
//         <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
//           <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
//           <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
//             Help us build a more resilient Myanmar. Whether through
//             volunteering, partnerships, or community engagement, there are many
//             ways to get involved.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link to="/donations">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="text-lg px-8 border-white text-black hover:bg-white hover:text-red-600"
//               >
//                 Donate
//               </Button>
//             </Link>
//             <Link to="/contact">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="text-lg px-8 border-white text-black hover:bg-white hover:text-red-600"
//               >
//                 Partner With Us
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Heart,
  Target,
  Eye,
  Globe,
  Handshake,
} from "lucide-react";
import PublicPartners from "@/components/partner/publicPartners";
import { Link } from "react-router-dom";
import ayethidaraungImage from "./assets/pic3.png"
import thzImage from "./assets/pic2.png"
import wnzImage from "./assets/pic4.png"
import azhImage from "./assets/pic5.png"
import ourstoryImage from "./assets/disastermanagement.jpg"

const teamMembers = [
  {
    name: "Wanna Zaw",
    role: "Director",
    image: wnzImage,
    bio: "Leading disaster management expert with 15+ years experience in Myanmar.",
  },
  {
    name: "Thant Htoo Zaw",
    role: "Operations Manager",
    image: thzImage,
    bio: "Coordinates emergency response operations across all regions of Myanmar.",
  },
  {
    name: "Aung Zin Htet",
    role: "Community Outreach",
    image: azhImage,
    bio: "Builds partnerships with local communities and volunteer networks.",
  },
  {
    name: "Aye Thida Aung",
    role: "Training Coordinator",
    image: ayethidaraungImage,
    bio: "Develops and delivers disaster preparedness training programs.",
  },
];

const values = [
  {
    title: "Community First",
    description:
      "We prioritize the needs and safety of Myanmar communities above all else.",
    icon: <Users className="h-8 w-8" />,
  },
  {
    title: "Rapid Response",
    description:
      "Quick and effective emergency response when disasters strike.",
    icon: <Shield className="h-8 w-8" />,
  },
  {
    title: "Local Knowledge",
    description:
      "Deep understanding of Myanmar's unique geographical and cultural context.",
    icon: <Heart className="h-8 w-8" />,
  },
  {
    title: "Collaboration",
    description:
      "Working together with government, NGOs, and communities for better outcomes.",
    icon: <Handshake className="h-8 w-8" />,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About DisasterGuard Myanmar
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We are dedicated to protecting communities across Myanmar through
            comprehensive disaster management, emergency response, and community
            resilience building programs.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg leading-relaxed">
                To build resilient communities across Myanmar by providing
                comprehensive disaster management services, emergency response
                coordination, and community-based preparedness programs that
                save lives and reduce suffering.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg leading-relaxed">
                A Myanmar where every community is prepared, protected, and
                resilient against disasters, with the knowledge and resources
                needed to respond effectively to emergencies and recover
                quickly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  DisasterGuard Myanmar was founded in 2018 following the
                  devastating impacts of Cyclone Nargis and subsequent natural
                  disasters that highlighted the critical need for comprehensive
                  disaster management in Myanmar.
                </p>
                <p>
                  Our organization emerged from the recognition that Myanmar's
                  unique geographical position, diverse topography, and monsoon
                  climate create specific disaster risks that require
                  locally-adapted solutions and community-centered approaches.
                </p>
                <p>
                  Since our inception, we have worked tirelessly to build
                  partnerships with local communities, government agencies, and
                  international organizations to create a robust disaster
                  management ecosystem that protects lives and livelihoods
                  across Myanmar.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={ourstoryImage}
                alt="Our story"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-16">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Valued Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collaborate with organizations that share our commitment to
              building resilience and protecting communities across Myanmar.
            </p>
          </div> */}

          {/* Public Partners Component with Infinite Animation */}
          <PublicPartners />
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Help us build a more resilient Myanmar. Whether through
            volunteering, partnerships, or community engagement, there are many
            ways to get involved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donations">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-black hover:bg-white hover:text-red-600"
              >
                Donate
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-black hover:bg-white hover:text-red-600"
              >
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}