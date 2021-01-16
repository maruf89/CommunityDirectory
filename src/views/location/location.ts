import { LatLngTuple } from 'leaflet';
import { mapInstances, LEAFLET_LOADED, MB_ATTR } from 'ThirdParty/leaflet';

let $:JQueryStatic;

export default function(_$:JQueryStatic) {
    $ = _$;

    const $Map = $('#LocationMap');
    if (!LEAFLET_LOADED || !$Map.length) return;

    initMap($Map);
}

function initMap($map:JQuery<HTMLElement>) {
    // var buttonTriggerer = event.target;
    var data = $map[0].dataset;
    // var locationId = +data.locationId;
    // var $map = $modal.find('#modalLocationMap');
    
    // // Use passed in coords or default coords
    var coords:any = ((data.coords && data.coords.split(',') || cdData.map.defaultCoords).map(str => +str))
    const markers:any = $map.children('.marker')
        .map((_, el) => [[+el.dataset.lat, +el.dataset.lon]])
        .toArray();

    // var editMap = data.columnEdit == 'true';        
    // var popup = editMap && L.popup();
    // var mapId = $modal.find('.map')[0].id;
    let hasInitiated = $map.hasClass('loaded');
    const map = hasInitiated ? mapInstances[0] : L.map($map[0].id, {
        center: coords,
        zoom: 13
    });

    // If first time loading, initiate the map and bind all listeners
    if (!hasInitiated) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + cdData.map.accessToken, {
            maxZoom: 18,
            attribution: MB_ATTR,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);

        map.data = {
            markers: []
        };

        $map.addClass('loaded');
        hasInitiated = true;
    }

    const addMarker = coords => {
        map.setView(coords, 13);
        var marker = L.marker(coords);
        map.data.markers.push(marker);
        marker.addTo(map);
    }

    markers.forEach(addMarker);
}