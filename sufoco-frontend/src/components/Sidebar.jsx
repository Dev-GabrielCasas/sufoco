import { LayoutDashboard, ArrowLeftRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem("token");

        navigate("/");

    }

    return (
        <aside className="
      w-64
      min-h-screen
      bg-zinc-900
      border-r
      border-zinc-800
      p-6
    ">

            <h1 className="text-2xl font-bold text-white mb-10">
                Sufoco
            </h1>

            <nav className="space-y-3">

                <button onClick={() => navigate("/dashboard")}
                    className="
            w-full
            flex
            items-center
            gap-3
            text-zinc-300
            hover:bg-zinc-800
            px-4
            py-3
            rounded-xl
            transition
          "
                >
                    <LayoutDashboard size={20} />

                    Dashboard
                </button>

                <button
                    onClick={() => navigate("/transactions")}
                    className="
            w-full
            flex
            items-center
            gap-3
            text-zinc-300
            hover:bg-zinc-800
            px-4
            py-3
            rounded-xl
            transition
          "
                >
                    <ArrowLeftRight size={20} />

                    Transações
                </button>

            </nav>

            <button
                onClick={handleLogout}
                className="
          mt-10
          w-full
          flex
          items-center
          gap-3
          text-red-400
          hover:bg-red-500/10
          px-4
          py-3
          rounded-xl
          transition
        "
            >
                <LogOut size={20} />

                Sair
            </button>

        </aside>
    );
}