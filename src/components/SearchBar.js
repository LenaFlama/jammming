import React, { useState } from 'react'
import SearchResults from './SearchResults'
import './SearchBar.css'

function SearchBar (props) {
  const [searchInput, setSearchInput] = useState('')
  const [tracks, setTracks] = useState([])

  const token = window.localStorage.getItem('token')

  const handleChangeInput = (e) => {
    const inputValue = e.target.value

    setSearchInput(inputValue)

    // verify if there is something written in the search bar
    if (inputValue.trim() === '') {
      setTracks([])
    }
  }

  async function handleSearch (e) {
    e.preventDefault()

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=4&`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
      }

      const data = await response.json()

      // console.log(tracks)

      setTracks(data.tracks.items)
    } catch (error) {
      console.error('Error searching tracks:', error)
    }
  }

  return (
    <div className='Search-bar-body'>
      <div className="search-bar">
      <form onSubmit={handleSearch} >
        <input
          id="searchBar"
          type="search"
          placeholder="Search"
          onChange={handleChangeInput}
          value={searchInput}
          required
        />
        <SearchResults tracks={tracks} />
      </form>
      </div>
    </div>
  )
};

export default SearchBar
