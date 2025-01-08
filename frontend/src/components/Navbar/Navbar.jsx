const Navbar = () => {
    return (
      <nav className="bg-blue-600 text-white">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <a href="/">MyLogo</a>
          </div>
  
          {/* Navigation Links */}
          <ul className="flex space-x-6">
            <li>
              <a href="#home" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-gray-300">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-gray-300">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-300">
                Contact
              </a>
            </li>
          </ul>
  
          {/* Call to Action Button */}
          <div>
            <a
              href="#signup"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  