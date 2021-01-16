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



var onBodyLoaded = document.body.onload;
document.body.onload = function (ev) {
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    if (onBodyLoaded && onBodyLoaded !== document.body.onload)
        onBodyLoaded.call(this, ev);
    var $ = jQuery;
    $('.enable-on-load').removeClass('disabled enable-on-load');
    (0,Admin_views_modals_modals__WEBPACK_IMPORTED_MODULE_0__.default)($);
    (0,Admin_Settings_settings__WEBPACK_IMPORTED_MODULE_1__.default)($);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvVGhpcmRQYXJ0eS9sZWFmbGV0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL3Jlc3QudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQW1EO0FBQ0E7QUFDN0I7QUFFdEIsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxFQUFFO0lBRS9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxD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Y3RvcnktYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5pdE1vZGFscyBmcm9tICdBZG1pbi92aWV3cy9tb2RhbHMvbW9kYWxzJztcbmltcG9ydCBpbml0U2V0dGluZ3MgZnJvbSAnQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MnO1xuaW1wb3J0ICcuL2luZGV4LnN0eWwnO1xuXG52YXIgb25Cb2R5TG9hZGVkID0gZG9jdW1lbnQuYm9keS5vbmxvYWQ7XG5kb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGZ1bmN0aW9uIChldikge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjZERhdGEubWFwLmRlZmF1bHRDb29yZHMgPSBbK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1swXSwgK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1sxXV07XG4gICAgXG4gICAgaWYgKCBvbkJvZHlMb2FkZWQgJiYgb25Cb2R5TG9hZGVkICE9PSBkb2N1bWVudC5ib2R5Lm9ubG9hZCApIG9uQm9keUxvYWRlZC5jYWxsKHRoaXMsIGV2KTtcbiAgICBjb25zdCAkID0galF1ZXJ5O1xuXG4gICAgLy8gQ2VydGFpbiBidXR0b25zIG1heSBiZSBkaXNhYmxlZCB1bnRpbCBsb2FkXG4gICAgJCgnLmVuYWJsZS1vbi1sb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGVuYWJsZS1vbi1sb2FkJyk7XG5cbiAgICBpbml0TW9kYWxzKCQpO1xuICAgIGluaXRTZXR0aW5ncygkKTsgICAgXG59OyIsImxldCAkOkpRdWVyeVN0YXRpYztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXyQ6SlF1ZXJ5U3RhdGljKSB7XG4gICAgJCA9IF8kO1xuXG4gICAgaWYgKCEkKCdib2R5LnRvcGxldmVsX3BhZ2VfY29tbXVuaXR5LWRpcmVjdG9yeScpLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgZWRpdExvY2F0aW9uVGFibGUoICQoJy5lZGl0LWxvY2F0aW9ucy10YWJsZScpICk7XG59XG5cbmZ1bmN0aW9uIGVkaXRMb2NhdGlvblRhYmxlICgkdGFibGU6SlF1ZXJ5PEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0ICRmb3JtOkpRdWVyeTxIVE1MRWxlbWVudD4gPSAkKCcjbWFpbmZvcm0nKTtcbiAgICBsZXQgbmV3RmllbGRJZDpudW1iZXIgPSAxO1xuICAgIFxuICAgICQoJy50YWJsZS1hZGQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lSWQ6bnVtYmVyID0gbmV3RmllbGRJZCsrO1xuICAgICAgICBjb25zdCAkY2xvbmUgPSAkdGFibGUuZmluZCgndHIuaGlkZScpLmNsb25lKHRydWUpLnJlbW92ZUNsYXNzKCdoaWRlIHRhYmxlLWxpbmUnKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LWZpZWxkJykuZWFjaChmdW5jdGlvbiAoaW5kZXg6bnVtYmVyLCBlbDpIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICAgICAgICBlbC5uYW1lID0gZWwubmFtZS5zdWJzdHIoMCwgZWwubmFtZS5sZW5ndGggLSAxKSArIGNsb25lSWQgKyAnXSc7XG5cbiAgICAgICAgICAgIC8vIE11c3QgYWRkIGNoYW5nZWQgdG8gbmV3IHN0YXR1cyBmaWVsZCBzbyBpdCBnZXRzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgaWYgKCQoZWwpLmhhc0NsYXNzKCdlZGl0LXN0YXR1cycpKSAkKGVsKS5hZGRDbGFzcygnY2hhbmdlZCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgJHRhYmxlLmFwcGVuZCgkY2xvbmUpO1xuICAgICAgICAkY2xvbmUuZmluZCgnLmVkaXQtbmFtZScpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICAvLyBEZWxldGVzIGxvY2F0aW9ucyB2aWEgYWpheFxuICAgICQoJy50YWJsZS1yZW1vdmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIWNvbmZpcm0oY2REYXRhLnRyYW5zbGF0aW9ucy5kZWxldGVMb2NhdGlvbikpIHJldHVybjtcblxuICAgIHZhciBsb2NJZCA9ICQodGhpcykuY2xvc2VzdCgndHInKVswXS5kYXRhc2V0LmxvY2F0aW9uSWQ7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbG9jYXRpb25faWQ6IGxvY0lkLFxuICAgICAgICBhY3Rpb246ICdsb2NhdGlvbl9kZWxldGUnLFxuICAgIH07XG5cbiAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgJC5wb3N0KGNkRGF0YS5hamF4VXJsLCBkYXRhLFxuICAgICAgICBmdW5jdGlvbihyZXNwb25zZSwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ID09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICQoJHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgYWxlcnQocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LW5hbWUnLCB7fSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gQWRkIGNoYW5nZWQgY2xhc3MgaWYgbmV3IHRleHQgZG9lc24ndCBtYXRjaCBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICB2YXIgaGFzQ2hhbmdlZCA9IGUudGFyZ2V0LmRhdGFzZXQub3JpZ2luYWxWYWx1ZSAhPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY2hhbmdlZCcsIGhhc0NoYW5nZWQpO1xuICAgIH0pO1xuXG4gICAgJHRhYmxlLm9uKCdjaGFuZ2UnLCAnLmVkaXQtc3RhdHVzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHN1Ym1pdCAoZSkge1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvLyBEZXRhY2ggYWxsIHVuY2hhbmdlZCBmaWVsZHNcbiAgICAgICAgJHRhYmxlLmZpbmQoJy5lZGl0LWZpZWxkOm5vdCguY2hhbmdlZCknKS5kZXRhY2goKTtcblxuICAgICAgICAkZm9ybS5vZmYoJ3N1Ym1pdCcsIHN1Ym1pdCkudHJpZ2dlcignc3VibWl0Jyk7XG4gICAgfVxuICAgIFxuICAgICRmb3JtLm9uKCdzdWJtaXQnLCBzdWJtaXQpO1xufTsiLCJpbXBvcnQgeyBtYXBJbnN0YW5jZXMsIE1CX0FUVFIgfSBmcm9tICdUaGlyZFBhcnR5L2xlYWZsZXQudHMnO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb25zLCB1cGRhdGUgfSBmcm9tICdTY3JpcHRzL3Jlc3QnO1xuXG5sZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmRlY2xhcmUgY29uc3QgTDphbnk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGlmICghJCgnYm9keS50b3BsZXZlbF9wYWdlX2NvbW11bml0eS1kaXJlY3RvcnknKS5sZW5ndGgpIHJldHVybjtcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy5zZWxlY3QtbG9jYXRpb24tbW9kYWwnLCBkZWZpbmVFbnRpdHlMb2NhdGlvbk1vZGFsKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcuc2VsZWN0LWNvb3Jkcy1tb2RhbCcsIGRlZmluZUNvb3Jkc01vZGFsKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmluZUVudGl0eUxvY2F0aW9uTW9kYWwgPSBmdW5jdGlvbiAoIGV2ZW50OkV2ZW50ICkge1xuICAgIGNvbnN0IHRhcmdldDpIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBlbnRpdHlJZCA9ICt0YXJnZXQuZGF0YXNldC5lbnRpdHlJZDtcbiAgICBjb25zdCAkbW9kYWwgPSAkKCcjbW9kYWxMb2NhdGlvbkxpc3QnKTtcbiAgICBjb25zdCAkY29sdW1uV3JhcHBlciA9ICQoJyMnICsgdGFyZ2V0LmRhdGFzZXQuY29sdW1uSWQpO1xuICAgIGNvbnN0ICRzZWxlY3Q6YW55ID0gJG1vZGFsLmZpbmQoJyNtb2RhbExvY2F0aW9uU2VsZWN0RmllbGQnKTtcbiAgICBjb25zdCAkc2F2ZSA9ICRtb2RhbC5maW5kKCcuc3VibWl0Jyk7XG5cbiAgICBpZiAoICEkbW9kYWxbMF0gKSBhbGVydCgnI21vZGFsTG9jYXRpb25MaXN0IG11c3QgYmUgcHJlc2VudCBpbiB0aGUgbWFya3VwJyk7XG5cbiAgICBpZiAoISRzZWxlY3QuaGFzQ2xhc3MoJ2xvYWRlZCcpKVxuICAgICAgICBnZXRMb2NhdGlvbnMoKS50aGVuKGZ1bmN0aW9uIChsb2NhdGlvbnMpIHtcbiAgICAgICAgICAgIGxvY2F0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiAobG9jKSB7XG4gICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInK2xvYy5pZCsnXCI+Jytsb2MuZGlzcGxheV9uYW1lKyc8L29wdGlvbj4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHNlbGVjdC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIH0pO1xuICAgIGVsc2Uge1xuICAgICAgICAkc2F2ZS50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgJHNlbGVjdFswXS52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgICRzZWxlY3Qub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNhdmUudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgIXRoaXMudmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkgcmV0dXJuO1xuXG4gICAgICAgIHVwZGF0ZS5lbnRpdHkudXBkYXRlTG9jYXRpb24oZW50aXR5SWQsICskc2VsZWN0WzBdLnZhbHVlKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkY29sdW1uV3JhcHBlci5lbXB0eSgpO1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXJbMF0uaW5uZXJIVE1MID0gJHNlbGVjdFswXS5vcHRpb25zWyRzZWxlY3RbMF0udmFsdWVdLmlubmVyVGV4dDtcbiAgICAgICAgICAgIHRiX3JlbW92ZSgpO1xuICAgICAgICAgICAgJG1vZGFsLm9mZignY2xpY2snLCAnLnN1Ym1pdCcsIG9uU3VibWl0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdCcsIG9uU3VibWl0KTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmluZUNvb3Jkc01vZGFsID0gZnVuY3Rpb24gKCBldmVudDpFdmVudCApIHtcbiAgICB2YXIgJG1vZGFsID0gJCgnI21vZGFsTWFwJyk7XG5cbiAgICBpZiAoICEkbW9kYWxbMF0gKSBhbGVydCgnI21vZGFsTWFwIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgbWFya3VwJyk7XG4gICAgXG4gICAgdmFyIGJ1dHRvblRyaWdnZXJlcjpIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICB2YXIgZGF0YSA9IGJ1dHRvblRyaWdnZXJlci5kYXRhc2V0O1xuICAgIHZhciBsb2NhdGlvbklkID0gK2RhdGEubG9jYXRpb25JZDtcbiAgICB2YXIgJG1hcCA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvbk1hcCcpO1xuICAgIFxuICAgIC8vIFVzZSBwYXNzZWQgaW4gY29vcmRzIG9yIGRlZmF1bHQgY29vcmRzXG4gICAgdmFyIGNvb3JkcyA9IGRhdGEuY29vcmRzID8gZGF0YS5jb29yZHMuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gK3N0cjsgfSkgOiBjZERhdGEubWFwLmRlZmF1bHRDb29yZHM7XG5cbiAgICB2YXIgZWRpdE1hcCA9IGRhdGEuY29sdW1uRWRpdCA9PSAndHJ1ZSc7ICAgICAgICBcbiAgICB2YXIgcG9wdXAgPSBlZGl0TWFwICYmIEwucG9wdXAoKTtcbiAgICB2YXIgbWFwSWQgPSAkbW9kYWwuZmluZCgnLm1hcCcpWzBdLmlkO1xuICAgIHZhciBoYXNJbml0aWF0ZWQgPSAkbWFwLmhhc0NsYXNzKCdsb2FkZWQnKTtcbiAgICB2YXIgbWFwID0gaGFzSW5pdGlhdGVkID8gbWFwSW5zdGFuY2VzWzBdIDogTC5tYXAobWFwSWQsIHtcbiAgICAgICAgY2VudGVyOiBjb29yZHMsXG4gICAgICAgIHpvb206IDEzXG4gICAgfSk7XG5cbiAgICB2YXIgYWRkTWFya2VyID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgICAgICBtYXAuc2V0Vmlldyhjb29yZHMsIDEzKTtcbiAgICAgICAgdmFyIG1hcmtlciA9IEwubWFya2VyKGNvb3Jkcyk7XG4gICAgICAgIG1hcC5kYXRhLm1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgICBtYXJrZXIuYWRkVG8obWFwKTtcbiAgICB9XG5cbiAgICB2YXIgY2xvc2VQb3B1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwLmNsb3NlUG9wdXAoKTtcbiAgICB9XG5cbiAgICB2YXIgb25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZS5sb2NhdGlvbi51cGRhdGVDb29yZHMobG9jYXRpb25JZCwgY29vcmRzWzBdLCBjb29yZHNbMV0pXG4gICAgICAgIC50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICAgICAgaWYgKCBzdWNjZXNzICkge1xuICAgICAgICAgICAgICAgIGNsb3NlUG9wdXAoKTtcbiAgICAgICAgICAgICAgICBhZGRNYXJrZXIoY29vcmRzKTtcbiAgICAgICAgICAgICAgICBidXR0b25UcmlnZ2VyZXIuaW5uZXJUZXh0ID0gY2REYXRhLnRyYW5zbGF0aW9ucy52aWV3T25NYXA7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxlcnQoJ1RoZXJlIHdhcyBhbiBlcnJvciBzYXZpbmcgdGhlIGNvb3JkaW5hdGVzLicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZW1vdmUgZWFjaCBtYXJrZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IG1hcC5kYXRhLm1hcmtlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnBvcCgpLnJlbW92ZSgpO1xuXG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgICAgIC8vIFJlc2V0IGNlbnRlciB0byBkZWZhdWx0XG4gICAgICAgIG1hcC5zZXRWaWV3KGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcywgMTMpO1xuICAgICAgICAvLyBSZW1vdmUgbGlzdGVuZXJzXG4gICAgICAgIG1hcC5vZmYoJ2NsaWNrJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgZmlyc3QgdGltZSBsb2FkaW5nLCBpbml0aWF0ZSB0aGUgbWFwIGFuZCBiaW5kIGFsbCBsaXN0ZW5lcnNcbiAgICBpZiAoIWhhc0luaXRpYXRlZCkge1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArIGNkRGF0YS5tYXAuYWNjZXNzVG9rZW4sIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246IE1CX0FUVFIsXG4gICAgICAgICAgICBpZDogJ21hcGJveC9zdHJlZXRzLXYxMScsXG4gICAgICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICAgICAgem9vbU9mZnNldDogLTEsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgbWFwLmRhdGEgPSB7XG4gICAgICAgICAgICBtYXJrZXJzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gTGlzdGVuZXIgdG8gc2F2ZSBjb29yZHMgdG8gREJcbiAgICAgICAgJG1vZGFsLm9uKCdjbGljaycsICcuc3VibWl0LXllcycsIG9uU3VibWl0KS5vbignY2xpY2snLCAnLnN1Ym1pdC1ubycsIGNsb3NlUG9wdXApO1xuXG4gICAgICAgIC8vIE92ZXJyaWRlIHRoZSB0aGUgdGhpY2tib3ggbW9kYWwgY2xvc2UgbGlzdGVuZXJzXG4gICAgICAgIHZhciBvbGRfdGJfcmVtb3ZlID0gd2luZG93LnRiX3JlbW92ZTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB3aW5kb3cudGJfcmVtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlICYmIGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgb2xkX3RiX3JlbW92ZSgpO1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjVEJfb3ZlcmxheSwgI1RCX3dpbmRvdycpLm9mZignY2xpY2snKS5vbignY2xpY2snLCB3aW5kb3cudGJfcmVtb3ZlKTtcblxuICAgICAgICAkbWFwLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgaGFzSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jb29yZHMgJiYgIWVkaXRNYXApIGFkZE1hcmtlcihjb29yZHMpO1xuXG4gICAgaWYgKGVkaXRNYXApIHtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb29yZHMgPSBbZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmddO1xuICAgICAgICAgICAgcG9wdXBcbiAgICAgICAgICAgICAgICAuc2V0TGF0TG5nKGUubGF0bG5nKVxuICAgICAgICAgICAgICAgIC5zZXRDb250ZW50KFwiU2V0IHRoaXMgcGxhY2UgYXMgdGhlIGNlbnRlcj88YnIgLz48YSBjbGFzcz0nc3VibWl0LXllcyBidXR0b24tcHJpbWFyeSc+WWVzPC9hPjxhIGNsYXNzPSdidXR0b24gc3VibWl0LW5vJz5ObzwvYT5cIilcbiAgICAgICAgICAgICAgICAub3Blbk9uKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGUudGFyZ2V0LnNldFZpZXcoZS5sYXRsbmcpXG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwiXG5cbmV4cG9ydCBjb25zdCBNQl9BVFRSID0gJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcblx0XHRcdCdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nO1xuZXhwb3J0IGNvbnN0IE1CX1VSTCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgJ0FDQ0VTU19UT0tFTic7XG5leHBvcnQgY29uc3QgT1NNX1VSTCA9ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZyc7XG5leHBvcnQgY29uc3QgT1NNX0FUVFJJQiA9ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyc7XG4vLyBAdHMtaWdub3JlXG5leHBvcnQgY29uc3QgTEVBRkxFVF9MT0FERUQgPSAhIXdpbmRvdy5MO1xuXG5leHBvcnQgY29uc3QgZWxNYXJrZXIgPSBMLk1hcmtlci5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZWw6ICdhdHRhY2ggYW4gZWxlbWVudCdcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwSW5zdGFuY2VzID0gW107XG5cbmlmICggTEVBRkxFVF9MT0FERUQgKSB7XG4gICAgTC5NYXAuYWRkSW5pdEhvb2soZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXBJbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICB9KTtcbn0iLCJcbmNvbnN0IGNhY2hlID0ge1xuICAgIGxvY2F0aW9uczogbnVsbCxcbiAgICBlbnRpdGllczogbnVsbCxcbn1cblxuZXhwb3J0IGNvbnN0IGdldExvY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjYWNoZWQgPSBjYWNoZS5sb2NhdGlvbnM7XG4gICAgcmV0dXJuIGNhY2hlZCA/IGpRdWVyeS53aGVuKGNhY2hlZCkgOiBqUXVlcnkuYWpheCh7XG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICB1cmw6IGNkRGF0YS5yZXN0QmFzZSArICdsb2NhdGlvbi9nZXQnICxcbiAgICAgICAgZGF0YTogeyAgfSxcbiAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCByZXNwb25zZSApIHtcbiAgICAgICAgICAgIGNhY2hlLmxvY2F0aW9ucyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RW50aXRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGpRdWVyeS5nZXQoIGNkRGF0YS5yZXN0QmFzZSArIGNkRGF0YS5wb3N0VHlwZS5lbnRpdHkgKTtcbn07XG5cbmV4cG9ydCBjb25zdCB1cGRhdGUgPSB7XG4gICAgZW50aXR5OiB7XG4gICAgICAgIHVwZGF0ZUxvY2F0aW9uOiAoZW50aXR5SWQ6bnVtYmVyLCBsb2NhdGlvbklkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGNkRGF0YS5yZXN0QmFzZSArICdlbnRpdHkvdXBkYXRlLWVudGl0eScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6IGVudGl0eUlkLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbl9pZDogbG9jYXRpb25JZCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHVwZGF0ZUNvb3JkczogKGxvY2F0aW9uSWQ6bnVtYmVyLCBsYXQ6bnVtYmVyLCBsb246bnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGNkRGF0YS5yZXN0QmFzZSArICdsb2NhdGlvbi91cGRhdGUtY29vcmRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uX2lkOiBsb2NhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICBsYXQsIGxvblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIGNkRGF0YS53cF9ub25jZSApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=