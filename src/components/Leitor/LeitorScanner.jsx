import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onResult }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .decodeFromVideoDevice(null, videoRef.current, (result, err, controls) => {

        if (!controlsRef.current && controls) {
          controlsRef.current = controls;
        }

        if (result) {
          const text = result.getText();
          console.log("Código detectado:", text);

          onResult(text);

          // para a câmera
          if (controlsRef.current) {
            controlsRef.current.stop();
          }
        }
      });

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
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