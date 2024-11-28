import Link from "next/link";


export default function Welcome(){

    return(
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-5xl font-bold text-blue-600 mb-6">
            Welcome to Tsiu POS System
          </h1>
          <p className="text-lg text-gray-600 mb-6">
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