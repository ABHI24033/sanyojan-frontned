import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import "./ui.css";

const AlertBox = ({ alert, setAlert }) => {
  // hide alert automatically after 2 seconds
  useEffect(() => {
    if (alert?.message) {
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 4000); // 2 seconds

      return () => clearTimeout(timer); // cleanup on unmount or alert change
    }
  }, [alert, setAlert]);

  if (!alert?.message) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1050, width: "350px" }}
    >
      <Alert
        variant={alert.type || "info"}
        dismissible
        onClose={() => setAlert({ type: "", message: "" })}
        className="custom-alert"
      >
        <div className="d-flex justify-content-between align-items-start">
          <div
            style={{
              whiteSpace: "pre-wrap",
              margin: 0,
              fontFamily: "inherit",
              flex: 1,
            }}
          >
            {alert.message}
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default AlertBox;
