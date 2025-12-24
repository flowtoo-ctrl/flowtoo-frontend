import React, { useState } from "react";
import { FaTimes, FaExpand, FaCompressAlt } from "react-icons/fa";
import "./ARMockup.css";

export default function ARMockup({ productImage, productName, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [room, setRoom] = useState("living");

  const roomBackgrounds = {
    living: "linear-gradient(135deg, #e8d5c4 0%, #d4c5b9 100%)",
    bedroom: "linear-gradient(135deg, #c8b8d8 0%, #b8a8d0 100%)",
    kitchen: "linear-gradient(135deg, #f5e6d3 0%, #e8d9c8 100%)",
    office: "linear-gradient(135deg, #d4d9e6 0%, #c8cfe0 100%)",
  };

  const roomNames = {
    living: "Living Room",
    bedroom: "Bedroom",
    kitchen: "Kitchen",
    office: "Office",
  };

  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  return (
    <div className={`ar-mockup-container ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="ar-mockup-header">
        <h3>Try Before You Buy - {productName}</h3>
        <div className="ar-mockup-controls">
          <button
            className="ar-control-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle fullscreen"
          >
            {isFullscreen ? <FaCompressAlt /> : <FaExpand />}
          </button>
          <button
            className="ar-control-btn close"
            onClick={onClose}
            title="Close AR view"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="ar-mockup-content">
        {/* Room Background */}
        <div
          className="ar-room-background"
          style={{ background: roomBackgrounds[room] }}
        >
          {/* Product Preview */}
          <div className="ar-product-container">
            <img
              src={productImage}
              alt={productName}
              className="ar-product-image"
              style={{ transform: `scale(${scale})` }}
            />
            <div className="ar-product-shadow"></div>
          </div>

          {/* Room Selector */}
          <div className="ar-room-selector">
            {Object.entries(roomNames).map(([key, name]) => (
              <button
                key={key}
                className={`room-btn ${room === key ? "active" : ""}`}
                onClick={() => setRoom(key)}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Scale Slider */}
          <div className="ar-scale-control">
            <label>Size: {Math.round(scale * 100)}%</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={handleScaleChange}
              className="scale-slider"
            />
          </div>

          {/* AR Info */}
          <div className="ar-info">
            <p>💡 Tip: Adjust the size to see how the product fits in your space</p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="ar-features">
        <h4>AR Features:</h4>
        <ul>
          <li>✓ Visualize in different rooms</li>
          <li>✓ Adjust size to match your space</li>
          <li>✓ See realistic placement</li>
          <li>✓ Make confident purchase decisions</li>
        </ul>
      </div>
    </div>
  );
}
