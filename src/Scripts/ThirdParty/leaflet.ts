

export const MB_ATTR = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
export const MB_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + 'ACCESS_TOKEN';
export const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// @ts-ignore
export const LEAFLET_LOADED = !!window.L;

export const elMarker = L.Marker.extend({
    options: {
        data: {
            el: 'attach an element'
        }
    }
});

export const mapInstances = [];

if ( LEAFLET_LOADED ) {
    L.Map.addInitHook(function () {
        mapInstances.push(this);
    });
}