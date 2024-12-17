import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout"
import ProductsPage from "@/app/components/SidebarComponents/Products"
import ProductsCards from "@/app/components/SidebarComponents/productsCards"
import { PencilIcon, Settings } from "lucide-react"
import Image from "next/image"
import { title } from "process"


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

        <div className="flex mt-4">
            <ProductsCards image={
                <Image
                src={'/m2.png'}
                width={200}
                height={200}
                alt="Image on the top of Card"                
                />}
                title={"Peach Trees"}
                description={"My description"}
                price={23}
                editIcon={<PencilIcon size={20} color="blue" /> } />

                
        </div>
        </DashboardLayout>
        </>
    )
}