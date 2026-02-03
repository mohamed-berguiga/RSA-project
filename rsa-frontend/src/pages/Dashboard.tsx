import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RSAProvider } from "@/context/RSAContext";
import { Info, Key, Lock, Unlock, LogOut } from "lucide-react";
import AboutView from "@/components/dashboard/AboutView";
import GenerateKeysView from "@/components/dashboard/GenerateKeysView";
import EncryptView from "@/components/dashboard/EncryptView";
import DecryptView from "@/components/dashboard/DecryptView";

type ViewType = "about" | "generate" | "encrypt" | "decrypt";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>("about");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  const views: Record<ViewType, React.ReactNode> = {
    about: <AboutView />,
    generate: <GenerateKeysView />,
    encrypt: <EncryptView />,
    decrypt: <DecryptView />,
  };

  const navItems: { id: ViewType; icon: React.ReactNode; label: string }[] = [
    { id: "about", icon: <Info className="w-5 h-5" />, label: "À propos" },
    { id: "generate", icon: <Key className="w-5 h-5" />, label: "Générer" },
    { id: "encrypt", icon: <Lock className="w-5 h-5" />, label: "Chiffrer" },
    { id: "decrypt", icon: <Unlock className="w-5 h-5" />, label: "Déchiffrer" },
  ];

  return (
    <RSAProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground text-sm">RSA Cipher</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20">
          <div className="animate-fade-in">
            {views[activeView]}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[70px] ${
                  activeView === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`transition-transform ${
                    activeView === item.id ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-xs font-medium">{item.label}</span>
                {activeView === item.id && (
                  <span className="absolute -bottom-0 w-8 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </RSAProvider>
  );
};

export default Dashboard;
