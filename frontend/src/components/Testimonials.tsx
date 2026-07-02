import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Tanvir Mansuri",
      location: "",
      image: testimonial1,
      rating: 5,
      title: "Great Experience",
      text: "I recently visited Shiv Shakti Dental Clinic and had a great experience. Dr. Karishma Patel was excellent; she has great explanation skills and a very pleasant nature. I underwent a root canal treatment followed by a zirconia crown. I no longer feel any pain after the treatment, and the new tooth looks just like my natural teeth.",
    },
    {
      name: "RanchodBhai Rabari",
      location: "",
      image: testimonial3,
      rating: 5,
      title: "Welcoming & Informative",
      text: "My experience at Shivshakti Dental Clinic was welcoming, simple and informative. The dental team provided impeccable service from door to door. Thanks so much! I look forward to seeing y'all soon.",
    },
    {
      name: "Srushti Patel",
      location: "",
      image: testimonial1,
      rating: 5,
      title: "Found My Permanent Dentist",
      text: "I stumbled into Dr. Karishma for an emergency and it was the best accident ever. Dentist are a personal nightmare for me, but this one changed that. She gives a heads up if there's a delay so you are not waiting endlessly. She is kind, gentle, patient and brilliant at her job. So happy to have found my new permanent dentist.",
    },
    {
      name: "Gopal Patel",
      location: "",
      image: testimonial2,
      rating: 5,
      title: "Very Professional",
      text: "Very professional and skilled top to bottom. Cannot recommend them more highly. Dr Karishma is thorough and informative and lets you know every step of the way so there are no surprises. Very calming as well. Thanks Dr Karishma.",
    },
    {
      name: "Pappu Dantani",
      location: "",
      image: testimonial3,
      rating: 5,
      title: "Painless Treatment",
      text: "I had severe pain due to TMJ issue. Dr. Karishma explained everything in detail about the treatment. They did low level laser pain therapy; thereafter my pain got reduced. Thanks to Dr. Karishma Patel for such a wonderful painless treatment.",
    },
    {
      name: "Pratap Thakor",
      location: "",
      image: testimonial1,
      rating: 5,
      title: "Best Experience",
      text: "Hands down my experience at the dentist, the best experience I have ever had. I was facing an incredibly different procedure, received root canal treatment. Dr. Karishma Patel explained nicely to me.",
    },
    {
      name: "Jasu Rathod",
      location: "",
      image: testimonial2,
      rating: 5,
      title: "Professional & Clean",
      text: "From the first day I stepped foot in this clinic, I found nothing but professionalism and skilled individuals. This is a new and very clean facility. I have had a deep cleaning done and I like what I see. This place is worth it for every patient; I would definitely suggest anyone to come here.",
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const headerRef = useScrollReveal<HTMLDivElement>();
  const ctaRef = useScrollReveal<HTMLDivElement>();

  // Duplicate testimonials for infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animationId: number;

    const scrollSpeed = 2; // px per frame

    const autoScroll = () => {
      if (!el) return;

      el.scrollLeft += scrollSpeed;

      // When scrolled half (original list length), reset
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    const stop = () => cancelAnimationFrame(animationId);
    const start = () => requestAnimationFrame(autoScroll);

    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", start);
    };
  }, [1000]);

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 reveal">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Patient Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don&apos;t just take our word for it. Here&apos;s what our patients
            in Gandhinagar and Raysan have to say about their experience.
          </p>
        </div>

        {/* Testimonials - Horizontal scroll */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto py-4 md:gap-8 md:py-6 hide-scrollbar"
          role="list"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-lg transition-shadow w-[260px] md:w-[500px] min-h-[320px] md:min-h-[340px] snap-start flex-shrink-0"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-primary/20 absolute top-4 right-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-card-foreground mb-3">
                  &ldquo;{testimonial.title}&rdquo;
                </h3>

                {/* Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                  {testimonial.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Google Reviews CTA */}
        <div ref={ctaRef} className="text-center mt-12 reveal">
          <a
            href="https://www.google.com/maps/place/Shiv+Shakti+Dental+Clinic/@23.1689269,72.6401287,916m/data=!3m1!1e3!4m8!3m7!1s0x395c2b006091d467:0xe8c76663ca012fa2!8m2!3d23.1689269!4d72.6401287!9m1!1b1!16s%2Fg%2F11vwsc2y9t?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <span>See all reviews on Google</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
