import React from "react";

function Logout () {

  function logout () {
    //setToken('')
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expiryTime');
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('loglevel');
    window.localStorage.removeItem('playlistTracks')
    window.localStorage.removeItem('selectedPlaylistId')

    window.location.reload();
      }
      
  return (
    <div>
    <button className="custom-btn btn" onClick={logout} style={{ margin: 0 }}>Log out</button>
    </div>
  )
}

export default Logout