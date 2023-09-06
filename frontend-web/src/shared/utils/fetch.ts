const envAwareFetch = (url: string, options?: Record<string, unknown>) => {
    const fetchUrl = `http://localhost:3001/${url}`;
    return fetch(fetchUrl, options)
};

export { envAwareFetch as fetch };