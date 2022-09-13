

export const setAccessTokenToLocal = async({data})=>{
    await localStorage.setItem('user', JSON.stringify(data))
}

export const getAccessTokenFromLocal = async()=>{
    const data = await JSON.parse(localStorage.getItem('user')); 
    return data; 
}
