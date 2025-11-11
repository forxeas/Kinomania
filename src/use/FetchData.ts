export const fetchData = async <T>(
    url: RequestInfo,
    headers: Record<string, string>
): Promise<T> => {
    try{
        const res = await fetch(url, {headers: headers})
        if(!res.ok) {
          throw Error(`Ошибка ${res.status}`)
        }
        return await res.json()
    } catch(e) {
        console.log(e)
        throw Error('Произошла ошибка при поиске фильма')
    }
};
