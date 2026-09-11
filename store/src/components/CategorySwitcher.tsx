"use client";

import { useState } from "react";

export default function CategorySwitcher({ onSwitch }: { onSwitch: (category: "women" | "kids") => void }) {
  const [active, setActive] = useState<"women" | "kids">("women");

  const handleSwitch = (cat: "women" | "kids") => {
    setActive(cat);
    onSwitch(cat);
  };

  return (
    <div className="flex items-center justify-center mb-10">
      <div className="bg-white p-1 rounded-lg border border-[#E8E4DC] inline-flex gap-1">
        <button
          onClick={() => handleSwitch("women")}
          className={`px-6 py-2.5 rounded-md text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
            active === "women"
              ? "bg-[#121212] text-white"
              : "text-[#6E6A64] hover:text-[#121212]"
          }`}
        >
          Women
        </button>
        <button
          onClick={() => handleSwitch("kids")}
          className={`px-6 py-2.5 rounded-md text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
            active === "kids"
              ? "bg-[#121212] text-white"
              : "text-[#6E6A64] hover:text-[#121212]"
          }`}
        >
          Kids
        </button>
      </div>
    </div>
  );
}
