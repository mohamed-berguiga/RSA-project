import { useState } from "react";
import { useRSA } from "@/context/RSAContext";
import { decryptMessage } from "@/utils/rsa";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Unlock, Copy, Check, AlertCircle, CheckCircle2, Key, Sparkles } from "lucide-react";

const DecryptView = () => {
  const { keyPair, lastEncryptedMessage } = useRSA();
  const [ciphertext, setCiphertext] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  //Fonction d’import clé privée
  async function importPrivateKey(pem: string): Promise<CryptoKey> {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\s/g, "");

    const binaryDer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    return await crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
    );
  }

  const handleDecrypt = async () => {
    if (!keyPair?.privateKey) {
      setError("Aucune clé privée disponible. Veuillez générer vos clés RSA.");
      return;
    }

    if (!ciphertext.trim()) {
      setError("Veuillez entrer un message chiffré.");
      return;
    }

    setIsDecrypting(true);
    setError("");
    setPlaintext("");

    try {
      // Utilisation directe de la clé privée du contexte
      const decrypted = await decryptMessage(ciphertext.trim(), keyPair.privateKey);
      setPlaintext(decrypted);
    } catch (err) {
      setError(
          "Échec du déchiffrement : message invalide."
      );
      console.error(err);
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(plaintext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setCiphertext("");
    setPlaintext("");
    setError("");
  };

  const useLastEncrypted = () => {
    if (lastEncryptedMessage) {
      setCiphertext(lastEncryptedMessage);
      setError("");
      setPlaintext("");
    }
  };

  return (
      <div className="p-4 space-y-4">
        {/* Header Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Unlock className="w-5 h-5 text-primary-foreground"/>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Déchiffrement</h2>
              <p className="text-xs text-muted-foreground">Avec la clé privée</p>
            </div>
          </div>
          <p className="text-sm text-secondary-foreground">
            Collez un message chiffré pour le déchiffrer avec votre clé privée RSA.
          </p>
        </div>

        {/* No Keys Warning */}
        {!keyPair && (
            <div
                className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 animate-fade-in">
              <Key className="w-5 h-5 text-warning shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-medium text-foreground">Aucune clé disponible</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rendez-vous dans l'onglet "Générer" pour créer votre paire de clés RSA.
                </p>
              </div>
            </div>
        )}

        {/* Quick Fill Button */}
        {keyPair && lastEncryptedMessage && !ciphertext && (
            <button
                onClick={useLastEncrypted}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-accent border border-primary/20 text-primary text-sm font-medium hover:bg-primary/10 transition-colors animate-fade-in"
            >
              <Sparkles className="w-4 h-4"/>
              Utiliser le dernier message chiffré
            </button>
        )}
        {/* PrivateKey Section */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <label className="block text-sm font-medium text-foreground mb-2">
            Clé privée (PEM/Base64)
          </label>

        </div>
        {/* Input Section */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <label className="block text-sm font-medium text-foreground mb-2">
            Message chiffré (Base64)
          </label>
          <Textarea
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder="Collez le message chiffré ici..."
              className="min-h-[120px] bg-muted/30 border-border focus:border-primary resize-none font-mono text-sm"
          />
          <div className="flex items-center justify-end mt-2">
            {ciphertext && (
                <button
                    onClick={handleClear}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Effacer
                </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
            <div
                className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0"/>
              <p className="text-sm text-destructive">{error}</p>
            </div>
        )}

        {/* Decrypt Button */}
        <Button
            onClick={handleDecrypt}
            disabled={isDecrypting || !keyPair || !ciphertext.trim() }
            className="w-full gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isDecrypting ? (
              <span className="flex items-center gap-2">
            <Unlock className="w-4 h-4 animate-pulse"/>
            Déchiffrement...
          </span>
          ) : (
              <span className="flex items-center gap-2">
            <Unlock className="w-4 h-4"/>
            Déchiffrer le message
          </span>
          )}
        </Button>

        {/* Result Section */}
        {plaintext && (
            <div className="bg-card rounded-2xl p-4 shadow-card border border-success/20 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success"/>
                  <span className="font-medium text-foreground text-sm">Message déchiffré</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                      <Check className="w-4 h-4 text-success"/>
                  ) : (
                      <Copy className="w-4 h-4"/>
                  )}
                </Button>
              </div>
              <div className="bg-success/5 border border-success/10 rounded-lg p-4">
                <p className="text-foreground text-sm whitespace-pre-wrap break-words">
                  {plaintext}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ✓ Déchiffrement réussi avec votre clé privée.
              </p>
            </div>
        )}

        {/* Info Box */}
        <div className="bg-muted/30 rounded-xl p-4">
          <h4 className="text-xs font-medium text-foreground mb-2">🔐 Sécurité RSA</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Le déchiffrement RSA n'est possible qu'avec la clé privée correspondante.
            Si vous utilisez une clé différente, le déchiffrement échouera.
          </p>
        </div>
      </div>
  );
};

export default DecryptView;
