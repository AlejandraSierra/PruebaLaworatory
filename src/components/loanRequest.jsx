import React, { useState, useEffect, useRef } from 'react';
import { getUser } from '../services/fectchService';
import { updateUser } from '../services/postService';
import { User } from '../models/user.class'

const LoanRequest = () => {

    //Creation of states for the user's data information obtained by the get request
    const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userAge, setUserAge] = useState(0);

    //Creating references for the inputs that user may modify
    const userPhoneUpdated = useRef('');
    const userAgeUpdated = useRef('');
    const loanAmount = useRef('');
    const loanYears = useRef('');

    //reference, state and actual date to manage the user's loan date
    const actualDate = (new Date()).toISOString().split('T')[0];
    const loanDate = useRef('');
    const [userloanDate, setUserLoanDate] = useState(null);

    //state and handler for the polices check
    const [policesCheck, setPolicesCheck] = useState(false);
    const handleOnChangePolicesCheck = () => {
        setPolicesCheck(!policesCheck);
      };

    //additional states to manage the views
    const [unsuccesfullStatus, setUnsuccesfullStatus] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [responseUpdateUser, setResponseUpdateUser] = useState(null);

    //declaration of constants and variables to manage the url id
    const urlValues = window.location.search;
    const urlParams = new URLSearchParams(urlValues);
    let id = urlParams.get('id');

    useEffect(() => {
        obtainUserData();
    }, []);

    //promise to get the user's data
    const obtainUserData = async () => {
        await getUser(id)
            .then((responseJSON) => {
                //validation of the status and code of the received user
                if (responseJSON.status === 200 && responseJSON.code === 'ok') {
                    //maping of the user's data
                    let userData = responseJSON.data;
                    setUserName(userData.name);
                    setUserSurname(userData.surname);
                    setUserEmail(userData.email);
                    setUserPhone(userData.phone);
                    setUserAge(userData.age);
                } else {
                    //getting the status and code in case of a different 200 status
                    setUnsuccesfullStatus({
                        status: responseJSON.status,
                        code: responseJSON.code
                    });
                }
            })
            .catch((error) => {
                return error;
            });
    }

    //promise to manage the post data of the user
    const sendRequest = async (e) => {
        //avoiding the default comportament of the submit button
        e.preventDefault();
        //management of the data to post using the class User
        const user = new User (
            id,
            userName,
            userSurname,
            userEmail,
            userPhoneUpdated.current.value,
            userAgeUpdated.current.value,
            loanAmount.current.value,
            loanDate.current.value,
            loanYears.current.value,
            policesCheck
        );
        await sendData(user);
    }

    //promise to update the user information
    async function sendData(user){
        //extra validation of the data information received by the user
        setValidationError(null);
        if(user.phone === null || user.phone === "" ){
            setValidationError("El número de teléfono es requerido");
            return;
        }
        if(user.age === null || user.age < 1 ){
            setValidationError("La edad es requerida");
            return;
        }
        if(user.loan_amount === null || user.loan_amount <= 10 || user.loan_amount > 1000 ){
            setValidationError("El importe del préstamo a solicitar debe ser entre 11 y 1000");
            return;
        }
        if(user.loan_weeks === null || user.loan_weeks < 1 || user.loan_weeks > 20 ){
            setValidationError("La duración del préstamo en años debe ser entre 1 y 20 años");
            return;
        }
        if(user.check === null || user.check === false ){
            setValidationError("Debe confirmar que está de acuerdo con los términos y condiciones");
            return;
        }
        //updating the user information
        await updateUser(user)
            .then(response => {
                setUserLoanDate(user.loan_date);
                setResponseUpdateUser(response);
            })
            .catch((error) => {
                return error;
            });
    }

    //returns for the possible scenarios according to the received or sent data
    
    //code to display when the URL received doesn't have a valid user id
    if (id === null) {
        return (
            <div className='container col-12 col-md-10 col-lg-8 my-2 my-md-3 my-lg-5 p-4 d-flex flex-column justify-content-center align-items-center bg-white rounded-3'>
                    <h1 className='display-6'>Solicitud de préstamo</h1>
                    <p className='pt-4'>Usuario inexistente. Por favor intente hacer el proceso con un usuario válido.</p>
                </div>
        );
    }

    //code to display when the user recieved has an ID but the status isn't 200
    if (unsuccesfullStatus !== null) {
        return (
            <div className='container col-12 col-md-10 col-lg-8 my-2 my-md-3 my-lg-5 p-4 d-flex flex-column justify-content-center align-items-center bg-white rounded-3'>
                <h1 className='display-6'>Solicitud de préstamo</h1>
                <p className='pt-4'>Se ha presentado un error del tipo { unsuccesfullStatus.status } con código "{ unsuccesfullStatus.code }" </p>
            </div>
        )
    }

    //code to display when a user sends succesfully a request
    if (!!responseUpdateUser) {
        if (responseUpdateUser.success === true) {
            // Thank you page
            return (    
                <div className='container col-12 col-md-10 col-lg-8 my-2 my-md-3 my-lg-5 p-4 d-flex flex-column justify-content-center align-items-center bg-white rounded-3'>
                     <h1 className='display-6'>Solicitud de préstamo</h1>
                    <div className='text-left'>
                        <p className='pt-4 text-left'>Su solicitud de préstamo se ha realizado con éxito con los siguientes datos:</p>
                        <ul>
                            <li>Nombre: {responseUpdateUser.data.name}</li>
                            <li>Apellido: {responseUpdateUser.data.surname}</li>
                            <li>Email: {responseUpdateUser.data.email}</li>
                            <li>Teléfono: {responseUpdateUser.data.phone}</li>
                            <li>Edad: {responseUpdateUser.data.age}</li>
                            <li>Importe del préstamo: {responseUpdateUser.data.loan_amount} €</li>
                            <li>Fecha de obtención: {userloanDate}</li>
                            <li>Duración del préstamo en años: {responseUpdateUser.data.loan_weeks}</li>
                        </ul>
                        <p className='pt-2'>Gracias por confiar en nosotros, en breve nos pondremos en contacto.</p>
                    </div>
                </div>
            )
        }
        // Error page
        return (
            <div className='container col-12 col-md-10 col-lg-8 my-2 my-md-3 my-lg-5 p-4 d-flex flex-column justify-content-center align-items-center bg-white rounded-3'>
                <h1 className='display-6'>Solicitud de préstamo</h1>
                <p className='pt-4'>Se ha presentado un error al procesar la solicitud. Por favor inténtelo nuevamente.</p>
                <button onClick={() => setResponseUpdateUser(null)} className="btn btn-primary">Regresar al formulario</button>
            </div>
        )
    }

    //code to display when the user recieved has an ID and 200 (form)
    return (
        <div className='container col-12 col-md-10 col-lg-8 my-2 my-md-3 my-lg-5 p-4 d-flex flex-column justify-content-center align-items-center bg-white rounded-3'>
            <h1 className='display-6'>Solicitud de préstamo</h1>
            <div className='col-8'>
                <form onSubmit={ sendRequest } className='row g-3 py-4'>
                    <div className="mb-2 col-12">
                        <p className='fs-5 mb-0'>Datos Personales</p>
                    </div>
                    <div className="my-1 col-12 col-lg-6">
                        <label for="userName" className="form-label">Nombre</label>
                        <input type="text" className="form-control form-control-sm" id="userName" value={userName} disabled />
                    </div>
                    <div className="my-1 col-12 col-lg-6">
                        <label for="userSurname" className="form-label">Apellido</label>
                        <input type="text" className="form-control form-control-sm" id="userSurname" value={userSurname} disabled />
                    </div>
                    <div className="my-1 col-12">
                        <label for="userEmail" className="form-label">Email</label>
                        <input type="email" className="form-control form-control-sm" id="userEmail" value={userEmail} disabled />
                    </div>
                    <div className="my-1 col-12 col-lg-6">
                        <label for="userPhone" className="form-label">Teléfono</label>
                        <input ref={userPhoneUpdated} type="text" className="form-control form-control-sm" id="userPhone" defaultValue={userPhone} required />
                    </div>
                    <div className="my-1 col-12 col-lg-6">
                        <label for="userAge" className="form-label">Edad</label>
                        <input ref={userAgeUpdated} type="number" className="form-control form-control-sm" id="userAge" value={userAge} onChange={(e) => setUserAge(parseInt(e.target.value))} required />
                    </div>
                    <div className="mb-2 mt-4 col-12">
                        <p className='fs-5 mb-0'>Datos del préstamo a solicitar</p>
                    </div>
                    <div className="my-1 col-12">
                        <label for="loanAmount" className="form-label">Importe del préstamo</label>
                        <input ref={loanAmount} type="number" min={11} max={1000} className="form-control form-control-sm" id="loanAmount" required/>
                    </div>
                    <div className="my-1 col-12 col-lg-6">
                        <label for="loanDate" className="form-label">Fecha de obtención</label>
                        <input ref={loanDate} type="date" min={actualDate} className="form-control form-control-sm" id="loanDate" />
                    </div>
                    <div className="my-1 col-12 col-lg-6">
                        <label for="loanYears" className="form-label">Duración del préstamo en años</label>
                        <input ref={loanYears} type="number" min={1} max={20} className="form-control form-control-sm" id="loanYears" required />
                    </div>
                    <div className="mb-2 form-check">
                        <input checked={policesCheck} onChange={handleOnChangePolicesCheck} type="checkbox" className="form-check-input" id="policesCheck" required />
                        <label className="form-check-label" for="policesCheck">Confirmo que estoy de acuerdo con los <a href='https://cloudframework.io/terminos-y-condiciones/' className='link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>términos y condiciones</a></label>
                    </div>
                    <div>
                        <p className='text-danger'><small>{validationError}</small></p>
                    </div>
                    <button type="submit" className="btn btn-primary">Enviar mi solicitud</button>
                </form>
            </div>
        </div>
    );
}

export default LoanRequest
