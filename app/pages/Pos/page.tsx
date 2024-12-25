import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import POSCard from "@/app/components/SidebarComponents/Interfaces/POScard";
import { TreePine } from "lucide-react";
import React from "react";
import Image from "next/image";



export default function POS(){


    return(
        <DashboardLayout>
            <h1>Welcome to the Point Of Sale system</h1>
                
            <div className="grid   md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-1 mt-4 max-w-5xl space-x-4">
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />                
            </div>
        </DashboardLayout>
    )
}