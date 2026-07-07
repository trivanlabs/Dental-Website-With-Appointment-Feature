import { useState, useEffect } from "react";
import { Phone, Menu, X} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#services", label: "Services", hash: "#services" },
    { href: "/#why-us", label: "Why Us", hash: "#why-us" },
    { href: "/#testimonials", label: "Reviews", hash: "#testimonials" },
    { href: "/#pricing", label: "Pricing", hash: "#pricing" },
    { href: "/doctor", label: "Our Doctor", hash: null },
    { href: "/#contact", label: "Contact", hash: "#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.href === "/doctor") {
      // Navigate to doctor page and scroll to top
      navigate("/doctor");
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Smooth scroll to top
    const startPosition = window.pageYOffset;
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
      
      window.scrollTo(0, startPosition * (1 - ease));
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    // If not on homepage, navigate first
    if (location.pathname !== "/") {
      navigate("/");
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    } else {
      // Already on homepage, just scroll to top
      requestAnimationFrame(animation);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card/95 backdrop-blur-md shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-4 h-16">
            <div className="w-12 h-10 bg-primary rounded-lg flex items-center justify-center">
              <img src={logo} alt="logo" className="w-15 h-15 rounded-lg" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground leading-tight">
                Clinic 
              </h1>
              <p className="text-base font-bold text-muted-foreground">Dental Clinic</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-semibold text-sm uppercase tracking-wide group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button> */}
            <a
              href="tel:+919313288482"
              className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+91 93132 88482</span>
            </a>
            <Button onClick={() => navigate('/book-appointment')}>
                Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border py-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-4 border-t border-border mt-2 space-y-3">
                {/* Theme Toggle for Mobile */}
                {/* <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-5 h-5" />
                      <span className="font-medium">Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-5 h-5" />
                      <span className="font-medium">Light Mode</span>
                    </>
                  )}
                </button> */}
                <Button className="w-full" onClick={() => { setIsMobileMenuOpen(false); navigate('/book-appointment'); }}>
                    Book Appointment
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
