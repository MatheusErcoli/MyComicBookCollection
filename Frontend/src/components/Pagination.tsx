interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (currentPage > 4) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);
    }  
    
    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={"rounded-lg border border-[#334155] px-4 py-2 text-sm text-white transition hover:bg-[#1d2a3d] disabled:cursor-not-allowed disabled:opacity-40"}
            >
                ←
            </button>

            {pages.map((page, index) => 
                page === "..." ? (
                    <span
                        key={index}
                        className="px-2 text-[#94a3b8]"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`h-10 w-10 rounded-lg transition ${
                            currentPage === page
                            ? "bg-red-500 text-white"
                            : "border border-[#334155] text-white hover:bg-[#1d2a3d]"
                        }`}
                    >
                        {page}
                    </button>
                )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={"rounded-lg border border-[#334155] px-4 py-2 text-sm text-white transition hover:bg-[#1d2a3d] disabled:cursor-not-allowed disabled:opacity-40"}
                >
                 →
                </button>
        </div>
    )
}