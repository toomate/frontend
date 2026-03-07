import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onResult }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          
          console.log("Código detectado:", result.getText());
          onResult(result.getText());
        }
      });

    return () => {
      codeReader.current.reset();
    };
  }, [onResult]);

  return (
    <div>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "10px"
        }}
      />
    </div>
  );
}