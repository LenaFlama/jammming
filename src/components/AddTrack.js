/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useAppContext } from './AppContext'
import './AddTrack.css'

function AddTrack ({ track }) {
  const [playlist, setPlaylist] = useState([])
  const storedToken = window.localStorage.getItem('token')
  const { selectedPlaylistId, refreshPlaylist } = useAppContext()

  useEffect(() => {
    setPlaylist(JSON.parse(window.localStorage.getItem('playlistTracks')) || [])
  }, [selectedPlaylistId])

  // let selectedPlaylistTracks = playlist.map((plTrack) => plTrack.track.id)

  async function addToPlaylist () {
    if (selectedPlaylistId == null) {
      return 'please select a playlist'
    }

    if (playlist.some((plTrack) => plTrack.track.id === track.id)) {
      console.log('Track already exists in the playlist.')
      return
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: [track.uri],
            position: 0
          })
        }
      )

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
      }

      console.log('Track added to playlist:', track)
      refreshPlaylist()
    } catch (error) {
      console.error('Error:', error)
    }

    const updatedTrack = { track }
    const updatedPlaylist = [...playlist, updatedTrack]
    setPlaylist(updatedPlaylist)
  };

  useEffect(() => {
    window.localStorage.setItem('playlistTracks', JSON.stringify(playlist))
  }, [playlist])

  return (
    <div>
      <p className="add" onClick={addToPlaylist}>Add To Playlist</p>
    </div>
  )
}

export default AddTrack
