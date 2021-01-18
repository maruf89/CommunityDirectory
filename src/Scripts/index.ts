import './index.styl';
import locationInit from 'views/location/location';
import * as ServiceType from 'Scripts/OfferNeed/ProductServiceType';

(function ($) {
    // ts-ignore
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    $(() => {
        locationInit($);
        if (ServiceType.isOfPostPage()) ServiceType.breadcrumbProductServices();
    })
})(jQuery);