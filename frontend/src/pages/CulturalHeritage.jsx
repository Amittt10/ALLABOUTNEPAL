import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Component/ui/Card"; 

import { Button } from "../Component/ui/Button"; 
import { Badge } from "../Component/ui/Bandge";   
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../Component/ui/Tab";
import "./CulturalHeritage.css"; 

// import "CulturalHeritage.css" // Assuming you have a CSS file for styles
import { Mountain, Building, Calendar, Utensils, Palette, Users, MapPin, Star, Heart, Camera, Book } from "lucide-react";

const NepalCulturalHeritage = () => {
  const [selectedSite, setSelectedSite] = useState(null)
  const [favoriteItems, setFavoriteItems] = useState([])

  const toggleFavorite = (item) => {
    setFavoriteItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  const heritageData = {
    heritageSites: [
      {
        id: 1,
        name: "Kathmandu Durbar Square",
        description: "Ancient royal palace complex with stunning Newari architecture",
        significance: "Former royal residence showcasing medieval art and architecture of the Kathmandu Valley",
        locations: ["Hanuman Dhoka Palace", "Kumari Ghar", "Kasthamandap", "Taleju Temple"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        name: "Lumbini - Birthplace of Buddha",
        description: "Sacred pilgrimage site where Lord Buddha was born",
        significance: "Most important Buddhist pilgrimage site with ancient monasteries and sacred garden",
        locations: ["Maya Devi Temple", "Ashoka Pillar", "Sacred Garden", "Monastic Zone"],
        yearInscribed: 1997,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        name: "Sagarmatha National Park",
        description: "Home to Mount Everest and unique Sherpa culture",
        significance: "Preserves high-altitude ecosystem and traditional Sherpa way of life",
        locations: ["Mount Everest", "Tengboche Monastery", "Namche Bazaar", "Khumbu Glacier"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 4,
        name: "Chitwan National Park",
        description: "Wildlife sanctuary preserving Tharu cultural heritage",
        significance: "Protects endangered species while maintaining indigenous Tharu traditions",
        locations: ["Tharu Villages", "Elephant Breeding Center", "Gharial Conservation", "Cultural Museums"],
        yearInscribed: 1984,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 5,
        name: "Patan Durbar Square",
        description: "Medieval city center with exquisite Newari craftsmanship",
        significance: "Finest collection of temples and palaces in Nepal showcasing ancient artistry",
        locations: ["Krishna Temple", "Golden Temple", "Patan Museum", "Mahabouddha Temple"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 6,
        name: "Bhaktapur Durbar Square",
        description: "Best-preserved medieval city in the Kathmandu Valley",
        significance: "Living museum of traditional Newari culture and architecture",
        locations: ["55-Window Palace", "Nyatapola Temple", "Pottery Square", "Peacock Window"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 7,
        name: "Swayambhunath Stupa",
        description: "Ancient Buddhist stupa known as the Monkey Temple",
        significance: "Sacred Buddhist site with panoramic views of Kathmandu Valley",
        locations: ["Main Stupa", "Buddha Statues", "Monastery Complex", "Prayer Wheels"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 8,
        name: "Boudhanath Stupa",
        description: "One of the largest Buddhist stupas in the world",
        significance: "Major pilgrimage site for Tibetan Buddhists with vibrant monastery community",
        locations: ["Great Stupa", "Tibetan Monasteries", "Prayer Flag Plaza", "Meditation Centers"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 9,
        name: "Pashupatinath Temple",
        description: "Sacred Hindu temple dedicated to Lord Shiva",
        significance: "Most important Hindu pilgrimage site in Nepal with ancient cremation ghats",
        locations: ["Main Temple", "Cremation Ghats", "Bagmati River", "Deupatan Complex"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 10,
        name: "Changu Narayan Temple",
        description: "Oldest Hindu temple in the Kathmandu Valley",
        significance: "Ancient temple with the oldest stone inscription in Nepal dating to 464 AD",
        locations: ["Main Temple", "Stone Inscriptions", "Museum", "Traditional Village"],
        yearInscribed: 1979,
        type: "UNESCO World Heritage Site",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],

    festivals: [
      {
        name: "Dashain",
        duration: "15 days",
        significance: "Victory of good over evil, family reunions",
        activities: ["Kite flying", "Animal sacrifices", "Tika ceremony", "Family gatherings"],
        season: "Autumn (September-October)",
      },
      {
        name: "Tihar (Deepawali)",
        duration: "5 days",
        significance: "Festival of lights, honoring animals and goddess Lakshmi",
        activities: ["Lighting oil lamps", "Decorating homes", "Deusi-Bhailo singing", "Bhai Tika"],
        season: "Autumn (October-November)",
      },
      {
        name: "Holi",
        duration: "2 days",
        significance: "Festival of colors celebrating spring",
        activities: ["Color throwing", "Water fights", "Traditional sweets", "Community celebrations"],
        season: "Spring (March)",
      },
      {
        name: "Buddha Jayanti",
        duration: "1 day",
        significance: "Celebrating Buddha's birth, enlightenment, and death",
        activities: ["Prayer ceremonies", "Meditation", "Pilgrimage to Lumbini", "Charitable acts"],
        season: "Spring (April-May)",
      },
      {
        name: "Teej",
        duration: "3 days",
        significance: "Women's festival for marital happiness and family welfare",
        activities: ["Fasting", "Red sari wearing", "Dancing", "Temple visits"],
        season: "Monsoon (August-September)",
      },
    ],

    architecture: [
      {
        style: "Pagoda Style",
        description: "Multi-tiered roofs with intricate wood carvings",
        examples: ["Nyatapola Temple", "Taleju Temple", "Kasthamandap"],
        features: ["Sloping roofs", "Wooden brackets", "Stone foundations", "Intricate carvings"],
      },
      {
        style: "Shikhara Style",
        description: "Tower-like structures with pointed tops",
        examples: ["Krishna Temple", "Mahabouddha Temple"],
        features: ["Vertical emphasis", "Stone construction", "Geometric patterns", "Spire tops"],
      },
      {
        style: "Stupa Style",
        description: "Buddhist monuments with dome structures",
        examples: ["Boudhanath", "Swayambhunath", "Changunarayan"],
        features: ["Dome base", "Spire top", "Prayer wheels", "Buddha eyes"],
      },
    ],

    traditions: [
      {
        category: "Greetings",
        practice: "Namaste",
        description: "Pressing palms together with slight bow",
        meaning: "I bow to the divine in you",
      },
      {
        category: "Clothing",
        practice: "Dhaka Topi",
        description: "Traditional Nepali cap made from Dhaka fabric",
        meaning: "Symbol of Nepali identity and pride",
      },
      {
        category: "Music",
        practice: "Folk Songs",
        description: "Traditional songs accompanying daily activities",
        meaning: "Preserving oral history and cultural values",
      },
      {
        category: "Dance",
        practice: "Classical Dances",
        description: "Religious and cultural performances",
        meaning: "Storytelling through movement and expression",
      },
    ],

    cuisine: [
      {
        dish: "Dal Bhat",
        description: "Rice with lentil soup - Nepal's staple food",
        ingredients: ["Rice", "Lentils", "Vegetables", "Pickles"],
        significance: "Daily meal representing nutritional balance",
      },
      {
        dish: "Momo",
        description: "Steamed dumplings with various fillings",
        ingredients: ["Flour", "Meat/Vegetables", "Spices", "Herbs"],
        significance: "Popular street food with Tibetan influence",
      },
      {
        dish: "Gundruk",
        description: "Fermented leafy green vegetable soup",
        ingredients: ["Mustard leaves", "Radish leaves", "Spices"],
        significance: "National dish rich in probiotics",
      },
      {
        dish: "Sel Roti",
        description: "Traditional ring-shaped rice bread",
        ingredients: ["Rice flour", "Sugar", "Ghee", "Spices"],
        significance: "Festival delicacy symbolizing prosperity",
      },
    ],

    arts: [
      {
        artForm: "Thangka Painting",
        description: "Buddhist religious paintings on cotton or silk",
        techniques: ["Natural pigments", "Gold leaf", "Precise measurements", "Sacred geometry"],
        significance: "Meditation aids and religious instruction",
      },
      {
        artForm: "Wood Carving",
        description: "Intricate designs on temples and traditional buildings",
        techniques: ["Hand tools", "Traditional patterns", "Religious motifs", "Geometric designs"],
        significance: "Architectural decoration and cultural expression",
      },
      {
        artForm: "Metal Craft",
        description: "Bronze and copper religious statues and vessels",
        techniques: ["Lost-wax casting", "Repoussé", "Engraving", "Patination"],
        significance: "Religious artifacts and ceremonial objects",
      },
      {
        artForm: "Pottery",
        description: "Traditional clay vessels and decorative items",
        techniques: ["Hand throwing", "Natural glazes", "Traditional firing", "Cultural motifs"],
        significance: "Daily use items and ceremonial objects",
      },
    ],
  }

  return (
    <div className="heritage-container">
      {/* Header */}
      <div className="heritage-header">
        <h1 className="heritage-title">Top 10 Heritage Sites of Nepal</h1>
        <p className="heritage-subtitle">
          Discover Nepal's most significant cultural and natural heritage sites, from ancient UNESCO World Heritage
          Sites to vibrant festivals, traditional arts, and timeless customs that have been preserved for centuries.
        </p>
        <div className="heritage-badges">
          <Badge variant="outline" className="heritage-badge">
            <Mountain className="w-4 h-4 mr-1" />
            Himalayan Culture
          </Badge>
          <Badge variant="outline" className="heritage-badge">
            <Building className="w-4 h-4 mr-1" />
            Ancient Architecture
          </Badge>
          <Badge variant="outline" className="heritage-badge">
            <Users className="w-4 h-4 mr-1" />
            Living Traditions
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="heritage" className="heritage-tabs">
        <TabsList className="heritage-tabs-list">
          <TabsTrigger value="heritage" className="heritage-tab-trigger">
            <Building className="w-4 h-4" />
            Heritage Sites
          </TabsTrigger>
          <TabsTrigger value="festivals" className="heritage-tab-trigger">
            <Calendar className="w-4 h-4" />
            Festivals
          </TabsTrigger>
          <TabsTrigger value="architecture" className="heritage-tab-trigger">
            <Mountain className="w-4 h-4" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="traditions" className="heritage-tab-trigger">
            <Users className="w-4 h-4" />
            Traditions
          </TabsTrigger>
          <TabsTrigger value="cuisine" className="heritage-tab-trigger">
            <Utensils className="w-4 h-4" />
            Cuisine
          </TabsTrigger>
          <TabsTrigger value="arts" className="heritage-tab-trigger">
            <Palette className="w-4 h-4" />
            Arts & Crafts
          </TabsTrigger>
        </TabsList>

        {/* Top 10 Heritage Sites */}
        <TabsContent value="heritage" className="heritage-content">
          <div className="heritage-grid">
            {heritageData.heritageSites.map((site) => (
              <Card key={site.id} className="heritage-card">
                <CardHeader className="heritage-card-header">
                  <div className="heritage-card-title-section">
                    <div className="heritage-card-title-content">
                      <CardTitle className="heritage-card-title">
                        <span className="heritage-site-number">#{site.id}</span>
                        {site.name}
                      </CardTitle>
                      <Badge variant="secondary" className="heritage-type-badge">
                        {site.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(`heritage-${site.id}`)}
                      className="heritage-favorite-btn"
                    >
                      <Heart
                        className={`w-4 h-4 heritage-heart ${
                          favoriteItems.includes(`heritage-${site.id}`)
                            ? "heritage-heart-filled"
                            : "heritage-heart-empty"
                        }`}
                      />
                    </Button>
                  </div>
                  <CardDescription className="heritage-card-description">{site.description}</CardDescription>
                </CardHeader>
                <CardContent className="heritage-card-content">
                  <div className="heritage-image-container">
                    <img src={site.image || "/placeholder.svg"} alt={site.name} className="heritage-image" />
                    <div className="heritage-image-overlay"></div>
                  </div>
                  <p className="heritage-significance">{site.significance}</p>
                  <div className="heritage-locations-section">
                    <h4 className="heritage-locations-title">Key Locations:</h4>
                    <div className="heritage-locations-grid">
                      {site.locations.map((location, index) => (
                        <Badge key={index} variant="outline" className="heritage-location-badge">
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {site.yearInscribed && (
                    <div className="heritage-inscription-info">
                      <Calendar className="w-4 h-4" />
                      UNESCO Inscribed: {site.yearInscribed}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Festivals */}
        <TabsContent value="festivals" className="heritage-content">
          <div className="heritage-festivals-grid">
            {heritageData.festivals.map((festival, index) => (
              <Card key={index} className="heritage-festival-card">
                <CardHeader>
                  <CardTitle className="heritage-festival-title">{festival.name}</CardTitle>
                  <CardDescription className="heritage-festival-meta">
                    <Badge variant="outline" className="heritage-duration-badge">
                      {festival.duration}
                    </Badge>
                    <span className="heritage-season">{festival.season}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="heritage-festival-content">
                  <p className="heritage-festival-significance">{festival.significance}</p>
                  <div className="heritage-activities-section">
                    <h4 className="heritage-activities-title">Traditional Activities:</h4>
                    <ul className="heritage-activities-list">
                      {festival.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="heritage-activity-item">
                          <Star className="w-3 h-3 heritage-activity-star" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Architecture */}
        <TabsContent value="architecture" className="heritage-content">
          <div className="heritage-architecture-grid">
            {heritageData.architecture.map((arch, index) => (
              <Card key={index} className="heritage-architecture-card">
                <CardHeader>
                  <CardTitle className="heritage-architecture-title">{arch.style}</CardTitle>
                  <CardDescription className="heritage-architecture-description">{arch.description}</CardDescription>
                </CardHeader>
                <CardContent className="heritage-architecture-content">
                  <div className="heritage-examples-section">
                    <h4 className="heritage-examples-title">Famous Examples:</h4>
                    <div className="heritage-examples-grid">
                      {arch.examples.map((example, exIndex) => (
                        <Badge key={exIndex} variant="secondary" className="heritage-example-badge">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="heritage-features-section">
                    <h4 className="heritage-features-title">Key Features:</h4>
                    <ul className="heritage-features-list">
                      {arch.features.map((feature, featIndex) => (
                        <li key={featIndex} className="heritage-feature-item">
                          <Building className="w-3 h-3 heritage-feature-icon" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Traditions */}
        <TabsContent value="traditions" className="heritage-content">
          <div className="heritage-traditions-grid">
            {heritageData.traditions.map((tradition, index) => (
              <Card key={index} className="heritage-tradition-card">
                <CardHeader>
                  <CardTitle className="heritage-tradition-title">
                    {tradition.practice}
                    <Badge variant="outline" className="heritage-tradition-category">
                      {tradition.category}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="heritage-tradition-description">{tradition.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="heritage-tradition-meaning">"{tradition.meaning}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cuisine */}
        <TabsContent value="cuisine" className="heritage-content">
          <div className="heritage-cuisine-grid">
            {heritageData.cuisine.map((dish, index) => (
              <Card key={index} className="heritage-cuisine-card">
                <CardHeader>
                  <CardTitle className="heritage-cuisine-title">{dish.dish}</CardTitle>
                  <CardDescription className="heritage-cuisine-description">{dish.description}</CardDescription>
                </CardHeader>
                <CardContent className="heritage-cuisine-content">
                  <div className="heritage-ingredients-section">
                    <h4 className="heritage-ingredients-title">Main Ingredients:</h4>
                    <div className="heritage-ingredients-grid">
                      {dish.ingredients.map((ingredient, ingIndex) => (
                        <Badge key={ingIndex} variant="outline" className="heritage-ingredient-badge">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="heritage-cuisine-significance">{dish.significance}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Arts & Crafts */}
        <TabsContent value="arts" className="heritage-content">
          <div className="heritage-arts-grid">
            {heritageData.arts.map((art, index) => (
              <Card key={index} className="heritage-art-card">
                <CardHeader>
                  <CardTitle className="heritage-art-title">{art.artForm}</CardTitle>
                  <CardDescription className="heritage-art-description">{art.description}</CardDescription>
                </CardHeader>
                <CardContent className="heritage-art-content">
                  <div className="heritage-techniques-section">
                    <h4 className="heritage-techniques-title">Traditional Techniques:</h4>
                    <ul className="heritage-techniques-list">
                      {art.techniques.map((technique, techIndex) => (
                        <li key={techIndex} className="heritage-technique-item">
                          <Palette className="w-3 h-3 heritage-technique-icon" />
                          {technique}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="heritage-art-significance">{art.significance}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="heritage-footer">
        <p className="heritage-footer-text">
          Nepal's top 10 heritage sites represent thousands of years of tradition, art, and spiritual wisdom preserved
          through generations.
        </p>
        <div className="heritage-footer-badges">
          <Badge variant="outline" className="heritage-footer-badge">
            <Book className="w-4 h-4 mr-1" />
            Living Heritage
          </Badge>
          <Badge variant="outline" className="heritage-footer-badge">
            <Camera className="w-4 h-4 mr-1" />
            Cultural Preservation
          </Badge>
          <Badge variant="outline" className="heritage-footer-badge">
            <Heart className="w-4 h-4 mr-1" />
            {favoriteItems.length} Favorites
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default NepalCulturalHeritage;
export const metadata = {
  title: "Cultural Heritage of Nepal",
  description: "Explore the rich cultural heritage of Nepal, including its top heritage sites, festivals, architecture, traditions, cuisine, and arts.",
}
