import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";

const ContactButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <CallButton />
      <WhatsAppButton />
    </div>
  );
};

export default ContactButtons;
