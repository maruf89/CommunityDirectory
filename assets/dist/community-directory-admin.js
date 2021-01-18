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
/* harmony export */   "mapInstances": () => /* binding */ mapInstances
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvSGVscGVyL2RlYm91bmNlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL09mZmVyTmVlZC9Qcm9kdWN0U2VydmljZVR5cGUudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvVGhpcmRQYXJ0eS9sZWFmbGV0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL3Jlc3QudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFtRDtBQUNBO0FBQzdCO0FBQzhDO0FBRXBFLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxJ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QUNBO1VBQ0EiLCJmaWxlIjoiY29tbXVuaXR5LWRpcmVjdG9yeS1hZG1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbml0TW9kYWxzIGZyb20gJ0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMnO1xuaW1wb3J0IGluaXRTZXR0aW5ncyBmcm9tICdBZG1pbi9TZXR0aW5ncy9zZXR0aW5ncyc7XG5pbXBvcnQgJy4vaW5kZXguc3R5bCc7XG5pbXBvcnQgKiBhcyBTZXJ2aWNlVHlwZSBmcm9tICdTY3JpcHRzL09mZmVyTmVlZC9Qcm9kdWN0U2VydmljZVR5cGUnO1xuXG52YXIgb25Cb2R5TG9hZGVkID0gZG9jdW1lbnQuYm9keS5vbmxvYWQ7XG5kb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGZ1bmN0aW9uIChldikge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjZERhdGEubWFwLmRlZmF1bHRDb29yZHMgPSBbK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1swXSwgK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1sxXV07XG4gICAgXG4gICAgaWYgKCBvbkJvZHlMb2FkZWQgJiYgb25Cb2R5TG9hZGVkICE9PSBkb2N1bWVudC5ib2R5Lm9ubG9hZCApIG9uQm9keUxvYWRlZC5jYWxsKHRoaXMsIGV2KTtcbiAgICBjb25zdCAkID0galF1ZXJ5O1xuXG4gICAgLy8gQ2VydGFpbiBidXR0b25zIG1heSBiZSBkaXNhYmxlZCB1bnRpbCBsb2FkXG4gICAgJCgnLmVuYWJsZS1vbi1sb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGVuYWJsZS1vbi1sb2FkJyk7XG5cbiAgICBpbml0TW9kYWxzKCQpO1xuICAgIGluaXRTZXR0aW5ncygkKTsgICAgXG4gICAgaWYgKFNlcnZpY2VUeXBlLmlzT2ZQb3N0UGFnZSgpKSBTZXJ2aWNlVHlwZS5icmVhZGNydW1iUHJvZHVjdFNlcnZpY2VzKCk7XG59OyIsImxldCAkOkpRdWVyeVN0YXRpYztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXyQ6SlF1ZXJ5U3RhdGljKSB7XG4gICAgJCA9IF8kO1xuXG4gICAgaWYgKCEkKCdib2R5LnRvcGxldmVsX3BhZ2VfY29tbXVuaXR5LWRpcmVjdG9yeScpLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgZWRpdExvY2F0aW9uVGFibGUoICQoJy5lZGl0LWxvY2F0aW9ucy10YWJsZScpICk7XG59XG5cbmZ1bmN0aW9uIGVkaXRMb2NhdGlvblRhYmxlICgkdGFibGU6SlF1ZXJ5PEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0ICRmb3JtOkpRdWVyeTxIVE1MRWxlbWVudD4gPSAkKCcjbWFpbmZvcm0nKTtcbiAgICBsZXQgbmV3RmllbGRJZDpudW1iZXIgPSAxO1xuICAgIFxuICAgICQoJy50YWJsZS1hZGQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lSWQ6bnVtYmVyID0gbmV3RmllbGRJZCsrO1xuICAgICAgICBjb25zdCAkY2xvbmUgPSAkdGFibGUuZmluZCgndHIuaGlkZScpLmNsb25lKHRydWUpLnJlbW92ZUNsYXNzKCdoaWRlIHRhYmxlLWxpbmUnKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LWZpZWxkJykuZWFjaChmdW5jdGlvbiAoaW5kZXg6bnVtYmVyLCBlbDpIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICAgICAgICBlbC5uYW1lID0gZWwubmFtZS5zdWJzdHIoMCwgZWwubmFtZS5sZW5ndGggLSAxKSArIGNsb25lSWQgKyAnXSc7XG5cbiAgICAgICAgICAgIC8vIE11c3QgYWRkIGNoYW5nZWQgdG8gbmV3IHN0YXR1cyBmaWVsZCBzbyBpdCBnZXRzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgaWYgKCQoZWwpLmhhc0NsYXNzKCdlZGl0LXN0YXR1cycpKSAkKGVsKS5hZGRDbGFzcygnY2hhbmdlZCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgJHRhYmxlLmFwcGVuZCgkY2xvbmUpO1xuICAgICAgICAkY2xvbmUuZmluZCgnLmVkaXQtbmFtZScpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICAvLyBEZWxldGVzIGxvY2F0aW9ucyB2aWEgYWpheFxuICAgICQoJy50YWJsZS1yZW1vdmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIWNvbmZpcm0oY2REYXRhLnRyYW5zbGF0aW9ucy5kZWxldGVMb2NhdGlvbikpIHJldHVybjtcblxuICAgIHZhciBsb2NJZCA9ICQodGhpcykuY2xvc2VzdCgndHInKVswXS5kYXRhc2V0LmxvY2F0aW9uSWQ7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbG9jYXRpb25faWQ6IGxvY0lkLFxuICAgICAgICBhY3Rpb246ICdsb2NhdGlvbl9kZWxldGUnLFxuICAgIH07XG5cbiAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgJC5wb3N0KGNkRGF0YS5hamF4VXJsLCBkYXRhLFxuICAgICAgICBmdW5jdGlvbihyZXNwb25zZSwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ID09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICQoJHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgYWxlcnQocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LW5hbWUnLCB7fSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gQWRkIGNoYW5nZWQgY2xhc3MgaWYgbmV3IHRleHQgZG9lc24ndCBtYXRjaCBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICB2YXIgaGFzQ2hhbmdlZCA9IGUudGFyZ2V0LmRhdGFzZXQub3JpZ2luYWxWYWx1ZSAhPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY2hhbmdlZCcsIGhhc0NoYW5nZWQpO1xuICAgIH0pO1xuXG4gICAgJHRhYmxlLm9uKCdjaGFuZ2UnLCAnLmVkaXQtc3RhdHVzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHN1Ym1pdCAoZSkge1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvLyBEZXRhY2ggYWxsIHVuY2hhbmdlZCBmaWVsZHNcbiAgICAgICAgJHRhYmxlLmZpbmQoJy5lZGl0LWZpZWxkOm5vdCguY2hhbmdlZCknKS5kZXRhY2goKTtcblxuICAgICAgICAkZm9ybS5vZmYoJ3N1Ym1pdCcsIHN1Ym1pdCkudHJpZ2dlcignc3VibWl0Jyk7XG4gICAgfVxuICAgIFxuICAgICRmb3JtLm9uKCdzdWJtaXQnLCBzdWJtaXQpO1xufTsiLCJpbXBvcnQgeyBtYXBJbnN0YW5jZXMsIE1CX0FUVFIgfSBmcm9tICdUaGlyZFBhcnR5L2xlYWZsZXQudHMnO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb25zLCB1cGRhdGUgfSBmcm9tICdTY3JpcHRzL3Jlc3QnO1xuXG5sZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmRlY2xhcmUgY29uc3QgTDphbnk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGlmICghJCgnYm9keS50b3BsZXZlbF9wYWdlX2NvbW11bml0eS1kaXJlY3RvcnknKS5sZW5ndGgpIHJldHVybjtcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy5zZWxlY3QtbG9jYXRpb24tbW9kYWwnLCBkZWZpbmVFbnRpdHlMb2NhdGlvbk1vZGFsKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcuc2VsZWN0LWNvb3Jkcy1tb2RhbCcsIGRlZmluZUNvb3Jkc01vZGFsKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmluZUVudGl0eUxvY2F0aW9uTW9kYWwgPSBmdW5jdGlvbiAoIGV2ZW50OkV2ZW50ICkge1xuICAgIGNvbnN0IHRhcmdldDpIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBlbnRpdHlJZCA9ICt0YXJnZXQuZGF0YXNldC5lbnRpdHlJZDtcbiAgICBjb25zdCAkbW9kYWwgPSAkKCcjbW9kYWxMb2NhdGlvbkxpc3QnKTtcbiAgICBjb25zdCAkY29sdW1uV3JhcHBlciA9ICQoJyMnICsgdGFyZ2V0LmRhdGFzZXQuY29sdW1uSWQpO1xuICAgIGNvbnN0ICRzZWxlY3Q6YW55ID0gJG1vZGFsLmZpbmQoJyNtb2RhbExvY2F0aW9uU2VsZWN0RmllbGQnKTtcbiAgICBjb25zdCAkc2F2ZSA9ICRtb2RhbC5maW5kKCcuc3VibWl0Jyk7XG5cbiAgICBpZiAoICEkbW9kYWxbMF0gKSBhbGVydCgnI21vZGFsTG9jYXRpb25MaXN0IG11c3QgYmUgcHJlc2VudCBpbiB0aGUgbWFya3VwJyk7XG5cbiAgICBpZiAoISRzZWxlY3QuaGFzQ2xhc3MoJ2xvYWRlZCcpKVxuICAgICAgICBnZXRMb2NhdGlvbnMoKS50aGVuKGZ1bmN0aW9uIChsb2NhdGlvbnMpIHtcbiAgICAgICAgICAgIGxvY2F0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiAobG9jKSB7XG4gICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInK2xvYy5pZCsnXCI+Jytsb2MuZGlzcGxheV9uYW1lKyc8L29wdGlvbj4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHNlbGVjdC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIH0pO1xuICAgIGVsc2Uge1xuICAgICAgICAkc2F2ZS50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgJHNlbGVjdFswXS52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgICRzZWxlY3Qub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNhdmUudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgIXRoaXMudmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkgcmV0dXJuO1xuXG4gICAgICAgIHVwZGF0ZS5lbnRpdHkudXBkYXRlTG9jYXRpb24oZW50aXR5SWQsICskc2VsZWN0WzBdLnZhbHVlKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkY29sdW1uV3JhcHBlci5lbXB0eSgpO1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXJbMF0uaW5uZXJIVE1MID0gJHNlbGVjdFswXS5vcHRpb25zWyRzZWxlY3RbMF0udmFsdWVdLmlubmVyVGV4dDtcbiAgICAgICAgICAgIHRiX3JlbW92ZSgpO1xuICAgICAgICAgICAgJG1vZGFsLm9mZignY2xpY2snLCAnLnN1Ym1pdCcsIG9uU3VibWl0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdCcsIG9uU3VibWl0KTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmluZUNvb3Jkc01vZGFsID0gZnVuY3Rpb24gKCBldmVudDpFdmVudCApIHtcbiAgICB2YXIgJG1vZGFsID0gJCgnI21vZGFsTWFwJyk7XG5cbiAgICBpZiAoICEkbW9kYWxbMF0gKSBhbGVydCgnI21vZGFsTWFwIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgbWFya3VwJyk7XG4gICAgXG4gICAgdmFyIGJ1dHRvblRyaWdnZXJlcjpIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICB2YXIgZGF0YSA9IGJ1dHRvblRyaWdnZXJlci5kYXRhc2V0O1xuICAgIHZhciBsb2NhdGlvbklkID0gK2RhdGEubG9jYXRpb25JZDtcbiAgICB2YXIgJG1hcCA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvbk1hcCcpO1xuICAgIFxuICAgIC8vIFVzZSBwYXNzZWQgaW4gY29vcmRzIG9yIGRlZmF1bHQgY29vcmRzXG4gICAgdmFyIGNvb3JkcyA9IGRhdGEuY29vcmRzID8gZGF0YS5jb29yZHMuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gK3N0cjsgfSkgOiBjZERhdGEubWFwLmRlZmF1bHRDb29yZHM7XG5cbiAgICB2YXIgZWRpdE1hcCA9IGRhdGEuY29sdW1uRWRpdCA9PSAndHJ1ZSc7ICAgICAgICBcbiAgICB2YXIgcG9wdXAgPSBlZGl0TWFwICYmIEwucG9wdXAoKTtcbiAgICB2YXIgbWFwSWQgPSAkbW9kYWwuZmluZCgnLm1hcCcpWzBdLmlkO1xuICAgIHZhciBoYXNJbml0aWF0ZWQgPSAkbWFwLmhhc0NsYXNzKCdsb2FkZWQnKTtcbiAgICB2YXIgbWFwID0gaGFzSW5pdGlhdGVkID8gbWFwSW5zdGFuY2VzWzBdIDogTC5tYXAobWFwSWQsIHtcbiAgICAgICAgY2VudGVyOiBjb29yZHMsXG4gICAgICAgIHpvb206IDEzXG4gICAgfSk7XG5cbiAgICB2YXIgYWRkTWFya2VyID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgICAgICBtYXAuc2V0Vmlldyhjb29yZHMsIDEzKTtcbiAgICAgICAgdmFyIG1hcmtlciA9IEwubWFya2VyKGNvb3Jkcyk7XG4gICAgICAgIG1hcC5kYXRhLm1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgICBtYXJrZXIuYWRkVG8obWFwKTtcbiAgICB9XG5cbiAgICB2YXIgY2xvc2VQb3B1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwLmNsb3NlUG9wdXAoKTtcbiAgICB9XG5cbiAgICB2YXIgb25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZS5sb2NhdGlvbi51cGRhdGVDb29yZHMobG9jYXRpb25JZCwgY29vcmRzWzBdLCBjb29yZHNbMV0pXG4gICAgICAgIC50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICAgICAgaWYgKCBzdWNjZXNzICkge1xuICAgICAgICAgICAgICAgIGNsb3NlUG9wdXAoKTtcbiAgICAgICAgICAgICAgICBhZGRNYXJrZXIoY29vcmRzKTtcbiAgICAgICAgICAgICAgICBidXR0b25UcmlnZ2VyZXIuaW5uZXJUZXh0ID0gY2REYXRhLnRyYW5zbGF0aW9ucy52aWV3T25NYXA7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxlcnQoJ1RoZXJlIHdhcyBhbiBlcnJvciBzYXZpbmcgdGhlIGNvb3JkaW5hdGVzLicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZW1vdmUgZWFjaCBtYXJrZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IG1hcC5kYXRhLm1hcmtlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnBvcCgpLnJlbW92ZSgpO1xuXG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgICAgIC8vIFJlc2V0IGNlbnRlciB0byBkZWZhdWx0XG4gICAgICAgIG1hcC5zZXRWaWV3KGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcywgMTMpO1xuICAgICAgICAvLyBSZW1vdmUgbGlzdGVuZXJzXG4gICAgICAgIG1hcC5vZmYoJ2NsaWNrJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgZmlyc3QgdGltZSBsb2FkaW5nLCBpbml0aWF0ZSB0aGUgbWFwIGFuZCBiaW5kIGFsbCBsaXN0ZW5lcnNcbiAgICBpZiAoIWhhc0luaXRpYXRlZCkge1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArIGNkRGF0YS5tYXAuYWNjZXNzVG9rZW4sIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246IE1CX0FUVFIsXG4gICAgICAgICAgICBpZDogJ21hcGJveC9zdHJlZXRzLXYxMScsXG4gICAgICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICAgICAgem9vbU9mZnNldDogLTEsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgbWFwLmRhdGEgPSB7XG4gICAgICAgICAgICBtYXJrZXJzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gTGlzdGVuZXIgdG8gc2F2ZSBjb29yZHMgdG8gREJcbiAgICAgICAgJG1vZGFsLm9uKCdjbGljaycsICcuc3VibWl0LXllcycsIG9uU3VibWl0KS5vbignY2xpY2snLCAnLnN1Ym1pdC1ubycsIGNsb3NlUG9wdXApO1xuXG4gICAgICAgIC8vIE92ZXJyaWRlIHRoZSB0aGUgdGhpY2tib3ggbW9kYWwgY2xvc2UgbGlzdGVuZXJzXG4gICAgICAgIHZhciBvbGRfdGJfcmVtb3ZlID0gd2luZG93LnRiX3JlbW92ZTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB3aW5kb3cudGJfcmVtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlICYmIGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgb2xkX3RiX3JlbW92ZSgpO1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjVEJfb3ZlcmxheSwgI1RCX3dpbmRvdycpLm9mZignY2xpY2snKS5vbignY2xpY2snLCB3aW5kb3cudGJfcmVtb3ZlKTtcblxuICAgICAgICAkbWFwLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgaGFzSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jb29yZHMgJiYgIWVkaXRNYXApIGFkZE1hcmtlcihjb29yZHMpO1xuXG4gICAgaWYgKGVkaXRNYXApIHtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb29yZHMgPSBbZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmddO1xuICAgICAgICAgICAgcG9wdXBcbiAgICAgICAgICAgICAgICAuc2V0TGF0TG5nKGUubGF0bG5nKVxuICAgICAgICAgICAgICAgIC5zZXRDb250ZW50KFwiU2V0IHRoaXMgcGxhY2UgYXMgdGhlIGNlbnRlcj88YnIgLz48YSBjbGFzcz0nc3VibWl0LXllcyBidXR0b24tcHJpbWFyeSc+WWVzPC9hPjxhIGNsYXNzPSdidXR0b24gc3VibWl0LW5vJz5ObzwvYT5cIilcbiAgICAgICAgICAgICAgICAub3Blbk9uKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGUudGFyZ2V0LnNldFZpZXcoZS5sYXRsbmcpXG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwiLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4vLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG5cdHZhciB0aW1lb3V0O1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9O1xuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdH07XG59OyIsImltcG9ydCBkZWJvdW5jZSBmcm9tICdTY3JpcHRzL0hlbHBlci9kZWJvdW5jZSc7XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9uIGFuIE9mZmVyc05lZWRzIHBvc3QgdHlwZSBwYWdlIChuZXcgcG9zdCBvciBlZGl0IHBvc3QpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09mUG9zdFBhZ2UoKTpib29sZWFuIHtcbiAgICByZXR1cm4gL3Bvc3QtKG5ldy0pP3BocC8udGVzdChkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSkgJiZcbiAgICAgICAgICAgKG5ldyBSZWdFeHAoYHBvc3QtdHlwZS0ke2NkRGF0YS5wb3N0VHlwZS5vZmZlcnNOZWVkc31gKSkudGVzdChkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSk7XG59XG5cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVzID0ge1xuICAgIGxpc3RQYXJlbnQ6ICdwcy1wYXJlbnQnLFxuICAgIG9wZW5lZDogJ29wZW5lZCcsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcygpIHtcbiAgICBjb25zdCBjb250YWluZXJJZCA9IGNkRGF0YS50YXhvbm9teVR5cGUucHJvZHVjdFNlcnZpY2U7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGpRdWVyeShgIyR7Y29udGFpbmVySWR9Y2hlY2tsaXN0YCk7XG4gICAgaWYgKCEkY29udGFpbmVyLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgJGNvbnRhaW5lci5jaGlsZHJlbignbGknKS5lYWNoKGFwcGx5Q2hpbGRCcmVhZGNydW1iKTtcblxuICAgICRjb250YWluZXIub24oJ2NsaWNrJywgYC4ke2NsYXNzTmFtZXMubGlzdFBhcmVudH1gLCBkZWJvdW5jZSgoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3QgPSBqUXVlcnkoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGN0LnRvZ2dsZUNsYXNzKGNsYXNzTmFtZXMub3BlbmVkLCAhY3QuaGFzQ2xhc3MoY2xhc3NOYW1lcy5vcGVuZWQpKTtcbiAgICB9LCAyNTAsIHRydWUpKTtcbiAgICBcbn1cblxuZnVuY3Rpb24gYXBwbHlDaGlsZEJyZWFkY3J1bWIoaW5kZXgsIHBvc3NpYmxlUGFyZW50KSB7XG4gICAgY29uc3QgJHBhcmVudCA9IGpRdWVyeShwb3NzaWJsZVBhcmVudCk7XG4gICAgY29uc3QgJGNoaWxkcmVuID0gJHBhcmVudC5jaGlsZHJlbignLmNoaWxkcmVuJykuY2hpbGRyZW4oJ2xpJyk7XG4gICAgaWYgKCEkY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XG5cbiAgICAkcGFyZW50LmFkZENsYXNzKGNsYXNzTmFtZXMubGlzdFBhcmVudCk7XG5cbiAgICAkY2hpbGRyZW4uZWFjaChhcHBseUNoaWxkQnJlYWRjcnVtYik7XG59IiwiXG5cbmV4cG9ydCBjb25zdCBNQl9BVFRSID0gJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcblx0XHRcdCdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nO1xuZXhwb3J0IGNvbnN0IE1CX1VSTCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgJ0FDQ0VTU19UT0tFTic7XG5leHBvcnQgY29uc3QgT1NNX1VSTCA9ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZyc7XG5leHBvcnQgY29uc3QgT1NNX0FUVFJJQiA9ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyc7XG4vLyBAdHMtaWdub3JlXG5leHBvcnQgY29uc3QgTEVBRkxFVF9MT0FERUQgPSAhIXdpbmRvdy5MO1xuXG5leHBvcnQgY29uc3QgZWxNYXJrZXIgPSBMLk1hcmtlci5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZWw6ICdhdHRhY2ggYW4gZWxlbWVudCdcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwSW5zdGFuY2VzID0gW107XG5cbmlmICggTEVBRkxFVF9MT0FERUQgKSB7XG4gICAgTC5NYXAuYWRkSW5pdEhvb2soZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXBJbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICB9KTtcbn0iLCJcbmNvbnN0IGNhY2hlID0ge1xuICAgIGxvY2F0aW9uczogbnVsbCxcbiAgICBlbnRpdGllczogbnVsbCxcbn1cblxuZXhwb3J0IGNvbnN0IGdldExvY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjYWNoZWQgPSBjYWNoZS5sb2NhdGlvbnM7XG4gICAgcmV0dXJuIGNhY2hlZCA/IGpRdWVyeS53aGVuKGNhY2hlZCkgOiBqUXVlcnkuYWpheCh7XG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICB1cmw6IGNkRGF0YS5yZXN0QmFzZSArICdsb2NhdGlvbi9nZXQnICxcbiAgICAgICAgZGF0YTogeyAgfSxcbiAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCByZXNwb25zZSApIHtcbiAgICAgICAgICAgIGNhY2hlLmxvY2F0aW9ucyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RW50aXRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGpRdWVyeS5nZXQoIGNkRGF0YS5yZXN0QmFzZSArIGNkRGF0YS5wb3N0VHlwZS5lbnRpdHkgKTtcbn07XG5cbmV4cG9ydCBjb25zdCB1cGRhdGUgPSB7XG4gICAgZW50aXR5OiB7XG4gICAgICAgIHVwZGF0ZUxvY2F0aW9uOiAoZW50aXR5SWQ6bnVtYmVyLCBsb2NhdGlvbklkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGNkRGF0YS5yZXN0QmFzZSArICdlbnRpdHkvdXBkYXRlLWVudGl0eScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6IGVudGl0eUlkLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbl9pZDogbG9jYXRpb25JZCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHVwZGF0ZUNvb3JkczogKGxvY2F0aW9uSWQ6bnVtYmVyLCBsYXQ6bnVtYmVyLCBsb246bnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGNkRGF0YS5yZXN0QmFzZSArICdsb2NhdGlvbi91cGRhdGUtY29vcmRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uX2lkOiBsb2NhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICBsYXQsIGxvblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIGNkRGF0YS53cF9ub25jZSApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=