import { useEffect, useState } from 'react';

const Verify = () => {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const email = query.get("email");

    fetch(`http://localhost:3000/api/verify-email?token=${token}&email=${email}`)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(() => setMessage("❌ Verification failed."));
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default Verify;
