import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface POSprops{
    image: React.ReactNode
    title: String
    price: number
    icon: React.ReactNode
}

export default function POSSidebar({image, title, price, icon}: POSprops){

    return (
        <div>
            <Card className="flex ">
                <CardHeader>
                    {image}
                </CardHeader>
                <CardContent>
                    {title}
                    <div className="flex mt-4 space-x-8">
                        {price}
                        {icon}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}