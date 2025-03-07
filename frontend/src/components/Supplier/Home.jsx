import { motion } from "framer-motion";
import { FaTools, FaClock, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/techfix-bg.jpg')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        {/* Hero Section */}
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <FaTools className="text-6xl text-blue-500 mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Welcome to <span className="text-blue-500">Techfix</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-80">
            Fast, reliable, and expert solutions for all your tech needs.
          </p>

          {/* Call to Action Button */}
          <motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  <Link
    to="/products"  // Navigates to the product page
    className="mt-10 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition shadow-lg"
  >
    Get Started
  </Link>
</motion.div>
        </motion.div>
      </div>

      {/* Features Section (Higher Position) */}
      <section className="relative py-20 px-6 -mt-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {/* Feature 1 */}
          <motion.div
            className="p-8 bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaClock className="text-5xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold">24/7 Service</h3>
            <p className="text-gray-400 mt-2 text-lg">
              Get support anytime, anywhere. We're always here for you.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="p-8 bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaShieldAlt className="text-5xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold">Secure & Trusted</h3>
            <p className="text-gray-400 mt-2 text-lg">
              Your data and devices are safe with us.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="p-8 bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaHeadset className="text-5xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold">Expert Support</h3>
            <p className="text-gray-400 mt-2 text-lg">
              Our experienced technicians are ready to assist you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
