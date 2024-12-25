import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import POSCard from "@/app/components/SidebarComponents/Interfaces/POScard";
import { TreePine } from "lucide-react";
import React from "react";
import Image from "next/image";



export default function POS(){


    return(
        <DashboardLayout>
            <h1>Welcome to the Point Of Sale system</h1>
                
            <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 max-w-5xl mt-6 space-x-5">
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                
            </div>
        </DashboardLayout>
    )
}