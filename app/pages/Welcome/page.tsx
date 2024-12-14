import Link from "next/link";

export default function Welcome() {
  return (
    <div
      className="relative bg-[#380a8e] min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url(/n1.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-200 mb-4">
          Welcome to Tequila Tech Solutions POS System
        </h1>

        {/* Subheading */}
        <p className="text-md sm:text-lg lg:text-xl text-gray-100 mb-8">
          Streamline your sales process with our easy-to-use Point of Sale solution.
        </p>

        {/* Call-to-Action Button */}
        <Link
          href="/pages/Auth"
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
