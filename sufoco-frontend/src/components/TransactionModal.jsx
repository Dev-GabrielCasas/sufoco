export default function TransactionModal({
                                             isOpen,
                                             onClose,
                                             onSubmit,
                                             formData,
                                             handleChange,
                                             setFormData,
                                             categories,
                                             onOpenCategoryModal,
                                         }) {

    if (!isOpen) return null;
    return (
        <div className="
            fixed
            inset-0
            bg-black/70
            flex
            items-center
            justify-center
        ">
            <form
                onSubmit={onSubmit}
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
                    "
                    required
                />

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
                    "
                >
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
                    "
                    required
                >

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
                    onClick={onOpenCategoryModal}
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
                        onClick={onClose}
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
    );
}