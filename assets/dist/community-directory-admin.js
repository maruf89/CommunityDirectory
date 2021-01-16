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
        $.ajax({
            type: 'POST',
            url: cdData.restBase + 'entity/update-entity',
            data: {
                entity: entityId,
                location_id: +$select[0].value,
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-WP-Nonce', cdData.wp_nonce);
            },
            dataType: 'json'
        }).then(function () {
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
    var data = event.target.dataset;
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
        $.ajax({
            type: 'POST',
            url: cdData.restBase + 'location/update-coords',
            data: {
                location_id: locationId,
                lat: coords[0],
                lon: coords[1]
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-WP-Nonce', cdData.wp_nonce);
            },
            dataType: 'json'
        }).then(function (success) {
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
/* harmony export */   "mapInstances": () => /* binding */ mapInstances
/* harmony export */ });
var MB_ATTR = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var MB_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + 'ACCESS_TOKEN';
var OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var LEAFLET_LOADED = !!window.L;
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
/* harmony export */   "getEntities": () => /* binding */ getEntities
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvVGhpcmRQYXJ0eS9sZWFmbGV0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL3Jlc3QudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBRW1EO0FBQ0E7QUFDN0I7QUFFdEIsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxFQUFFO0lBQy9CLElBQUssWUFBWSxJQUFJLFlBQVksS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU07UUFBRyxZQUFZLENBQUMsSUFBSSxD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QUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDO0FBQ2xFLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FDekJGOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbW11bml0eS1kaXJlY3RvcnktYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBjZERhdGE6IHsgZm46IHsgW25hbWU6c3RyaW5nXTogRnVuY3Rpb24gfSB9O1xuXG5pbXBvcnQgaW5pdE1vZGFscyBmcm9tICdBZG1pbi92aWV3cy9tb2RhbHMvbW9kYWxzJztcbmltcG9ydCBpbml0U2V0dGluZ3MgZnJvbSAnQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MnO1xuaW1wb3J0ICcuL2luZGV4LnN0eWwnO1xuXG52YXIgb25Cb2R5TG9hZGVkID0gZG9jdW1lbnQuYm9keS5vbmxvYWQ7XG5kb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGZ1bmN0aW9uIChldikge1xuICAgIGlmICggb25Cb2R5TG9hZGVkICYmIG9uQm9keUxvYWRlZCAhPT0gZG9jdW1lbnQuYm9keS5vbmxvYWQgKSBvbkJvZHlMb2FkZWQuY2FsbCh0aGlzLCBldik7XG4gICAgY29uc3QgJCA9IGpRdWVyeTtcblxuICAgIC8vIENlcnRhaW4gYnV0dG9ucyBtYXkgYmUgZGlzYWJsZWQgdW50aWwgbG9hZFxuICAgICQoJy5lbmFibGUtb24tbG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBlbmFibGUtb24tbG9hZCcpO1xuXG4gICAgaW5pdE1vZGFscygkKTtcbiAgICBpbml0U2V0dGluZ3MoJCk7ICAgIFxufTsiLCJsZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGlmICghJCgnYm9keS50b3BsZXZlbF9wYWdlX2NvbW11bml0eS1kaXJlY3RvcnknKS5sZW5ndGgpIHJldHVybjtcblxuICAgIGVkaXRMb2NhdGlvblRhYmxlKCAkKCcuZWRpdC1sb2NhdGlvbnMtdGFibGUnKSApO1xufVxuXG5mdW5jdGlvbiBlZGl0TG9jYXRpb25UYWJsZSAoJHRhYmxlOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCAkZm9ybTpKUXVlcnk8SFRNTEVsZW1lbnQ+ID0gJCgnI21haW5mb3JtJyk7XG4gICAgbGV0IG5ld0ZpZWxkSWQ6bnVtYmVyID0gMTtcbiAgICBcbiAgICAkKCcudGFibGUtYWRkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjbG9uZUlkOm51bWJlciA9IG5ld0ZpZWxkSWQrKztcbiAgICAgICAgY29uc3QgJGNsb25lID0gJHRhYmxlLmZpbmQoJ3RyLmhpZGUnKS5jbG9uZSh0cnVlKS5yZW1vdmVDbGFzcygnaGlkZSB0YWJsZS1saW5lJyk7XG4gICAgICAgICRjbG9uZS5maW5kKCcuZWRpdC1maWVsZCcpLmVhY2goZnVuY3Rpb24gKGluZGV4Om51bWJlciwgZWw6SFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICAgICAgZWwubmFtZSA9IGVsLm5hbWUuc3Vic3RyKDAsIGVsLm5hbWUubGVuZ3RoIC0gMSkgKyBjbG9uZUlkICsgJ10nO1xuXG4gICAgICAgICAgICAvLyBNdXN0IGFkZCBjaGFuZ2VkIHRvIG5ldyBzdGF0dXMgZmllbGQgc28gaXQgZ2V0cyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGlmICgkKGVsKS5oYXNDbGFzcygnZWRpdC1zdGF0dXMnKSkgJChlbCkuYWRkQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICR0YWJsZS5hcHBlbmQoJGNsb25lKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LW5hbWUnKS50cmlnZ2VyKCdmb2N1cycpO1xuICAgIH0pO1xuXG4gICAgLy8gRGVsZXRlcyBsb2NhdGlvbnMgdmlhIGFqYXhcbiAgICAkKCcudGFibGUtcmVtb3ZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCFjb25maXJtKGNkRGF0YS50cmFuc2xhdGlvbnMuZGVsZXRlTG9jYXRpb24pKSByZXR1cm47XG5cbiAgICB2YXIgbG9jSWQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJylbMF0uZGF0YXNldC5sb2NhdGlvbklkO1xuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxvY2F0aW9uX2lkOiBsb2NJZCxcbiAgICAgICAgYWN0aW9uOiAnbG9jYXRpb25fZGVsZXRlJyxcbiAgICB9O1xuXG4gICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICQucG9zdChjZERhdGEuYWpheFVybCwgZGF0YSxcbiAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkKCR0aGlzKS5jbG9zZXN0KCd0cicpLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkdGFibGUub24oJ2NoYW5nZScsICcuZWRpdC1uYW1lJywge30sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIEFkZCBjaGFuZ2VkIGNsYXNzIGlmIG5ldyB0ZXh0IGRvZXNuJ3QgbWF0Y2ggb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LXN0YXR1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBoYXNDaGFuZ2VkID0gZS50YXJnZXQuZGF0YXNldC5vcmlnaW5hbFZhbHVlICE9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjaGFuZ2VkJywgaGFzQ2hhbmdlZCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzdWJtaXQgKGUpIHtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gRGV0YWNoIGFsbCB1bmNoYW5nZWQgZmllbGRzXG4gICAgICAgICR0YWJsZS5maW5kKCcuZWRpdC1maWVsZDpub3QoLmNoYW5nZWQpJykuZGV0YWNoKCk7XG5cbiAgICAgICAgJGZvcm0ub2ZmKCdzdWJtaXQnLCBzdWJtaXQpLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgIH1cbiAgICBcbiAgICAkZm9ybS5vbignc3VibWl0Jywgc3VibWl0KTtcbn07IiwiaW1wb3J0IHsgbWFwSW5zdGFuY2VzLCBNQl9BVFRSIH0gZnJvbSAnVGhpcmRQYXJ0eS9sZWFmbGV0LnRzJztcbmltcG9ydCB7IGdldExvY2F0aW9ucyB9IGZyb20gJ1NjcmlwdHMvcmVzdCc7XG5cbmxldCAkOkpRdWVyeVN0YXRpYztcblxuZGVjbGFyZSBjb25zdCBMOmFueTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXyQ6SlF1ZXJ5U3RhdGljKSB7XG4gICAgJCA9IF8kO1xuXG4gICAgaWYgKCEkKCdib2R5LnRvcGxldmVsX3BhZ2VfY29tbXVuaXR5LWRpcmVjdG9yeScpLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCAnLnNlbGVjdC1sb2NhdGlvbi1tb2RhbCcsIGRlZmluZUVudGl0eUxvY2F0aW9uTW9kYWwpO1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy5zZWxlY3QtY29vcmRzLW1vZGFsJywgZGVmaW5lQ29vcmRzTW9kYWwpO1xufVxuXG5leHBvcnQgY29uc3QgZGVmaW5lRW50aXR5TG9jYXRpb25Nb2RhbCA9IGZ1bmN0aW9uICggZXZlbnQ6RXZlbnQgKSB7XG4gICAgY29uc3QgdGFyZ2V0OkhUTUxFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGVudGl0eUlkID0gK3RhcmdldC5kYXRhc2V0LmVudGl0eUlkO1xuICAgIGNvbnN0ICRtb2RhbCA9ICQoJyNtb2RhbExvY2F0aW9uTGlzdCcpO1xuICAgIGNvbnN0ICRjb2x1bW5XcmFwcGVyID0gJCgnIycgKyB0YXJnZXQuZGF0YXNldC5jb2x1bW5JZCk7XG4gICAgY29uc3QgJHNlbGVjdDphbnkgPSAkbW9kYWwuZmluZCgnI21vZGFsTG9jYXRpb25TZWxlY3RGaWVsZCcpO1xuICAgIGNvbnN0ICRzYXZlID0gJG1vZGFsLmZpbmQoJy5zdWJtaXQnKTtcblxuICAgIGlmICggISRtb2RhbFswXSApIGFsZXJ0KCcjbW9kYWxMb2NhdGlvbkxpc3QgbXVzdCBiZSBwcmVzZW50IGluIHRoZSBtYXJrdXAnKTtcblxuICAgIGlmICghJHNlbGVjdC5oYXNDbGFzcygnbG9hZGVkJykpXG4gICAgICAgIGdldExvY2F0aW9ucygpLnRoZW4oZnVuY3Rpb24gKGxvY2F0aW9ucykge1xuICAgICAgICAgICAgbG9jYXRpb25zLmZvckVhY2goIGZ1bmN0aW9uIChsb2MpIHtcbiAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZCgnPG9wdGlvbiB2YWx1ZT1cIicrbG9jLmlkKydcIj4nK2xvYy5kaXNwbGF5X25hbWUrJzwvb3B0aW9uPicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2VsZWN0LmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgfSk7XG4gICAgZWxzZSB7XG4gICAgICAgICRzYXZlLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAkc2VsZWN0WzBdLnZhbHVlID0gJyc7XG4gICAgfVxuXG4gICAgJHNlbGVjdC5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2F2ZS50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCAhdGhpcy52YWx1ZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgb25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSByZXR1cm47XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2VudGl0eS91cGRhdGUtZW50aXR5JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBlbnRpdHk6IGVudGl0eUlkLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uX2lkOiArJHNlbGVjdFswXS52YWx1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXIuZW1wdHkoKTtcbiAgICAgICAgICAgICRjb2x1bW5XcmFwcGVyWzBdLmlubmVySFRNTCA9ICRzZWxlY3RbMF0ub3B0aW9uc1skc2VsZWN0WzBdLnZhbHVlXS5pbm5lclRleHQ7XG4gICAgICAgICAgICB0Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgICRtb2RhbC5vZmYoJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkbW9kYWwub24oJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVDb29yZHNNb2RhbCA9IGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gICAgdmFyICRtb2RhbCA9ICQoJyNtb2RhbE1hcCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbE1hcCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuICAgIFxuICAgIHZhciBidXR0b25UcmlnZ2VyZXIgPSBldmVudC50YXJnZXQ7XG4gICAgdmFyIGRhdGEgPSBldmVudC50YXJnZXQuZGF0YXNldDtcbiAgICB2YXIgbG9jYXRpb25JZCA9ICtkYXRhLmxvY2F0aW9uSWQ7XG4gICAgdmFyICRtYXAgPSAkbW9kYWwuZmluZCgnI21vZGFsTG9jYXRpb25NYXAnKTtcbiAgICBcbiAgICAvLyBVc2UgcGFzc2VkIGluIGNvb3JkcyBvciBkZWZhdWx0IGNvb3Jkc1xuICAgIHZhciBjb29yZHMgPSBkYXRhLmNvb3JkcyA/IGRhdGEuY29vcmRzLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuICtzdHI7IH0pIDogY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzO1xuXG4gICAgdmFyIGVkaXRNYXAgPSBkYXRhLmNvbHVtbkVkaXQgPT0gJ3RydWUnOyAgICAgICAgXG4gICAgdmFyIHBvcHVwID0gZWRpdE1hcCAmJiBMLnBvcHVwKCk7XG4gICAgdmFyIG1hcElkID0gJG1vZGFsLmZpbmQoJy5tYXAnKVswXS5pZDtcbiAgICB2YXIgaGFzSW5pdGlhdGVkID0gJG1hcC5oYXNDbGFzcygnbG9hZGVkJyk7XG4gICAgdmFyIG1hcCA9IGhhc0luaXRpYXRlZCA/IG1hcEluc3RhbmNlc1swXSA6IEwubWFwKG1hcElkLCB7XG4gICAgICAgIGNlbnRlcjogY29vcmRzLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZE1hcmtlciA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICAgICAgbWFwLnNldFZpZXcoY29vcmRzLCAxMyk7XG4gICAgICAgIHZhciBtYXJrZXIgPSBMLm1hcmtlcihjb29yZHMpO1xuICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgbWFya2VyLmFkZFRvKG1hcCk7XG4gICAgfVxuXG4gICAgdmFyIGNsb3NlUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgfVxuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnbG9jYXRpb24vdXBkYXRlLWNvb3JkcycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb25faWQ6IGxvY2F0aW9uSWQsXG4gICAgICAgICAgICAgICAgbGF0OiBjb29yZHNbMF0sXG4gICAgICAgICAgICAgICAgbG9uOiBjb29yZHNbMV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmICggc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICBjbG9zZVBvcHVwKCk7XG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKGNvb3Jkcyk7XG4gICAgICAgICAgICAgICAgYnV0dG9uVHJpZ2dlcmVyLmlubmVyVGV4dCA9IGNkRGF0YS50cmFuc2xhdGlvbnMudmlld09uTWFwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsZXJ0KCdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRoZSBjb29yZGluYXRlcy4nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGVhY2ggbWFya2VyXG4gICAgICAgIGZvciAobGV0IGkgPSBtYXAuZGF0YS5tYXJrZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgbWFwLmRhdGEubWFya2Vycy5wb3AoKS5yZW1vdmUoKTtcblxuICAgICAgICBtYXAuY2xvc2VQb3B1cCgpO1xuICAgICAgICAvLyBSZXNldCBjZW50ZXIgdG8gZGVmYXVsdFxuICAgICAgICBtYXAuc2V0VmlldyhjZERhdGEubWFwLmRlZmF1bHRDb29yZHMsIDEzKTtcbiAgICAgICAgLy8gUmVtb3ZlIGxpc3RlbmVyc1xuICAgICAgICBtYXAub2ZmKCdjbGljaycpO1xuICAgIH1cblxuICAgIC8vIElmIGZpcnN0IHRpbWUgbG9hZGluZywgaW5pdGlhdGUgdGhlIG1hcCBhbmQgYmluZCBhbGwgbGlzdGVuZXJzXG4gICAgaWYgKCFoYXNJbml0aWF0ZWQpIHtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyBjZERhdGEubWFwLmFjY2Vzc1Rva2VuLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBNQl9BVFRSLFxuICAgICAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12MTEnLFxuICAgICAgICAgICAgdGlsZVNpemU6IDUxMixcbiAgICAgICAgICAgIHpvb21PZmZzZXQ6IC0xLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIG1hcC5kYXRhID0ge1xuICAgICAgICAgICAgbWFya2VyczogW11cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIExpc3RlbmVyIHRvIHNhdmUgY29vcmRzIHRvIERCXG4gICAgICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdC15ZXMnLCBvblN1Ym1pdCkub24oJ2NsaWNrJywgJy5zdWJtaXQtbm8nLCBjbG9zZVBvcHVwKTtcblxuICAgICAgICAvLyBPdmVycmlkZSB0aGUgdGhlIHRoaWNrYm94IG1vZGFsIGNsb3NlIGxpc3RlbmVyc1xuICAgICAgICB2YXIgb2xkX3RiX3JlbW92ZSA9IHdpbmRvdy50Yl9yZW1vdmU7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnRiX3JlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIG9sZF90Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI1RCX292ZXJsYXksICNUQl93aW5kb3cnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgd2luZG93LnRiX3JlbW92ZSk7XG5cbiAgICAgICAgJG1hcC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIGhhc0luaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY29vcmRzICYmICFlZGl0TWFwKSBhZGRNYXJrZXIoY29vcmRzKTtcblxuICAgIGlmIChlZGl0TWFwKSB7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29vcmRzID0gW2UubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nXTtcbiAgICAgICAgICAgIHBvcHVwXG4gICAgICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgICAgICAuc2V0Q29udGVudChcIlNldCB0aGlzIHBsYWNlIGFzIHRoZSBjZW50ZXI/PGJyIC8+PGEgY2xhc3M9J3N1Ym1pdC15ZXMgYnV0dG9uLXByaW1hcnknPlllczwvYT48YSBjbGFzcz0nYnV0dG9uIHN1Ym1pdC1ubyc+Tm88L2E+XCIpXG4gICAgICAgICAgICAgICAgLm9wZW5PbihlLnRhcmdldCk7XG4gICAgICAgICAgICBlLnRhcmdldC5zZXRWaWV3KGUubGF0bG5nKVxuICAgICAgICB9KTtcbiAgICB9XG59OyIsIlxuXG5leHBvcnQgY29uc3QgTUJfQVRUUiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG5cdFx0XHQnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JztcbmV4cG9ydCBjb25zdCBNQl9VUkwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArICdBQ0NFU1NfVE9LRU4nO1xuZXhwb3J0IGNvbnN0IE9TTV9VUkwgPSAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnO1xuZXhwb3J0IGNvbnN0IE9TTV9BVFRSSUIgPSAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnO1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IExFQUZMRVRfTE9BREVEID0gISF3aW5kb3cuTDtcblxuZXhwb3J0IGNvbnN0IG1hcEluc3RhbmNlcyA9IFtdO1xuXG5pZiAoIExFQUZMRVRfTE9BREVEICkge1xuICAgIEwuTWFwLmFkZEluaXRIb29rKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwSW5zdGFuY2VzLnB1c2godGhpcyk7XG4gICAgfSk7XG59IiwiXG5jb25zdCBjYWNoZSA9IHtcbiAgICBsb2NhdGlvbnM6IG51bGwsXG4gICAgZW50aXRpZXM6IG51bGwsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2FjaGVkID0gY2FjaGUubG9jYXRpb25zO1xuICAgIHJldHVybiBjYWNoZWQgPyBqUXVlcnkud2hlbihjYWNoZWQpIDogalF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnbG9jYXRpb24vZ2V0JyAsXG4gICAgICAgIGRhdGE6IHsgIH0sXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICBjYWNoZS5sb2NhdGlvbnMgPSByZXNwb25zZTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEVudGl0aWVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBqUXVlcnkuZ2V0KCBjZERhdGEucmVzdEJhc2UgKyBjZERhdGEucG9zdFR5cGUuZW50aXR5ICk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9