export class transform {
    static formatDateFromArray = (arr?: number[]): string => {
        if (!Array.isArray(arr) || arr.length < 3) return "";
        const [year, month, day] = arr;
        // month và day luôn có giá trị >= 1, < 13 / < 32
        const dd = String(day).padStart(2, "0");
        const mm = String(month).padStart(2, "0");
        return `${dd}/${mm}/${year}`;
    };
}