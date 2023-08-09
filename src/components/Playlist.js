/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useAppContext } from './AppContext'
import './Playlist.css'

function Playlist () {
  const { selectedPlaylistId, setSelectedPlaylistId, playlistRefreshFlag } = useAppContext()
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null)
  const [userPlaylists, setUserPlaylists] = useState([])
  const [userPlaylistTracks, setUserPlaylistTracks] = useState([])
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [playlistName, setPlaylistName] = useState('')
  const [isRemoving, setIsRemoving] = useState(false)

  const storedToken = window.localStorage.getItem('token')

  useEffect(() => {
    async function fetchData () {
      try {
        // Fetch user profile
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        if (!response.ok) {
          throw new Error('Request failed with status ' + response.status)
        }

        const userData = await response.json()

        setUserId(userData.id)
        localStorage.setItem('userId', userData.id)

        // Fetch user playlists
        const playlistsResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        if (!playlistsResponse.ok) {
          throw new Error(
            'Request failed with status ' + playlistsResponse.status)
        }

        const playlistsData = await playlistsResponse.json()
        setUserPlaylists(playlistsData.items)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchPlaylistTracks () {
      try {
        if (!selectedPlaylistId) {
          return
        }

        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          }
        )

        if (!tracksResponse.ok) {
          throw new Error('Request failed with status ' + tracksResponse.status)
        }

        const tracksData = await tracksResponse.json()
        setUserPlaylistTracks(tracksData.items)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchPlaylistTracks()
  }, [selectedPlaylistId, playlistRefreshFlag])

  // create new playlist
  async function createNewPlaylist (inp) {
    try {
      if (!inp) {
        return
      }
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          name: inp,
          description: 'New playlist description',
          public: true
        })
      })

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
      }

      const data = await response.json()

      setNewPlaylistName('')
      setUserPlaylists(prevPlaylists => [...prevPlaylists, data]) // Update userPlaylists state with the new playlist
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // editing playlist
  async function editPlaylist (playlistId, newName) {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          description: 'Updated playlist description',
          public: true
        })
      })

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
      }

      // Fetch the updated playlist data
      const updatedPlaylistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      if (!updatedPlaylistResponse.ok) {
        throw new Error('Request failed with status ' + updatedPlaylistResponse.status)
      }

      const updatedPlaylistData = await updatedPlaylistResponse.json()

      setUserPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist => {
          if (playlist.id === playlistId) {
            return { ...playlist, name: newName }
          } else {
            return playlist
          }
        })
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleRenameButtonClick = (playlistId, currentName) => {
    const newName = prompt('Enter new playlist name:', currentName)

    if (newName !== currentName) {
      editPlaylist(playlistId, newName)
    }
  }

  // select a playlist
  async function handlePlaylistButtonClick (playlist) {
    try {
      setPlaylistName(playlist.name)

      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      if (!tracksResponse.ok) {
        throw new Error('Request failed with status ' + tracksResponse.status)
      }

      const tracksData = await tracksResponse.json()

      setUserPlaylistTracks(tracksData.items)

      setSelectedPlaylistId(playlist.id)

      localStorage.setItem('playlistTracks', JSON.stringify(tracksData.items))
    } catch (error) {
      console.error('Error:', error)
    }
  };

  async function handleRemoveTrackButton (track) {
    try {
      setIsRemoving(true)

      const selectedPlaylistTrackURI = track.track.uri
      // console.log(selectedPlaylistTrackURI)

      const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      if (!playlistResponse.ok) {
        throw new Error('Request failed with status ' + playlistResponse.status)
      }

      const playlistData = await playlistResponse.json()
      const snapshotId = playlistData.snapshot_id
      // console.log(snapshotId)

      const response = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracks: [{
            uri: selectedPlaylistTrackURI
          }],
          snapshot_id: snapshotId
        })
      })

      if (response.ok) {
        console.log('Track removed successfully')
        setUserPlaylistTracks((prevTracks) => prevTracks.filter((t) => t.track.id !== track.track.id))
      } else {
        console.error('Failed to remove track')
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setIsRemoving(false)
  };

  return (
    <div className="playlist">
      <h2 className="your-playlist">Your Playlists</h2>
      <div className="new-playlist search-bar">
        <h4>Create New Playlist</h4>
        <input
          className="new-name"
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          required
        />
        <button className="create custom-btn btn" onClick={() => createNewPlaylist(newPlaylistName)}>Create</button>
      </div>
      <div className="user-playlists">
      {userId && userPlaylists.length > 0
        ? (
        <div className="playlists-name">
        <ul className="no-bullets">
          {userPlaylists.map((playlist) => (
            <li key={playlist.id}
              onClick={() => handlePlaylistButtonClick(playlist)}
            >
              <button className="custom-btn btn" onClick={() => handleRenameButtonClick(playlist.id, playlist.name)}
                >Rename
              </button>
              <h4>{playlist.name}</h4>
            </li>
          ))}
        </ul>
        </div>
          )
        : (
        <p>Loading playlists...</p>
          )}
      {selectedPlaylistId && userPlaylistTracks && (
        <div className="selected-playlist">
          <h3>{playlistName}</h3>
          <ul className="playlist-tr">
            {userPlaylistTracks.map((track) => (
              <li key={track.track.id}>{track.track.name}
              <p onClick={() => handleRemoveTrackButton(track)} disabled={isRemoving}>Remove</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  )
}

export default Playlist
