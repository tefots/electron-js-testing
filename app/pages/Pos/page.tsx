import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import POSCard from "@/app/components/SidebarComponents/Interfaces/POScard";
import { Carrot, TreePine } from "lucide-react";
import React from "react";
import Image from "next/image";
import POSSidebar from "@/app/components/SidebarComponents/Interfaces/POSsidebar";

export default function POS() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome to the Point Of Sale System
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grid for POS Cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
          <POSCard
            image={<Image src="/b.png" alt="picture" width={300} height={195} />}
            icon={<TreePine />}
            title="Flower"
            price={98}
          />
          <POSCard
            image={<Image src="/b.png" alt="picture" width={195} height={195} />}
            icon={<TreePine />}
            title="Flower"
            price={98}
          />
          <POSCard
            image={<Image src="/b.png" alt="picture" width={195} height={195} />}
            icon={<TreePine />}
            title="Flower"
            price={98}
          />
          <POSCard
            image={<Image src="/b.png" alt="picture" width={195} height={195} />}
            icon={<TreePine />}
            title="Flower"
            price={98}
          />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6 space-y-4">
          <POSSidebar
            image={
              <Image
                src="/b.png"
                alt="Item picture"
                width={95}
                height={150}
              />
            }
            title="High Profile Tree"
            price={34}
            icon={<Carrot className="ms-4" />}
          />
          <POSSidebar
            image={
              <Image
                src="/b.png"
                alt="Item picture"
                width={95}
                height={150}
              />
            }
            title="High Profile Tree"
            price={34}
            icon={<Carrot />}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
