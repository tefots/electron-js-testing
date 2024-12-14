import Link from "next/link";


export default function Welcome(){

    return(
        <div className=" relative bg-[#380a8e] min-h-screen flex items-center justify-center">

      {/* Overlay to darken the video */}
{/* <div className="absolute inset-0 bg-black opacity-25 z-0"></div> */}


        <div className=" container mx-auto p-6 text-center">
          <h1 className="text-5xl font-bold text-blue-200 mb-6">
            Welcome to Tequila Tech Solutions POS System
          </h1>
          <p className="text-lg text-gray-100 mb-6">
            Streamline your sales process with our easy-to-use Point of Sale solution.
          </p>
          <Link
            href="/pages/Auth"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    )
}