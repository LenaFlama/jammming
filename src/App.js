import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import SearchBar from './components/SearchBar';
import Playlist from './components/Playlist';
import Logout from './components/Logout';
import { AppProvider } from './components/AppContext';


function App() {

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token');
    setToken(storedToken);
  }, []);

   return      (
    <div>
      {token?
        <div>
          <AppProvider>
            <div className='header'>
              <h1 className="poison">What's your poison?</h1>
              <div className='log-out'><Logout/></div>
            </div>
            <div className='search-bar'>
              <SearchBar/>
            </div>
            <div><Playlist/></div>
          </AppProvider>     
        </div>
        :<h1><Login></Login></h1>
      }   
    </div>
   )
}


export default App;
