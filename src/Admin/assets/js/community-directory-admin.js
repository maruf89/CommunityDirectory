ACCESS_TOKEN="";
MB_ATTR = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
MB_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + ACCESS_TOKEN;
OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
LEAFLET_LOADED = !!window.L;

window.cdData.fn = {};

(function ($) {
    cdData.fn.editLocationTable = function ($table) {
        $form = $('#mainform');
        newFieldId = 1;
        
        $('.table-add').click(function () {
        var cloneId = newFieldId++;
        var $clone = $table.find('tr.hide').clone(true).removeClass('hide table-line');
        $clone.find('.edit-field').each(function (index, el) {
            el.name = el.name.substr(0, el.name.length - 1) + cloneId + ']';

            // Must add changed to new status field so it gets submitted
            if ($(el).hasClass('edit-status')) $(el).addClass('changed');
        });
        $table.append($clone);
        $clone.find('.edit-name').focus();
        });
    
        // Deletes locations via ajax
        $('.table-remove').click(function () {

        if (!confirm(cdData.translations.deleteLocation)) {
            return;
        }

        var locId = $(this).closest('tr')[0].dataset.locationId;

        var data = {
            location_id: locId,
            action: 'location_delete',
        };

        var $this = this;

        $.post(ajaxurl, data, function(response, result) {
            if (result == 'success') {
            $($this).closest('tr').detach();
            alert(response);
            }
        });
        
        });


        $table.on('change', '.edit-name', {}, function (e) {
        // Add changed class if new text doesn't match original value
        var hasChanged = e.target.dataset.originalValue != e.target.value;
        $(this).toggleClass('changed', hasChanged);
        });

        $table.on('change', '.edit-status', function (e) {
        var hasChanged = e.target.dataset.originalValue != e.target.value;
        $(this).toggleClass('changed', hasChanged);
        });

        function submit (e) {
        e.originalEvent.preventDefault();

        // Detach all unchanged fields
        $table.find('.edit-field:not(.changed)').detach();

        $form.off('submit', submit).trigger('submit');
        }
        
        $form.on('submit', submit);
    };

    cdData.fn.get = {
        cache: {
            locations: null,
            entities: null,
        },
        locations: function ( limit ) {
            limit = limit || 25;// todo
            var cached = cdData.fn.get.cache.locations;
            return cached ? $.when(cached) : $.ajax({
                type: 'GET',
                url: cdData.restBase + 'location/get' ,
                data: {  },
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', cdData.wp_nonce );
                },
                success: function ( response ) {
                    cdData.fn.get.cache.locations = response;
                    return response;
                },
                dataType: 'json'
            });
        },
        entities: function ( limit ) {
            limit = limit || 25;// todo
            return $.get( cdData.restBase + cdData.postType.entity );
        },
    };

    cdData.fn.defineEntityLocationModal = function ( _this ) {
        var entityId = +_this.target.dataset.entityId;
        var $modal = $('#modalLocationList');
        var $columnWrapper = $('#' + _this.target.dataset.columnId);
        var $select = $modal.find('#modalLocationSelectField');
        var $save = $modal.find('.submit');

        if ( !$modal[0] ) alert('#modalLocationList must be present in the markup');

        if (!$select.hasClass('loaded'))
            cdData.fn.get.locations().then(function (locations) {
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

            $.ajax({
                type: 'POST',
                url: cdData.restBase + 'entity/update-entity',
                data: {
                    entity: entityId,
                    location_id: +$select[0].value,
                },
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', cdData.wp_nonce );
                },
                dataType: 'json'
            }).then(function () {
                $columnWrapper.empty();
                $columnWrapper[0].innerHTML = $select[0].options[$select[0].value].innerText;
                tb_remove();
                $modal.off('click', '.submit', onSubmit);
            });
        };

        $modal.on('click', '.submit', onSubmit);
    };

    // Will store the initiated map instances
    cdData.map.instances = [];

    if ( LEAFLET_LOADED ) {
        L.Map.addInitHook(function () {
            cdData.map.instances.push(this);
        });
    }

    cdData.fn.defineCoordsModal = function ( event ) {
        var $modal = $('#modalMap');

        if ( !$modal[0] ) alert('#modalMap must be present in the markup');
        if ( !window.L ) alert('Missing Leaflet library.');
        
        var buttonTriggerer = event.target;
        var data = event.target.dataset;
        var locationId = +data.locationId;
        var $columnWrapper = $('#' + data.columnId);
        var $map = $modal.find('#modalLocationMap');
        
        // Use passed in coords or default coords
        var coords = data.coords ? data.coords.split(',').map(function (str) { return +str; }) : cdData.map.defaultCoords;

        var editMap = data.columnEdit == 'true';        
        var popup = editMap && L.popup();
        var mapId = $modal.find('.map')[0].id;
        var hasInitiated = $map.hasClass('loaded');
        var map = hasInitiated ? cdData.map.instances[0] : L.map(mapId, {
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
            $.ajax({
                type: 'POST',
                url: cdData.restBase + 'location/update-coords',
                data: {
                    location_id: locationId,
                    lat: coords[0],
                    lon: coords[1]
                },
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', cdData.wp_nonce );
                },
                dataType: 'json'
            }).then(function (success) {
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

    var onBodyLoaded = document.body.onload;
    document.body.onload = function () {
        if ( onBodyLoaded && onBodyLoaded !== document.body.onload ) onBodyLoaded();

        // Certain buttons may be disabled until load
        $('.enable-on-load').removeClass('disabled enable-on-load');

        $(document.body).on('click', '.select-location-modal', cdData.fn.defineEntityLocationModal);
        $(document.body).on('click', '.select-coords-modal', cdData.fn.defineCoordsModal);
    };
})(jQuery);
