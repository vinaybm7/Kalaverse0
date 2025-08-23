import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Award, Globe, Palette, Shield, Target, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const About = () => {
  const stats = [
    { icon: Users, label: "Artists", value: "500+" },
    { icon: Palette, label: "Artworks", value: "2000+" },
    { icon: Globe, label: "Countries", value: "15+" },
    { icon: Award, label: "Awards", value: "50+" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Cultural Preservation",
      description: "We are committed to preserving India's rich traditional art forms and ensuring they thrive in the modern world."
    },
    {
      icon: Shield,
      title: "Authenticity",
      description: "Every artwork on our platform is created by verified traditional artists using authentic techniques and materials."
    },
    {
      icon: Target,
      title: "Artist Empowerment",
      description: "We provide a platform for traditional artists to showcase their work and earn a sustainable livelihood."
    },
    {
      icon: Eye,
      title: "Cultural Education",
      description: "We educate people about the history, significance, and techniques behind each traditional art form."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "/artist-1.png",
      description: "Art historian passionate about preserving traditional Indian art forms"
    },
    {
      name: "Arjun Patel",
      role: "Head of Artist Relations",
      image: "/artist-2.png", 
      description: "Works directly with artists to ensure authentic representation"
    },
    {
      name: "Meera Singh",
      role: "Cultural Curator",
      image: "/artist-3.png",
      description: "Expert in traditional art forms with 15+ years of experience"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About KalaVerse
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a platform dedicated to preserving, promoting, and celebrating India's rich 
              traditional art heritage while empowering the artists who keep these ancient traditions alive.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                KalaVerse was born from a deep love for India's traditional art forms and a concern 
                for their preservation in the modern world. We recognized that many talented traditional 
                artists struggle to find platforms to showcase their work and earn sustainable livelihoods.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our mission is to bridge the gap between traditional artists and art lovers worldwide, 
                creating a sustainable ecosystem where ancient art forms can thrive in the contemporary market 
                while maintaining their authenticity and cultural significance.
              </p>
              <Link to="/#gallery">
                <Button variant="cultural" size="lg">
                  Explore Our Gallery
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/hero-traditional-art.jpg" 
                alt="Traditional Indian Art" 
                className="rounded-lg shadow-warm w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at KalaVerse
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 h-full">
                <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Art Forms Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Traditional Art Forms We Support</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We specialize in authentic traditional Indian art forms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300">
              <div className="relative">
                <img 
                  src="/warli-art.jpg" 
                  alt="Warli Art" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Maharashtra
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Warli Art</h3>
                <p className="text-muted-foreground mb-4">
                  Ancient tribal art form from Maharashtra featuring simple geometric patterns 
                  depicting daily life, nature, and celebrations.
                </p>
                <Link to="/#gallery">
                  <Button variant="outline" size="sm">View Warli Artworks</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300">
              <div className="relative">
                <img 
                  src="/madhubani-art.jpg" 
                  alt="Madhubani Art" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Bihar
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Madhubani Art</h3>
                <p className="text-muted-foreground mb-4">
                  Traditional art form from Bihar known for its intricate patterns, 
                  vibrant colors, and mythological themes.
                </p>
                <Link to="/#gallery">
                  <Button variant="outline" size="sm">View Madhubani Artworks</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300">
              <div className="relative">
                <img 
                  src="/pithora-art.jpg" 
                  alt="Pithora Art" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Gujarat
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Pithora Art</h3>
                <p className="text-muted-foreground mb-4">
                  Sacred art form from Gujarat's tribal communities, featuring 
                  colorful murals with spiritual and cultural significance.
                </p>
                <Link to="/#gallery">
                  <Button variant="outline" size="sm">View Pithora Artworks</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals dedicated to preserving traditional art forms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're an art lover, collector, or traditional artist, 
            join us in preserving and celebrating India's cultural heritage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#gallery">
              <Button variant="cultural" size="lg">
                Explore Artworks
              </Button>
            </Link>
            <Link to="/#artists">
              <Button variant="outline" size="lg">
                Meet Our Artists
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};