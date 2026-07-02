import { Heart, Cpu, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhyChooseUs = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const featuresRef = useScrollReveal<HTMLDivElement>(0.1);
  const statsRef = useScrollReveal<HTMLDivElement>(0.1);

  const features = [
    {
      icon: Heart,
      title: "Pain-Free Dentistry",
      description:
        "Experience dental care without anxiety. Our gentle approach and modern anesthesia ensure comfortable, stress-free treatments for even the most nervous patients.",
    },
    {
      icon: Cpu,
      title: "Advanced Digital Technology",
      description:
        "State-of-the-art equipment delivers precise diagnoses and faster treatment results. Digital X-rays, 3D imaging, and laser treatments for better outcomes.",
    },
    {
      icon: Users,
      title: "Trustworthy & Caring Team",
      description:
        "Our compassionate professionals prioritize your comfort and build lasting relationships. We take time to understand your concerns and explain every step.",
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 reveal">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
            Why 10,000+ Patients Trust Shiv Shakti Dental Clinic
          </h2>
          <p className="text-muted-foreground text-lg">
            We combine advanced technology with compassionate care to deliver
            exceptional dental experiences in Gandhinagar.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-8 rounded-2xl bg-background hover:shadow-xl transition-all duration-300 group reveal reveal-delay-${index + 1}`}
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "10,000+", label: "Happy Patients" },
            { number: "15+", label: "Years Experience" },
            { number: "98%", label: "Patient Satisfaction" },
            { number: "5★", label: "Google Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`text-center reveal-scale reveal-delay-${index + 1}`}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
