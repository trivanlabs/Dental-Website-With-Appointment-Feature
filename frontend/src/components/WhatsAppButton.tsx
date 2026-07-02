import { IoLogoWhatsapp } from "react-icons/io";

type Props = {
  className?: string;
};

const WhatsAppButton = ({ className = "" }: Props) => {
  return (
    <a
      href="https://wa.me/917778044482?text=Hi, I would like to book an appointment at Shiv Shakti Dental Clinic"
      target="_blank"
      rel="noopener noreferrer"
      className={`relative w-14 h-14 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 motion-safe:animate-bounce hover:animate-none ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <IoLogoWhatsapp className="w-7 h-7" />
      <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
        1
      </span>
    </a>
  );
};

export default WhatsAppButton;
