import { toast } from "react-toastify";
import CustomToast from "../../Component/CustomToast";

export const showCustomToast = (
  code,
  message,
  linkText = "",
  linkHref = "#",
  onLinkClick = null // callback on link click
) => {
  toast(({ closeToast }) => (
    <CustomToast
      code={code}
      message={message}
      linkText={linkText}
      linkHref={linkHref}
      onLinkClick={onLinkClick}
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
