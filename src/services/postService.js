//service to post the user's loan request
export const updateUser = async (user) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-WEB-KEY': 'Development' 
        },
        body: JSON.stringify({ 
            phone: user.phone,
            age: user.age,
            loan_amount: user.loan_amount,
            loan_date: user.loan_date,
            loan_weeks: user.loan_weeks,
            check: user.check
        })
    };

    return await fetch('https://api7.cloudframework.io/recruitment/fullstack/users/' + user.id, requestOptions)
        .then(response => response.json())
        .then((responseJSON) => {
            if (responseJSON.status === 201 && responseJSON.success === true) {
                return responseJSON;
            }
            return { success: false };
        })
        .catch((err) => {
            console.log(`error tomando los datos de usuario: ${err}`);
            return { success: false };
        })
}