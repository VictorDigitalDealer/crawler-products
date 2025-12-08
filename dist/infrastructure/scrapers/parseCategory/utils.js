export function textToNumber(text) {
    if (!text)
        return 0;
    const cleaned = text
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? 0 : num;
}
