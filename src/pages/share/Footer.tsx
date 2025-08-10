import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const BRAND_NAME = "Test_School";

const footerLinks = {
  assessment: [
    { label: "Take Assessment", href: "/assessment" },
    { label: "Certification Levels", href: "/levels" },
    { label: "Assessment Process", href: "/process" },
    { label: "FAQ", href: "/faq" },
  ],
  resources: [
    { label: "Study Materials", href: "/resources" },
    { label: "Competency Framework", href: "/competencies" },
    { label: "Sample Questions", href: "/samples" },
    { label: "Preparation Guide", href: "/guide" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Certification Policy", href: "/certification-policy" },
    { label: "Security Measures", href: "/security" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wide text-[#3F4555] dark:text-blue-400 hover:text-blue-600 transition-colors duration-300 flex items-center gap-1"
            >
              <img
                src="src/assets/logo.jpg"
                alt="Test_School Logo"
                className="h-14  w-auto"
              />
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Digital Competency Assessment Platform. Evaluate and certify your
              skills through our secure 3-step assessment process from A1 to C2
              levels.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 capitalize">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Security Notice */}
        <div className="border-t mt-12 pt-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {BRAND_NAME} Competency Assessment
            Platform. All rights reserved. Secure testing environment powered by
            Safe Exam Browser technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
