import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import {
  AlertTriangle,
  Heart,
  Shield,
  Users,
  CheckCircle,
  MapPin,
} from "lucide-react"
import picts from "../../images/relief-team.jpeg"

export default function HeroSection() {
  return (
    <section
      className="
        relative flex items-center justify-center
        min-h-[400px] h-[600px] md:h-[680px] lg:h-[720px]
        bg-blue-900
      "
      style={{
        backgroundImage: `linear-gradient(110deg, rgba(6,23,52,0.47) 56%, rgba(248,250,202,0.12) 100%), url(${picts})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="z-10 w-full max-w-4xl mx-auto px-6 py-8 text-white flex flex-col gap-8">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
          DisasterGuard Myanmar
          <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-400 bg-clip-text text-transparent">
            Verified Relief, Real Impact.
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl font-medium opacity-95 drop-shadow-sm">
          Instantly access trusted disaster alerts, report urgent needs, and join proven relief efforts across Myanmar.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 max-w-md w-full">
          <Button
            asChild
            size="lg"
            className=" bg-white border-white text-blue-900 font-semibold px-10 py-4 rounded-lg text-base hover:bg-white"  // no hover
          >
            <Link to="/requests/assistant/new" className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6" />
              Report Disaster
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-blue-900 font-semibold px-10 py-4 rounded-lg text-base" // no hover
          >
            <Link to="/donations/new" className="flex items-center gap-3">
              <Heart className="h-6 w-6" />
              Donate Now
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 pt-6 max-w-xl mx-auto text-white/90 text-sm font-medium drop-shadow-md">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-300" />
            Verified Info
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-300" />
            Community Powered
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Trusted Partners
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-400" />
            Myanmar Coverage
          </div>
        </div>
      </div>
    </section>
  )
}
