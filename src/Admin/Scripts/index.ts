import initModals from 'Admin/views/modals/modals';
import initSettings from 'Admin/Settings/settings';
import './index.styl';

var onBodyLoaded = document.body.onload;
document.body.onload = function (ev) {
    // @ts-ignore
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    
    if ( onBodyLoaded && onBodyLoaded !== document.body.onload ) onBodyLoaded.call(this, ev);
    const $ = jQuery;

    // Certain buttons may be disabled until load
    $('.enable-on-load').removeClass('disabled enable-on-load');

    initModals($);
    initSettings($);    
};