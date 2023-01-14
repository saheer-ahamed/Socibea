import React from "react";

export default function ThemeModal() {
  return (
    <>
      <div className="customize-theme">
        <div className="card">
          <h2>Customize your view</h2>
          <p>Manage your font size, color, and background.</p>
          {/* ========== FONT SIZES ========== */}
          <div className="font-size">
            <h3>Font Size</h3>
            <div>
              <h6>Aa</h6>
              <div className="choose-size">
                <span className="font-size-1" />
                <span className="font-size-2" />
                <span className="font-size-3 active" />
                <span className="font-size-4" />
                <span className="font-size-5" />
              </div>
              <h3>Aa</h3>
            </div>
          </div>
          {/* ========== PRIMARY COLORS ========== */}
          <div className="color">
            <h3>Color</h3>
            <div className="choose-color">
              <span className="color-1" />
              <span className="color-2" />
              <span className="color-3" />
              <span className="color-4" />
              <span className="color-5 active" />
            </div>
          </div>
          {/* ========== BACKGROUND COLORS ========== */}
          <div className="background">
            <h3>Background</h3>
            <div className="choose-bg">
              <div className="bg-1">
                <span />
                <h5 htmlFor="bg-1">Light</h5>
              </div>
              <div className="bg-2">
                <span />
                <h5 htmlFor="bg-2">Dim</h5>
              </div>
              <div className="bg-3 active">
                <span />
                <h5 htmlFor="bg-3">Lights Out</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
