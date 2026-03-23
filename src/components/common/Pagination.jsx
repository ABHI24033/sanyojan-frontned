export default function Pagination({ page, setPage, totalPages }) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-between align-items-center mt-4 p-3 rounded ">

            {/* Previous Button */}
            <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="btn btn-outline-primary"
                style={{
                    opacity: page === 1 ? 0.5 : 1,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                }}
            >
                ◀ Previous
            </button>

            {/* Page Indicator */}
            <span className=" fs-6">
                Page <span className="">{page}</span> of{" "}
                <span className="">{totalPages}</span>
            </span>

            {/* Next Button */}
            <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="btn btn-outline-primary "
                style={{
                    opacity: page === totalPages ? 0.5 : 1,
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
            >
                Next ▶
            </button>
        </div>
    );
}
