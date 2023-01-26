export function moveArrayElement(arr: any[], index: number, direction: 'up' | 'down') {
    if (direction === "up") {
        if (index !== 0) {
            [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
        }
    } else if (direction === "down") {
        if (index !== arr.length - 1) {
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        }
    }
    return arr;
}
