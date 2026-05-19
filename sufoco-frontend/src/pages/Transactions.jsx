import Sidebar from "../components/Sidebar";

export default function Transactions() {

    return (
        <div className="flex bg-zinc-950 min-h-screen">

            <Sidebar />

            <main className="flex-1 p-8">

                <div className="flex items-center justify-between mb-10">

                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Transações
                        </h1>

                        <p className="text-zinc-400">
                            Gerencie suas receitas e despesas
                        </p>
                    </div>

                    <button
                        className="
              bg-emerald-500
              hover:bg-emerald-600
              text-black
              font-semibold
              px-5
              py-3
              rounded-xl
              transition
            "
                    >
                        Nova Transação
                    </button>

                </div>

                <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          overflow-hidden
        ">

                    <table className="w-full">

                        <thead className="bg-zinc-800">

                        <tr>

                            <th className="text-left text-zinc-300 px-6 py-4">
                                Descrição
                            </th>

                            <th className="text-left text-zinc-300 px-6 py-4">
                                Categoria
                            </th>

                            <th className="text-left text-zinc-300 px-6 py-4">
                                Valor
                            </th>

                            <th className="text-left text-zinc-300 px-6 py-4">
                                Tipo
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        <tr className="border-t border-zinc-800">

                            <td className="px-6 py-4 text-white">
                                Mercado
                            </td>

                            <td className="px-6 py-4 text-zinc-400">
                                Alimentação
                            </td>

                            <td className="px-6 py-4 text-red-400">
                                - R$ 120,00
                            </td>

                            <td className="px-6 py-4 text-zinc-400">
                                Despesa
                            </td>

                        </tr>

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
}