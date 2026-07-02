import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    message: "",
  });

  const headerRef = useScrollReveal<HTMLDivElement>();
  const leftRef = useScrollReveal<HTMLDivElement>(0.1);
  const formRef = useScrollReveal<HTMLDivElement>(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appointment Request Sent!",
      description:
        "Thank you for reaching out. We will contact you shortly to confirm your appointment.",
    });
    setFormData({
      name: "",
      phone: "",
      email: "",
      preferredDate: "",
      message: "",
    });
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 93132 88482",
      href: "tel:+919313288482",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+91 93132 88482",
      href: "https://wa.me/919313288482?text=Hi, I would like to book an appointment at Shiv Shakti Dental Clinic",
    },
    {
      icon: Mail,
      label: "Email",
      value: "karishmaspatel26@gmail.com",
      // href: "mailto:karishmaspatel26@gmail.com",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon-Sat: 9 AM - 7 PM",
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 reveal">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visit Us in Gandhinagar
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to transform your smile? Book your appointment today or visit
            our clinic in Raysan, Gandhinagar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map & Address */}
          <div ref={leftRef} className="space-y-6 reveal-left">
            {/* Address Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-1">
                      Our Address
                    </h3>
                    <p className="text-muted-foreground">
                      Fortune Atlantis, Raysan,
                      <br />
                      Gandhinagar, Gujarat 382426
                    </p>
                    <a
                      href="https://maps.app.goo.gl/EaKugstx8e97a6yZ7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium mt-2 transition-colors"
                    >
                      Get Directions
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
              </CardContent>
            </Card>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <Card key={index} className={`reveal reveal-delay-${index + 1}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="font-medium text-card-foreground hover:text-primary transition-colors truncate block"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium text-card-foreground truncate">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="reveal-right">
            <Card className="h-fit">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-card-foreground mb-6">
                  Request an Appointment
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 93132 88482"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Preferred Date & Time
                    </label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="datetime-local"
                      value={formData.preferredDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Message / Concerns
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your dental concerns or any questions you have..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Request Appointment
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We&apos;ll confirm your appointment within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
