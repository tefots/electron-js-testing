import Link from "next/link";

export default function Welcome() {
  return (
    <div
      className="relative bg-white min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url(/../../logo.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
      {/* container */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Main Heading */}
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4">
          Welcome to Lesotho Nursery Shop</h1>

        {/* Subheading */}
        <p className="text-white text-md sm:text-lg lg:text-xl mb-8">
          Streamline your sales process with our easy-to-use Point of Sale solution.
        </p>

        {/* Call-to-Action Button */}
        <Link
          href="/pages/Auth"
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:bg-gray-500 transition-all duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
