import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Batch Trip Planner · Sept–Oct 2026" },
      {
        name: "description",
        content:
          "Sixty seconds to say when you're free, where you're starting from and what you want. Then someone finally books something.",
      },
      { property: "og:title", content: "Batch trip. Finally." },
      {
        property: "og:description",
        content: "Sixty seconds, then someone books something.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  ssr: false,
  component: App,
});
