import { Icon } from "@iconify/react";
import React, { useRef, useState, useEffect } from "react";

export default function ProfileImageUpload({ onFileSelect, error, value, gender }) {

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    // Get gender-specific placeholder image
    const getPlaceholderImage = () => {
        if (gender === 'male') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Male avatar
        } else if (gender === 'female') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png"; // Female avatar
        } else {
            return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; // Default/Other avatar
        }
    };

    useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }

        // Case 1: value is a File object
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreview(url);

            return () => URL.revokeObjectURL(url); // cleanup
        }

        // Case 2: value is a string URL (Cloudinary / existing image)
        if (typeof value === "string" && value.trim() !== "") {
            setPreview(value);
            return;
        }

        setPreview(null);
    }, [value]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect && onFileSelect(file);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>

            <div
                className="profile-wrapper"
                onClick={() => fileInputRef.current.click()}
                style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    // overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    border: "3px solid #ddd",
                    margin: "auto",
                }}
            >
                {/* Profile Preview */}
                <img
                    src={(preview && preview.trim() !== '') ? preview : getPlaceholderImage()}
                    alt="Profile"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%"
                    }}
                />

                {/* Camera Button (perfect bottom-right) */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "2px",
                        width: "24px",
                        height: "24px",
                        background: "#00000090",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backdropFilter: "blur(2px)",
                    }}
                >
                    <Icon
                        icon="mdi:camera"
                        width="14"
                        height="14"
                        style={{ color: "#fff" }}
                    />
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
            />
            {
                error && <div className="text-danger text-sm ">{error}</div>
            }

        </div>
    );
}
