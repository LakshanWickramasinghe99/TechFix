import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1C4474] text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand & Social Links */}
        <div>
          <h2 className="text-2xl font-bold text-white">Techfix</h2>
          <p className="mt-2 text-gray-400">Your trusted tech solutions provider.</p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a href="#" className="hover:text-white transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:text-gray-200 transition">Home</a></li>
            <li><a href="#" className="hover:text-gray-200 transition">About Us</a></li>
            <li><a href="#" className="hover:text-gray-200 transition">Services</a></li>
            <li><a href="#" className="hover:text-gray-200 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact Us</h3>
          <p className="mt-4 text-gray-400">123 Tech Street, City, Country</p>
          <p className="mt-2 text-gray-400">Email: support@techfix.com</p>
          <p className="mt-2 text-gray-400">Phone: +123 456 7890</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 text-center pt-6 text-gray-300 text-sm">
        © {new Date().getFullYear()} Techfix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
