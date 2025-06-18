// Function to fetch train schedules from a free API
async function fetchTrainSchedulesAndShow() {
    const resultDiv = document.getElementById('optimization-result');
    resultDiv.textContent = 'Loading train schedules...';
    try {
        // Using a free railway API
        const response = await fetch('https://real-time-pnr-status-api-for-indian-railways.p.rapidapi.com/route/train/12301', {
        method: 'GET',
        headers: {
            'RAILWAY_API': '2908c9e52amsh962fd743dd5c989p1835f6jsn50e6b376b3f4',
            'RAIWAY_API_HOST': 'real-time-pnr-status-api-for-indian-railways.p.rapidapi.com'
        }
    });
        const data = await response.json();
        if (data && data.route) {
            let html = '<h3>Train Schedule</h3>';
            html += '<div class="schedule-list">';
            data.route.forEach(station => {
                html += `<div class="station-item"> 
                    <strong>${station.station.name}</strong>
                    <p>Arrival: ${station.scharr || 'N/A'}</p>
                    <p>Departure: ${station.schdep || 'N/A'}</p>
                </div>`;
            });
            html += '</div>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.textContent = 'No schedule data available.';
        }
    } catch (e) {
        resultDiv.textContent = 'Failed to fetch train schedules. Please try again later.';
        console.error('Error fetching train schedules:', e);
    }
}

// Function to fetch weather data from OpenWeatherMap API (free tier)
async function fetchWeatherDataAndShow() {
    const resultDiv = document.getElementById('optimization-result');
    resultDiv.textContent = 'Loading weather data...';
    try {
        // Using OpenWeatherMap free API
        const apiKey = '2ed20493d9a80d8092db42fb4c2f2fdf'; // Replace with your free API key
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=APIKEY`);
        const data = await response.json();
        if (data && data.main) {
            let html = '<h3>Weather Information</h3>';
            html += `<div class="weather-info">
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            </div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.textContent = 'Weather data not available.';
        }
    } catch (e) {
        resultDiv.textContent = 'Failed to fetch weather data. Please try again later.';
        console.error('Error fetching weather data:', e);
    }
}
async function fetchWeatherForPath(path) {
  const resultDiv = document.getElementById('optimization-result');
  if (!resultDiv) return;

  resultDiv.innerHTML = `<h3>Weather Along the Path</h3>`;
  
  const apiKey = '2ed20493d9a80d8092db42fb4c2f2fdf'; // Replace with your actual API key

  for (const city of path) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      
      if (data.cod === 200) {
        resultDiv.innerHTML += `
          <div class="weather-info">
            <strong>${city}</strong>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <hr>
          </div>
        `;
      } else {
        resultDiv.innerHTML += `<p>Weather data not found for ${city}</p>`;
      }
    } catch (err) {
      resultDiv.innerHTML += `<p>Error fetching weather for ${city}</p>`;
      console.error(`Weather fetch error for ${city}:`, err);
    }
  }
}


// Function to fetch user location using free IP Geolocation API
async function fetchUserLocationAndShow() {
    const resultDiv = document.getElementById('map-result');
    resultDiv.textContent = 'Detecting your location using GPS...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;

                // Display coordinates
                resultDiv.textContent = `Coordinates: Latitude ${latitude}, Longitude ${longitude}`;

                // Reverse geocode using Google Maps Geocoding API
                try {
                    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=2ed20493d9a80d8092db42fb4c2f2fdf`);
                    const data = await response.json();

                    if (data.status === 'OK' && data.results.length > 0) {
                        const address = data.results[0].formatted_address;
                        resultDiv.textContent = `Your location: ${address}`;
                    } else {
                        resultDiv.textContent += ' (Unable to retrieve address.)';
                    }
                } catch (error) {
                    console.error('Reverse geocoding failed:', error);
                    resultDiv.textContent += ' (Reverse geocoding error.)';
                }

                // Show location on map
                if (window.google && window.google.maps && document.getElementById('map')) {
                    const map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: latitude, lng: longitude },
                        zoom: 12
                    });

                    new google.maps.Marker({
                        position: { lat: latitude, lng: longitude },
                        map,
                        title: 'You are here'
                    });
                }--
            },
            error => {
                resultDiv.textContent = 'Permission denied or location unavailable.';
                console.error('Geolocation error:', error);
            }
        );
    } else {
        resultDiv.textContent = 'Geolocation not supported by your browser.';
    }
}


// Function to initialize Google Maps
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 8
    });
}

// Function to calculate directions using Google Directions API
function calculateDirections() {
    const resultDiv = document.getElementById('map-result');
    resultDiv.textContent = 'Calculating directions...';
    if (window.google && window.google.maps && document.getElementById('map')) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 28.6139, lng: 77.2090 },
            zoom: 6
        });
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        const request = {
            origin: 'New Delhi Railway Station',
            destination: 'Kanpur Central',
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                resultDiv.textContent = 'Directions displayed on map.';
            } else {
                resultDiv.textContent = 'Failed to get directions. Please try again later.';
            }
        });
    } else {
        resultDiv.textContent = 'Google Maps not loaded. Please check your internet connection.';
    }
}

// Function to search for places using Google Places API
function searchPlaces() {
    const resultDiv = document.getElementById('map-result');
    resultDiv.textContent = 'Searching for nearby stations...';
    if (window.google && window.google.maps && document.getElementById('map')) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 28.6139, lng: 77.2090 }, // Delhi as default
            zoom: 12
        });
        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: { lat: 28.6139, lng: 77.2090 },
            radius: 5000,
            type: ['train_station']
        };
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                let html = '<h3>Nearby Stations</h3>';
                html += '<div class="stations-list">';
                results.forEach(place => {
                    html += `<div class="station-item">
                        <strong>${place.name}</strong>
                        <p>Rating: ${place.rating || 'N/A'}</p>
                        <p>Address: ${place.vicinity || 'N/A'}</p>
                    </div>`;
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map,
                        title: place.name
                    });
                });
                html += '</div>';
                resultDiv.innerHTML = html;
            } else {
                resultDiv.textContent = 'No stations found in the area.';
            }
        });
    } else {
        resultDiv.textContent = 'Google Maps not loaded. Please check your internet connection.';
    }
}

// Scroll to Optimization section when Start Optimization is clicked
function optionone() {
    const section = document.getElementById('optimization');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// Load Google Maps script dynamically if not present
if (!window.google || !window.google.maps) {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD3IbQ1qoJdxMTgGRVi_2iZU40QyyHvs2M&libraries=places';
    script.async = true;
    script.defer=true;
    document.head.appendChild(script);
} 
function onGoogleMapsLoaded(){
    console.log('Google Maps script loaded.');
    initMap();
}
