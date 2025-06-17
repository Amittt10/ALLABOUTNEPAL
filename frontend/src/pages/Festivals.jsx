import { useState } from "react"
import { Calendar, MapPin, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Component/ui/Card"
import { Button } from "../Component/ui/Button"
import { Badge } from "../Component/ui/Bandge"

// Festivals css
import "./Festivals.css"

const nepaliFestivals = [
  {
    id: 1,
    name: "Dashain",
    nameNepali: "दशैं",
    date: "15-25",
    month: "Ashwin",
    description: "The biggest and most important festival of Nepal, celebrating the victory of good over evil.",
    significance: "Celebrates Goddess Durga's victory over the demon Mahishasura",
    duration: "15 days",
    location: "Nationwide",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Tihar",
    nameNepali: "तिहार",
    date: "13-17",
    month: "Kartik",
    description: "Festival of lights, also known as Deepawali, celebrating the bond between humans and animals.",
    significance: "Honors crows, dogs, cows, and celebrates sibling relationships",
    duration: "5 days",
    location: "Nationwide",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Holi",
    nameNepali: "होली",
    date: "Full Moon",
    month: "Falgun",
    description: "Festival of colors celebrating the arrival of spring and the triumph of good over evil.",
    significance: "Celebrates the legend of Prahlad and Holika",
    duration: "2 days",
    location: "Terai and Hill regions",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Buddha Jayanti",
    nameNepali: "बुद्ध जयन्ती",
    date: "Full Moon",
    month: "Baisakh",
    description: "Celebrates the birth, enlightenment, and death of Lord Buddha.",
    significance: "Sacred day for Buddhists worldwide",
    duration: "1 day",
    location: "Lumbini and Buddhist sites",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Teej",
    nameNepali: "तीज",
    date: "3rd day",
    month: "Bhadra",
    description: "Women's festival dedicated to Lord Shiva and Parvati, celebrating marital bliss.",
    significance: "Women pray for their husband's long life and prosperity",
    duration: "3 days",
    location: "Nationwide",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    name: "Indra Jatra",
    nameNepali: "इन्द्र जात्रा",
    date: "8 days",
    month: "Bhadra",
    description: "Festival honoring Indra, the king of gods, and the living goddess Kumari.",
    significance: "Celebrates the end of monsoon and honors the deceased",
    duration: "8 days",
    location: "Kathmandu Valley",
    category: "cultural",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    name: "Maghe Sankranti",
    nameNepali: "माघे संक्रान्ति",
    date: "1st day",
    month: "Magh",
    description: "Marks the beginning of the holy month of Magh and the end of winter solstice.",
    significance: "Celebrates the sun's northward journey",
    duration: "1 day",
    location: "Nationwide",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    name: "Shivaratri",
    nameNepali: "शिवरात्री",
    date: "14th day",
    month: "Falgun",
    description: "Night dedicated to Lord Shiva, observed with fasting and prayers.",
    significance: "Celebrates the marriage of Shiva and Parvati",
    duration: "1 night",
    location: "Pashupatinath Temple",
    category: "religious",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const nepaliMonths = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
]

export default function Festivals() {
  const [selectedMonth, setSelectedMonth] = useState("Ashwin")
  const [selectedFestival, setSelectedFestival] = useState(null)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5)

  const filteredFestivals = nepaliFestivals.filter(f => f.month === selectedMonth)

  const nextMonth = () => {
    const nextIndex = (currentMonthIndex + 1) % nepaliMonths.length
    setCurrentMonthIndex(nextIndex)
    setSelectedMonth(nepaliMonths[nextIndex])
    setSelectedFestival(null)
  }

  const prevMonth = () => {
    const prevIndex = currentMonthIndex === 0 ? nepaliMonths.length - 1 : currentMonthIndex - 1
    setCurrentMonthIndex(prevIndex)
    setSelectedMonth(nepaliMonths[prevIndex])
    setSelectedFestival(null)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "religious":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "cultural":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "national":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nepal Festivals Calendar</h1>
          <p className="text-xl text-gray-600 mb-4">नेपाली पर्व तथा चाडपर्वहरू</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Traditional Nepali Calendar System</span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <Button variant="outline" size="sm" onClick={prevMonth} className="mr-4">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="bg-white rounded-lg shadow-md px-6 py-3 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-center text-gray-800">{selectedMonth}</h2>
            <p className="text-sm text-center text-gray-500">{currentMonthIndex + 1} of 12 months</p>
          </div>
          <Button variant="outline" size="sm" onClick={nextMonth} className="ml-4">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid gap-4">
            {filteredFestivals.length > 0 ? (
              filteredFestivals.map(festival => (
                <Card
                  key={festival.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
                    selectedFestival?.id === festival.id
                      ? "border-l-orange-500 bg-orange-50"
                      : "border-l-gray-200 hover:border-l-orange-300"
                  }`}
                  onClick={() => setSelectedFestival(festival)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">{festival.name}</CardTitle>
                        <CardDescription className="text-lg font-medium text-gray-600 mt-1">
                          {festival.nameNepali}
                        </CardDescription>
                      </div>
                      <Badge className={getCategoryColor(festival.category)}>{festival.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{festival.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{festival.date} {festival.month}</div>
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{festival.duration}</div>
                      <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{festival.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No festivals in {selectedMonth}</h3>
                  <p className="text-gray-500">Try selecting a different month to see festivals</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 sticky top-4">
            {selectedFestival ? (
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="text-xl">{selectedFestival.name}</CardTitle>
                  <CardDescription className="text-orange-100 text-lg">{selectedFestival.nameNepali}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      Significance
                    </h4>
                    <p className="text-gray-700 text-sm">{selectedFestival.significance}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-medium text-gray-900">{selectedFestival.date} {selectedFestival.month}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                      <p className="font-medium text-gray-900">{selectedFestival.duration}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="font-medium text-gray-900">{selectedFestival.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                    <Badge className={getCategoryColor(selectedFestival.category)}>{selectedFestival.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Festival</h3>
                  <p className="text-gray-500 text-sm">Click on any festival to see detailed information</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Nepali Calendar Months</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nepaliMonths.map((month, index) => (
              <Button
                key={month}
                variant={selectedMonth === month ? "default" : "outline"}
                className={`p-4 h-auto ${
                  selectedMonth === month
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "hover:bg-orange-50 hover:border-orange-300"
                }`}
                onClick={() => {
                  setSelectedMonth(month)
                  setCurrentMonthIndex(index)
                  setSelectedFestival(null)
                }}
              >
                <div className="text-center">
                  <div className="font-semibold">{month}</div>
                  <div className="text-xs opacity-75">Month {index + 1}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
