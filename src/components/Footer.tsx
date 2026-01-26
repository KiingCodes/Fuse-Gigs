import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary py-16">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Side Quest"
                className="h-24 w-auto object-contain"
              />
              <span className="font-display text-xl font-bold text-secondary-foreground">
                Side Quest
              </span>
            </Link>

            <p className="text-sm text-secondary-foreground/60 mb-6">
              Connecting hustlers with their community, one quest at a time.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-secondary-foreground/80" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-secondary-foreground/80" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-secondary-foreground/80" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-secondary-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/explore" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Near Me
                </Link>
              </li>
              <li>
                <Link to="/explore?featured=true" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hustlers */}
          <div>
            <h4 className="font-display font-semibold text-secondary-foreground mb-4">
              For Hustlers
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/for-hustlers" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Join Us
                </Link>
              </li>
              <li>
                <Link to="/for-hustlers" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/for-hustlers" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/for-hustlers" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-secondary-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/50">
            © 2026 Side Quest. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary-foreground/50">
            <Mail className="w-4 h-4" />
            <span>hello@sidequest.app</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

