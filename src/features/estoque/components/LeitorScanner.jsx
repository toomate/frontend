import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onResult }) {

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {

    readerRef.current = new BrowserMultiFormatReader();

    readerRef.current
      .decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err, controls) => {

          if (!controlsRef.current && controls) {
            controlsRef.current = controls;
          }

          if (result) {

            const code = result.getText();

            onResult(code);

            if (controlsRef.current) {
              controlsRef.current.stop();
            }
          }
        }
      );

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };

  }, [onResult]);

  return (
    <video
      ref={videoRef}
      className="scanner-video"
    />
  );
}