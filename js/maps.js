
const placeNameElement = document.getElementById('place-name');
const photoElement = document.getElementById('photo');
const addressElement = document.getElementById('address');
const modalElement = document.getElementById('modal');
const lightboxElement = document.getElementById('lightbox').getElementsByClassName('content')[0];

loadPlaces();

L.mapbox.accessToken = "pk.eyJ1IjoicmV4LWEiLCJhIjoiY2pvYTYzZGRpMDJibzNscWx0cjZubWljZCJ9.2yhLb0zk0Rx1KE5UyXjlOg";
const map = L.mapbox.map('bandung-map').setView([-6.92, 107.60], 13).addLayer(L.mapbox.tileLayer('mapbox.streets'));



function showModal() {
    modalElement.style.visibility = 'visible';
}

async function loadPlaces() {
    await fetch('data/bandung.geojson').then(response => response.json()).then(response => {
        let places = response.features;
        let placeItem = "";

        places.forEach(place => {
            placeItem += `
                        <div class="item" onclick='showDescription(${JSON.stringify(place)})'>
                            <div class="photo">
                                <img src="${place.properties.photo}">
                            </div>
                            <div class="description">
                                <span>${place.properties.name}</span>
                            </div>
                        </div>
                    `;
        })

        lightboxElement.innerHTML = placeItem;
    });
}

function showDescription(data) {
    modalElement.style.visibility = 'hidden';
    placeNameElement.innerHTML = data.properties.name;
    addressElement.innerHTML = data.properties.address;
    photoElement.setAttribute('src', data.properties.photo);

    map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 15);

}


L.mapbox.featureLayer()
    .loadURL('data/bandung.geojson')
    .on('ready', event => {
        let clusterGroup = new L.MarkerClusterGroup();

        event.target.eachLayer(layer => {
            clusterGroup.addLayer(layer);
        });

        map.addLayer(clusterGroup);
    })
    .on('click', event => {
        let coordinates = event.layer.feature.geometry.coordinates;



        showDescription(event.layer.feature);
    });

map.scrollWheelZoom.disable();