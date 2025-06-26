import React, { useState } from "react";
import {axiosInstance} from "../../api/axiosConfig"; // Adjust the path if needed
import "./SubscribeForm.css";

export default function SubscribeForm() {
  const [subscriber, setSubscriber] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubscriber((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!subscriber.name.trim() || !subscriber.email.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(subscriber.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/subscribers", subscriber);
      setMessage(response.data.message || "Subscribed successfully!");
      setSubscriber({ name: "", email: "" });
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Subscription failed. Please try again.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-form-container">
      <h3>Subscribe to Our Newsletter</h3>
      <form className="subscribe-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={subscriber.name}
          onChange={handleInputChange}
          required
          aria-label="Name"
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={subscriber.email}
          onChange={handleInputChange}
          required
          aria-label="Email"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </form>
      {message && <p className="subscribe-message">{message}</p>}
    </div>
  );
}
