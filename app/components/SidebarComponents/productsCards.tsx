import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Updated interface to clarify image prop
interface ProductProps {
  image: string; // URL string (e.g., "/products/123456789-image.jpg")
  title: string; // Changed to lowercase for consistency
  description: string;
  quantity: number;
  pricePerProduct: string;
}

export default function ProductsCards({
  image,
  title,
  description,
  quantity,
  pricePerProduct,
}: ProductProps) {
  return (
    <div className="ms-2">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative w-full h-48"> {/* Fixed height for image container */}
            <img
              src={image}
              alt={`Image of ${title}`}
              className="w-full h-full object-cover" // Ensure equal size and cover fit
            />
          </div>
          <CardTitle className="px-4 pt-4">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-gray-600">{description}</p>
          <div className="flex flex-col items-center w-full mt-4">
            <div className="text-green-700 text-xl font-semibold">
              {pricePerProduct}
            </div>
            <div className="mt-2 text-gray-500 text-lg">Qty: {quantity}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}