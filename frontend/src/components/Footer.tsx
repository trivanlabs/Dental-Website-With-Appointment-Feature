import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#services", label: "Services", hash: "#services" },
    { href: "/#why-us", label: "Why Us", hash: "#why-us" },
    { href: "/#testimonials", label: "Reviews", hash: "#testimonials" },
    { href: "/#pricing", label: "Pricing", hash: "#pricing" },
    { href: "/#contact", label: "Contact", hash: "#contact" },
  ];

  const services = [
    "Dental Checkups",
    "Root Canal Treatment",
    "Teeth Whitening",
    "Orthodontic Bracing",
    "Dental Fillings",
    "Gum Treatment",
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.href === "/doctor") {
      // Navigate to doctor page
      navigate("/doctor");
    } else if (link.hash) {
      // If we're on the homepage, just scroll to the section
      if (location.pathname === "/") {
        const element = document.querySelector(link.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // If we're on another page, navigate to homepage first, then scroll
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(link.hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  const handleServiceClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname === "/") {
      const element = document.querySelector("#services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to homepage first, then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector("#services");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  S
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-foreground leading-tight">
                  Shiv Shakti
                </h3>
                <p className="text-xs text-secondary-foreground/60">
                  Dental Clinic
                </p>
              </div>
            </div>
            <p className="text-secondary-foreground/70 mb-4">
              Your Smile, Our Priority. Providing gentle, pain-free dental care
              to Gandhinagar families since 2009.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/denish_ahalpara/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://maps.app.goo.gl/EaKugstx8e97a6yZ7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Google Maps"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="
          group inline-block relative
          text-secondary-foreground/70
          transition-all duration-300 ease-out
          hover:text-primary
          hover:translate-x-1
        "
                  >
                    {link.label}

                    {/* Animated underline */}
                    <span
                      className="
            absolute left-0 -bottom-0.5
            h-[2px] w-full
            bg-primary
            scale-x-0
            origin-left
            transition-transform duration-300 ease-out
            group-hover:scale-x-100
          "
                    />
                  </a>
                </li>
              ))}
            </ul>

          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="/#services"
                    onClick={(e) => handleServiceClick(e)}
                    className="
          group inline-block relative
          text-secondary-foreground/70
          transition-all duration-300 ease-out
          hover:text-primary
          hover:translate-x-1
        "
                  >
                    {service}

                    {/* Animated underline */}
                    <span
                      className="
            absolute left-0 -bottom-0.5
            h-[2px] w-full
            bg-primary
            scale-x-0
            origin-left
            transition-transform duration-300 ease-out
            group-hover:scale-x-100
          "
                    />
                  </a>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://maps.app.goo.gl/EaKugstx8e97a6yZ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Fortune Atlantis, Raysan,
                    <br />
                    Gandhinagar, Gujarat 382426
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919313288482"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  +91 93132 88482
                </a>
              </li>
              <li>
                <a
                  // href="mailto:karishmaspatel26@gmail.com?subject=hello&body=hello"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  karishmaspatel26@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/60 text-sm">
              © {currentYear} Shiv Shakti Dental Clinic. All rights reserved.
            </p>
            <p className="text-secondary-foreground/60 text-sm">
              Your Smile, Our Priority 😊
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
