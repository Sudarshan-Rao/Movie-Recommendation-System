import { Login } from "./Login";
//import { useContext } from 'react'
//import AuthContext, { AuthProvider } from "./context/AuthProvider";

function App() {
  //const { setAuth } = useContext(AuthContext)
  //console.log(setAuth)
  //{setAuth === false ? (<Login />) : (<Main />)}
  //<AuthProvider></AuthProvider>

  return (
        <Login/>
    //if auth token is set route to Main
    // else route to login
  );
}

export default App;