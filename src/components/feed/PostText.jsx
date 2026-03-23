import { useState } from "react";

export default function PostText({ text, maxLength = 200 }) {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    const isLong = text.length > maxLength;
    const displayText = expanded
        ? text
        : text.slice(0, maxLength) + (isLong ? "..." : "");

    return (
        <p
            className="mb-3 text-break"
            style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
        >
            {displayText}
            {isLong && (
                <span
                    className="ms-2 text-primary fw-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Read less" : "Read more"}
                </span>
            )}
        </p>
    );
}
