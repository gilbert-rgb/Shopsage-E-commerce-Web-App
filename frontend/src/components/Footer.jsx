import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
          {/* Company Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Company
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li className="mb-4">
                <a href="/careers" className="hover:underline">
                  Careers
                </a>
              </li>
              <li className="mb-4">
                <a href="/brands" className="hover:underline">
                  Brand Center
                </a>
              </li>
              <li className="mb-4">
                <a href="/blog" className="hover:underline">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Help Center
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="/support" className="hover:underline">
                  Customer Support
                </a>
              </li>
              <li className="mb-4">
                <a href="/faq" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li className="mb-4">
                <a href="/shipping" className="hover:underline">
                  Shipping & Delivery
                </a>
              </li>
              <li className="mb-4">
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-4">
                <a href="/terms" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li className="mb-4">
                <a href="/returns" className="hover:underline">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* App Downloads */}
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Download Our App
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  iOS App
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Android App
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Windows
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  macOS
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social Bar */}
        <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © {new Date().getFullYear()} <a href="/">YourShop™</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 md:mt-0 rtl:space-x-reverse">
            {/* Replace # with actual links */}
            {[
              { name: "Facebook", href: "#", icon: "facebook" },
              { name: "Twitter", href: "#", icon: "twitter" },
              { name: "GitHub", href: "#", icon: "github" },
              { name: "Dribbble", href: "#", icon: "dribbble" },
            ].map((item, idx) => (
              <a key={idx} href={item.href} className="text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label={item.name}>
                <span className="sr-only">{item.name}</span>
                {/* You can swap these for Heroicons or Lucide icons */}
                <i className={`fab fa-${item.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
