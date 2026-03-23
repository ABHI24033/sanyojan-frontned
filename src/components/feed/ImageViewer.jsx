import { Icon } from "@iconify/react";

export default function ImageViewer({ images, index, onClose, onNext, onPrev }) {
    if (!images || images.length === 0) return null;

    const getImageSrc = (img) => {
        if (img instanceof File) return URL.createObjectURL(img);
        return img; // URL string
    };


    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark d-flex justify-content-center align-items-center"
            style={{
                zIndex: 2000,
                backgroundColor: "rgba(0,0,0,0.5)", // dark background
                backdropFilter: "blur(3px)", // smooth glass blur effect
            }}
        >
            {/* Close Button */}
            <button
                className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
                onClick={onClose}
            >
                <Icon icon="mdi:close" className="fs-2" />
            </button>

            {/* Image */}
            <img
                src={getImageSrc(images[index])}
                className="img-fluid rounded shadow-lg"
                style={{
                    maxHeight: "85%",
                    maxWidth: "85%",
                    objectFit: "contain",
                }}
            />

            {/* Left Arrow */}
            {index > 0 && (
                <button
                    className="btn btn-light position-absolute start-0 ms-4 rounded-circle"
                    onClick={onPrev}
                >
                    <Icon icon="mdi:chevron-left" className="fs-1" />
                </button>
            )}

            {/* Right Arrow */}
            {index < images.length - 1 && (
                <button
                    className="btn btn-light position-absolute end-0 me-4 rounded-circle"
                    onClick={onNext}
                >
                    <Icon icon="mdi:chevron-right" className="fs-1" />
                </button>
            )}
        </div>
    );
}
