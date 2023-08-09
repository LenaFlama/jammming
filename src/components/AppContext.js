import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const [playlistRefreshFlag, setPlaylistRefreshFlag] = useState(false);

  // Callback function to trigger the playlist refresh
  const refreshPlaylist = () => {
    setPlaylistRefreshFlag(!playlistRefreshFlag);
  };

  return (
    <AppContext.Provider value={{ selectedPlaylistId, setSelectedPlaylistId,
      playlistRefreshFlag,
      refreshPlaylist }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };