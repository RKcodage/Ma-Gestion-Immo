import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";

export default function PropertiesCarousel({ properties }) {
  const containerRef = useRef();
  const CARD_WIDTH = 288;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [properties]);

  const scrollBy = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * CARD_WIDTH,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-6">
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={updateScrollButtons}
        className="flex overflow-x-scroll no-scrollbar space-x-4 scroll-smooth"
      >
        {properties.map((property) => (
          <div
            key={property._id}
            className="shrink-0"
            style={{ width: `${CARD_WIDTH}px` }}
          >
            <PropertyCard
              property={property}
              onSeeMore={() => console.log("Voir plus", property)}
            />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
