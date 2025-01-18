import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// creating an interface
interface productProps{
    image: React.ReactNode
    title: String
    description: String
    quantity: number
    pricePerProduct: String
    }

    export default function ProductsCards({image, title,description, quantity, pricePerProduct}: productProps){

        return(
            <div className="ms-2">
            <Card className="">
                <CardHeader>
                    <div className="">{image}</div>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="">
                    {description}

                    <div className="flex flex-col items-center w-full">                    
                        <div className="mt-2 text-green-700 text-xl font-semibold">
                            {pricePerProduct}
                            </div>
                            <div className="mt-2 text-gray-500 text-lg">
                            {quantity}
                        </div>
                    </div>
                </CardContent>
            </Card>            
            </div>
        )
    }