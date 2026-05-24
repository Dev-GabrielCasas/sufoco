import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";
import CategoryModal from "../components/CategoryModal";

import {
    getCategories,
    createCategory
} from "../services/categoryService";

import {
    getTransactions,
    createTransaction
} from "../services/transactionService";


export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customCategories, setCustomCategories] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "EXPENSE",
        categoryId: "",
    });

    const categories = customCategories;

    useEffect(() => {
        async function fetchData() {
            try {
                const [transactionsResponse, categoriesResponse] =
                    await Promise.all([
                        getTransactions(),
                        getCategories(),
                    ]);
                setTransactions(transactionsResponse.data);
                setCustomCategories(categoriesResponse);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
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
            await createTransaction({
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
            const updatedTransactions = await getTransactions();
            setTransactions(updatedTransactions);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return;
        try {
            setIsCreatingCategory(true);
            const newCategory = await createCategory({
                name: newCategoryName
            });
            setCustomCategories((prev) => [
                ...prev,
                newCategory
            ]);
            setFormData({
                ...formData,
                categoryId: newCategory.id
            });
            setNewCategoryName("");
            setIsCategoryModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreatingCategory(false);
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


                <TransactionTable transactions={transactions} />

                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    categories={categories}
                    onOpenCategoryModal={() =>
                        setIsCategoryModalOpen(true)
                    }
                />

                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() =>
                        setIsCategoryModalOpen(false)
                    }
                    newCategoryName={newCategoryName}
                    setNewCategoryName={setNewCategoryName}
                    onCreateCategory={handleCreateCategory}
                    isCreatingCategory={isCreatingCategory}
                />
            </main>

        </div>
    );
}