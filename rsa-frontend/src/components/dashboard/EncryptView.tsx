import { useState } from "react";
import { useRSA } from "@/context/RSAContext";
import { encryptMessage } from "@/utils/rsa";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Copy, Check, AlertCircle, CheckCircle2, Key } from "lucide-react";

const EncryptView = () => {
  const { keyPair, setLastEncryptedMessage } = useRSA();
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [publicKeyInput, setpublicKeyInput] = useState("");

  //fonction d’import de clé publique
  async function importPublicKey(pem: string): Promise<CryptoKey> {
    const b64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/, "")
        .replace(/-----END PUBLIC KEY-----/, "")
        .replace(/\s/g, "");

    const binaryDer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    return await crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );
  }

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      setError("Veuillez entrer un message à chiffrer.");
      return;
    }

    if (!publicKeyInput.trim()) {
      setError("Veuillez fournir la clé publique du destinataire.");
      return;
    }

    if (plaintext.length > 190) {
      setError("Le message est trop long. Maximum 190 caractères pour RSA-2048.");
      return;
    }

    setIsEncrypting(true);
    setError("");

    try {
      const publicKey = await importPublicKey(publicKeyInput.trim());
      const encrypted = await encryptMessage(plaintext, publicKey);

      setCiphertext(encrypted);
      setLastEncryptedMessage(encrypted);
    } catch (err) {
      setError("Clé publique invalide ou erreur de chiffrement.");
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ciphertext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setPlaintext("");
    setCiphertext("");
    setError("");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Card */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Chiffrement</h2>
            <p className="text-xs text-muted-foreground">Avec la clé publique</p>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground">
          Entrez votre message secret et chiffrez-le avec la clé publique RSA.
        </p>
      </div>

      {/* No Keys Warning */}
      {!keyPair && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 animate-fade-in">
          <Key className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Aucune clé disponible</p>
            <p className="text-xs text-muted-foreground mt-1">
              Rendez-vous dans l'onglet "Générer" pour créer votre paire de clés RSA.
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
        <label className="block text-sm font-medium text-foreground mb-2">
          Message en clair
        </label>
        <Textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Entrez votre message secret ici..."
          className="min-h-[120px] bg-muted/30 border-border focus:border-primary resize-none"
          maxLength={190}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {plaintext.length}/190 caractères
          </span>
          {plaintext && (
            <button
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Effacer
            </button>
          )}
        </div>
      </div>
      {/* PublicKey Section */}
      <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
        <label className="block text-sm font-medium text-foreground mb-2">
          Clé publique (PEM/Base64)
        </label>
        <Textarea
            value={publicKeyInput}
            onChange={(e) => setpublicKeyInput(e.target.value)}
            placeholder="Collez votre clé publique ici..."
            className="min-h-[120px] bg-muted/30 border-border focus:border-primary resize-none font-mono text-sm"
        />
        <div className="flex items-center justify-end mt-2">
          {publicKeyInput && (
              <button
                  onClick={() => setpublicKeyInput("")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Effacer
              </button>
          )}
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Encrypt Button */}
      <Button
        onClick={handleEncrypt}
        disabled={isEncrypting || !keyPair || !plaintext.trim()}
        className="w-full gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isEncrypting ? (
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 animate-pulse" />
            Chiffrement...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Chiffrer le message
          </span>
        )}
      </Button>

      {/* Result Section */}
      {ciphertext && (
        <div className="bg-card rounded-2xl p-4 shadow-card border border-primary/20 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="font-medium text-foreground text-sm">Message chiffré</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="cipher-text max-h-40 overflow-y-auto">
            {ciphertext}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Ce message ne peut être déchiffré qu'avec la clé privée correspondante.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-muted/30 rounded-xl p-4">
        <h4 className="text-xs font-medium text-foreground mb-2">💡 Comment ça marche ?</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Le chiffrement RSA utilise la clé publique pour transformer votre message en texte 
          illisible. Seul le détenteur de la clé privée pourra le déchiffrer.
        </p>
      </div>
    </div>
  );
};

export default EncryptView;
