import { FaHeadset ,FaPhoneAlt,FaEnvelope,FaComments,FaMapMarkerAlt} from "react-icons/fa";
import type { IconType } from "react-icons";

export const faqs = [
    {
      question: "What are your shipping options and delivery times?",
      answer:
        "We offer standard, express, and next-day shipping. Delivery times vary by location.",
    },
    {
      question: "What's your return and refund policy?",
      answer:
        "Returns are accepted within 30 days. Refunds issued upon product inspection.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You’ll receive a tracking number via email after your order ships.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide. Customs fees may apply depending on your location.",
    },
    {
      question: "How do I change or cancel my order?",
      answer:
        "Contact support within 1 hour of placing the order for changes or cancellation.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, PayPal, and digital wallets.",
    },
    {
      question: "Do you have a size guide?",
      answer: "Yes, our size guide is available on product pages.",
    },
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' at the top right and follow the steps.",
    },
  ];

export const contact = [
  {
    heading:"Phone Support",
    icon:FaPhoneAlt,
    line1:"+1 (555) 123-4567",
    line2:"Mon-Fri, 9 AM - 6 PM EST"
  },
  {
    heading:"Email Support",
    icon:FaEnvelope,
    line1:"support@nexora.com",
    line2:"Response within 24 hours"
  },
  {
    heading:"Live Chat",
    icon:FaComments,
    line1:"Available on our website",
    line2:"Mon-Fri, 9 AM - 6 PM EST"
  },
  {
    heading:"Phone Support",
    icon:FaPhoneAlt,
    line1:"123 Commerce Street",
    line2:"New York, NY 10001"
  },
  {
    heading:"Office Address",
    icon:FaMapMarkerAlt,
    line1:"Monday – Friday",
    line2:"9:00 AM – 6:00 PM EST"
  }
]


interface SupportItem {
  icon: IconType;
  heading: string;
  subHeading: string;
}

interface SupportBanner {
  heading: string;
  subHeading: string;
  image1: SupportItem;
  image2: SupportItem;
  image3: SupportItem;
}

export const supportBanner: SupportBanner = {
  heading: "We're Here to Help",
  subHeading: "Have questions about your order, need product support, or want to learn more about Nexora? Our customer service team is ready to assist you.",
  image1: {
    icon: FaHeadset,
    heading: "24/7 Support",
    subHeading: "Available around the clock.",
  },
  image2: {
    icon: FaHeadset,
    heading: "Secure & Private",
    subHeading: "Protected info.",
  },
  image3: {
    icon: FaHeadset,
    heading: "Fast Response",
    subHeading: "Quick help.",
  },
};

export const querryOption = [
  "General Inquiry","Order Issue","Technical Support","Feedback"
]



