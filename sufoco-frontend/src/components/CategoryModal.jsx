export default function CategoryModal(
    {
        isOpen,
        onClose,
        newCategoryName,
        setNewCategoryName,
        onCreateCategory,
        isCreatingCategory,
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
            <div className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-6
                w-full
                max-w-sm
                space-y-4
            ">

                <h2 className="text-xl font-bold text-white">
                    Nova Categoria
                </h2>
                <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={newCategoryName}
                    onChange={(e) =>
                        setNewCategoryName(e.target.value)
                    }
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
                />
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
                        type="button"
                        onClick={onCreateCategory}
                        disabled={isCreatingCategory}
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
                        {isCreatingCategory
                            ? "Criando..."
                            : "Criar"}
                    </button>
                </div>
            </div>
        </div>
    );
}