// src/components/Footer.jsx
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-semibold">MyWebsite</h3>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">Home</a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">About</a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">Services</a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://www.facebook.com"  className="text-gray-400 hover:text-white text-xl"><i className="bi bi-facebook"></i></a>
          <a href="https://www.twitter.com" className="text-gray-400 hover:text-white text-xl"><i className="bi bi-twitter"></i></a>
          <a href="https://www.instagram" className="text-gray-400 hover:text-white text-xl"><i className="bi bi-instagram"></i></a>
          <a href="http://www.gmail.com" className="text-gray-400 hover:text-white text-xl"><i className="bi bi-envelope"></i></a>
        </div>
      </div>
    </footer>
  );
};
