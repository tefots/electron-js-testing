import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

export default function ProductsPage({
  title,
  icon,
  onClick,
  isActive,
}: ProductProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-row rounded-lg p-5 space-x-4 items-center ${
        isActive ? "bg-green-400 text-white" : "bg-white"
      }`}
    >
      <div className="card-header">{icon}</div>
      <div className="card-title">{title}</div>
    </div>
  );
}
