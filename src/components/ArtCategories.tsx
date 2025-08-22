import { Card } from "@/components/ui/card";
import warliImage from "@/assets/warli-art.jpg";
import madhubaniImage from "@/assets/madhubani-art.jpg";
import pithoraImage from "@/assets/pithora-art.jpg";

const categories = [
  {
    name: "Warli Art",
    description: "Traditional tribal art from Maharashtra with simple white figures depicting daily life",
    image: warliImage,
    count: "120+ pieces"
  },
  {
    name: "Madhubani Art", 
    description: "Vibrant folk art from Bihar featuring intricate patterns and mythological themes",
    image: madhubaniImage,
    count: "85+ pieces"
  },
  {
    name: "Pithora Art",
    description: "Colorful ritual art from Gujarat showcasing horses, elephants and tribal motifs",
    image: pithoraImage,
    count: "65+ pieces"
  }
];

export const ArtCategories = () => {
  return (
    <section id="categories" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Traditional Art Forms
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the rich diversity of Indian folk art traditions, each telling unique stories 
            of cultural heritage and ancestral wisdom.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-warm transition-all duration-300 overflow-hidden"
                  onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="aspect-square overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};