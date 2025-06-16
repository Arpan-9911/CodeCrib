import { useEffect, useRef } from "react";

const NotificationComponent = ({ bodyMessage, onComplete }) => {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!hasFired.current && Notification.permission === "granted") {
      hasFired.current = true;
      new Notification("CodeCrib Notification", {
        body: bodyMessage,
      });
      onComplete(); // Reset in parent
    }
  }, []);

  return null;
};

export default NotificationComponent;