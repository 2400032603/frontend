import React, { useState, useEffect, useRef } from "react";

function SimpleCaptcha({ onCaptchaChange, onRefresh }) {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setIsCaptchaValid(false);
    drawCaptcha(result);
  };

  // Draw captcha on canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256}, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Add noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256}, 0.5)`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // Draw text
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#0f766e";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Add slight rotation and distortion
    for (let i = 0; i < text.length; i++) {
      const x = (width / (text.length + 1)) * (i + 1);
      const y = height / 2;
      const angle = (Math.random() - 0.5) * 0.3;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add border
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  };

  // Initialize captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Validate input
  useEffect(() => {
    const isValid = userInput.toLowerCase() === captchaText.toLowerCase();
    setIsCaptchaValid(isValid);
    onCaptchaChange(isValid);
  }, [userInput, captchaText, onCaptchaChange]);

  const handleRefresh = () => {
    generateCaptcha();
    if (onRefresh) onRefresh();
  };

  return (
    <div style={captchaContainer}>
      <label style={captchaLabel}>
        <strong>Security Verification</strong>
      </label>
      <div style={captchaWrapper}>
        <canvas
          ref={canvasRef}
          width={250}
          height={80}
          style={canvasStyle}
        />
        <button
          type="button"
          onClick={handleRefresh}
          style={refreshBtn}
          title="Refresh CAPTCHA"
        >
          🔄
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter the text above"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={{
          ...captchaInput,
          borderColor: userInput
            ? isCaptchaValid
              ? "#059669"
              : "#dc2626"
            : "#d1d5db"
        }}
      />

      {userInput && (
        <p
          style={{
            margin: "5px 0 0 0",
            fontSize: "12px",
            color: isCaptchaValid ? "#059669" : "#dc2626",
            fontWeight: "500"
          }}
        >
          {isCaptchaValid ? "✅ CAPTCHA verified" : "❌ CAPTCHA incorrect"}
        </p>
      )}
    </div>
  );
}

const captchaContainer = {
  marginBottom: "15px"
};

const captchaLabel = {
  display: "block",
  marginBottom: "10px",
  fontSize: "14px",
  color: "#374151"
};

const captchaWrapper = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "10px"
};

const canvasStyle = {
  border: "2px solid #0f766e",
  borderRadius: "6px",
  backgroundColor: "#fff"
};

const refreshBtn = {
  padding: "8px 12px",
  background: "#0f766e",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background 0.3s ease"
};

const captchaInput = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "2px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease"
};

export default SimpleCaptcha;
