import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const container = document.getElementById("main-scroll") || window;
    container.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
