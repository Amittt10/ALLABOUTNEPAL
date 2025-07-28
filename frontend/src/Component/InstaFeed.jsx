// InstaFeed.jsx
import { useEffect } from "react";
import './InstaFeed.css';

export default function InstaFeed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="custom-insta-feed-wrapper">
      <div
        className="elfsight-app-a35feb70-641c-4a00-a8d9-34f97d8567d9"
        data-elfsight-app-lazy
      />
    </div>
  );
}
