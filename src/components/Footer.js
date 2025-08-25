export default function Footer({ onNavigateToSection }) {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Student Appeal Manager
            </h3>
            <p className="text-gray-300 text-sm">
              Streamlining academic appeals at the University of Sheffield with
              transparency and efficiency.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Login
                </a>
              </li>
              <li>
                {onNavigateToSection ? (
                  <button
                    onClick={() => onNavigateToSection("help")}
                    className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-300 text-sm cursor-pointer"
                  >
                    Help
                  </button>
                ) : (
                  <a
                    href="/#help"
                    className="hover:text-white transition-colors"
                  >
                    Help
                  </a>
                )}
              </li>
              <li>
                {onNavigateToSection ? (
                  <button
                    onClick={() => onNavigateToSection("contact")}
                    className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-300 text-sm cursor-pointer"
                  >
                    Contact
                  </button>
                ) : (
                  <a
                    href="/#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                )}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="mailto:appeals@sheffield.ac.uk"
                  className="hover:text-white transition-colors"
                >
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="tel:+441142222000"
                  className="hover:text-white transition-colors"
                >
                  Phone Support
                </a>
              </li>
              <li>
                {onNavigateToSection ? (
                  <button
                    onClick={() => onNavigateToSection("help")}
                    className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-300 text-sm cursor-pointer"
                  >
                    FAQ
                  </button>
                ) : (
                  <a
                    href="/#help"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                )}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">University</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="https://www.sheffield.ac.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  University Website
                </a>
              </li>
              <li>
                <a
                  href="https://www.sheffield.ac.uk/students"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Student Portal
                </a>
              </li>
              <li>
                <a
                  href="https://sheffield.ac.uk/saas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Student Services
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 University of Sheffield. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
