import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getSummary, getMonthlyReport } from "../services/transactionService";
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight } from "lucide-react";

export default function Summary() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [summary, setSummary] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [summaryRes, reportRes] = await Promise.all([
                    getSummary(),
                    getMonthlyReport(month, year),
                ]);
                setSummary(summaryRes.data);
                setReport(reportRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [month, year]);

    function prevMonth() {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }

    function nextMonth() {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }

    const formatCurrency = (value) =>
        Number(value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className="flex bg-zinc-950 min-h-screen">
            <Sidebar />

            <main className="flex-1 p-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Resumo Financeiro</h1>
                    <p className="text-zinc-400">Visão geral das suas finanças</p>
                </div>

                {/* Cards totais */}
                {summary && (
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                            <div className="bg-green-500/10 p-3 rounded-xl">
                                <TrendingUp size={24} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm mb-1">Total de Receitas</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {formatCurrency(summary.totalIncome)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                            <div className="bg-red-500/10 p-3 rounded-xl">
                                <TrendingDown size={24} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm mb-1">Total de Despesas</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {formatCurrency(summary.totalExpense)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                            <div className="bg-emerald-500/10 p-3 rounded-xl">
                                <Wallet size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm mb-1">Saldo Total</p>
                                <p className={`text-2xl font-bold ${
                                    Number(summary.balance) >= 0 ? "text-emerald-400" : "text-red-400"
                                }`}>
                                    {formatCurrency(summary.balance)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Relatório mensal */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                    {/* Navegação de mês */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            Extrato Mensal
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={prevMonth}
                                className="text-zinc-400 hover:text-white transition"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-white font-medium w-36 text-center">
                                {monthNames[month - 1]} {year}
                            </span>
                            <button
                                onClick={nextMonth}
                                className="text-zinc-400 hover:text-white transition"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-zinc-500 text-center py-10">Carregando...</p>
                    ) : (
                        <>
                            {/* Resumo do mês */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-zinc-800 rounded-xl p-4">
                                    <p className="text-zinc-400 text-sm mb-1">Receitas do mês</p>
                                    <p className="text-lg font-semibold text-green-400">
                                        {formatCurrency(report?.totalIncome)}
                                    </p>
                                </div>
                                <div className="bg-zinc-800 rounded-xl p-4">
                                    <p className="text-zinc-400 text-sm mb-1">Despesas do mês</p>
                                    <p className="text-lg font-semibold text-red-400">
                                        {formatCurrency(report?.totalExpense)}
                                    </p>
                                </div>
                                <div className="bg-zinc-800 rounded-xl p-4">
                                    <p className="text-zinc-400 text-sm mb-1">Saldo do mês</p>
                                    <p className={`text-lg font-semibold ${
                                        Number(report?.balance ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                                    }`}>
                                        {formatCurrency(report?.balance)}
                                    </p>
                                </div>
                            </div>

                            {/* Gastos por categoria */}
                            <h3 className="text-zinc-300 font-medium mb-3">Gastos por categoria</h3>

                            {report?.categories?.length === 0 ? (
                                <p className="text-zinc-500 text-center py-8">
                                    Nenhuma despesa registrada neste mês.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {report?.categories?.map((cat) => {
                                        const total = Number(report.totalExpense) || 1;
                                        const pct = Math.min((Number(cat.total) / total) * 100, 100).toFixed(0);
                                        return (
                                            <div key={cat.categoryName}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-zinc-300">{cat.categoryName}</span>
                                                    <span className="text-zinc-400">
                                                        {formatCurrency(cat.total)} ({pct}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-zinc-800 rounded-full h-2">
                                                    <div
                                                        className="bg-emerald-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}