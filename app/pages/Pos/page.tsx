import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import POSCard from "@/app/components/SidebarComponents/Interfaces/POScard";
import { Carrot, TreePine } from "lucide-react";
import React from "react";
import Image from "next/image";
import POSSidebar from "@/app/components/SidebarComponents/Interfaces/POSsidebar";
import { title } from "process";

export default function POS(){

    return(
        <DashboardLayout>
            <h1>Welcome to the Point Of Sale system</h1>
            <div className="flex"> 
                <div className="grid md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-1 mt-4 max-w-5xl space-x-4">
                    <POSCard image={<Image src={'/b.png'} alt="picture"  width={300} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                    <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                    <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />
                    <POSCard image={<Image src={'/b.png'} alt="picture"  width={195} height={195} />} icon={<TreePine />} title={'Flower'} price={98} />                
                </div>
                {/* sidebar when the POSCard is clicked it appears here*/}
                <div className="space-y-4 w-full bg-white p-5">
                    <POSSidebar image={<Image src={'/b.png'} alt="Item picture" width={95} height={150} />} title={"High profile tree"} price={34} icon={<Carrot className="ms-4"/>}/>
                    <POSSidebar image={<Image src={'/b.png'} alt="Item picture" width={95} height={150} />} title={"High profile tree"} price={34} icon={<Carrot />}/>

                </div>
            </div>

        </DashboardLayout>
    )
}