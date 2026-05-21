export default function TransactionTable({ transactions }) {

    return (

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
                {transactions.map((transaction) => (
                    <tr
                        key={transaction.id}
                        className="border-t border-zinc-800"
                    >
                        <td className="px-6 py-4 text-white">
                            {transaction.description}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                            {transaction.categoryName}
                        </td>
                        <td
                            className={`px-6 py-4 font-semibold ${
                                transaction.type === "INCOME"
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            R$ {Number(transaction.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                            {transaction.type === "INCOME"
                                ? "Receita"
                                : "Despesa"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}