import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (scrollToHash()) return;
    }

    const container = document.getElementById("main-scroll") || window;
    container.scrollTo({ top: 0, behavior: "instant" });
    container.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
