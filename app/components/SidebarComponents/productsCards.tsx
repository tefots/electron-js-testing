import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// creating an interface
interface productProps{
    image: React.ReactNode
    title: String
    description: String
    price: number
    editIcon: React.ReactNode
    }

    export default function ProductsCards({image, title,description, price, editIcon}: productProps){

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
                    {editIcon}
                    </div>


                    </div>

                </CardContent>

            </Card>
            
            </>
        )
    }