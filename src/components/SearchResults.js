import React from "react";
import AddTrack from "./AddTrack";
import './SearchResults.css'


function SearchResults(props) {

 
  let result = props.tracks.map((track) => (
    <div key={track.id} className="results">
      <img src={track.album.images[0].url} alt=''></img>
      <div className="info"> 
      <h2>{track.name}</h2>
      <p>by {track.artists[0]?.name}</p>
      {console.log(track.uri)}
      {console.log(track.id)} 
      <details>
        <summary></summary>
        <AddTrack track={track}/>
      </details>
      </div> 
    </div>
  ));

  return (
    <div className="tracks">
      {result.length > 0? 
      <div>{result}
      </div>:
      result}      
    </div>
  )
}

export default SearchResults