import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover
          ? star <= hover
          : star <= rating;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && setRating(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className="group focus:outline-none"
          >
            <FaStar
              size={26}
              className={`
                transition-all duration-200 ease-in-out
                ${
                  active
                    ? "text-yellow-400 scale-110"
                    : "text-gray-300"
                }
                ${!readOnly && "group-hover:scale-125"}
              `}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
