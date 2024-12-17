import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// creating an interface
interface productProps{
    image: React.ReactNode
    title: String
    description: String
    price: number
    pricePerProduct: String
    }

    export default function ProductsCards({image, title,description, price, pricePerProduct}: productProps){

        return(
            <>
            <Card >
                <CardHeader>
                    <div className="">{image}</div>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="">
                    {description}
                    <div className="flex flex-row space-x-10 w-full">
                    <div className="mt-2">
                    {price}
                    </div>
                    <div className="mt-2 mx-5">
                    {pricePerProduct}
                    </div>


                    </div>

                </CardContent>

            </Card>
            
            </>
        )
    }