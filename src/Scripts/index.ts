import './index.styl';
import mapInit from 'views/map/map';

(function ($) {
    // ts-ignore
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    $(() => {
        mapInit($);
    })
})(jQuery);