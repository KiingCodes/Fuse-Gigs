import { Compass, Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary py-16">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-secondary-foreground">Side Quest</span>
            </div>
            <p className="text-sm text-secondary-foreground/60 mb-6">
              Connecting hustlers with their community, one quest at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="w-5 h-5 text-secondary-foreground/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5 text-secondary-foreground/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Facebook className="w-5 h-5 text-secondary-foreground/80" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-secondary-foreground mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Browse All</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Categories</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Near Me</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Featured</a></li>
            </ul>
          </div>

          {/* For Hustlers */}
          <div>
            <h4 className="font-display font-semibold text-secondary-foreground mb-4">For Hustlers</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Join Us</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-secondary-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/50">
            © 2024 Side Quest. All rights reserved.
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
