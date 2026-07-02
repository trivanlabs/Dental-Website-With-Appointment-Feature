import { IoCall } from "react-icons/io5";

type Props = {
  className?: string;
};

const CallButton = ({ className = "" }: Props) => {
  return (
    <a
      href="tel:+917778044482"
      className={`relative w-14 h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 motion-safe:animate-bounce hover:animate-none ${className}`}
      aria-label="Call Shiv Shakti Dental Clinic"
    >
      <IoCall className="w-6 h-6" />
    </a>
  );
};

export default CallButton;
