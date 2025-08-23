export interface Artwork {
  id: number;
  title: string;
  artist: string;
  category: string;
  price: number;
  location: string;
  image: string;
  description: string;
  likes: number;
  views: number;
}

export interface Artist {
  id: string;
  name: string;
  location: string;
  specialty: string;
  rating: number;
  artworks: number;
  description: string;
  avatar: string;
  bio: string;
  experience: string;
  achievements: string[];
}

export const artworks: Artwork[] = [
  {
    id: 1,
    title: "Dancing Celebration",
    artist: "Rajesh Baiga",
    category: "Warli Art",
    price: 2500,
    location: "Maharashtra",
    image: "/Indian-tribal-Art-Warli-Painting-of-people-dancing-Painting-home-decor-white.webp",
    description: "Traditional Warli painting depicting people dancing in celebration",
    likes: 24,
    views: 156
  },
  {
    id: 2,
    title: "Warli Village Life",
    artist: "Meera Patel",
    category: "Warli Art",
    price: 2200,
    location: "Maharashtra",
    image: "/Warli_art.jpeg",
    description: "Authentic Warli art showcasing traditional village life and customs",
    likes: 19,
    views: 142
  },
  {
    id: 3,
    title: "Madhubani Mahavidyas",
    artist: "Kishore Rathwa",
    category: "Madhubani Art", 
    price: 3200,
    location: "Bihar",
    image: "/Madhubani_Mahavidyas.jpg",
    description: "Sacred Madhubani art depicting the divine Mahavidyas",
    likes: 38,
    views: 203
  },
  {
    id: 4,
    title: "Women in Madhubani",
    artist: "Kamala Devi",
    category: "Madhubani Art",
    price: 3500,
    location: "Bihar",
    image: "/Women_madhubani-art.png", 
    description: "Beautiful Madhubani artwork celebrating women and nature",
    likes: 45,
    views: 267
  },
  {
    id: 5,
    title: "Sacred Horses",
    artist: "Sunita Devi", 
    category: "Pithora Art",
    price: 2800,
    location: "Gujarat",
    image: "/Horses-pethora-art.jpg",
    description: "Traditional Pithora art featuring sacred horses in vibrant colors",
    likes: 31,
    views: 178
  },
  {
    id: 6,
    title: "Elephant Ride",
    artist: "Chanchal Soni",
    category: "Pithora Art", 
    price: 3100,
    location: "Gujarat",
    image: "/Elephant_Ride_In_Pithora_Art_by_Chanchal_Soni_1024x.jpg.webp",
    description: "Magnificent Pithora painting depicting an elephant ride by Chanchal Soni",
    likes: 29,
    views: 189
  }
];

export const artists: Artist[] = [
  {
    id: "rajesh-baiga",
    name: "Rajesh Baiga",
    location: "Maharashtra",
    specialty: "Warli Art",
    rating: 4.9,
    artworks: 2,
    description: "Master of traditional Warli art with 25+ years of experience",
    avatar: "/artist-1.png",
    bio: "Rajesh Baiga is a renowned Warli artist from Maharashtra who has dedicated his life to preserving and promoting the ancient art form of Warli painting. Born into a family of traditional artists, he learned the intricate techniques from his grandmother and has been practicing this art for over 25 years.",
    experience: "25+ years",
    achievements: [
      "National Award for Traditional Arts (2018)",
      "Featured in UNESCO Cultural Heritage Documentation",
      "Exhibited in 50+ galleries across India",
      "Trained over 200 students in Warli art techniques"
    ]
  },
  {
    id: "sunita-devi",
    name: "Sunita Devi",
    location: "Gujarat", 
    specialty: "Pithora Art",
    rating: 4.9,
    artworks: 2,
    description: "Traditional Pithora artist creating vibrant cultural narratives",
    avatar: "/artist-3.png",
    bio: "Sunita Devi is a master Pithora artist from Gujarat, known for her vibrant and spiritually rich paintings. She comes from the Rathwa tribal community and has been instrumental in keeping the sacred tradition of Pithora art alive. Her works are celebrated for their authentic storytelling and traditional motifs.",
    experience: "20+ years",
    achievements: [
      "Gujarat State Award for Folk Arts (2020)",
      "Featured in National Geographic documentary",
      "Pithora art workshops in 15+ countries",
      "Preserved over 100 traditional Pithora stories through art"
    ]
  },
  {
    id: "kishore-rathwa",
    name: "Kishore Rathwa",
    location: "Bihar",
    specialty: "Madhubani Art", 
    rating: 4.8,
    artworks: 2,
    description: "Award-winning Madhubani artist preserving ancient techniques",
    avatar: "/artist-2.png",
    bio: "Kishore Rathwa is an accomplished Madhubani artist from Bihar who has mastered the intricate art of Mithila painting. He specializes in creating sacred and mythological themes using traditional natural pigments and techniques passed down through generations.",
    experience: "18+ years",
    achievements: [
      "Bihar State Cultural Award (2019)",
      "International recognition at Folk Art Festival, Japan",
      "Published research on traditional Madhubani techniques",
      "Mentored 150+ artists in authentic Madhubani methods"
    ]
  },
  {
    id: "meera-patel",
    name: "Meera Patel",
    location: "Maharashtra",
    specialty: "Warli Art",
    rating: 4.7,
    artworks: 1,
    description: "Contemporary Warli artist blending tradition with modern themes",
    avatar: "/artist-1.png",
    bio: "Meera Patel is a talented Warli artist who brings fresh perspectives to traditional art forms. She focuses on depicting contemporary village life while maintaining the authentic Warli style and techniques.",
    experience: "12+ years",
    achievements: [
      "Young Artist Award - Maharashtra (2021)",
      "Featured in Modern Indian Art exhibitions",
      "Community art projects in 20+ villages"
    ]
  },
  {
    id: "kamala-devi",
    name: "Kamala Devi",
    location: "Bihar",
    specialty: "Madhubani Art",
    rating: 4.8,
    artworks: 1,
    description: "Master Madhubani artist specializing in women-centric themes",
    avatar: "/artist-2.png",
    bio: "Kamala Devi is a celebrated Madhubani artist known for her powerful depictions of women and nature. Her work focuses on celebrating feminine strength and the connection between women and the natural world.",
    experience: "22+ years",
    achievements: [
      "Women's Art Excellence Award (2017)",
      "Featured in international women's art exhibitions",
      "Advocate for women artists' rights in traditional art forms"
    ]
  },
  {
    id: "chanchal-soni",
    name: "Chanchal Soni",
    location: "Gujarat",
    specialty: "Pithora Art",
    rating: 4.6,
    artworks: 1,
    description: "Innovative Pithora artist known for large-scale ceremonial paintings",
    avatar: "/artist-3.png",
    bio: "Chanchal Soni is a skilled Pithora artist who specializes in creating large-scale ceremonial paintings for traditional rituals and modern exhibitions. His work bridges the gap between sacred art and contemporary appreciation.",
    experience: "15+ years",
    achievements: [
      "Traditional Arts Preservation Award (2020)",
      "Created murals for 30+ temples and cultural centers",
      "Expert in traditional Pithora ritual ceremonies"
    ]
  }
];

// Helper functions
export const getArtworksByArtist = (artistName: string): Artwork[] => {
  return artworks.filter(artwork => artwork.artist === artistName);
};

export const getArtistById = (artistId: string): Artist | undefined => {
  return artists.find(artist => artist.id === artistId);
};

export const getArtworkById = (artworkId: number): Artwork | undefined => {
  return artworks.find(artwork => artwork.id === artworkId);
};