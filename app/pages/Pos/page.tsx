import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import POSCard from "@/app/components/SidebarComponents/Interfaces/POScard";
import React from "react";



export default function POS(){


    return(
        <DashboardLayout>

            <div>
                <h1>Welcome to the Point Of Sale system</h1>
                <POSCard image={'/b.png'} icon={} />
            </div>
        </DashboardLayout>
    )
}