import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProductProps {
  image: string;
  title: string;
  description: string;
  pricePerProduct: string;
  id: number;
  onDelete: (id: number) => void;
}

export default function ProductsCards({
  image,
  title,
  description,
  pricePerProduct,
  id,
  onDelete,
}: ProductProps) {
  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      onDelete(id);
    }
  };

  return (
    <Card className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-full">
      {/* Image */}
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square">
          <img
            src={image}
            alt={`Image of ${title}`}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      {/* Content */}
      <CardContent className="flex flex-col p-3 sm:p-4">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold uppercase text-gray-800 truncate">
          {title}
        </h3>
        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>
        {/* Price and Actions */}
        <div className="flex justify-between items-center mt-3 sm:mt-4">
          <span className="text-base sm:text-lg font-semibold text-gray-800">
            ${pricePerProduct}
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href={`/pages/Products/edit/${id}`} passHref>
              <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors relative group">
                <Pencil size={14} className="sm:size-16" />
                <span className="absolute bottom-10 hidden sm:group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Edit Product
                </span>
              </button>
            </Link>
            <button
              onClick={handleDeleteClick}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors relative group"
            >
              <Trash2 size={14} className="sm:size-16" />
              <span className="absolute bottom-10 hidden sm:group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Delete Product
              </span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}