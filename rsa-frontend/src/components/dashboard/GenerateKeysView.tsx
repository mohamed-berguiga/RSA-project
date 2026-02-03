import { useState } from "react";
import { useRSA } from "@/context/RSAContext";
import { generateRSAKeyPair, formatKeyForDisplay } from "@/utils/rsa";
import { Button } from "@/components/ui/button";
import { Key, RefreshCw, Copy, Check, AlertCircle, CheckCircle2 } from "lucide-react";

const GenerateKeysView = () => {
  const { keyPair, setKeyPair } = useRSA();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<"public" | "private" | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      const newKeyPair = await generateRSAKeyPair();
      setKeyPair(newKeyPair);
    } catch (err) {
      setError("Erreur lors de la génération des clés. Votre navigateur supporte-t-il Web Crypto API?");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, keyType: "public" | "private") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Card */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Key className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Génération de clés</h2>
            <p className="text-xs text-muted-foreground">RSA 2048 bits</p>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground mb-4">
          Générez une nouvelle paire de clés RSA pour chiffrer et déchiffrer vos messages.
        </p>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-all"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Génération en cours...
            </span>
          ) : keyPair ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Régénérer les clés
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Générer les clés
            </span>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {keyPair && !error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <p className="text-sm text-success font-medium">Clés générées avec succès !</p>
        </div>
      )}

      {/* Keys Display */}
      {keyPair && (
        <div className="space-y-4 animate-slide-up">
          {/* Public Key */}
          <div className="bg-card rounded-2xl p-4 shadow-card border border-success/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-success/10 flex items-center justify-center">
                  <Key className="w-3 h-3 text-success" />
                </div>
                <span className="font-medium text-foreground text-sm">Clé publique</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(keyPair.publicKeyBase64, "public")}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                {copiedKey === "public" ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="key-display text-success/80 max-h-32 overflow-y-auto">
              {formatKeyForDisplay(keyPair.publicKeyBase64)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cette clé peut être partagée pour recevoir des messages chiffrés.
            </p>
          </div>

          {/* Private Key */}
          <div className="bg-card rounded-2xl p-4 shadow-card border border-destructive/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center">
                  <Key className="w-3 h-3 text-destructive" />
                </div>
                <span className="font-medium text-foreground text-sm">Clé privée</span>
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                  Secrète
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(keyPair.privateKeyBase64, "private")}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                {copiedKey === "private" ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="key-display text-destructive/80 max-h-32 overflow-y-auto">
              {formatKeyForDisplay(keyPair.privateKeyBase64)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ⚠️ Ne partagez jamais cette clé. Elle permet de déchiffrer vos messages.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!keyPair && !error && (
        <div className="bg-muted/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Aucune clé générée. Cliquez sur le bouton ci-dessus pour créer votre paire de clés RSA.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerateKeysView;
