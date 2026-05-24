import { LayoutDashboard, ArrowLeftRight, BarChart2, UserCircle2, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    const navItems = [
        { label: "Dashboard",  icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { label: "Transacoes", icon: <ArrowLeftRight size={20} />,  path: "/transactions" },
        { label: "Resumo",     icon: <BarChart2 size={20} />,       path: "/summary" },
    ];

    return (
        <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-10">Sufoco</h1>

            {/* Nav principal */}
            <nav className="space-y-3 flex-1">
                {navItems.map(({ label, icon, path }) => (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            location.pathname === path
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </nav>

            {/* Perfil + Sair — fixos no rodapé */}
            <div className="space-y-2 mt-6">
                <button
                    onClick={() => navigate("/profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        location.pathname === "/profile"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                >
                    <UserCircle2 size={20} />
                    Perfil
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition"
                >
                    <LogOut size={20} />
                    Sair
                </button>
            </div>
        </aside>
    );
}