import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, Sparkles, Smile, Scissors, Heart, Crown, Zap } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Services = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>(0.05);

  const services = [
    {
      icon: Search,
      title: "Comprehensive Checkups",
      description:
        "Thorough dental examinations to keep your smile healthy with early detection of potential issues.",
      price: "Starting at ₹300",
      cta: "Book Checkup",
    },
    {
      icon: Shield,
      title: "Root Canal Treatment",
      description:
        "Pain-free root canal therapy using advanced techniques and modern anesthesia for comfortable treatment.",
      price: "₹4,000 - ₹10,000 per tooth",
      cta: "Learn More",
    },
    {
      icon: Sparkles,
      title: "Teeth Whitening",
      description:
        "Professional whitening treatments for a brighter, more confident smile that lasts.",
      price: "Consultation Available",
      cta: "Get Brighter Smile",
    },
    {
      icon: Smile,
      title: "Orthodontic Bracing",
      description:
        "Straighten your teeth with modern bracing solutions including invisible aligners and traditional braces.",
      price: "Custom Plans Available",
      cta: "Consultation Available",
    },
    {
      icon: Sparkles,
      title: "Teeth Cleaning & Polishing",
      description:
        "Professional removal of plaque, tartar, and stains to keep your gums healthy and your smile bright.",
      price: "₹999",
      cta: "Book Cleaning",
    },
    {
      icon: Sparkles,
      title: "Teeth Whitening",
      description:
        "Advanced whitening treatment that lightens teeth several shades in a single visit with long-lasting results.",
      price: "₹4,499",
      cta: "Get Whiter Smile",
    },
    {
      icon: Heart,
      title: "Dental Implants",
      description:
        "Permanent replacement for missing teeth with titanium implants that feel and function like natural teeth.",
      price: "₹24,999",
      cta: "Consult for Implants",
    },
    {
      icon: Scissors,
      title: "Braces & Aligners",
      description:
        "Straighten crowded or misaligned teeth with modern braces or invisible aligners for a confident smile.",
      price: "₹29,999",
      cta: "Start Alignment",
    },
    {
      icon: Zap,
      title: "Root Canal Treatment",
      description:
        "Modern, pain-managed root canal therapy to save infected teeth and eliminate severe tooth pain.",
      price: "₹2,999",
      cta: "Relieve Pain",
    },
    {
      icon: Heart,
      title: "Tooth Extraction",
      description:
        "Safe and gentle removal of damaged or wisdom teeth with minimal discomfort and quick healing.",
      price: "₹899",
      cta: "Schedule Removal",
    },
    {
      icon: Crown,
      title: "Dental Crowns & Bridges",
      description:
        "Restore broken or missing teeth with durable, natural-looking ceramic crowns and bridges.",
      price: "₹3,499",
      cta: "Restore Tooth",
    },
    {
      icon: Smile,
      title: "Kids Dentistry",
      description:
        "Friendly dental care for children including cavity prevention, fluoride treatment, and habit counseling.",
      price: "₹699",
      cta: "Book for Child",
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 reveal">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Specialized Dental Services
          </h2>
          <p className="text-muted-foreground text-lg">
            From routine checkups to advanced treatments, we provide
            comprehensive dental care using the latest technology.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`
                group relative
                border-border/50
                transition-all duration-300 ease-out
                hover:-translate-y-2
                hover:shadow-xl hover:shadow-primary/10
                hover:border-primary/30
                reveal reveal-delay-${Math.min(index + 1, 12)}
              `}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div
                  className="
                    w-14 h-14 mb-5
                    bg-primary/10 rounded-xl
                    flex items-center justify-center
                    transition-all duration-300 ease-out
                    group-hover:bg-primary
                    group-hover:scale-110
                    group-hover:rotate-3
                  "
                >
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3
                  className="
                    text-xl font-semibold text-card-foreground mb-3
                    transition-all duration-300
                    group-hover:-translate-y-1
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    text-muted-foreground mb-4 leading-relaxed
                    transition-all duration-300
                    group-hover:-translate-y-1
                    group-hover:opacity-90
                  "
                >
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
