import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthProvider";

import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    MutedLink,
    SubmitButton,
  } from "./common";
  import { Marginer } from "../marginer";
  import { AccountContext } from "./accountContext";
  import axios from '../../api/axios';
  import { Navigate } from 'react-router-dom';

const LOGIN_URL = '/login';

export function LoginForm(props) {
    const { switchToSignup } = useContext(AccountContext);
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ "email":email, "password":pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            setEmail('');
            setPwd('');

            if (JSON.stringify(response?.data?.login_status_flag)==='1') {
                console.log(JSON.stringify(response?.data?.login_status_flag));
                setSuccess(true);
                <Navigate to='/main' />
            }else{

                    throw new Error();
            }
        } catch (err) {
            setErrMsg('Login Failed, Unauthorized User');
            if (!err?.response) {
                setErrMsg('Login Failed: Unauthorized User');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                 <Navigate to='/main' />
            ) : (
                <BoxContainer>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <FormContainer id="signin" onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />

                    </FormContainer>

                        <Marginer direction="vertical" margin={10} />
                        <Marginer direction="vertical" margin="1.6em" />
                        <SubmitButton type="submit" form="signin" >SignIn</SubmitButton>
                        <Marginer direction="vertical" margin="1em" />

                    <MutedLink href="#">
                        Don't have an accoun?{" "}
                        <BoldLink href="#" onClick={switchToSignup}>
                        Signup
                        </BoldLink>
                    </MutedLink>
                </BoxContainer>
            )}
        </>
    )
}