import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-lg text-foreground">
                Prishtina Nights
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the best nightlife venues, events, and experiences in
              Prishtina.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Explore</h4>
            <div className="space-y-2">
              <Link
                to="/venues"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Venues
              </Link>
              <Link
                to="/events"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Events
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Account</h4>
            <div className="space-y-2">
              <Link
                to="/login"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Register
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Platform</h4>
            <p className="text-sm text-muted-foreground">
              Built as a shared platform for nightlife discovery, reservations,
              and venue management.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Prishtina Nights. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;