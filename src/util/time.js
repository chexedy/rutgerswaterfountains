export function SQLtoLocalTime(sqlTimeString) {
    const date = new Date(sqlTimeString + "Z");
    return date.toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "2-digit", day: "2-digit", year: "numeric" });
}