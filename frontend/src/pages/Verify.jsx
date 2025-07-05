import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const email = query.get("email");

    fetch(`http://localhost:3000/api/verify-email?token=${token}&email=${email}`)
      .then(res => res.text())
      .then(data => {
        if (data.toLowerCase().includes("success")) {
          // ✅ Redirect to login with verified param
          navigate("/login?verified=success", { replace: true });
        } else {
          setMessage("❌ Verification failed.");
        }
      })
      .catch(() => setMessage("❌ Verification failed."));
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default Verify;
