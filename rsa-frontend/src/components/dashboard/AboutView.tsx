import { Shield, Lock, Key, Unlock, AlertTriangle, Info } from "lucide-react";

const AboutView = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Title Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-button">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">RSA Cipher</h2>
            <p className="text-sm text-muted-foreground">Chiffrement asymétrique</p>
          </div>
        </div>
        <p className="text-secondary-foreground text-sm leading-relaxed">
          Cette application pédagogique vous permet de comprendre et d'expérimenter 
          le fonctionnement du chiffrement RSA, l'un des algorithmes cryptographiques 
          les plus utilisés au monde.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          Comment ça fonctionne ?
        </h3>
        <div className="space-y-4">
          <StepItem
            number={1}
            icon={<Key className="w-4 h-4" />}
            title="Générer les clés"
            description="Créez une paire de clés RSA (publique et privée) de 2048 bits."
          />
          <StepItem
            number={2}
            icon={<Lock className="w-4 h-4" />}
            title="Chiffrer"
            description="Utilisez la clé publique pour chiffrer votre message secret."
          />
          <StepItem
            number={3}
            icon={<Unlock className="w-4 h-4" />}
            title="Déchiffrer"
            description="Seule la clé privée correspondante peut révéler le message original."
          />
        </div>
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-2 gap-3">
        <ConceptCard
          icon={<Key className="w-5 h-5 text-success" />}
          title="Clé publique"
          description="Peut être partagée librement"
          color="success"
        />
        <ConceptCard
          icon={<Lock className="w-5 h-5 text-destructive" />}
          title="Clé privée"
          description="Doit rester strictement secrète"
          color="destructive"
        />
      </div>

      {/* Security Notice */}
      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground text-sm mb-1">
              Environnement pédagogique
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Les clés sont stockées uniquement en mémoire (RAM). La fermeture ou 
              le rechargement de la page entraînera leur perte définitive. Cette 
              application est destinée à l'apprentissage uniquement.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <div className="bg-muted/50 rounded-2xl p-4">
        <h4 className="font-medium text-foreground text-sm mb-3">Spécifications techniques</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <TechSpec label="Algorithme" value="RSA-OAEP" />
          <TechSpec label="Taille clé" value="2048 bits" />
          <TechSpec label="Hash" value="SHA-256" />
          <TechSpec label="API" value="Web Crypto" />
        </div>
      </div>
    </div>
  );
};

function StepItem({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary">{icon}</span>
          <h4 className="font-medium text-foreground text-sm">{title}</h4>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ConceptCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "success" | "destructive";
}) {
  return (
    <div className={`bg-card rounded-xl p-4 shadow-card border ${
      color === "success" ? "border-success/20" : "border-destructive/20"
    }`}>
      <div className="mb-2">{icon}</div>
      <h4 className="font-medium text-foreground text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function TechSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg p-2 border border-border/50">
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export default AboutView;
