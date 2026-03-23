// export default function PdfList({ pdfs, onPdfSelect }) {
//     return (
//         <ul className="list-group mt-2">
//             {pdfs.map((item, index) => (
//                 <li
//                     key={index}
//                     className="list-group-item list-group-item-action"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => onPdfSelect(item.pdf)}
//                 >
//                     📄 {item.name}
//                 </li>
//             ))}
//         </ul>
//     );
// }





export default function PdfList({ pdfs, selectedPdf, onPdfSelect }) {
    return (
        <ul className="list-group mt-2 ms-3">
            {pdfs.map((item, index) => {
                const isActive = selectedPdf === item.pdf;

                return (
                    <li
                        key={index}
                        className={`list-group-item d-flex align-items-center ${
                            isActive ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => onPdfSelect(item.pdf)}
                    >
                        <span className="me-2 fs-5">📕</span>
                        <span className="text-truncate">{item.name}</span>
                    </li>
                );
            })}
        </ul>
    );
}
