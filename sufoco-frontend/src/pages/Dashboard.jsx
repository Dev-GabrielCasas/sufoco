import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    return (
        <div className="flex bg-zinc-950 min-h-screen">

            <Sidebar />

            <main className="flex-1 p-8">

                <h1 className="text-4xl font-bold text-white mb-2">
                    Dashboard
                </h1>

                <p className="text-zinc-400 mb-10">
                    Bem-vindo ao Sufoco.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-400 mb-2">
                            Saldo Total
                        </p>

                        <h2 className="text-3xl font-bold text-emerald-400">
                            R$ 0,00
                        </h2>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-400 mb-2">
                            Receitas
                        </p>

                        <h2 className="text-3xl font-bold text-green-400">
                            R$ 0,00
                        </h2>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-400 mb-2">
                            Despesas
                        </p>

                        <h2 className="text-3xl font-bold text-red-400">
                            R$ 0,00
                        </h2>
                    </div>

                </div>

            </main>

        </div>
    );
}