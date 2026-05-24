import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { getProfile, updateProfile } from "../services/UserService.js";
import { User, Mail, Lock, Coins, CheckCircle, XCircle, MapPin, Camera } from "lucide-react";

const CURRENCY_OPTIONS = [
    { value: "BRL", label: "Real Brasileiro (R$)" },
    { value: "USD", label: "Dólar Americano ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "Libra Esterlina (£)" },
];

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoBase64, setPhotoBase64] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currency, setCurrency] = useState(localStorage.getItem("currency") ?? "BRL");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getProfile();
                const data = res.data;
                setProfile(data);
                setName(data.name ?? "");
                setAddress(data.address ?? "");
                if (data.photoUrl) setPhotoPreview(data.photoUrl);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, []);

    function showFeedback(type, message) {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4000);
    }

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showFeedback("error", "A foto deve ter no máximo 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPhotoPreview(reader.result);
            setPhotoBase64(reader.result);
        };
        reader.readAsDataURL(file);
    }

    async function handleSaveProfile(e) {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            showFeedback("error", "As senhas não coincidem.");
            return;
        }
        if (newPassword && newPassword.length < 6) {
            showFeedback("error", "A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            const payload = { name, address };
            if (photoBase64) payload.photoUrl = photoBase64;
            if (newPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const res = await updateProfile(payload);
            setProfile(res.data);
            setPhotoBase64(null);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            showFeedback("success", "Perfil atualizado com sucesso!");
        } catch (err) {
            const msg = err.response?.data?.message ?? "Erro ao atualizar perfil.";
            showFeedback("error", msg);
        } finally {
            setLoading(false);
        }
    }

    function handleSaveCurrency() {
        localStorage.setItem("currency", currency);
        showFeedback("success", "Preferências salvas!");
    }

    const avatarLetter = (name || profile?.email || "?")[0]?.toUpperCase();

    return (
        <div className="flex bg-zinc-950 min-h-screen">
            <Sidebar />

            <main className="flex-1 p-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Meu Perfil</h1>
                    <p className="text-zinc-400">Gerencie suas informações pessoais e preferências</p>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border ${
                        feedback.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}>
                        {feedback.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        <span className="text-sm">{feedback.message}</span>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-6">

                    {/* Coluna principal */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <User size={20} className="text-emerald-400" />
                                Informações Pessoais
                            </h2>

                            <form onSubmit={handleSaveProfile} className="space-y-5">

                                {/* Nome */}
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Nome</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* Email — somente leitura */}
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="email"
                                            value={profile?.email ?? ""}
                                            disabled
                                            className="w-full bg-zinc-800/40 border border-zinc-700 text-zinc-500 rounded-xl pl-10 pr-4 py-3 cursor-not-allowed select-none"
                                        />
                                    </div>
                                    <p className="text-zinc-600 text-xs mt-1">O email não pode ser alterado.</p>
                                </div>

                                {/* Endereço */}
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Endereço</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Rua, número, cidade..."
                                            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition"
                                        />
                                    </div>
                                </div>



                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition"
                                >
                                    {loading ? "Salvando..." : "Salvar Alterações"}
                                </button>
                            </form>
                        </div>

                        {/* Preferências de moeda */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Coins size={20} className="text-emerald-400" />
                                Preferências
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Moeda padrão</label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                                    >
                                        {CURRENCY_OPTIONS.map((c) => (
                                            <option key={c.value} value={c.value} className="bg-zinc-900">
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleSaveCurrency}
                                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition border border-zinc-700"
                                >
                                    Salvar Preferências
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* Coluna lateral */}
                    <div className="space-y-6">

                        {/* Avatar com upload */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-emerald-400">
                                            {avatarLetter}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-black p-1.5 rounded-full transition"
                                >
                                    <Camera size={14} />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-semibold">{name || "Sem nome"}</p>
                                <p className="text-zinc-500 text-sm">{profile?.email}</p>
                                {address && <p className="text-zinc-600 text-xs mt-1">{address}</p>}
                            </div>
                            <p className="text-zinc-600 text-xs">JPG, PNG ou GIF — max 2MB</p>
                        </div>
                            

                        {/* Alterar senha */}
                        <div className="border-t border-zinc-800 pt-5">
                            <h3 className="text-zinc-300 font-medium mb-4 flex items-center gap-2">
                                <Lock size={16} className="text-emerald-400" />
                                Alterar Senha
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Senha atual</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Nova senha</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Confirmar nova senha</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none transition ${
                                            confirmPassword && newPassword !== confirmPassword
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-zinc-700 focus:border-emerald-500"
                                        }`}
                                    />
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1">As senhas não coincidem.</p>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    );
}