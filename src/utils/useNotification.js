import { useEffect, useState } from "react";
import sseManager from "./sseManager";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = sseManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return notifications;
}