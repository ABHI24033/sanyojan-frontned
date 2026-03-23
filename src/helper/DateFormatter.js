export const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};
