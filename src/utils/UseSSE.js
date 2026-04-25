import { useEffect, useState } from "react";
import sseManager from "./sseManager";

export function useSSE() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const handler = (msg) => {
      setData(msg);
    };

    sseManager.subscribe(handler);

  }, []);

  return data;
}