
const cache = {
    locations: null,
    entities: null,
}

export const getLocations = function () {
    const cached = cache.locations;
    return cached ? jQuery.when(cached) : jQuery.ajax({
        type: 'GET',
        url: cdData.restBase + 'location/get' ,
        data: {  },
        beforeSend: function ( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce', cdData.wp_nonce );
        },
        success: function ( response ) {
            cache.locations = response;
            return response;
        },
        dataType: 'json'
    });
};

export const getEntities = function () {
    return jQuery.get( cdData.restBase + cdData.postType.entity );
};