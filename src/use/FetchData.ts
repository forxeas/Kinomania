export const fetchData = async <T>(
    url: RequestInfo,
    storage: T[],
    headers: Record<string, string>
): Promise<T> => {
    try{
        const res = await fetch(url, {headers: headers})
        const data: T = await res.json()
        storage.push(data)
        return data
    } catch(e) {
        console.log(e)
        throw Error('Произошла ошибка при поиске фильма')
    }
};
