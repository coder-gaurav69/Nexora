import { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import emailjs from "@emailjs/browser";
import { Failure, Success } from "../Components/Toast";
import { faqs, contact, supportBanner, querryOption } from "../utils/content";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    inquiryType: "General Inquiry",
    orderNumber: "",
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const orderNumberInput = formRef.current.querySelector<HTMLInputElement>(
      'input[name="orderNumber"]'
    );

    // If empty, set default value before sending
    if (orderNumberInput && orderNumberInput.value.trim() === "") {
      orderNumberInput.value = "Not Provided";
    }

    try {
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log("Success:", result.text);
      Success("Email sent successfully!");
      setFormData({
        fullName: "",
        email: "",
        inquiryType: "General Inquiry",
        orderNumber: "",
        message: "",
      });
    } catch (error) {
      Failure("Failed to send email.");
      console.error("Error sending email:", error);
    }
  };

  useEffect(()=>{
    window.scrollTo({top:0,left:0})
  },[])

  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-800">
        {/* Help Section */}
        <section className="w-[100%] m-auto bg-gradient-to-b from-blue-600 to-blue-800 text-white text-center py-32 mt-[70px] px-[20px] md:px-[10px]">
          <h1 className="text-4xl font-bold mb-4">{supportBanner.heading}</h1>
          <p className="max-w-3xl mx-auto">{supportBanner.subHeading}</p>
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            {[
              supportBanner.image1,
              supportBanner.image2,
              supportBanner.image3,
            ].map(({ icon:Icon, heading, subHeading }, index) => (
              <div className="flex flex-col items-center" key={index}>
                <div className="bg-blue-500 p-5 rounded-full mb-4">
                  <Icon size={30} />
                </div>
                <h3 className="font-semibold text-lg">{heading}</h3>
                <p>{subHeading}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="w-[90%] mx-auto py-16 px-4 grid md:grid-cols-3 gap-10">
          <form
            className="md:col-span-2 bg-white shadow rounded-lg p-8 space-y-4"
            onSubmit={handleSubmitForm}
            ref={formRef}
          >
            <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border rounded p-2 w-full"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                className="border rounded p-2 w-full"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                className="border rounded p-2 w-full"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
              >
                {querryOption.map((e,index)=>(
                  <option key={index}>{e}</option>
                ))}
                
                
              </select>
              <input
                className="border rounded p-2 w-full"
                name="orderNumber"
                placeholder="Order Number (optional)"
                value={formData.orderNumber}
                onChange={handleChange}
              />
            </div>
            <textarea
              className="border rounded p-2 w-full min-h-[200px]"
              name="message"
              placeholder="Message *"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded flex items-center gap-2 flex justify-center"
            >
              <span>Send Message</span>
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6 text-sm bg-white shadow rounded-lg p-8">
            <h2 className="text-xl font-bold mb-2">Get in Touch</h2>
            {contact.map(({heading,icon:Icon,line1,line2},index)=>(
              <div className="flex items-start gap-3" key={index}>
              <Icon className="mt-1 text-blue-600" />
              <div>
                <p className="font-medium">{heading}</p>
                <p>
                  {line1}
                  <br />
                  {line2}
                </p>
              </div>
            </div>
          ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map(({ question, answer }, index) => (
                <details
                  className="group border rounded-lg bg-white"
                  key={index}
                >
                  <summary className="flex justify-between items-center cursor-pointer px-4 py-3 text-base font-medium text-gray-800">
                    {question}
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-sm text-gray-600">
                    {answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="bg-blue-50 mt-10 p-5 rounded-md text-sm text-blue-900">
              <strong>Still have questions?</strong> Our customer service team
              is here to help! Contact us using any of the methods above, and
              we'll get back to you as soon as possible.
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
