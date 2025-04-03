"use client";
import schoolData from "@/lib/json/schools.json";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("./components/Map").then((component) => component.Map),
  { ssr: false }
);

export default function HomePage() {
  return <Map locations={schoolData} />;
}
