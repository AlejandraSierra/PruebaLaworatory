//creation the class "User" to define the user's object
export class User {
    id = 0;
    name = "";
    surname = "";
    email = "";
    phone = "";
    age = 0
    loan_amount = 0;
    loan_date = "";
    loan_weeks = 0;
    check = false;
    
    constructor(id, name, surname, email, phone, age, loan_amount, loan_date, loan_weeks, check){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.loan_amount = loan_amount;
        this.loan_date = loan_date;
        this.loan_weeks = loan_weeks;
        this.check = check;
    }
}