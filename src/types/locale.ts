export type LocaleMessages = {
    [key: string]: {
        [key: string]: unknown
    }
}

// Example usage
export type Messages = {
    ru: {
        common: {
            hello: string
            welcome: string
        }
    }
    uz: {
        common: {
            hello: string
            welcome: string
        }
    }
}