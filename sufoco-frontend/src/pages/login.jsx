import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", formData);
            console.log(response);
            const token = response.data.token;

            localStorage.setItem("token", token);
            console.log("token salvo local storage", token);

            navigate("/dashboard");

        } catch (err) {
            if (err.response?.status === 400) {
                setError("Email ou senha inválidos");
            } else {
                setError("Erro ao conectar com o servidor");
            }


        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Sufoco
                </h1>

                <p className="text-zinc-400 mb-8">
                    Controle financeiro pessoal
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="seuemail@email.com"
                            value={formData.email}
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
                outline-none
                focus:border-emerald-500
                transition
              "
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">
                            Senha
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
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
                outline-none
                focus:border-emerald-500
                transition
              "
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-xl p-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full
              bg-emerald-500
              hover:bg-emerald-600
              text-black
              font-semibold
              py-3
              rounded-xl
              transition
              disabled:opacity-50
            "
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                </form>

                <p className="text-zinc-500 text-sm mt-6 text-center">
                    Não possui conta?{" "}
                    <Link
                        to="/register"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Criar conta
                    </Link>
                </p>

            </div>
        </div>
    );
}