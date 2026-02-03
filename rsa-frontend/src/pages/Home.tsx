import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-subtle flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">RSA Cipher</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="max-w-md w-full text-center animate-slide-up">
          {/* Animated Lock Icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-elevated">
              <Lock className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2 left-1/2 ml-8 w-10 h-10 rounded-xl bg-card shadow-card flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            RSA Encryption
          </h1>
          <p className="text-muted-foreground mb-2">
            Démonstration pédagogique
          </p>
          
          <p className="text-secondary-foreground text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            Découvrez le fonctionnement du chiffrement asymétrique RSA de manière interactive et sécurisée.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <FeatureCard
              icon={<Key className="w-5 h-5" />}
              label="Générer"
            />
            <FeatureCard
              icon={<Lock className="w-5 h-5" />}
              label="Chiffrer"
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              label="Déchiffrer"
            />
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="w-full max-w-xs gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-all group"
          >
            Commencer
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            Toutes les opérations sont effectuées localement dans votre navigateur
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          Web Crypto API • 2048-bit RSA • Client-side encryption
        </p>
      </footer>
    </div>
  );
};

function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 flex flex-col items-center gap-2">
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}

export default Home;
