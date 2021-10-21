export const distanceSq = (x0: number, y0: number, x1: number, y1: number): number => {
    return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)
}