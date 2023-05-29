//service to get the user data
export const getUser = async (id) => {
    
    let userData = await fetch('https://api7.cloudframework.io/recruitment/fullstack/users?id=' + id)
        .then(response => response.json())
        .catch((err) => {
            console.log(`error tomando los datos de usuario: ${err}`);
        })

    return userData
}