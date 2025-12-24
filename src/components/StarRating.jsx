import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ value }) {
  const totalStars = 5;
  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.round(value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-700 ml-1">{value.toFixed(1)}</span>
    </div>
  );
}
