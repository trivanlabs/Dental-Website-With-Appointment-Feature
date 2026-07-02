import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTA = () => {
  const badgeRef = useScrollReveal<HTMLSpanElement>();
  const headlineRef = useScrollReveal<HTMLHeadingElement>();
  const subRef = useScrollReveal<HTMLParagraphElement>();
  const ctaRef = useScrollReveal<HTMLDivElement>();
  const trustRef = useScrollReveal<HTMLParagraphElement>();

  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <span
            ref={badgeRef}
            className="inline-block px-4 py-1.5 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium mb-6 reveal"
          >
            Limited Slots Available
          </span>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6 reveal reveal-delay-1"
          >
            Ready for Your Pain-Free Dental Experience?
          </h2>

          {/* Subtext */}
          <p
            ref={subRef}
            className="text-xl text-secondary-foreground/80 mb-8 reveal reveal-delay-2"
          >
            Join 10,000+ satisfied patients in Gandhinagar. Book your
            appointment today and experience the difference of gentle,
            caring dental care.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-3">
            <Button
              size="lg"
              asChild
              className="
                text-lg px-8
                transition-all duration-300 ease-out
                hover:-translate-y-1
                hover:shadow-xl hover:shadow-primary/20
                active:translate-y-0
              "
            >
              <a
                href="https://wa.me/919313288482?text=Hi, I would like to book an appointment at Shiv Shakti Dental Clinic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Calendar className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Schedule Your Visit Now
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="
                text-lg px-8
                border-primary/40
                text-primary
                bg-transparent
                transition-all duration-300 ease-out
                hover:bg-primary hover:text-primary-foreground
                hover:border-primary
                hover:-translate-y-1
                hover:shadow-lg hover:shadow-primary/20
                active:translate-y-0
              "
            >
              <a href="tel:+919313288482" className="flex items-center">
                <Phone className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Call +91 93132 88482
              </a>
            </Button>
          </div>

          {/* Trust Note */}
          <p
            ref={trustRef}
            className="mt-8 text-secondary-foreground/60 reveal reveal-delay-4"
          >
            ✓ Same-day appointments available &nbsp; ✓ No waiting time &nbsp; ✓
            Flexible payment options
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
