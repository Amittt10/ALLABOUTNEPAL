import { toast } from "react-toastify";
import CustomToast from "../../Component/CustomToast";

export const showCustomToast = (code, message, linkText = "", linkHref = "#") => {
  toast(({ closeToast }) => (
    <CustomToast
      code={code}
      message={message}
      linkText={linkText}
      linkHref={linkHref}
      closeToast={closeToast}
    />
  ), {
    type: "default",
    icon: false,
    closeButton: false,
    style: {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  });
};
