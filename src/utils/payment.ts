export const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? Number(price) : price;

    if (isNaN(numericPrice)) {
        console.warn('Invalid price value:', price);
        return '0';
    }

    return numericPrice.toLocaleString('ru-RU', {
        style: 'decimal',
        maximumFractionDigits: 0
    });
};