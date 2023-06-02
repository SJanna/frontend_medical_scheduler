import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

const AuthTabs = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [registerData, setRegisterData] = useState({
        nombre: "",
        apellidos: "",
        numero_identificacion: "",
        celular: ""
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleLoginInputChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleRegisterInputChange = (e) => {
        const { id, value } = e.target;
        setRegisterData((prevData) => ({ ...prevData, [id]: value }));
    };

    const [isLoading, setIsLoading] = useState(false);

    const [failAlertLogin, setFailAlertLogin] = useState(false);
    const [failAlertRegister, setFailAlertRegister] = useState(false);


    const handleFormSubmit = (e) => {
        setIsLoading(true)
        setFailAlertLogin(false)
        e.preventDefault();
        if (activeTab === "login") {
            // Enviar los datos del formulario de login a la API
            axios.post("http://127.0.0.1:8000/api/authentication/login/", loginData)
                .then((response) => {
                    document.location.href = "/";
                    localStorage.setItem('token', response.data.key);
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error);
                    setFailAlertLogin(true)
                    setIsLoading(false)
                });
        } else if (activeTab === "register") {
            // Enviar los datos del formulario de registro a la API
            axios.post("http://127.0.0.1:8000/personas/", {

                user: {
                    username: registerData.numero_identificacion,
                    email: loginData.email,
                    password: loginData.password
                }, ...registerData
            })
                .then((response) => {
                    document.location.reload()
                    console.log(response)

                })
                .catch((error) => {
                    console.log(error);
                    setFailAlertRegister(true)
                    setIsLoading(false)
                });
        }
    };

    return (
        <>
            <div className="row justify-content-center aling-items-center">
                <div className="m-5 col-auto p-5 shadow p-3 mb-5 rounded">

                    {/* Pills navs */}
                    <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                                id="tab-login"
                                data-mdb-toggle="pill"
                                href="#pills-login"
                                role="tab"
                                aria-controls="pills-login"
                                aria-selected={activeTab === "login"}
                                onClick={() => handleTabChange("login")}
                            >
                                Login
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                                id="tab-register"
                                data-mdb-toggle="pill"
                                href="#pills-register"
                                role="tab"
                                aria-controls="pills-register"
                                aria-selected={activeTab === "register"}
                                onClick={() => handleTabChange("register")}
                            >
                                Register
                            </a>
                        </li>
                    </ul>
                    {/* Pills navs */}

                    {/* Pills content */}
                    <div className="tab-content">
                        <div
                            className={`tab-pane fade show ${activeTab === "login" ? "active" : ""}`}
                            id="pills-login"
                            role="tabpanel"
                            aria-labelledby="tab-login"
                        >

                            <form onSubmit={handleFormSubmit}>
                                <div className="text-center mb-3">
                                    <p>Sign in:</p>
                                </div>
                                {/* Email input */}
                                <div className="form-outline mb-4">
                                    <input required type="text" id="username" className="form-control" placeholder="ID number" onChange={handleLoginInputChange} />
                                </div>

                                {/* Password input */}
                                <div className="form-outline mb-4">
                                    <input required type="password" id="password" className="form-control" placeholder="Password" onChange={handleLoginInputChange} />
                                </div>

                                {failAlertLogin && (
                                    <>
                                        <div className="alert alert-danger" role="alert">
                                            An error occurred while logging in
                                        </div>
                                    </>
                                )}
                                {/* 2 column grid layout */}
                                <div className="row mb-4">
                                    <div className="col-md-6 d-flex justify-content-center">
                                        {/* Checkbox */}
                                        <div className="form-check mb-3 mb-md-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                id="loginCheck"
                                            // checked readOnly
                                            />
                                            <label className="form-check-label" htmlFor="loginCheck">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-md-6 d-flex justify-content-center">
                                        {/* Simple link */}
                                        <a href="http://localhost:3000/login#pills-register">Forgot password?</a>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <button type="submit" className="btn btn-primary btn-block mb-4" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>

                                {/* Register buttons */}
                                <div className="text-center">
                                    <p>
                                        Not a member?
                                        <a
                                            className={`${activeTab === "register" ? "active" : ""}`}
                                            id="tab-register"
                                            data-mdb-toggle="pill"
                                            href="#pills-register"
                                            role="tab"
                                            aria-controls="pills-register"
                                            aria-selected={activeTab === "register"}
                                            onClick={() => handleTabChange("register")}
                                        >
                                            Register
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div
                            className={`tab-pane fade ${activeTab === "register" ? "show active" : ""}`}
                            id="pills-register"
                            role="tabpanel"
                            aria-labelledby="tab-register"
                        >

                            <form onSubmit={handleFormSubmit}>
                                <div className="text-center mb-3">
                                    <p>Sign up:</p>
                                </div>

                                <div className="input-group">
                                    {/* Name input */}
                                    <div className="form-outline mb-4 me-2">
                                        <input required type="text" id="nombre" className="form-control" placeholder="Name" onChange={handleRegisterInputChange} />
                                    </div>

                                    {/* Lastname input */}
                                    <div className="form-outline mb-4 ms-2">
                                        <input required type="text" id="apellidos" className="form-control" placeholder="Lastname" onChange={handleRegisterInputChange} />
                                    </div>

                                </div>


                                {/* ID number input */}
                                <div className="form-outline mb-4">
                                    <input required type="text" id="numero_identificacion" className="form-control" placeholder="ID Number" onChange={handleRegisterInputChange} />
                                </div>
                                {/* Phone input */}
                                <div className="form-outline mb-4">
                                    <input required type="text" id="celular" className="form-control" placeholder="Phone Number" onChange={handleRegisterInputChange} />
                                </div>
                                {/* Username input */}
                                {/* <div className="form-outline mb-4">
                            <input hidden required type="text" id="username" className="form-control" placeholder="Username" onChange={handleLoginInputChange} />
                        </div> */}

                                {/* Email input */}
                                <div className="form-outline mb-4">
                                    <input required type="email" id="email" className="form-control" placeholder="Email" onChange={handleLoginInputChange} />
                                </div>

                                {/* Password input */}
                                <div className="form-outline mb-4">
                                    <input required type="password" id="password" className="form-control" placeholder="Password" onChange={handleLoginInputChange} />
                                </div>

                                {failAlertRegister && (
                                    <>
                                        <div className="alert alert-danger" role="alert">
                                            An error occurred while signing up
                                        </div>
                                    </>
                                )}

                                {/* Checkbox */}
                                <div className="form-check d-flex justify-content-center mb-4">
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        value=""
                                        id="registerCheck"
                                        // checked readOnly
                                        aria-describedby="registerCheckHelpText"
                                    />
                                    <label className="form-check-label" htmlFor="registerCheck">
                                        I have read and agree to the terms
                                    </label>
                                </div>

                                {/* Submit button */}
                                <button type="submit" className="btn btn-primary btn-block mb-4" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </>
                                    ) : (
                                        "Sign up"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                    {/* Pills content */}
                </div>
            </div>
        </>
    );
};

export default AuthTabs;
