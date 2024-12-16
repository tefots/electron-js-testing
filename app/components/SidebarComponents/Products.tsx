import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface productProps {
  title: String,
  icon: React.ReactNode
}
export default function ProductsPage({title, icon}: productProps ) {
    return (
      <div className="p-2">
        {/* top of the products that provides the description*/}

        <Card className="flex flex-row  bg-white p-2">
          <CardHeader className="ms-2">{icon}</CardHeader>
          <CardTitle className="text-lg items-center space-y-2 mt-4 p-1 ms-0 mr-2 font-medium text-black-400">{title}</CardTitle>

        </Card>
      </div>
    );
  }
  