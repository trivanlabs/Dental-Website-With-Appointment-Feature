import { Card, CardContent } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Pricing = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>(0.05);
  const noteRef = useScrollReveal<HTMLDivElement>();

  const pricingItems = [
    {
      service: "Consultation / Check-up",
      price: "₹300 – ₹800",
      includes: ["Complete oral examination", "Digital X-rays if needed", "Treatment plan discussion"],
    },
    {
      service: "Teeth Cleaning / Polishing",
      price: "₹500 – ₹1,500",
      includes: ["Professional scaling", "Stain removal", "Fluoride treatment"],
    },
    {
      service: "Root Canal Treatment",
      price: "₹4,000 – ₹10,000",
      perTooth: true,
      includes: ["Advanced anesthesia", "Post-treatment care", "Follow-up visits"],
    },
    {
      service: "Teeth Whitening",
      price: "₹3,000 – ₹8,000",
      includes: ["In-office treatment", "Take-home kit option", "Long-lasting results"],
    },
    {
      service: "Dental Fillings",
      price: "₹500 – ₹2,000",
      perTooth: true,
      includes: ["Composite materials", "Color matching", "Durable finish"],
    },
    {
      service: "Orthodontic Bracing",
      price: "₹25,000 – ₹80,000",
      includes: ["Metal or ceramic options", "Regular adjustments", "Retainers included"],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 reveal">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
            Transparent, Affordable Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Quality dental care without hidden costs. We believe in complete
            transparency so you can make informed decisions.
          </p>
        </div>

        {/* Pricing Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingItems.map((item, index) => (
            <Card
              key={index}
              className={`
                group relative
                border-border/50
                transition-all duration-300 ease-out
                hover:-translate-y-2
                hover:shadow-xl hover:shadow-primary/10
                hover:border-primary/30
                reveal reveal-delay-${index + 1}
              `}
            >
              <CardContent className="p-6">
                {/* Title */}
                <h3
                  className="
                    text-lg font-semibold text-card-foreground mb-2
                    transition-all duration-300
                    group-hover:-translate-y-1
                  "
                >
                  {item.service}
                </h3>

                {/* Price */}
                <div
                  className="
                    flex items-baseline gap-1 mb-4
                    transition-all duration-300
                    group-hover:-translate-y-1
                  "
                >
                  <span className="text-2xl font-bold text-primary">
                    {item.price}
                  </span>
                  {item.perTooth && (
                    <span className="text-sm text-muted-foreground">
                      per tooth
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {item.includes.map((feature, i) => (
                    <li
                      key={i}
                      className="
                        flex items-center gap-2
                        text-muted-foreground
                        transition-all duration-300
                        group-hover:translate-x-1
                      "
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note */}
        <div
          ref={noteRef}
          className="mt-12 p-6 bg-primary/5 rounded-xl flex items-start gap-4 max-w-2xl mx-auto reveal"
        >
          <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Prices may vary
            based on treatment complexity and individual requirements. Contact
            us for a personalized quote after consultation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
