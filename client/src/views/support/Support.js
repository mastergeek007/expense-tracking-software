import emailjs from "@emailjs/browser";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { name, email, subject, message } = form;

    if (!name || !email || !subject || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    const templateParams = {
      name,
      email,
      subject,
      message,
    };

    try {
      await emailjs.send(
        "service_jyf23mo", // Replace with your EmailJS service ID
        "template_y4j6aze", // Replace with your EmailJS template ID
        templateParams,
        "bWKLhu__qsfa0uG2K" // Replace with your EmailJS public key
      );
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-center text-primary mb-6">
        Contact Support
      </h1>
      <p className="text-center text-gray-600 mb-3">
        Found a bug or need help with the Expense Tracker? Send us a message.
      </p>
      <p className="text-center text-gray-600 mb-6">
        For Emergency Contact Whatsapp Number: +880 1571261165
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border rounded px-4 py-2"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full border rounded px-4 py-2"
        />

        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full border rounded px-4 py-2"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows="5"
          placeholder="Your Message"
          className="w-full border rounded px-4 py-2"
        />

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
