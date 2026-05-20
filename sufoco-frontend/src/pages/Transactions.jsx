import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "EXPENSE",
        categoryId: "",
    });
    const categories = [
        { id: 1, name: "Mercado" },
        { id: 2, name: "Casa" },
        { id: 3, name: "Transporte" },
        { id: 4, name: "Carro" },
        { id: 5, name: "Energia/Luz" },
        { id: 6, name: "Internet" },
        { id: 7, name: "Lazer" },
        { id: 8, name: "Saúde" },
        { id: 9, name: "Educação" },
        { id: 10, name: "Salário" },
    ];

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await api.get("/transactions");
                setTransactions(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTransactions();
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post("/transactions", {
                ...formData,
                amount: Number(
                    formData.amount
                        .replace("R$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                ),
                categoryId: Number(formData.categoryId),
            });
            setIsModalOpen(false);
            const response = await api.get("/transactions");
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
        }
    }

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

                    <button onClick={() => setIsModalOpen(true)}
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

                {isModalOpen && (

                    <div className="
        fixed
        inset-0
        bg-black/70
        flex
        items-center
        justify-center
    ">

                        <form
                            onSubmit={handleSubmit}
                            className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-8
                w-full
                max-w-md
                space-y-5
            "
                        >

                            <h2 className="text-2xl font-bold text-white">
                                Nova Transação
                            </h2>

                            <input
                                type="text"
                                name="description"
                                placeholder="Descrição"
                                value={formData.description}
                                onChange={handleChange}
                                className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                "
                                required
                            />

                            <input
                                type="text"
                                name="amount"
                                placeholder="R$ 0,00"
                                value={formData.amount}
                                onChange={(e) => {

                                    let value = e.target.value;

                                    value = value.replace(/\D/g, "");

                                    value = (Number(value) / 100).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    });

                                    setFormData({
                                        ...formData,
                                        amount: value,
                                    });

                                }}
                                className="
        w-full
        bg-zinc-800
        border
        border-zinc-700
        rounded-xl
        px-4
        py-3
        text-white
    "
                                required
                            />
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                " required/>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                ">
                                <option value="INCOME">
                                    Receita
                                </option>
                                <option value="EXPENSE">
                                    Despesa
                                </option>
                            </select>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="
        w-full
        bg-zinc-800
        border
        border-zinc-700
        rounded-xl
        px-4
        py-3
        text-white
    " required>
                                <option value="">
                                    Selecione uma categoria
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="
        text-emerald-400
        text-sm
        hover:text-emerald-300
    "
                            >

                                + Criar nova categoria

                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="
                        flex-1
                        bg-zinc-800
                        hover:bg-zinc-700
                        text-white
                        py-3
                        rounded-xl
                    "
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="
                        flex-1
                        bg-emerald-500
                        hover:bg-emerald-600
                        text-black
                        font-semibold
                        py-3
                        rounded-xl
                    "
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

        </div>
    );
}