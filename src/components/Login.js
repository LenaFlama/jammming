import React, {useState, useEffect} from "react";
import './Login.css'


function Login () {

  const clientId = '3c85b578147a4afd96e2be08ffcac446';
  const redirectUri = 'http://localhost:3000';
  const scope = 'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private'

  const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&show_dialog=true`;

  const [token, setToken] = useState('');
  const [tokenExpired, setTokenExpired] = useState(false);
   

  useEffect(() => {
  //getting the url after authenification

    let newURL = window.location.hash
    let storedToken = window.localStorage.getItem("token") 
    let expiryTime = window.localStorage.getItem("expiryTime");
 
    //separating the token & verify if expired
    if(!storedToken && newURL) {
      let storedToken = newURL.substring(1).split('&').find(e => e.startsWith('access_token')).split('=')[1]
      let expiryTime = Date.now() + 3600000;
    
      window.location.hash = ''
      window.localStorage.setItem('token', storedToken)
      window.localStorage.setItem('expiryTime', expiryTime)
      //let storedExpiryTime = expiryTime;
    } 

    setToken(storedToken)

    // Token is expired, handle re-authentication or log out
    if (expiryTime && parseInt(expiryTime) <= Date.now()) {
      console.log("Token expired, you need to log in again!");
      setTokenExpired(true);
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('expiryTime');
      window.location.href = "/login";
      return
    }
    
    setTokenExpired(false);
    }, [])
 
    
  return (
    <div className='body'>
      <h1>Please Log In</h1>
      <div className="frame">
        <a href={authorizationUrl}>
          <button className="custom-btn btn"><span>Log In</span></button>
        </a>
      </div>
    </div>
  )
}

export default Login
