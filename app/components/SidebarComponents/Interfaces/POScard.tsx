import { Card, CardContent, CardHeader } from "@/components/ui/card"


interface posProps{
    image: React.ReactNode
    icon: React.ReactNode
    title: String
    price: number
}

export default function POSCard({image, icon, title, price}: posProps){
 
    return(
        <div>
            <Card className="">
                <CardHeader>
                    <div className="relative w-full">
                    {image}
                    </div>

                    <div className="absolute ms-2">
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    {title}
                    {price}
                </CardContent>
            </Card>
        </div>
    )
}