"use client";

import { useState, useEffect } from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width;
        setSidebarWidth(width);
      }
    });

    const sidebar = document.querySelector("aside");
    if (sidebar) {
      setSidebarWidth(sidebar.getBoundingClientRect().width);
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }

    const resizeHandler = () => {
      const sb = document.querySelector("aside");
      if (sb) {
        setSidebarWidth(sb.getBoundingClientRect().width);
      }
    };

    window.addEventListener("resize", resizeHandler);

    // Observe for sidebar width changes via a polling interval as a fallback
    const interval = setInterval(resizeHandler, 300);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeHandler);
      clearInterval(interval);
    };
  }, []);

  return (
    <main
      className="flex-1 p-6 lg:p-8 transition-all duration-300 ease-in-out min-h-screen"
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
