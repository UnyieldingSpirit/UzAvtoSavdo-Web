const generateRcode = (): string => {
    const characters = 'abcdef0123456789';
    return Array.from({ length: 32 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
};

const getRcode = async (): Promise<string> => {
    const existingRcode = localStorage.getItem('rtoken');
    if (existingRcode) return existingRcode;

    const newRcode = generateRcode();
    localStorage.setItem('rtoken', newRcode);
    return newRcode;
};

export { generateRcode, getRcode };