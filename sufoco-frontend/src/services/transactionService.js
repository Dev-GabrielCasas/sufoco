import api from "../api/axios";

export async function getTransactions() {
    const response = await api.get("/transactions");
    return response.data;
}

export async function createTransaction(data) {
    const response = await api.post("/transactions", data);
    return response.data;
}