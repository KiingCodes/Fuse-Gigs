import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Smartphone, CheckCircle, Share, MoreVertical } from "lucide-react";
import logo from "@/assets/logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(checkStandalone);

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            App Installed!
          </h1>
          <p className="text-muted-foreground">
            Fuse Gigs is now installed on your device. You can access it from your home screen.
          </p>
          <Link to="/">
            <Button className="w-full">Open App</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 max-w-lg mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center space-y-6">
          <img src={logo} alt="Fuse Gigs" className="h-24 w-auto mx-auto" />
          
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Install Fuse Gigs
            </h1>
            <p className="text-muted-foreground">
              Get the full app experience on your device
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Why install?
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Quick access from your home screen</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Works offline for browsing cached content</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Faster loading and smoother experience</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Receive notifications for new messages</span>
              </li>
            </ul>
          </div>

          {/* Install Instructions */}
          {isIOS ? (
            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
              <h2 className="font-semibold text-foreground">Install on iPhone/iPad</h2>
              <ol className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <Share className="w-4 h-4 inline text-primary" /> Share button in Safari</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Scroll down and tap "Add to Home Screen"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Tap "Add" in the top right corner</span>
                </li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstallClick} size="lg" className="w-full gap-2">
              <Download className="w-5 h-5" />
              Install Fuse Gigs
            </Button>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
              <h2 className="font-semibold text-foreground">Install on Android</h2>
              <ol className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <MoreVertical className="w-4 h-4 inline text-primary" /> menu button in Chrome</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Tap "Install app" or "Add to Home screen"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Follow the prompts to install</span>
                </li>
              </ol>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            No app store required. Install directly from your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Install;
