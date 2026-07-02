import { Phone, Mail, GraduationCap, Award, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactButtons from "@/components/ContactButtons";
import doctorImage from "@/assets/doctor-karishma.png";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DoctorProfile = () => {
    const navigate = useNavigate();
    const qualifications = [
        {
            icon: GraduationCap,
            title: "Qualification",
            details: "BDS (Dentist)",
            institution: "AMC Dental College Ahmedabad",
            year: "2015",
        },
        {
            icon: Award,
            title: "Registration",
            details: "A-13128",
            institution: "Dental Council Of India (DCI)",
        },
        {
            icon: Briefcase,
            title: "Specialization",
            details: "Dental Surgeon",
        },
        {
            icon: CheckCircle,
            title: "Experience",
            details: "9 Years in Healthcare",
        },
    ];

    const heroInfoRef = useScrollReveal<HTMLDivElement>(0.1);
    const heroImgRef = useScrollReveal<HTMLDivElement>(0.1);
    const qualHeaderRef = useScrollReveal<HTMLDivElement>();
    const qualGridRef = useScrollReveal<HTMLDivElement>(0.05);
    const contactHeaderRef = useScrollReveal<HTMLDivElement>();
    const contactCardsRef = useScrollReveal<HTMLDivElement>(0.1);
    const contactCtaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative min-h-[60vh] flex items-center pt-20 bg-gradient-to-br from-secondary via-secondary/95 to-primary/20">
                    <div className="container mx-auto px-4 relative z-10 py-7">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Doctor Image */}
                            <div ref={heroImgRef} className="flex justify-center lg:justify-end order-1 lg:order-2 reveal-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
                                    <img
                                        // src={doctorImage}
                                        alt="Dr. Karishma Patel - Dental Surgeon"
                                        className="relative w-full max-w-md rounded-3xl shadow-2xl object-cover"
                                    />
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div ref={heroInfoRef} className="order-2 lg:order-1 text-center lg:text-left reveal-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium backdrop-blur-sm mb-4">
                                    <CheckCircle className="w-4 h-4" />
                                    Expert Dental Care
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-4">
                                    Dr. Karishma Patel
                                </h1>
                                <p className="text-xl md:text-2xl text-primary font-semibold mb-6">
                                    BDS - Dental Surgeon
                                </p>
                                <p className="text-lg text-secondary-foreground/80 mb-8 max-w-xl">
                                    Dedicated to providing exceptional dental care with 9 years of experience
                                    in delivering pain-free treatments and beautiful smiles.
                                </p>

                                {/* Contact Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button size="lg" className="text-lg px-8" onClick={() => navigate('/book-appointment')}>
                                        <Phone className="w-5 h-5 mr-2" />
                                        Book Appointment
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="text-lg px-8 bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20"
                                        asChild
                                    >
                                        <a href="tel:+919313288482">
                                            <Phone className="w-5 h-5 mr-2" />
                                            Call Now
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Qualifications Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div ref={qualHeaderRef} className="text-center mb-12 reveal">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Professional Credentials
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Highly qualified and registered dental professional committed to excellence
                            </p>
                        </div>

                        <div ref={qualGridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {qualifications.map((qual, index) => {
                                const Icon = qual.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`
          group
          bg-card rounded-2xl p-6
          border border-border
          transition-all duration-300 ease-out
          hover:-translate-y-2
          hover:shadow-xl hover:shadow-primary/10
          hover:border-primary/50
          reveal reveal-delay-${index + 1}
        `}
                                    >
                                        {/* Icon */}
                                        <div
                                            className="
            w-12 h-12 mb-4
            bg-primary/10 rounded-xl
            flex items-center justify-center
            transition-all duration-300 ease-out
            group-hover:bg-primary
            group-hover:scale-110
            group-hover:rotate-3
          "
                                        >
                                            <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="
            text-lg font-semibold text-foreground mb-2
            transition-all duration-300
            group-hover:-translate-y-0.5
          "
                                        >
                                            {qual.title}
                                        </h3>

                                        {/* Details */}
                                        <p
                                            className="
            text-base font-medium text-primary mb-1
            transition-all duration-300
            group-hover:-translate-y-0.5
          "
                                        >
                                            {qual.details}
                                        </p>

                                        {qual.institution && (
                                            <p
                                                className="
              text-sm text-muted-foreground
              transition-all duration-300
              group-hover:opacity-90
            "
                                            >
                                                {qual.institution}
                                            </p>
                                        )}

                                        {qual.year && (
                                            <p
                                                className="
              text-sm text-muted-foreground mt-1
              transition-all duration-300
              group-hover:opacity-90
            "
                                            >
                                                {qual.year}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </section>

                {/* Contact Information Section */}
                <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div ref={contactHeaderRef} className="text-center mb-12 reveal">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    Get In Touch
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Schedule your appointment or reach out for any queries
                                </p>
                            </div>

                            <div ref={contactCardsRef} className="grid md:grid-cols-2 gap-6">
                                {/* Phone Card */}
                                <a
                                    href="tel:+919313288482"
                                    className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/50 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Phone className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                Phone
                                            </h3>
                                            <p className="text-lg text-primary font-medium">
                                                +91 93132 88482
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Call for appointments
                                            </p>
                                        </div>
                                    </div>
                                </a>

                                {/* Email Card */}
                                <a
                                    // href="mailto:ahalparadenish852@gmail.com"
                                    className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/50 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Mail className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                Email
                                            </h3>
                                            <p className="text-lg text-primary font-medium break-all">
                                                karishmaspatel26@gmail.com
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Send us a message
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* CTA Section */}
                            <div ref={contactCtaRef} className="mt-12 text-center bg-card rounded-2xl p-8 shadow-lg border border-border reveal">
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Ready to Transform Your Smile?
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Book your appointment today and experience pain-free dental care
                                </p>
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
                                        className="flex items-center group"
                                    >
                                        <Phone
                                            className="
        w-5 h-5 mr-2
        transition-transform duration-300
        group-hover:scale-110 group-hover:rotate-6
      "
                                        />
                                        Book Appointment via WhatsApp
                                    </a>
                                </Button>

                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <ContactButtons />
        </div>
    );
};

export default DoctorProfile;
