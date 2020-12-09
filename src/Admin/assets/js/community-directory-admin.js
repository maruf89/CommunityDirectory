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
        $table.find('.edit-field:not(.changed)').detach()

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
        var setLoc = '';

        if ( !$modal[0] ) alert('#modalLocationList must be present in the markup');

        if (!$select.hasClass('locs-loaded'))
            cdData.fn.get.locations().then(function (locations) {
                locations.forEach( function (loc) {
                    $select.append('<option value="'+loc.id+'">'+loc.display_name+'</option>');
                });
                $select.addClass('locs-loaded');
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
            }).then(function (response) {
                $columnWrapper.empty();
                $columnWrapper[0].innerHTML = $select[0].options[$select[0].value].innerText;
                tb_remove();
                $modal.off('click', '.submit', onSubmit);
            });
        };

        $modal.on('click', '.submit', onSubmit);
    };

    var onBodyLoaded = document.body.onload;
    document.body.onload = function () {
        if ( onBodyLoaded && onBodyLoaded !== document.body.onload ) onBodyLoaded();

        // Certain buttons may be disabled until load
        $('.enable-on-load').removeClass('disabled enable-on-load');

        $(document.body).on('click', '.select-location-modal', cdData.fn.defineEntityLocationModal);
    };
})(jQuery);
