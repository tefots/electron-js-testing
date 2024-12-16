import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout"
import ProductsPage from "@/app/components/SidebarComponents/Products"
import { Settings } from "lucide-react"


export default function Products (){


    return(
        <>
        <DashboardLayout >
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <p>Manage your product inventory here.</p>
        <div className="flex flex-col md:flex-row">
            <ProductsPage icon={<Settings size= {20} /> } title ="Fruit Trees" />
            <ProductsPage icon={<Settings size= {20} /> } title ="Stetings" />
            <ProductsPage icon={<Settings size= {20} /> } title ="Stetings" />
            <ProductsPage icon={<Settings size= {20} /> } title ="Stetings" />
        </div>
        </DashboardLayout>
        </>
    )
}