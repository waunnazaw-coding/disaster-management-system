import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Video, Download, Users, AlertTriangle, Shield, Waves, Wind, Zap, Mountain } from 'lucide-react'

const awarenessContent = [
  {
    id: 1,
    title: 'Earthquake Preparedness Guide',
    description: 'Complete guide on earthquake safety, including what to do before, during, and after an earthquake.',
    type: 'Guide',
    category: 'Earthquake',
    readTime: '15 min',
    downloads: 2450,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 2,
    title: 'Flood Safety Training Video',
    description: 'Educational video series on flood safety measures and evacuation procedures for Myanmar communities.',
    type: 'Video',
    category: 'Flood',
    readTime: '25 min',
    downloads: 1890,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 3,
    title: 'Cyclone Response Handbook',
    description: 'Comprehensive handbook for coastal communities on cyclone preparedness and response strategies.',
    type: 'Handbook',
    category: 'Cyclone',
    readTime: '30 min',
    downloads: 3200,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 4,
    title: 'Fire Safety in Urban Areas',
    description: 'Essential fire safety tips for urban residents, including prevention and emergency response.',
    type: 'Guide',
    category: 'Fire',
    readTime: '12 min',
    downloads: 1650,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 5,
    title: 'Landslide Risk Assessment',
    description: 'Understanding landslide risks in mountainous regions and community-based early warning systems.',
    type: 'Assessment',
    category: 'Landslide',
    readTime: '20 min',
    downloads: 980,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 6,
    title: 'Emergency Kit Checklist',
    description: 'Complete checklist for preparing family emergency kits with locally available supplies.',
    type: 'Checklist',
    category: 'General',
    readTime: '8 min',
    downloads: 4100,
    image: '/placeholder.svg?height=200&width=300'
  }
]

const disasterTypes = [
  {
    name: 'Earthquakes',
    icon: <Mountain className="h-6 w-6" />,
    color: 'bg-orange-100 text-orange-800',
    description: 'Seismic activity preparedness'
  },
  {
    name: 'Floods',
    icon: <Waves className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-800',
    description: 'Water-related emergencies'
  },
  {
    name: 'Cyclones',
    icon: <Wind className="h-6 w-6" />,
    color: 'bg-gray-100 text-gray-800',
    description: 'Tropical storm systems'
  },
  {
    name: 'Fires',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-red-100 text-red-800',
    description: 'Fire prevention and response'
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Guide': return <BookOpen className="h-4 w-4" />
    case 'Video': return <Video className="h-4 w-4" />
    case 'Handbook': return <BookOpen className="h-4 w-4" />
    case 'Assessment': return <AlertTriangle className="h-4 w-4" />
    case 'Checklist': return <Shield className="h-4 w-4" />
    default: return <BookOpen className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Guide': return 'bg-green-100 text-green-800 border-green-200'
    case 'Video': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Handbook': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Assessment': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Checklist': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function AwarenessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disaster Awareness & Education</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Empower yourself and your community with knowledge. Access comprehensive resources, 
            training materials, and educational content to build disaster resilience in Myanmar.
          </p>
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Myanmar Disaster Preparedness Guide</h2>
              <p className="text-xl text-blue-100 mb-6">
                Comprehensive guide tailored specifically for Myanmar's unique geographical and cultural context. 
                Available in Myanmar and English languages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Download className="mr-2 h-5 w-5" />
                  Download Guide
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-blue-400 hover:bg-white hover:text-blue-600">
                  <Video className="mr-2 h-5 w-5" />
                  Watch Video
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Disaster Preparedness Guide"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Disaster Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Disaster Types in Myanmar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {disasterTypes.map((disaster, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${disaster.color}`}>
                    {disaster.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{disaster.name}</h3>
                  <p className="text-sm text-gray-600">{disaster.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Educational Resources */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Educational Resources</h2>
            <Button variant="outline">View All Resources</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awarenessContent.map((content) => (
              <Card key={content.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={content.image || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getTypeColor(content.type)}>
                      {getTypeIcon(content.type)}
                      <span className="ml-1">{content.type}</span>
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{content.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {content.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {content.readTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      {content.downloads.toLocaleString()}
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {content.category}
                  </Badge>
                  
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Training */}
        
      </div>
    </div>
  )
}
