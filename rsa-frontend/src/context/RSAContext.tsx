import React, { createContext, useContext, useState, ReactNode } from "react";
import { RSAKeyPair } from "@/utils/rsa";

interface RSAContextType {
  keyPair: RSAKeyPair | null;
  setKeyPair: (keyPair: RSAKeyPair | null) => void;
  lastEncryptedMessage: string;
  setLastEncryptedMessage: (message: string) => void;
}

const RSAContext = createContext<RSAContextType | undefined>(undefined);

export function RSAProvider({ children }: { children: ReactNode }) {
  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const [lastEncryptedMessage, setLastEncryptedMessage] = useState("");

  return (
    <RSAContext.Provider
      value={{ keyPair, setKeyPair, lastEncryptedMessage, setLastEncryptedMessage }}
    >
      {children}
    </RSAContext.Provider>
  );
}

export function useRSA() {
  const context = useContext(RSAContext);
  if (context === undefined) {
    throw new Error("useRSA must be used within an RSAProvider");
  }
  return context;
}
