import React from "react";

interface MapToolbarProps {
    selectedStyle: "hybrid" | "streets" | "basic" | "topo";
    setSelectedStyle: React.Dispatch<
        React.SetStateAction<"hybrid" | "streets" | "basic" | "topo">
    >;
    drawType: "Point" | "Polygon" | null;
    setDrawType: (type: "Point" | "Polygon" | null) => void;
    clearAll: () => void;
    mapStyles: Record<string, string>;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
    selectedStyle,
    setSelectedStyle,
    drawType,
    setDrawType,
    clearAll,
    mapStyles,
}) => {
    // Base button style reused for all buttons
    const baseButtonStyle: React.CSSProperties = {
        padding: "8px 14px",
        marginRight: 10,
        border: "1px solid #ccc",
        borderRadius: 4,
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
        fontWeight: "500",
        transition: "background-color 0.2s ease",
    };

    const disabledButtonStyle: React.CSSProperties = {
        ...baseButtonStyle,
        cursor: "not-allowed",
        backgroundColor: "#ddd",
        color: "#888",
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                padding: 12,
                backgroundColor: "#fafafa",
                borderRadius: 8,
                boxShadow: "0 1px 10px lightgray",
                marginBottom: 20,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "auto"}}>
                <label
                    htmlFor="map-style-select"
                    style={{ fontWeight: 600, marginRight: 3, whiteSpace: "nowrap" }}
                >
                    Map Style:
                </label>
                <select
                    id="map-style-select"
                    value={selectedStyle}
                    onChange={(e) =>
                        setSelectedStyle(e.target.value as "hybrid" | "streets" | "basic" | "topo")
                    }
                    style={{
                        padding: "8px 8px",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        minWidth: 80,
                    }}
                >
                    {Object.keys(mapStyles).map((style) => (
                        <option key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ width: "100%", textAlign: "center", margin: "10px 0" }}>
                <button
                    onClick={() => setDrawType("Point")}
                    disabled={drawType === "Point"}
                    style={drawType === "Point" ? disabledButtonStyle : baseButtonStyle}
                    aria-pressed={drawType === "Point"}
                    title="Draw Points on the map"
                >
                    Point
                </button>

                <button
                    onClick={() => setDrawType("Polygon")}
                    disabled={drawType === "Polygon"}
                    style={drawType === "Polygon" ? disabledButtonStyle : baseButtonStyle}
                    aria-pressed={drawType === "Polygon"}
                    title="Draw Polygons on the map"
                >
                    Draw Polygon
                </button>

                <button
                    onClick={() => setDrawType(null)}
                    disabled={drawType === null}
                    style={drawType === null ? disabledButtonStyle : baseButtonStyle}
                    aria-pressed={drawType === null}
                    title="Stop Drawing"
                >
                    Stop Drawing
                </button>

                <button
                    onClick={clearAll}
                    style={{
                        ...baseButtonStyle,
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        marginLeft: "auto",
                        border: "none",
                        minWidth: 100,
                    }}
                    title="Clear all drawn features"
                >
                    Clear All
                </button>
            </div>

            <span
                style={{
                    fontStyle: "italic",
                    color: "#555",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                Select features and press <span style={{ color: "red" }}>Delete</span> to remove
            </span>
        </div>
    );
};

export default MapToolbar;
