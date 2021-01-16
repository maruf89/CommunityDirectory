import { mapInstances, MB_ATTR } from 'ThirdParty/leaflet.ts';
import { getLocations, update } from 'Scripts/rest';

let $:JQueryStatic;

declare const L:any;

export default function(_$:JQueryStatic) {
    $ = _$;

    if (!$('body.toplevel_page_community-directory').length) return;

    $(document.body).on('click', '.select-location-modal', defineEntityLocationModal);
    $(document.body).on('click', '.select-coords-modal', defineCoordsModal);
}

export const defineEntityLocationModal = function ( event:Event ) {
    const target:HTMLElement = event.target as HTMLElement;
    const entityId = +target.dataset.entityId;
    const $modal = $('#modalLocationList');
    const $columnWrapper = $('#' + target.dataset.columnId);
    const $select:any = $modal.find('#modalLocationSelectField');
    const $save = $modal.find('.submit');

    if ( !$modal[0] ) alert('#modalLocationList must be present in the markup');

    if (!$select.hasClass('loaded'))
        getLocations().then(function (locations) {
            locations.forEach( function (loc) {
                $select.append('<option value="'+loc.id+'">'+loc.display_name+'</option>');
            });
            $select.addClass('loaded');
        });
    else {
        $save.toggleClass('disabled', true);
        $select[0].value = '';
    }

    $select.on('change', function () {
        $save.toggleClass('disabled', !this.value);
    });

    var onSubmit = function () {
        if ($(this).hasClass('disabled')) return;

        update.entity.updateLocation(entityId, +$select[0].value)
        .then(function () {
            $columnWrapper.empty();
            $columnWrapper[0].innerHTML = $select[0].options[$select[0].value].innerText;
            tb_remove();
            $modal.off('click', '.submit', onSubmit);
        });
    };

    $modal.on('click', '.submit', onSubmit);
}

export const defineCoordsModal = function ( event:Event ) {
    var $modal = $('#modalMap');

    if ( !$modal[0] ) alert('#modalMap must be present in the markup');
    
    var buttonTriggerer:HTMLElement = event.target as HTMLElement;
    var data = buttonTriggerer.dataset;
    var locationId = +data.locationId;
    var $map = $modal.find('#modalLocationMap');
    
    // Use passed in coords or default coords
    var coords = data.coords ? data.coords.split(',').map(function (str) { return +str; }) : cdData.map.defaultCoords;

    var editMap = data.columnEdit == 'true';        
    var popup = editMap && L.popup();
    var mapId = $modal.find('.map')[0].id;
    var hasInitiated = $map.hasClass('loaded');
    var map = hasInitiated ? mapInstances[0] : L.map(mapId, {
        center: coords,
        zoom: 13
    });

    var addMarker = function (coords) {
        map.setView(coords, 13);
        var marker = L.marker(coords);
        map.data.markers.push(marker);
        marker.addTo(map);
    }

    var closePopup = function () {
        map.closePopup();
    }

    var onSubmit = function () {
        update.location.updateCoords(locationId, coords[0], coords[1])
        .then(success => {
            if ( success ) {
                closePopup();
                addMarker(coords);
                buttonTriggerer.innerText = cdData.translations.viewOnMap;
                return;
            }
            alert('There was an error saving the coordinates.');
        });
    };

    var reset = function () {
        // Remove each marker
        for (let i = map.data.markers.length - 1; i >= 0; i--)
            map.data.markers.pop().remove();

        map.closePopup();
        // Reset center to default
        map.setView(cdData.map.defaultCoords, 13);
        // Remove listeners
        map.off('click');
    }

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
        
        // Listener to save coords to DB
        $modal.on('click', '.submit-yes', onSubmit).on('click', '.submit-no', closePopup);

        // Override the the thickbox modal close listeners
        var old_tb_remove = window.tb_remove;
        // @ts-ignore
        window.tb_remove = function (e) {
            if (e && e.target !== e.currentTarget) return true;
            old_tb_remove();
            reset();
        }
        $('#TB_overlay, #TB_window').off('click').on('click', window.tb_remove);

        $map.addClass('loaded');
        hasInitiated = true;
    }

    if (data.coords && !editMap) addMarker(coords);

    if (editMap) {
        map.on('click', function (e) {
            coords = [e.latlng.lat, e.latlng.lng];
            popup
                .setLatLng(e.latlng)
                .setContent("Set this place as the center?<br /><a class='submit-yes button-primary'>Yes</a><a class='button submit-no'>No</a>")
                .openOn(e.target);
            e.target.setView(e.latlng)
        });
    }
};