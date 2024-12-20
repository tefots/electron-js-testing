import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface productProps {
  title: String,
  icon: React.ReactNode
}
export default function ProductsPage({title, icon}: productProps ) {
    return (
      <div className="p-2">
        {/* top of the products that provides the description*/}

        <div className="flex flex-row rounded-lg bg-white p-5 space-x-4 items-center">
          <div className="card-header">
            {icon}
          </div>
          <div className="card-title"> {title}</div>
        </div>
      </div>
    );
  }
  