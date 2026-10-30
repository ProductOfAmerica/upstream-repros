import { createRoot } from "react-dom/client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

createRoot(document.getElementById("root")!).render(
  <DayPicker mode="single" defaultMonth={new Date(2026, 0)} />,
);
