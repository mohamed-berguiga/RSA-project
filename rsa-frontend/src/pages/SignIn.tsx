import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        const success = await register(email,name,password);

        setIsLoading(false);

        if (success) {
            navigate("/login");
        } else {
            setError("Erreur lors de la création du compte.");
        }
    };

    return (
        <div className="min-h-screen gradient-subtle flex flex-col">
            {/* Header */}
            <header className="p-4">
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Retour</span>
                </button>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
                <div className="w-full max-w-sm animate-slide-up">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-elevated mb-4">
                            <Shield className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Inscription à l'application RSA Cipher
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div
                                className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4 mt-0.5"/>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                <Input
                                    type="email"
                                    placeholder="vous@exemple.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Name</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                <Input
                                    type="string"
                                    placeholder="name"
                                    className="pl-10"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>


                        <div className="space-y-2">
                            <Label>Mot de passe</Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Confirmer le mot de passe</Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-primary-foreground shadow-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Création..." : "Créer un compte"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 p-4 rounded-xl bg-accent/50 border border-primary/10">
                        <p className="text-xs text-center text-muted-foreground">
                            Déjà un compte ?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignIn;
