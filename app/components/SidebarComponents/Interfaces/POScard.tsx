import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { title } from "process"
import { ReactNode } from "react"

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
                    <div className="relative">
                    {image}
                    </div>

                    <div className="absolute mx-auto">
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