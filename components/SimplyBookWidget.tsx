"use client";

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

// This fixes the TypeScript error if you're using it
declare global {
  interface Window {
    SimplyBookWidget: any;
  }
}

const BookingWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInitiated = useRef(false);

  const initWidget = () => {
    if (typeof window !== "undefined" && window.SimplyBookWidget && !widgetInitiated.current) {
      try {
        const themeSettings = {
          "colors_accent": "#fa0032",
          "colors_accent_contrast": "#ffffff",
          "colors_text": "#000000",
          "colors_text_secondary": "#5c5c5c",
          "colors_border": "#e7eaee",
          "colors_background": "#ffffff",
          "colors_link": "#990017",
          "font_sizes_h2": "24px",
          "font_sizes_h3": "20px",
          "font_sizes_p": "16px"
        };

        
        window.SimplyBookWidget(containerRef.current, {
          apiKey: "193a629a5cdb85e4726fe2ed5a19bd69c0e6e8b262ca655d769e0cb6b2e5322f",
          company: "mockup",
          baseUrl: "https://user-api-v2.simplybook.me",
          theme: themeSettings
        });

        widgetInitiated.current = true;
      } catch (e) {
        console.error("SimplyBook initialization failed:", e);
      }
    }
  };

  return (
    <>
      <link 
        rel="stylesheet" 
        href="//widget.simplybook.me/react-widget/public/app.css" 
      />
      
     
      <Script 
        src="//widget.simplybook.me/react-widget/public/runtime.js" 
        strategy="afterInteractive"
      />
      <Script 
        src="//widget.simplybook.me/react-widget/public/app.js" 
        strategy="afterInteractive"
        onLoad={() => {
          // Small timeout ensures the script execution is complete
          setTimeout(initWidget, 100);
        }}
      />

      <div 
        ref={containerRef} 
        id="sb_widget" 
        style={{ width: '100%', minHeight: '600px' }} 
      />
    </>
  );
};

export default BookingWidget;