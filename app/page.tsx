import Image from "next/image";
import Welcome from "./pages/Welcome/page";

export default function Home() {
  return (
    <div className="bg-slate-600">
      <Welcome />
    </div>
  );
}
