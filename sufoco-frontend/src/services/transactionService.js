import api from "../api/axios";

export async function getTransactions() {
    const response = await api.get("/transactions");
    return response;
}

export async function createTransaction(data) {
    const response = await api.post("/transactions", data);
    return response;
}

export async function updateTransaction(id, data) {
    const response = await api.put(`/transactions/${id}`, data);
    return response;
}

export async function deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response;
}

export async function getSummary() {
    const response = await api.get("/transactions/summary");
    return response;
}

export async function getMonthlyReport(month, year) {
    const response = await api.get(`/transactions/report?month=${month}&year=${year}`);
    return response;
}