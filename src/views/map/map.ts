import { Marker } from 'leaflet';
import { mapInstances, LEAFLET_LOADED, MB_ATTR, mapboxUrl } from 'ThirdParty/leaflet';

let $:JQueryStatic;

export default function(_$:JQueryStatic) {
    $ = _$;

    const $Map = $('#InstanceMap');
    if (!LEAFLET_LOADED || !$Map.length) return;

    initMap($Map);
}

function initMap($map:JQuery<HTMLElement>) {
    const data = $map[0].dataset;
    let popup = L.popup();
    // Use passed in coords or default coords
    // @ts-ignore
    const center:any = ((data.coords && data.coords.split(',') || cdData.map.defaultCoords).map(str => +str))

    const mapOpenPopup = ($element, e) => {
        popup
            .setLatLng(e.latlng)
            .setContent($element.html())
            .openOn(e.target);
        map.setView(e.latlng)

        setTimeout(() => {
            const centerPoint = map.getSize().divideBy(2);
            const targetPoint = centerPoint.subtract([0, 60]);
            const targetLatLng = map.containerPointToLatLng(targetPoint);
            map.panTo(targetLatLng);
        }, 250);
        
        // @ts-ignore
        const popupOpenEvent = new CustomEvent(cdData.events.map.popupOpen, { detail: { $element, e } });
        window.dispatchEvent(popupOpenEvent);
    };
    
    const markers:Marker[] = $map.children('.marker')
        .map((_, el) => {
            const marker =  L.marker([+el.dataset.lat, +el.dataset.lon]);
            if (!data.singleMarker) {
                marker.bindPopup(popup)
                marker.on('click', mapOpenPopup.bind(null, jQuery(el)))
            }
            return marker;
        })
        .toArray();

    const markerGroup = L.featureGroup(markers);

    let hasInitiated = $map.hasClass('loaded');
    const map = hasInitiated ? mapInstances[0] : L.map($map[0].id, {
        center: center,
        zoom: 13
    });

    // If first time loading, initiate the map and bind all listeners
    if (!hasInitiated) {
        L.tileLayer(mapboxUrl, {
            id: 'mapbox/streets-v8',
            tileSize: 512,
            zoomOffset: -1,
            attribution: MB_ATTR
        }).addTo(map);

        map.data = {
            markers: []
        };

        $map.addClass('loaded');
        hasInitiated = true;
    }

    markerGroup.addTo(map);
    map.fitBounds(markerGroup.getBounds());
    
    if (data.singleMarker) map.setZoom(16);
}


