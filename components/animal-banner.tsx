"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AnimalImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface AnimalBannerProps {
  type: "cat" | "dog";
}

const API_CONFIG = {
  cat: {
    url: "https://api.thecatapi.com/v1/images/search",
    title: "Gato do dia",
    attribution: "Powered by TheCatAPI",
    envKey: "NEXT_PUBLIC_CAT_API",
  },
  dog: {
    url: "https://api.thedogapi.com/v1/images/search",
    title: "Cachorro do dia",
    attribution: "Powered by The Dog API",
    envKey: "NEXT_PUBLIC_DOG_API",
  },
} as const;

export function AnimalBanner({ type }: AnimalBannerProps) {
  const [animalImage, setAnimalImage] = useState<AnimalImage | null>(null);
  const config = API_CONFIG[type];

  useEffect(() => {
    const fetchAnimalImage = async () => {
      try {
        const response = await fetch(config.url, {
          headers: {
            "x-api-key": process.env[config.envKey] || "",
          },
        });
        const data = await response.json();
        setAnimalImage(data[0]);
      } catch (error) {
        console.error(`Error fetching ${type} image:`, error);
      }
    };

    fetchAnimalImage();
  }, [type, config]);

  if (!animalImage) return null;

  const isGif = animalImage.url.toLowerCase().endsWith(".gif");

  return (
    <div className="flex p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24 rounded-sm overflow-hidden">
            <Image
              src={animalImage.url}
              alt={`Random ${type}`}
              fill
              className="object-cover"
              unoptimized={isGif}
            />
          </div>
          <div>
            <p className="text-sm text-center font-medium">{config.title}</p>
            <p className="text-xs text-center text-gray-500">
              {config.attribution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
