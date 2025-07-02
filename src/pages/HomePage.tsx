import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"../components/ui/card"
import { AlertTriangle, Shield, Users, Heart, TrendingUp, Clock,Building2, CheckCircle, MapPin,Phone } from "lucide-react"
import { DisasterEvents } from "../components/disaster/DisastetEvents"

export default function HomePage() {
 
  const stats = [
    {
      icon: AlertTriangle,
      value: "1,247",
      label: "Disasters Reported",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Users,
      value: "15,892",
      label: "People Helped",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Building2,
      value: "89",
      label: "Partner Organizations",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: CheckCircle,
      value: "2,156",
      label: "Requests Completed",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]
const actions = [
  {
    title: "Report Disaster",
    description: "Submit a new disaster report to alert authorities",
    icon: AlertTriangle,
    href: "/report",
    color: "from-red-600 to-orange-600",
    iconColor: "text-red-600"
  },
  {
    title: "Donate Now",
    description: "Support affected communities with your contribution",
    icon: Heart,
    href: "/donate",
    color: "from-blue-600 to-purple-600",
    iconColor: "text-blue-600"
  },
  {
    title: "Find Help",
    description: "Locate nearby shelters and assistance centers",
    icon: MapPin,
    href: "/helpcenter",
    color: "from-green-600 to-emerald-600",
    iconColor: "text-green-600"
  }
];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden m-4">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-white ring-1 ring-white/20 hover:ring-white/30 transition-all">
              🚨 Emergency Response Platform{" "}
              <span className="font-semibold">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Together We Can
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Overcome Disasters
            </span>
          </h1>

          <p className="mt-6 text-xl leading-8 text-blue-100 max-w-2xl mx-auto">
            A comprehensive platform connecting communities, organizations, and relief efforts to respond effectively to
            natural disasters and emergencies across Myanmar.
          </p>

          {/* Action buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              <Link to="/report">
                <AlertTriangle className="mr-2 h-6 w-6" />
                Report Emergency
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg bg-transparent backdrop-blur-sm"
            >
              <Link to="/donate">
                <Heart className="mr-2 h-6 w-6" />
                Donate Now
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Verified Reports</h3>
              <p className="mt-2 text-sm text-blue-100">Admin-verified disaster reports ensure accurate information</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Community Impact</h3>
              <p className="mt-2 text-sm text-blue-100">Real stories and impacts from affected communities</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Coordinated Relief</h3>
              <p className="mt-2 text-sm text-blue-100">Organizations working together for maximum impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      

      {/* Recent Events Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1500px] mx-auto my-20">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

      <DisasterEvents/>
      {/* Call to Action Section */}
      {/* <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Make a Difference Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
            Your support helps communities recover faster and build resilience against future disasters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/donate">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              <Link to="/report">Report a Disaster</Link>
            </Button>
          </div>
        </div>
      </section> */}

   <div className="min-h-[60vh] flex items-center justify-center p-4">
  <div className="w-full max-w-[1500px] mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <p className="text-lg text-muted-foreground">
        Get help or provide assistance with just a few clicks
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Card
          key={index}
          className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <action.icon className={`h-10 w-10 mx-auto ${action.color.replace('from-', 'text-').split(' ')[0]}`} />
            </div>
            <CardTitle className="text-xl">{action.title}</CardTitle>
            <CardDescription className="text-sm">{action.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 text-white`}>
              <Link to={action.href}>Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</div>
    </div>
  )
}
