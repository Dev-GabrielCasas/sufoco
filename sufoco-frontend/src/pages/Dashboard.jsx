import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getSummary } from "../services/transactionService";
import { getMonthlyReport } from "../services/transactionService";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";


export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [report, setReport] = useState(null);
    useEffect(() => {
        async function fetchSummary() {
            try {
                const now = new Date();
                const [summaryResponse, reportResponse] = await Promise.all([
                    getSummary(),
                    getMonthlyReport(
                        now.getMonth() + 1,
                        now.getFullYear()
                    )
                ]);
                setSummary(summaryResponse.data);
                setReport(reportResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchSummary();
    }, []);

    const COLORS = [
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
        "#14b8a6",
        "#f97316",
    ];


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
                            {summary
                                ? Number(summary.balance).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })
                                : "R$ 0,00"}
                        </h2>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-400 mb-2">
                            Receitas
                        </p>

                        <h2 className="text-3xl font-bold text-green-400">
                            {summary
                                ? Number(summary.totalIncome).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })
                                : "R$ 0,00"}
                        </h2>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-400 mb-2">
                            Despesas
                        </p>

                        <h2 className="text-3xl font-bold text-red-400">
                            {summary
                                ? Number(summary.totalExpense).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })
                                : "R$ 0,00"}
                        </h2>
                    </div>

                </div>
                {report?.categories?.length > 0 && (

                    <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-2xl font-bold text-white mb-6">
                            Gastos por Categoria
                        </h2>

                        <div className="w-full h-[400px]">

                            <ResponsiveContainer width="100%" height="100%">

                                <PieChart>

                                    <Pie
                                        data={report.categories}
                                        dataKey="total"
                                        nameKey="categoryName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={140}
                                        label={({ categoryName, percent }) =>
                                            `${categoryName} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >

                                        {report.categories.map((entry, index) => (

                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />

                                        ))}

                                    </Pie>

                                    <Tooltip
                                        formatter={(value) =>
                                            Number(value).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })
                                        }
                                    />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                )}
            </main>
        </div>
    );
}