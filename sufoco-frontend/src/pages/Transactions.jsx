import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";
import CategoryModal from "../components/CategoryModal";
import { TrendingUp, TrendingDown, Wallet, Plus, Search, Filter } from "lucide-react";

import { getCategories, createCategory } from "../services/categoryService";
import { getTransactions, createTransaction, getSummary } from "../services/transactionService";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customCategories, setCustomCategories] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [summary, setSummary] = useState(null);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "EXPENSE",
        categoryId: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [transactionsResponse, categoriesResponse, summaryResponse] =
                    await Promise.all([
                        getTransactions(),
                        getCategories(),
                        getSummary(),
                    ]);
                const data = transactionsResponse.data;
                setTransactions(Array.isArray(data) ? data : (data.content ?? []));
                setCustomCategories(categoriesResponse.data ?? categoriesResponse);
                setSummary(summaryResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await createTransaction({
                ...formData,
                amount: Number(
                    formData.amount.replace("R$", "").replace(/\./g, "").replace(",", ".")
                ),
                categoryId: Number(formData.categoryId),
            });
            setIsModalOpen(false);
            const [updatedTransactions, updatedSummary] = await Promise.all([
                getTransactions(),
                getSummary(),
            ]);
            const data = updatedTransactions.data;
            setTransactions(Array.isArray(data) ? data : (data.content ?? []));
            setSummary(updatedSummary.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return;
        try {
            setIsCreatingCategory(true);
            const newCategory = await createCategory({ name: newCategoryName });
            const cat = newCategory.data ?? newCategory;
            setCustomCategories((prev) => [...prev, cat]);
            setFormData({ ...formData, categoryId: cat.id });
            setNewCategoryName("");
            setIsCategoryModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreatingCategory(false);
        }
    }

    const formatCurrency = (value) =>
        Number(value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase()) ||
            t.categoryName?.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "ALL" || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="flex bg-zinc-950 min-h-screen">
            <Sidebar />

            <main className="flex-1 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Transações</h1>
                        <p className="text-zinc-400">Gerencie suas receitas e despesas</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-3 rounded-xl transition"
                    >
                        <Plus size={18} />
                        Nova Transação
                    </button>
                </div>

                {/* Cards de resumo */}
                {summary && (
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                            <div className="bg-green-500/10 p-3 rounded-xl">
                                <TrendingUp size={22} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm mb-1">Receitas</p>
                                <p className="text-xl font-bold text-green-400">
                                    {formatCurrency(summary.totalIncome)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                            <div className="bg-red-500/10 p-3 rounded-xl">
                                <TrendingDown size={22} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm mb-1">Despesas</p>
                                <p className="text-xl font-bold text-red-400">
                                    {formatCurrency(summary.totalExpense)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                            <div className="bg-emerald-500/10 p-3 rounded-xl">
                                <Wallet size={22} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm mb-1">Saldo</p>
                                <p className={`text-xl font-bold ${Number(summary.balance) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                    {formatCurrency(summary.balance)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Barra de busca e filtro */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Buscar por descrição ou categoria..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4">
                        <Filter size={16} className="text-zinc-500" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-transparent text-zinc-300 focus:outline-none py-3 cursor-pointer"
                        >
                            <option value="ALL" className="bg-zinc-900">Todos</option>
                            <option value="INCOME" className="bg-zinc-900">Receitas</option>
                            <option value="EXPENSE" className="bg-zinc-900">Despesas</option>
                        </select>
                    </div>
                </div>

                {/* Contador de resultados */}
                <p className="text-zinc-500 text-sm mb-4">
                    {filteredTransactions.length} transaç{filteredTransactions.length !== 1 ? "ões" : "ão"} encontrada{filteredTransactions.length !== 1 ? "s" : ""}
                </p>

                <TransactionTable transactions={filteredTransactions} />

                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    categories={customCategories}
                    onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
                />

                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    newCategoryName={newCategoryName}
                    setNewCategoryName={setNewCategoryName}
                    onCreateCategory={handleCreateCategory}
                    isCreatingCategory={isCreatingCategory}
                />
            </main>
        </div>
    );
}