const envAwareFetch = (url: string, options?: Record<string, unknown>) => {
    const fetchUrl = `http://localhost:3000/${url}`;
    return fetch(fetchUrl, options).then((res) => res.json());
};

export { envAwareFetch as fetch };