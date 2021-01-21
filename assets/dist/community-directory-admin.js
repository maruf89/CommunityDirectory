/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Admin/Scripts/index.ts":
/*!************************************!*\
  !*** ./src/Admin/Scripts/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var Admin_views_modals_modals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Admin/views/modals/modals */ "./src/Admin/views/modals/modals.ts");
/* harmony import */ var Admin_Settings_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Admin/Settings/settings */ "./src/Admin/Settings/settings.ts");
/* harmony import */ var _index_styl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.styl */ "./src/Admin/Scripts/index.styl");
/* harmony import */ var Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Scripts/OfferNeed/ProductServiceType */ "./src/Scripts/OfferNeed/ProductServiceType.ts");




var onBodyLoaded = document.body.onload;
document.body.onload = function (ev) {
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    if (onBodyLoaded && onBodyLoaded !== document.body.onload)
        onBodyLoaded.call(this, ev);
    var $ = jQuery;
    $('.enable-on-load').removeClass('disabled enable-on-load');
    (0,Admin_views_modals_modals__WEBPACK_IMPORTED_MODULE_0__.default)($);
    (0,Admin_Settings_settings__WEBPACK_IMPORTED_MODULE_1__.default)($);
    if (Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_3__.isOfPostPage())
        Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_3__.breadcrumbProductServices();
};


/***/ }),

/***/ "./src/Admin/Settings/settings.ts":
/*!****************************************!*\
  !*** ./src/Admin/Settings/settings.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
var $;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(_$) {
    $ = _$;
    if (!$('body.toplevel_page_community-directory').length)
        return;
    editLocationTable($('.edit-locations-table'));
}
function editLocationTable($table) {
    var $form = $('#mainform');
    var newFieldId = 1;
    $('.table-add').on('click', function () {
        var cloneId = newFieldId++;
        var $clone = $table.find('tr.hide').clone(true).removeClass('hide table-line');
        $clone.find('.edit-field').each(function (index, el) {
            el.name = el.name.substr(0, el.name.length - 1) + cloneId + ']';
            if ($(el).hasClass('edit-status'))
                $(el).addClass('changed');
        });
        $table.append($clone);
        $clone.find('.edit-name').trigger('focus');
    });
    $('.table-remove').on('click', function () {
        if (!confirm(cdData.translations.deleteLocation))
            return;
        var locId = $(this).closest('tr')[0].dataset.locationId;
        var data = {
            location_id: locId,
            action: 'location_delete',
        };
        var $this = this;
        $.post(cdData.ajaxUrl, data, function (response, result) {
            if (result == 'success') {
                $($this).closest('tr').detach();
                alert(response);
            }
        });
    });
    $table.on('change', '.edit-name', {}, function (e) {
        var hasChanged = e.target.dataset.originalValue != e.target.value;
        $(this).toggleClass('changed', hasChanged);
    });
    $table.on('change', '.edit-status', function (e) {
        var hasChanged = e.target.dataset.originalValue != e.target.value;
        $(this).toggleClass('changed', hasChanged);
    });
    function submit(e) {
        e.originalEvent.preventDefault();
        $table.find('.edit-field:not(.changed)').detach();
        $form.off('submit', submit).trigger('submit');
    }
    $form.on('submit', submit);
}
;


/***/ }),

/***/ "./src/Admin/views/modals/modals.ts":
/*!******************************************!*\
  !*** ./src/Admin/views/modals/modals.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "defineEntityLocationModal": () => /* binding */ defineEntityLocationModal,
/* harmony export */   "defineCoordsModal": () => /* binding */ defineCoordsModal
/* harmony export */ });
/* harmony import */ var ThirdParty_leaflet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ThirdParty/leaflet.ts */ "./src/Scripts/ThirdParty/leaflet.ts");
/* harmony import */ var Scripts_rest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Scripts/rest */ "./src/Scripts/rest.ts");


var $;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(_$) {
    $ = _$;
    if (!$('body.toplevel_page_community-directory').length)
        return;
    $(document.body).on('click', '.select-location-modal', defineEntityLocationModal);
    $(document.body).on('click', '.select-coords-modal', defineCoordsModal);
}
var defineEntityLocationModal = function (event) {
    var target = event.target;
    var entityId = +target.dataset.entityId;
    var $modal = $('#modalLocationList');
    var $columnWrapper = $('#' + target.dataset.columnId);
    var $select = $modal.find('#modalLocationSelectField');
    var $save = $modal.find('.submit');
    if (!$modal[0])
        alert('#modalLocationList must be present in the markup');
    if (!$select.hasClass('loaded'))
        (0,Scripts_rest__WEBPACK_IMPORTED_MODULE_1__.getLocations)().then(function (locations) {
            locations.forEach(function (loc) {
                $select.append('<option value="' + loc.id + '">' + loc.display_name + '</option>');
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
        if ($(this).hasClass('disabled'))
            return;
        Scripts_rest__WEBPACK_IMPORTED_MODULE_1__.update.entity.updateLocation(entityId, +$select[0].value)
            .then(function () {
            $columnWrapper.empty();
            $columnWrapper[0].innerHTML = $select[0].options[$select[0].value].innerText;
            tb_remove();
            $modal.off('click', '.submit', onSubmit);
        });
    };
    $modal.on('click', '.submit', onSubmit);
};
var defineCoordsModal = function (event) {
    var $modal = $('#modalMap');
    if (!$modal[0])
        alert('#modalMap must be present in the markup');
    var buttonTriggerer = event.target;
    var data = buttonTriggerer.dataset;
    var locationId = +data.locationId;
    var $map = $modal.find('#modalLocationMap');
    var coords = data.coords ? data.coords.split(',').map(function (str) { return +str; }) : cdData.map.defaultCoords;
    var editMap = data.columnEdit == 'true';
    var popup = editMap && L.popup();
    var mapId = $modal.find('.map')[0].id;
    var hasInitiated = $map.hasClass('loaded');
    var map = hasInitiated ? ThirdParty_leaflet_ts__WEBPACK_IMPORTED_MODULE_0__.mapInstances[0] : L.map(mapId, {
        center: coords,
        zoom: 13
    });
    var addMarker = function (coords) {
        map.setView(coords, 13);
        var marker = L.marker(coords);
        map.data.markers.push(marker);
        marker.addTo(map);
    };
    var closePopup = function () {
        map.closePopup();
    };
    var onSubmit = function () {
        Scripts_rest__WEBPACK_IMPORTED_MODULE_1__.update.location.updateCoords(locationId, coords[0], coords[1])
            .then(function (success) {
            if (success) {
                closePopup();
                addMarker(coords);
                buttonTriggerer.innerText = cdData.translations.viewOnMap;
                return;
            }
            alert('There was an error saving the coordinates.');
        });
    };
    var reset = function () {
        for (var i = map.data.markers.length - 1; i >= 0; i--)
            map.data.markers.pop().remove();
        map.closePopup();
        map.setView(cdData.map.defaultCoords, 13);
        map.off('click');
    };
    if (!hasInitiated) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + cdData.map.accessToken, {
            maxZoom: 18,
            attribution: ThirdParty_leaflet_ts__WEBPACK_IMPORTED_MODULE_0__.MB_ATTR,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);
        map.data = {
            markers: []
        };
        $modal.on('click', '.submit-yes', onSubmit).on('click', '.submit-no', closePopup);
        var old_tb_remove = window.tb_remove;
        window.tb_remove = function (e) {
            if (e && e.target !== e.currentTarget)
                return true;
            old_tb_remove();
            reset();
        };
        $('#TB_overlay, #TB_window').off('click').on('click', window.tb_remove);
        $map.addClass('loaded');
        hasInitiated = true;
    }
    if (data.coords && !editMap)
        addMarker(coords);
    if (editMap) {
        map.on('click', function (e) {
            coords = [e.latlng.lat, e.latlng.lng];
            popup
                .setLatLng(e.latlng)
                .setContent("Set this place as the center?<br /><a class='submit-yes button-primary'>Yes</a><a class='button submit-no'>No</a>")
                .openOn(e.target);
            e.target.setView(e.latlng);
        });
    }
};


/***/ }),

/***/ "./src/Scripts/Helper/debounce.ts":
/*!****************************************!*\
  !*** ./src/Scripts/Helper/debounce.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ debounce
/* harmony export */ });
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
;


/***/ }),

/***/ "./src/Scripts/OfferNeed/ProductServiceType.ts":
/*!*****************************************************!*\
  !*** ./src/Scripts/OfferNeed/ProductServiceType.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isOfPostPage": () => /* binding */ isOfPostPage,
/* harmony export */   "classNames": () => /* binding */ classNames,
/* harmony export */   "breadcrumbProductServices": () => /* binding */ breadcrumbProductServices
/* harmony export */ });
/* harmony import */ var Scripts_Helper_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Scripts/Helper/debounce */ "./src/Scripts/Helper/debounce.ts");

function isOfPostPage() {
    return /post-(new-)?php/.test(document.body.className) &&
        (new RegExp("post-type-" + cdData.postType.offersNeeds)).test(document.body.className);
}
var classNames = {
    listParent: 'ps-parent',
    opened: 'opened',
};
function breadcrumbProductServices() {
    var containerId = cdData.taxonomyType.productService;
    var $container = jQuery("#" + containerId + "checklist");
    if (!$container.length)
        return;
    $container.children('li').each(applyChildBreadcrumb);
    $container.on('click', "." + classNames.listParent, (0,Scripts_Helper_debounce__WEBPACK_IMPORTED_MODULE_0__.default)(function (event) {
        var ct = jQuery(event.currentTarget);
        ct.toggleClass(classNames.opened, !ct.hasClass(classNames.opened));
    }, 250, true));
}
function applyChildBreadcrumb(index, possibleParent) {
    var $parent = jQuery(possibleParent);
    var $children = $parent.children('.children').children('li');
    if (!$children.length)
        return;
    $parent.addClass(classNames.listParent);
    $children.each(applyChildBreadcrumb);
}


/***/ }),

/***/ "./src/Scripts/ThirdParty/leaflet.ts":
/*!*******************************************!*\
  !*** ./src/Scripts/ThirdParty/leaflet.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MB_ATTR": () => /* binding */ MB_ATTR,
/* harmony export */   "MB_URL": () => /* binding */ MB_URL,
/* harmony export */   "OSM_URL": () => /* binding */ OSM_URL,
/* harmony export */   "OSM_ATTRIB": () => /* binding */ OSM_ATTRIB,
/* harmony export */   "LEAFLET_LOADED": () => /* binding */ LEAFLET_LOADED,
/* harmony export */   "elMarker": () => /* binding */ elMarker,
/* harmony export */   "mapInstances": () => /* binding */ mapInstances,
/* harmony export */   "mapboxUrl": () => /* binding */ mapboxUrl
/* harmony export */ });
var MB_ATTR = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var MB_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + 'ACCESS_TOKEN';
var OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var LEAFLET_LOADED = !!window.L;
var elMarker = L.Marker.extend({
    options: {
        data: {
            el: 'attach an element'
        }
    }
});
var mapInstances = [];
var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + cdData.map.accessToken;
if (LEAFLET_LOADED) {
    L.Map.addInitHook(function () {
        mapInstances.push(this);
    });
}


/***/ }),

/***/ "./src/Scripts/rest.ts":
/*!*****************************!*\
  !*** ./src/Scripts/rest.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLocations": () => /* binding */ getLocations,
/* harmony export */   "getEntities": () => /* binding */ getEntities,
/* harmony export */   "update": () => /* binding */ update
/* harmony export */ });
var cache = {
    locations: null,
    entities: null,
};
var getLocations = function () {
    var cached = cache.locations;
    return cached ? jQuery.when(cached) : jQuery.ajax({
        type: 'GET',
        url: cdData.restBase + 'location/get',
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', cdData.wp_nonce);
        },
        success: function (response) {
            cache.locations = response;
            return response;
        },
        dataType: 'json'
    });
};
var getEntities = function () {
    return jQuery.get(cdData.restBase + cdData.postType.entity);
};
var update = {
    entity: {
        updateLocation: function (entityId, locationId) {
            return jQuery.ajax({
                type: 'POST',
                url: cdData.restBase + 'entity/update-entity',
                data: {
                    entity: entityId,
                    location_id: locationId,
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', cdData.wp_nonce);
                },
                dataType: 'json'
            });
        }
    },
    location: {
        updateCoords: function (locationId, lat, lon) {
            return jQuery.ajax({
                type: 'POST',
                url: cdData.restBase + 'location/update-coords',
                data: {
                    location_id: locationId,
                    lat: lat, lon: lon
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', cdData.wp_nonce);
                },
                dataType: 'json'
            });
        }
    }
};


/***/ }),

/***/ "./src/Admin/Scripts/index.styl":
/*!**************************************!*\
  !*** ./src/Admin/Scripts/index.styl ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/Admin/Scripts/index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvSGVscGVyL2RlYm91bmNlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL09mZmVyTmVlZC9Qcm9kdWN0U2VydmljZVR5cGUudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvVGhpcmRQYXJ0eS9sZWFmbGV0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL3Jlc3QudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFtRDtBQUNBO0FBQzdCO0FBQzhDO0FBRXBFLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxJ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V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbW11bml0eS1kaXJlY3RvcnktYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5pdE1vZGFscyBmcm9tICdBZG1pbi92aWV3cy9tb2RhbHMvbW9kYWxzJztcbmltcG9ydCBpbml0U2V0dGluZ3MgZnJvbSAnQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MnO1xuaW1wb3J0ICcuL2luZGV4LnN0eWwnO1xuaW1wb3J0ICogYXMgU2VydmljZVR5cGUgZnJvbSAnU2NyaXB0cy9PZmZlck5lZWQvUHJvZHVjdFNlcnZpY2VUeXBlJztcblxudmFyIG9uQm9keUxvYWRlZCA9IGRvY3VtZW50LmJvZHkub25sb2FkO1xuZG9jdW1lbnQuYm9keS5vbmxvYWQgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzID0gWytjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMF0sICtjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMV1dO1xuICAgIFxuICAgIGlmICggb25Cb2R5TG9hZGVkICYmIG9uQm9keUxvYWRlZCAhPT0gZG9jdW1lbnQuYm9keS5vbmxvYWQgKSBvbkJvZHlMb2FkZWQuY2FsbCh0aGlzLCBldik7XG4gICAgY29uc3QgJCA9IGpRdWVyeTtcblxuICAgIC8vIENlcnRhaW4gYnV0dG9ucyBtYXkgYmUgZGlzYWJsZWQgdW50aWwgbG9hZFxuICAgICQoJy5lbmFibGUtb24tbG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBlbmFibGUtb24tbG9hZCcpO1xuXG4gICAgaW5pdE1vZGFscygkKTtcbiAgICBpbml0U2V0dGluZ3MoJCk7ICAgIFxuICAgIGlmIChTZXJ2aWNlVHlwZS5pc09mUG9zdFBhZ2UoKSkgU2VydmljZVR5cGUuYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcygpO1xufTsiLCJsZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGlmICghJCgnYm9keS50b3BsZXZlbF9wYWdlX2NvbW11bml0eS1kaXJlY3RvcnknKS5sZW5ndGgpIHJldHVybjtcblxuICAgIGVkaXRMb2NhdGlvblRhYmxlKCAkKCcuZWRpdC1sb2NhdGlvbnMtdGFibGUnKSApO1xufVxuXG5mdW5jdGlvbiBlZGl0TG9jYXRpb25UYWJsZSAoJHRhYmxlOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCAkZm9ybTpKUXVlcnk8SFRNTEVsZW1lbnQ+ID0gJCgnI21haW5mb3JtJyk7XG4gICAgbGV0IG5ld0ZpZWxkSWQ6bnVtYmVyID0gMTtcbiAgICBcbiAgICAkKCcudGFibGUtYWRkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjbG9uZUlkOm51bWJlciA9IG5ld0ZpZWxkSWQrKztcbiAgICAgICAgY29uc3QgJGNsb25lID0gJHRhYmxlLmZpbmQoJ3RyLmhpZGUnKS5jbG9uZSh0cnVlKS5yZW1vdmVDbGFzcygnaGlkZSB0YWJsZS1saW5lJyk7XG4gICAgICAgICRjbG9uZS5maW5kKCcuZWRpdC1maWVsZCcpLmVhY2goZnVuY3Rpb24gKGluZGV4Om51bWJlciwgZWw6SFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICAgICAgZWwubmFtZSA9IGVsLm5hbWUuc3Vic3RyKDAsIGVsLm5hbWUubGVuZ3RoIC0gMSkgKyBjbG9uZUlkICsgJ10nO1xuXG4gICAgICAgICAgICAvLyBNdXN0IGFkZCBjaGFuZ2VkIHRvIG5ldyBzdGF0dXMgZmllbGQgc28gaXQgZ2V0cyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGlmICgkKGVsKS5oYXNDbGFzcygnZWRpdC1zdGF0dXMnKSkgJChlbCkuYWRkQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICR0YWJsZS5hcHBlbmQoJGNsb25lKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LW5hbWUnKS50cmlnZ2VyKCdmb2N1cycpO1xuICAgIH0pO1xuXG4gICAgLy8gRGVsZXRlcyBsb2NhdGlvbnMgdmlhIGFqYXhcbiAgICAkKCcudGFibGUtcmVtb3ZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCFjb25maXJtKGNkRGF0YS50cmFuc2xhdGlvbnMuZGVsZXRlTG9jYXRpb24pKSByZXR1cm47XG5cbiAgICB2YXIgbG9jSWQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJylbMF0uZGF0YXNldC5sb2NhdGlvbklkO1xuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxvY2F0aW9uX2lkOiBsb2NJZCxcbiAgICAgICAgYWN0aW9uOiAnbG9jYXRpb25fZGVsZXRlJyxcbiAgICB9O1xuXG4gICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICQucG9zdChjZERhdGEuYWpheFVybCwgZGF0YSxcbiAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkKCR0aGlzKS5jbG9zZXN0KCd0cicpLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkdGFibGUub24oJ2NoYW5nZScsICcuZWRpdC1uYW1lJywge30sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIEFkZCBjaGFuZ2VkIGNsYXNzIGlmIG5ldyB0ZXh0IGRvZXNuJ3QgbWF0Y2ggb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LXN0YXR1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBoYXNDaGFuZ2VkID0gZS50YXJnZXQuZGF0YXNldC5vcmlnaW5hbFZhbHVlICE9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjaGFuZ2VkJywgaGFzQ2hhbmdlZCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzdWJtaXQgKGUpIHtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gRGV0YWNoIGFsbCB1bmNoYW5nZWQgZmllbGRzXG4gICAgICAgICR0YWJsZS5maW5kKCcuZWRpdC1maWVsZDpub3QoLmNoYW5nZWQpJykuZGV0YWNoKCk7XG5cbiAgICAgICAgJGZvcm0ub2ZmKCdzdWJtaXQnLCBzdWJtaXQpLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgIH1cbiAgICBcbiAgICAkZm9ybS5vbignc3VibWl0Jywgc3VibWl0KTtcbn07IiwiaW1wb3J0IHsgbWFwSW5zdGFuY2VzLCBNQl9BVFRSIH0gZnJvbSAnVGhpcmRQYXJ0eS9sZWFmbGV0LnRzJztcbmltcG9ydCB7IGdldExvY2F0aW9ucywgdXBkYXRlIH0gZnJvbSAnU2NyaXB0cy9yZXN0JztcblxubGV0ICQ6SlF1ZXJ5U3RhdGljO1xuXG5kZWNsYXJlIGNvbnN0IEw6YW55O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfJDpKUXVlcnlTdGF0aWMpIHtcbiAgICAkID0gXyQ7XG5cbiAgICBpZiAoISQoJ2JvZHkudG9wbGV2ZWxfcGFnZV9jb21tdW5pdHktZGlyZWN0b3J5JykubGVuZ3RoKSByZXR1cm47XG5cbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcuc2VsZWN0LWxvY2F0aW9uLW1vZGFsJywgZGVmaW5lRW50aXR5TG9jYXRpb25Nb2RhbCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCAnLnNlbGVjdC1jb29yZHMtbW9kYWwnLCBkZWZpbmVDb29yZHNNb2RhbCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVFbnRpdHlMb2NhdGlvbk1vZGFsID0gZnVuY3Rpb24gKCBldmVudDpFdmVudCApIHtcbiAgICBjb25zdCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgZW50aXR5SWQgPSArdGFyZ2V0LmRhdGFzZXQuZW50aXR5SWQ7XG4gICAgY29uc3QgJG1vZGFsID0gJCgnI21vZGFsTG9jYXRpb25MaXN0Jyk7XG4gICAgY29uc3QgJGNvbHVtbldyYXBwZXIgPSAkKCcjJyArIHRhcmdldC5kYXRhc2V0LmNvbHVtbklkKTtcbiAgICBjb25zdCAkc2VsZWN0OmFueSA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvblNlbGVjdEZpZWxkJyk7XG4gICAgY29uc3QgJHNhdmUgPSAkbW9kYWwuZmluZCgnLnN1Ym1pdCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbExvY2F0aW9uTGlzdCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuXG4gICAgaWYgKCEkc2VsZWN0Lmhhc0NsYXNzKCdsb2FkZWQnKSlcbiAgICAgICAgZ2V0TG9jYXRpb25zKCkudGhlbihmdW5jdGlvbiAobG9jYXRpb25zKSB7XG4gICAgICAgICAgICBsb2NhdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24gKGxvYykge1xuICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKCc8b3B0aW9uIHZhbHVlPVwiJytsb2MuaWQrJ1wiPicrbG9jLmRpc3BsYXlfbmFtZSsnPC9vcHRpb24+Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzZWxlY3QuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuICAgICAgICB9KTtcbiAgICBlbHNlIHtcbiAgICAgICAgJHNhdmUudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICRzZWxlY3RbMF0udmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAkc2VsZWN0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzYXZlLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcsICF0aGlzLnZhbHVlKTtcbiAgICB9KTtcblxuICAgIHZhciBvblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHJldHVybjtcblxuICAgICAgICB1cGRhdGUuZW50aXR5LnVwZGF0ZUxvY2F0aW9uKGVudGl0eUlkLCArJHNlbGVjdFswXS52YWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXIuZW1wdHkoKTtcbiAgICAgICAgICAgICRjb2x1bW5XcmFwcGVyWzBdLmlubmVySFRNTCA9ICRzZWxlY3RbMF0ub3B0aW9uc1skc2VsZWN0WzBdLnZhbHVlXS5pbm5lclRleHQ7XG4gICAgICAgICAgICB0Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgICRtb2RhbC5vZmYoJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkbW9kYWwub24oJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVDb29yZHNNb2RhbCA9IGZ1bmN0aW9uICggZXZlbnQ6RXZlbnQgKSB7XG4gICAgdmFyICRtb2RhbCA9ICQoJyNtb2RhbE1hcCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbE1hcCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuICAgIFxuICAgIHZhciBidXR0b25UcmlnZ2VyZXI6SFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgdmFyIGRhdGEgPSBidXR0b25UcmlnZ2VyZXIuZGF0YXNldDtcbiAgICB2YXIgbG9jYXRpb25JZCA9ICtkYXRhLmxvY2F0aW9uSWQ7XG4gICAgdmFyICRtYXAgPSAkbW9kYWwuZmluZCgnI21vZGFsTG9jYXRpb25NYXAnKTtcbiAgICBcbiAgICAvLyBVc2UgcGFzc2VkIGluIGNvb3JkcyBvciBkZWZhdWx0IGNvb3Jkc1xuICAgIHZhciBjb29yZHMgPSBkYXRhLmNvb3JkcyA/IGRhdGEuY29vcmRzLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuICtzdHI7IH0pIDogY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzO1xuXG4gICAgdmFyIGVkaXRNYXAgPSBkYXRhLmNvbHVtbkVkaXQgPT0gJ3RydWUnOyAgICAgICAgXG4gICAgdmFyIHBvcHVwID0gZWRpdE1hcCAmJiBMLnBvcHVwKCk7XG4gICAgdmFyIG1hcElkID0gJG1vZGFsLmZpbmQoJy5tYXAnKVswXS5pZDtcbiAgICB2YXIgaGFzSW5pdGlhdGVkID0gJG1hcC5oYXNDbGFzcygnbG9hZGVkJyk7XG4gICAgdmFyIG1hcCA9IGhhc0luaXRpYXRlZCA/IG1hcEluc3RhbmNlc1swXSA6IEwubWFwKG1hcElkLCB7XG4gICAgICAgIGNlbnRlcjogY29vcmRzLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZE1hcmtlciA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICAgICAgbWFwLnNldFZpZXcoY29vcmRzLCAxMyk7XG4gICAgICAgIHZhciBtYXJrZXIgPSBMLm1hcmtlcihjb29yZHMpO1xuICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgbWFya2VyLmFkZFRvKG1hcCk7XG4gICAgfVxuXG4gICAgdmFyIGNsb3NlUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgfVxuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGUubG9jYXRpb24udXBkYXRlQ29vcmRzKGxvY2F0aW9uSWQsIGNvb3Jkc1swXSwgY29vcmRzWzFdKVxuICAgICAgICAudGhlbihzdWNjZXNzID0+IHtcbiAgICAgICAgICAgIGlmICggc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICBjbG9zZVBvcHVwKCk7XG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKGNvb3Jkcyk7XG4gICAgICAgICAgICAgICAgYnV0dG9uVHJpZ2dlcmVyLmlubmVyVGV4dCA9IGNkRGF0YS50cmFuc2xhdGlvbnMudmlld09uTWFwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsZXJ0KCdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRoZSBjb29yZGluYXRlcy4nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGVhY2ggbWFya2VyXG4gICAgICAgIGZvciAobGV0IGkgPSBtYXAuZGF0YS5tYXJrZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgbWFwLmRhdGEubWFya2Vycy5wb3AoKS5yZW1vdmUoKTtcblxuICAgICAgICBtYXAuY2xvc2VQb3B1cCgpO1xuICAgICAgICAvLyBSZXNldCBjZW50ZXIgdG8gZGVmYXVsdFxuICAgICAgICBtYXAuc2V0VmlldyhjZERhdGEubWFwLmRlZmF1bHRDb29yZHMsIDEzKTtcbiAgICAgICAgLy8gUmVtb3ZlIGxpc3RlbmVyc1xuICAgICAgICBtYXAub2ZmKCdjbGljaycpO1xuICAgIH1cblxuICAgIC8vIElmIGZpcnN0IHRpbWUgbG9hZGluZywgaW5pdGlhdGUgdGhlIG1hcCBhbmQgYmluZCBhbGwgbGlzdGVuZXJzXG4gICAgaWYgKCFoYXNJbml0aWF0ZWQpIHtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyBjZERhdGEubWFwLmFjY2Vzc1Rva2VuLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBNQl9BVFRSLFxuICAgICAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12MTEnLFxuICAgICAgICAgICAgdGlsZVNpemU6IDUxMixcbiAgICAgICAgICAgIHpvb21PZmZzZXQ6IC0xLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIG1hcC5kYXRhID0ge1xuICAgICAgICAgICAgbWFya2VyczogW11cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIExpc3RlbmVyIHRvIHNhdmUgY29vcmRzIHRvIERCXG4gICAgICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdC15ZXMnLCBvblN1Ym1pdCkub24oJ2NsaWNrJywgJy5zdWJtaXQtbm8nLCBjbG9zZVBvcHVwKTtcblxuICAgICAgICAvLyBPdmVycmlkZSB0aGUgdGhlIHRoaWNrYm94IG1vZGFsIGNsb3NlIGxpc3RlbmVyc1xuICAgICAgICB2YXIgb2xkX3RiX3JlbW92ZSA9IHdpbmRvdy50Yl9yZW1vdmU7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnRiX3JlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIG9sZF90Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI1RCX292ZXJsYXksICNUQl93aW5kb3cnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgd2luZG93LnRiX3JlbW92ZSk7XG5cbiAgICAgICAgJG1hcC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIGhhc0luaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY29vcmRzICYmICFlZGl0TWFwKSBhZGRNYXJrZXIoY29vcmRzKTtcblxuICAgIGlmIChlZGl0TWFwKSB7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29vcmRzID0gW2UubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nXTtcbiAgICAgICAgICAgIHBvcHVwXG4gICAgICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgICAgICAuc2V0Q29udGVudChcIlNldCB0aGlzIHBsYWNlIGFzIHRoZSBjZW50ZXI/PGJyIC8+PGEgY2xhc3M9J3N1Ym1pdC15ZXMgYnV0dG9uLXByaW1hcnknPlllczwvYT48YSBjbGFzcz0nYnV0dG9uIHN1Ym1pdC1ubyc+Tm88L2E+XCIpXG4gICAgICAgICAgICAgICAgLm9wZW5PbihlLnRhcmdldCk7XG4gICAgICAgICAgICBlLnRhcmdldC5zZXRWaWV3KGUubGF0bG5nKVxuICAgICAgICB9KTtcbiAgICB9XG59OyIsIi8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3Rcbi8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3Jcbi8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHR2YXIgdGltZW91dDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTsiLCJpbXBvcnQgZGVib3VuY2UgZnJvbSAnU2NyaXB0cy9IZWxwZXIvZGVib3VuY2UnO1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvbiBhbiBPZmZlcnNOZWVkcyBwb3N0IHR5cGUgcGFnZSAobmV3IHBvc3Qgb3IgZWRpdCBwb3N0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPZlBvc3RQYWdlKCk6Ym9vbGVhbiB7XG4gICAgcmV0dXJuIC9wb3N0LShuZXctKT9waHAvLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpICYmXG4gICAgICAgICAgIChuZXcgUmVnRXhwKGBwb3N0LXR5cGUtJHtjZERhdGEucG9zdFR5cGUub2ZmZXJzTmVlZHN9YCkpLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgY2xhc3NOYW1lcyA9IHtcbiAgICBsaXN0UGFyZW50OiAncHMtcGFyZW50JyxcbiAgICBvcGVuZWQ6ICdvcGVuZWQnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJyZWFkY3J1bWJQcm9kdWN0U2VydmljZXMoKSB7XG4gICAgY29uc3QgY29udGFpbmVySWQgPSBjZERhdGEudGF4b25vbXlUeXBlLnByb2R1Y3RTZXJ2aWNlO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBqUXVlcnkoYCMke2NvbnRhaW5lcklkfWNoZWNrbGlzdGApO1xuICAgIGlmICghJGNvbnRhaW5lci5sZW5ndGgpIHJldHVybjtcblxuICAgICRjb250YWluZXIuY2hpbGRyZW4oJ2xpJykuZWFjaChhcHBseUNoaWxkQnJlYWRjcnVtYik7XG5cbiAgICAkY29udGFpbmVyLm9uKCdjbGljaycsIGAuJHtjbGFzc05hbWVzLmxpc3RQYXJlbnR9YCwgZGVib3VuY2UoKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN0ID0galF1ZXJ5KGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjdC50b2dnbGVDbGFzcyhjbGFzc05hbWVzLm9wZW5lZCwgIWN0Lmhhc0NsYXNzKGNsYXNzTmFtZXMub3BlbmVkKSk7XG4gICAgfSwgMjUwLCB0cnVlKSk7XG4gICAgXG59XG5cbmZ1bmN0aW9uIGFwcGx5Q2hpbGRCcmVhZGNydW1iKGluZGV4LCBwb3NzaWJsZVBhcmVudCkge1xuICAgIGNvbnN0ICRwYXJlbnQgPSBqUXVlcnkocG9zc2libGVQYXJlbnQpO1xuICAgIGNvbnN0ICRjaGlsZHJlbiA9ICRwYXJlbnQuY2hpbGRyZW4oJy5jaGlsZHJlbicpLmNoaWxkcmVuKCdsaScpO1xuICAgIGlmICghJGNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgJHBhcmVudC5hZGRDbGFzcyhjbGFzc05hbWVzLmxpc3RQYXJlbnQpO1xuXG4gICAgJGNoaWxkcmVuLmVhY2goYXBwbHlDaGlsZEJyZWFkY3J1bWIpO1xufSIsIlxuXG5leHBvcnQgY29uc3QgTUJfQVRUUiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG5cdFx0XHQnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JztcbmV4cG9ydCBjb25zdCBNQl9VUkwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArICdBQ0NFU1NfVE9LRU4nO1xuZXhwb3J0IGNvbnN0IE9TTV9VUkwgPSAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnO1xuZXhwb3J0IGNvbnN0IE9TTV9BVFRSSUIgPSAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnO1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IExFQUZMRVRfTE9BREVEID0gISF3aW5kb3cuTDtcblxuZXhwb3J0IGNvbnN0IGVsTWFya2VyID0gTC5NYXJrZXIuZXh0ZW5kKHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGVsOiAnYXR0YWNoIGFuIGVsZW1lbnQnXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG1hcEluc3RhbmNlcyA9IFtdO1xuZXhwb3J0IGNvbnN0IG1hcGJveFVybCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgY2REYXRhLm1hcC5hY2Nlc3NUb2tlbjtcblxuaWYgKCBMRUFGTEVUX0xPQURFRCApIHtcbiAgICBMLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcEluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgIH0pO1xufSIsIlxuY29uc3QgY2FjaGUgPSB7XG4gICAgbG9jYXRpb25zOiBudWxsLFxuICAgIGVudGl0aWVzOiBudWxsLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0TG9jYXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNhY2hlZCA9IGNhY2hlLmxvY2F0aW9ucztcbiAgICByZXR1cm4gY2FjaGVkID8galF1ZXJ5LndoZW4oY2FjaGVkKSA6IGpRdWVyeS5hamF4KHtcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2xvY2F0aW9uL2dldCcgLFxuICAgICAgICBkYXRhOiB7ICB9LFxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIGNkRGF0YS53cF9ub25jZSApO1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlc3BvbnNlICkge1xuICAgICAgICAgICAgY2FjaGUubG9jYXRpb25zID0gcmVzcG9uc2U7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRFbnRpdGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4galF1ZXJ5LmdldCggY2REYXRhLnJlc3RCYXNlICsgY2REYXRhLnBvc3RUeXBlLmVudGl0eSApO1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZSA9IHtcbiAgICBlbnRpdHk6IHtcbiAgICAgICAgdXBkYXRlTG9jYXRpb246IChlbnRpdHlJZDpudW1iZXIsIGxvY2F0aW9uSWQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2VudGl0eS91cGRhdGUtZW50aXR5JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogZW50aXR5SWQsXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uX2lkOiBsb2NhdGlvbklkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIGNkRGF0YS53cF9ub25jZSApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgICAgdXBkYXRlQ29vcmRzOiAobG9jYXRpb25JZDpudW1iZXIsIGxhdDpudW1iZXIsIGxvbjpudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2xvY2F0aW9uL3VwZGF0ZS1jb29yZHMnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25faWQ6IGxvY2F0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgIGxhdCwgbG9uXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9BZG1pbi9TY3JpcHRzL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==