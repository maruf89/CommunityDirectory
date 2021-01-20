import './index.styl';
import mapInit from 'views/map/map';
import * as ServiceType from 'Scripts/OfferNeed/ProductServiceType';

(function ($) {
    // ts-ignore
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    $(() => {
        mapInit($);
        if (ServiceType.isOfPostPage()) ServiceType.breadcrumbProductServices();
    })
})(jQuery);