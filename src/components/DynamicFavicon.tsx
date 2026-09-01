"use client";

import { useEffect } from "react";

export default function DynamicFavicon() {
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((settings) => {
        const logoUrl = settings.logo;
        if (logoUrl) {
          // Remove any existing dynamic favicon
          const existing = document.getElementById("dynamic-favicon");
          if (existing) existing.remove();

          // Set the admin logo as favicon
          const link = document.createElement("link");
          link.id = "dynamic-favicon";
          link.rel = "icon";
          link.type = "image/png";
          link.href = logoUrl;
          document.head.appendChild(link);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
