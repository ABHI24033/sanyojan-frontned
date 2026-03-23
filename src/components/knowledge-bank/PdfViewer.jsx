export default function PdfViewer({ pdfUrl }) {
    if (!pdfUrl) {
        return <p>Select a PDF to view</p>;
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <h6 className="mb-2">Ritual Details</h6>
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    style={{ border: "1px solid #ccc" }}
                />
            </div>
        </div>
    );
}
