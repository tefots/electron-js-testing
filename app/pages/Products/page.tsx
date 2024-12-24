"use client";
import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout"
import ProductsPage from "@/app/components/SidebarComponents/Products"
import ProductsCards from "@/app/components/SidebarComponents/productsCards"
import { Book, Flower, Flower2, Heart, PencilIcon, Settings, Trees } from "lucide-react"
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation"

import { title } from "process"


export default function Products (){

    // defining method to add product into the database
    function addProduct(){
        const route = useRouter();
        route.push('/pages/Products/Add');
    }
    return(
        <>
        <DashboardLayout >
            <div className="mx-2">
                
                    <h1 className="text-2xl font-bold mb-4">Products</h1>
                    <p>Manage your product inventory here.</p>
            
            </div>

        <div className="flex flex-col md:flex-row">
            <ProductsPage icon={<Book size= {20} /> } title ="Fruit Trees" />
            <ProductsPage icon={<Trees size= {20} /> } title ="Forest" />
            <ProductsPage icon={<Flower size= {20} /> } title ="Flowers" />
            <ProductsPage icon={<Flower2 size= {20} /> } title ="Herbs" />

        <div className="mt-9">            
            <Link className="mx-6 bg-slate-500 text-white p-3 rounded-xl" href={'/pages/Products/add'} passHref>
                        + Add Product
            </Link>
            </div>
            
        </div>

        {/* products cards with images and numbers */}
        <div></div>
        <div className="grid   md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-1 mt-4 max-w-5xl space-x-4">
            <ProductsCards image={
                <Image
                src={'/m2.png'}
                width={200}
                height={200}
                alt="Image on the top of Card"                
                />}
                title={"Peach Trees"}
                description={"My description"}                
                pricePerProduct={"M99" }
                quantity={2}
                />

            <ProductsCards image={
                <Image
                src={'/m2.png'}
                width={200}
                height={200}
                alt="Image on the top of Card"                
                />}
                title={"Peach Trees"}
                description={"My description"}
                quantity={23}
                pricePerProduct={"M80" } />

            <ProductsCards image={
                <Image
                src={'/m2.png'}
                width={200}
                height={200}
                alt="Image on the top of Card"                
                />}
                title={"Peach Trees"}
                description={"My description"}
                quantity={232}
                pricePerProduct={"M70" } />

            <ProductsCards image={
                <Image
                src={'/m2.png'}
                width={200}
                height={200}
                alt="Image on the top of Card"                
                />}
                title={"Peach Trees"}
                description={"My description"}
                quantity={40}
                pricePerProduct={"M75" } />

               

                
        </div>
        </DashboardLayout>
        </>
    )
}