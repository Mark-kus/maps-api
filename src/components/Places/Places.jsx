import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"

import "./Places.css"

export default function Places({ movePlace }) {
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete()

    const handleClick = async (description) => {
        // Clears suggests and moves the map to that location
        setValue(description, false)
        clearSuggestions()

        const results = await getGeocode({ address: description })
        
        const { lat, lng } = getLatLng(results[0])
        console.log({ lat, lng })
        movePlace({ lat, lng })
    }

    const findUser = () => {
        // Asks permission to get user's location and moves to it
        navigator.geolocation.getCurrentPosition(
            (e) => {
                movePlace({ lat: e.coords.latitude, lng: e.coords.longitude })
            },
            (err) => {
                console.log(err);
            })
    }

    return (
        <>
            <div className="results-container">
                <button onClick={findUser}>FindMe</button>
                <input
                    type="text"
                    value={value}
                    disabled={!ready}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Busca tu ubicacion"
                />
                <ul>
                    {status === "OK" && data.map(({ place_id, description }) => {
                        return <li
                            key={place_id}
                            className="result-item"
                            onClick={() => handleClick(description)}
                        >{description}</li>
                    })}
                </ul>
            </div>
        </>
    )
}