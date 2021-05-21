import React from 'react'

function Login() {

    const googleAuth = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    }
    const githubAuth = () => {
        window.open("http://localhost:5000/auth/github", "_self");
    }
    const linkedinAuth = () => {
        window.open("http://localhost:5000/auth/linkedin", "_self");
    }


    return (
        <div>
            <button onClick={googleAuth}>Login With Google</button>
            <br />
            <br />
            <button onClick={githubAuth}>Login With Github</button>
            <br />
            <br />
            <button onClick={linkedinAuth}>Login With Linkedin</button>
        </div>
    )
}

export default Login
