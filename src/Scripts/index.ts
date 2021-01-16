import './index.styl';
import locationInit from 'views/location/location';

(function ($) {
    // ts-ignore
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    $(() => {
        locationInit($);
    })
})(jQuery);