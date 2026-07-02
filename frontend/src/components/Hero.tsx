import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dental.jpg";

const Hero = () => {
  const trustBadges = [
    "10,000+ Happy Patients",
    "Pain-Free Treatments",
    "Advanced Technology",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Ken-Burns zoom + Overlay */}
      <div className="absolute inset-0 z-0 hero-fade-in hero-delay-1">
        <img
          src={heroImage}
          alt="Modern dental clinic with professional staff"
          className="w-full h-full object-cover hero-bg-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 mb-6 hero-fade-up hero-delay-1">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium backdrop-blur-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {badge}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-tight mb-6 hero-fade-up hero-delay-2">
            Experience{" "}
            <span className="text-primary">Pain-Free Dentistry</span> with
            Expert Care You Can Trust
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8 leading-relaxed hero-fade-up hero-delay-3">
            Join 10,000+ happy smiles in Gandhinagar. Our gentle approach and
            advanced digital dentistry ensure comfortable, stress-free
            treatments for you and your family.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 hero-fade-up hero-delay-4">
            <Button
              size="lg"
              className="text-lg px-8 transition-transform duration-300 ease-out hover:-translate-y-1 active:translate-y-0"
              asChild
            >
              <Link to="/book-appointment">
                <Phone className="w-5 h-5 mr-2" />
                Book Your Appointment
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20"
              onClick={() => {
                const servicesSection = document.querySelector('#services');
                if (servicesSection) {
                  const targetPosition = servicesSection.getBoundingClientRect().top + window.pageYOffset;
                  const startPosition = window.pageYOffset;
                  const distance = targetPosition - startPosition;
                  const duration = 1000;
                  let start: number | null = null;

                  const easeInOutCubic = (t: number): number => {
                    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                  };

                  const animation = (currentTime: number) => {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = easeInOutCubic(progress);

                    window.scrollTo(0, startPosition + distance * ease);

                    if (timeElapsed < duration) {
                      requestAnimationFrame(animation);
                    }
                  };

                  requestAnimationFrame(animation);
                }
              }}
            >
              View Our Services
            </Button>
          </div>

          {/* Location Badge */}
          <div className="mt-8 inline-flex items-center gap-2 text-secondary-foreground/70 hero-fade-up hero-delay-5">
            <a
              href="https://www.google.com/maps/place/Shiv+Shakti+Dental+Clinic/@23.1689269,72.6401287,916m/data=!3m2!1e3!4b1!4m6!3m5!1s0x395c2b006091d467:0xe8c76663ca012fa2!8m2!3d23.1689269!4d72.6401287!16s%2Fg%2F11vwsc2y9t?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Shiv Shakti Dental Clinic on Google Maps"
              className="inline-flex items-center"
            >
              <svg
                className="w-5 h-5 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Fortune Atlantis, Raysan, Gandhinagar, Gujarat</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
