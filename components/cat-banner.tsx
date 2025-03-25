"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export function CatBanner() {
  const [catImage, setCatImage] = useState<CatImage | null>(null);

  useEffect(() => {
    const fetchCatImage = async () => {
      try {
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search",
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_CAT_API || "",
            },
          }
        );
        const data = await response.json();
        setCatImage(data[0]);
      } catch (error) {
        console.error("Error fetching cat image:", error);
      }
    };

    fetchCatImage();
  }, []);

  if (!catImage) return null;

  const isGif = catImage.url.toLowerCase().endsWith(".gif");

  return (
    <div className="flex bottom-0 left-0 right-0 bg-white border-t p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={catImage.url}
              alt="Random cat"
              fill
              className="object-cover"
              unoptimized={isGif}
            />
          </div>
          <div>
            <p className="text-lg font-medium">Gato do dia</p>
            <p className="text-sm text-gray-500">Powered by TheCatAPI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
