export function debouncing(fn: Function, delay: number=250){
    let timeout: number;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args)
        }, delay);
    }
}