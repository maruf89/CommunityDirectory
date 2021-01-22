/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Admin/Scripts/index.ts":
/*!************************************!*\
  !*** ./src/Admin/Scripts/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_styl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.styl */ "./src/Admin/Scripts/index.styl");
/* harmony import */ var Admin_views_modals_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Admin/views/modals/modals */ "./src/Admin/views/modals/modals.ts");
/* harmony import */ var Admin_Settings_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Admin/Settings/settings */ "./src/Admin/Settings/settings.ts");
/* harmony import */ var Scripts_OfferNeed_PostPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Scripts/OfferNeed/PostPage */ "./src/Scripts/OfferNeed/PostPage.ts");




var onBodyLoaded = document.body.onload;
document.body.onload = function (ev) {
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    if (onBodyLoaded && onBodyLoaded !== document.body.onload)
        onBodyLoaded.call(this, ev);
    var $ = jQuery;
    $('.enable-on-load').removeClass('disabled enable-on-load');
    (0,Admin_views_modals_modals__WEBPACK_IMPORTED_MODULE_1__.default)($);
    (0,Admin_Settings_settings__WEBPACK_IMPORTED_MODULE_2__.default)($);
    (0,Scripts_OfferNeed_PostPage__WEBPACK_IMPORTED_MODULE_3__.initPostPage)();
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

/***/ "./src/Scripts/OfferNeed/PostPage.ts":
/*!*******************************************!*\
  !*** ./src/Scripts/OfferNeed/PostPage.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isOfPostPage": () => /* binding */ isOfPostPage,
/* harmony export */   "initPostPage": () => /* binding */ initPostPage,
/* harmony export */   "autofillHashtagTitle": () => /* binding */ autofillHashtagTitle
/* harmony export */ });
/* harmony import */ var Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Scripts/OfferNeed/ProductServiceType */ "./src/Scripts/OfferNeed/ProductServiceType.ts");

function isOfPostPage() {
    return /post-(new-)?php/.test(document.body.className) &&
        (new RegExp("post-type-" + cdData.postType.offersNeeds)).test(document.body.className);
}
function initPostPage() {
    if (!isOfPostPage())
        return false;
    (0,Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_0__.requireProductService)();
    (0,Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_0__.breadcrumbProductServices)();
    autofillHashtagTitle();
    return true;
}
function autofillHashtagTitle() {
    var $titleInput = jQuery('#title')[0];
    var $hashtagTitleInput = jQuery("#acf-" + cdData.pages.offersNeeds.acf.hashtag_title)[0];
    $titleInput.onkeyup = function (event) {
        $hashtagTitleInput.value = hashtagify(event.target.value);
    };
}
function hashtagify(text) {
    return "#" + text.split(' ').map(function (val) { return val[0].toUpperCase() + val.substr(1); }).join('');
}


/***/ }),

/***/ "./src/Scripts/OfferNeed/ProductServiceType.ts":
/*!*****************************************************!*\
  !*** ./src/Scripts/OfferNeed/ProductServiceType.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "requireProductService": () => /* binding */ requireProductService,
/* harmony export */   "classNames": () => /* binding */ classNames,
/* harmony export */   "breadcrumbProductServices": () => /* binding */ breadcrumbProductServices
/* harmony export */ });
/* harmony import */ var Scripts_Helper_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Scripts/Helper/debounce */ "./src/Scripts/Helper/debounce.ts");

function requireProductService() {
    var $post = jQuery('#post');
    var $taxonomyContainer = jQuery("#" + cdData.taxonomyType.productService + "div").addClass('focusable');
    var productServiceKey = "tax_input[" + cdData.taxonomyType.productService + "][]";
    var validateHasTaxonomy = function (event) {
        event.preventDefault();
        var productServiceFields = jQuery('#post')
            .serializeArray()
            .filter(function (_a) {
            var name = _a.name;
            return name === productServiceKey;
        })
            .filter(function (_a) {
            var value = _a.value;
            return value != '0';
        });
        if (productServiceFields.length)
            return $post.trigger('submit');
        console.log('missing tax');
        jQuery([document.documentElement, document.body]).animate({
            scrollTop: $taxonomyContainer.offset().top + -100
        }, 250);
        setTimeout(function () { return $taxonomyContainer.addClass('focus'); }, 250);
        setTimeout(function () { return $taxonomyContainer.removeClass('focus'); }, 1250);
        $post.one('submit', validateHasTaxonomy);
    };
    $post.one('submit', validateHasTaxonomy);
}
var classNames = {
    listParent: 'ps-parent',
    opened: 'opened',
};
function breadcrumbProductServices() {
    var $container = jQuery("#" + cdData.taxonomyType.productService + "checklist");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvSGVscGVyL2RlYm91bmNlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL09mZmVyTmVlZC9Qb3N0UGFnZS50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9PZmZlck5lZWQvUHJvZHVjdFNlcnZpY2VUeXBlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL1RoaXJkUGFydHkvbGVhZmxldC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9yZXN0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9BZG1pbi9TY3JpcHRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7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QUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJjb21tdW5pdHktZGlyZWN0b3J5LWFkbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL2luZGV4LnN0eWwnO1xuaW1wb3J0IGluaXRNb2RhbHMgZnJvbSAnQWRtaW4vdmlld3MvbW9kYWxzL21vZGFscyc7XG5pbXBvcnQgaW5pdFNldHRpbmdzIGZyb20gJ0FkbWluL1NldHRpbmdzL3NldHRpbmdzJztcbmltcG9ydCB7IGluaXRQb3N0UGFnZSB9IGZyb20gJ1NjcmlwdHMvT2ZmZXJOZWVkL1Bvc3RQYWdlJztcblxudmFyIG9uQm9keUxvYWRlZCA9IGRvY3VtZW50LmJvZHkub25sb2FkO1xuZG9jdW1lbnQuYm9keS5vbmxvYWQgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzID0gWytjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMF0sICtjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMV1dO1xuICAgIFxuICAgIGlmICggb25Cb2R5TG9hZGVkICYmIG9uQm9keUxvYWRlZCAhPT0gZG9jdW1lbnQuYm9keS5vbmxvYWQgKSBvbkJvZHlMb2FkZWQuY2FsbCh0aGlzLCBldik7XG4gICAgY29uc3QgJCA9IGpRdWVyeTtcblxuICAgIC8vIENlcnRhaW4gYnV0dG9ucyBtYXkgYmUgZGlzYWJsZWQgdW50aWwgbG9hZFxuICAgICQoJy5lbmFibGUtb24tbG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBlbmFibGUtb24tbG9hZCcpO1xuXG4gICAgaW5pdE1vZGFscygkKTtcbiAgICBpbml0U2V0dGluZ3MoJCk7ICAgIFxuICAgIGluaXRQb3N0UGFnZSgpO1xufTsiLCJsZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGlmICghJCgnYm9keS50b3BsZXZlbF9wYWdlX2NvbW11bml0eS1kaXJlY3RvcnknKS5sZW5ndGgpIHJldHVybjtcblxuICAgIGVkaXRMb2NhdGlvblRhYmxlKCAkKCcuZWRpdC1sb2NhdGlvbnMtdGFibGUnKSApO1xufVxuXG5mdW5jdGlvbiBlZGl0TG9jYXRpb25UYWJsZSAoJHRhYmxlOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCAkZm9ybTpKUXVlcnk8SFRNTEVsZW1lbnQ+ID0gJCgnI21haW5mb3JtJyk7XG4gICAgbGV0IG5ld0ZpZWxkSWQ6bnVtYmVyID0gMTtcbiAgICBcbiAgICAkKCcudGFibGUtYWRkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjbG9uZUlkOm51bWJlciA9IG5ld0ZpZWxkSWQrKztcbiAgICAgICAgY29uc3QgJGNsb25lID0gJHRhYmxlLmZpbmQoJ3RyLmhpZGUnKS5jbG9uZSh0cnVlKS5yZW1vdmVDbGFzcygnaGlkZSB0YWJsZS1saW5lJyk7XG4gICAgICAgICRjbG9uZS5maW5kKCcuZWRpdC1maWVsZCcpLmVhY2goZnVuY3Rpb24gKGluZGV4Om51bWJlciwgZWw6SFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICAgICAgZWwubmFtZSA9IGVsLm5hbWUuc3Vic3RyKDAsIGVsLm5hbWUubGVuZ3RoIC0gMSkgKyBjbG9uZUlkICsgJ10nO1xuXG4gICAgICAgICAgICAvLyBNdXN0IGFkZCBjaGFuZ2VkIHRvIG5ldyBzdGF0dXMgZmllbGQgc28gaXQgZ2V0cyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGlmICgkKGVsKS5oYXNDbGFzcygnZWRpdC1zdGF0dXMnKSkgJChlbCkuYWRkQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICR0YWJsZS5hcHBlbmQoJGNsb25lKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LW5hbWUnKS50cmlnZ2VyKCdmb2N1cycpO1xuICAgIH0pO1xuXG4gICAgLy8gRGVsZXRlcyBsb2NhdGlvbnMgdmlhIGFqYXhcbiAgICAkKCcudGFibGUtcmVtb3ZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCFjb25maXJtKGNkRGF0YS50cmFuc2xhdGlvbnMuZGVsZXRlTG9jYXRpb24pKSByZXR1cm47XG5cbiAgICB2YXIgbG9jSWQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJylbMF0uZGF0YXNldC5sb2NhdGlvbklkO1xuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxvY2F0aW9uX2lkOiBsb2NJZCxcbiAgICAgICAgYWN0aW9uOiAnbG9jYXRpb25fZGVsZXRlJyxcbiAgICB9O1xuXG4gICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICQucG9zdChjZERhdGEuYWpheFVybCwgZGF0YSxcbiAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkKCR0aGlzKS5jbG9zZXN0KCd0cicpLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkdGFibGUub24oJ2NoYW5nZScsICcuZWRpdC1uYW1lJywge30sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIEFkZCBjaGFuZ2VkIGNsYXNzIGlmIG5ldyB0ZXh0IGRvZXNuJ3QgbWF0Y2ggb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LXN0YXR1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBoYXNDaGFuZ2VkID0gZS50YXJnZXQuZGF0YXNldC5vcmlnaW5hbFZhbHVlICE9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjaGFuZ2VkJywgaGFzQ2hhbmdlZCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzdWJtaXQgKGUpIHtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gRGV0YWNoIGFsbCB1bmNoYW5nZWQgZmllbGRzXG4gICAgICAgICR0YWJsZS5maW5kKCcuZWRpdC1maWVsZDpub3QoLmNoYW5nZWQpJykuZGV0YWNoKCk7XG5cbiAgICAgICAgJGZvcm0ub2ZmKCdzdWJtaXQnLCBzdWJtaXQpLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgIH1cbiAgICBcbiAgICAkZm9ybS5vbignc3VibWl0Jywgc3VibWl0KTtcbn07IiwiaW1wb3J0IHsgbWFwSW5zdGFuY2VzLCBNQl9BVFRSIH0gZnJvbSAnVGhpcmRQYXJ0eS9sZWFmbGV0LnRzJztcbmltcG9ydCB7IGdldExvY2F0aW9ucywgdXBkYXRlIH0gZnJvbSAnU2NyaXB0cy9yZXN0JztcblxubGV0ICQ6SlF1ZXJ5U3RhdGljO1xuXG5kZWNsYXJlIGNvbnN0IEw6YW55O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfJDpKUXVlcnlTdGF0aWMpIHtcbiAgICAkID0gXyQ7XG5cbiAgICBpZiAoISQoJ2JvZHkudG9wbGV2ZWxfcGFnZV9jb21tdW5pdHktZGlyZWN0b3J5JykubGVuZ3RoKSByZXR1cm47XG5cbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcuc2VsZWN0LWxvY2F0aW9uLW1vZGFsJywgZGVmaW5lRW50aXR5TG9jYXRpb25Nb2RhbCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCAnLnNlbGVjdC1jb29yZHMtbW9kYWwnLCBkZWZpbmVDb29yZHNNb2RhbCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVFbnRpdHlMb2NhdGlvbk1vZGFsID0gZnVuY3Rpb24gKCBldmVudDpFdmVudCApIHtcbiAgICBjb25zdCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgZW50aXR5SWQgPSArdGFyZ2V0LmRhdGFzZXQuZW50aXR5SWQ7XG4gICAgY29uc3QgJG1vZGFsID0gJCgnI21vZGFsTG9jYXRpb25MaXN0Jyk7XG4gICAgY29uc3QgJGNvbHVtbldyYXBwZXIgPSAkKCcjJyArIHRhcmdldC5kYXRhc2V0LmNvbHVtbklkKTtcbiAgICBjb25zdCAkc2VsZWN0OmFueSA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvblNlbGVjdEZpZWxkJyk7XG4gICAgY29uc3QgJHNhdmUgPSAkbW9kYWwuZmluZCgnLnN1Ym1pdCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbExvY2F0aW9uTGlzdCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuXG4gICAgaWYgKCEkc2VsZWN0Lmhhc0NsYXNzKCdsb2FkZWQnKSlcbiAgICAgICAgZ2V0TG9jYXRpb25zKCkudGhlbihmdW5jdGlvbiAobG9jYXRpb25zKSB7XG4gICAgICAgICAgICBsb2NhdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24gKGxvYykge1xuICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKCc8b3B0aW9uIHZhbHVlPVwiJytsb2MuaWQrJ1wiPicrbG9jLmRpc3BsYXlfbmFtZSsnPC9vcHRpb24+Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzZWxlY3QuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuICAgICAgICB9KTtcbiAgICBlbHNlIHtcbiAgICAgICAgJHNhdmUudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICRzZWxlY3RbMF0udmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAkc2VsZWN0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzYXZlLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcsICF0aGlzLnZhbHVlKTtcbiAgICB9KTtcblxuICAgIHZhciBvblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHJldHVybjtcblxuICAgICAgICB1cGRhdGUuZW50aXR5LnVwZGF0ZUxvY2F0aW9uKGVudGl0eUlkLCArJHNlbGVjdFswXS52YWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXIuZW1wdHkoKTtcbiAgICAgICAgICAgICRjb2x1bW5XcmFwcGVyWzBdLmlubmVySFRNTCA9ICRzZWxlY3RbMF0ub3B0aW9uc1skc2VsZWN0WzBdLnZhbHVlXS5pbm5lclRleHQ7XG4gICAgICAgICAgICB0Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgICRtb2RhbC5vZmYoJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkbW9kYWwub24oJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVDb29yZHNNb2RhbCA9IGZ1bmN0aW9uICggZXZlbnQ6RXZlbnQgKSB7XG4gICAgdmFyICRtb2RhbCA9ICQoJyNtb2RhbE1hcCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbE1hcCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuICAgIFxuICAgIHZhciBidXR0b25UcmlnZ2VyZXI6SFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgdmFyIGRhdGEgPSBidXR0b25UcmlnZ2VyZXIuZGF0YXNldDtcbiAgICB2YXIgbG9jYXRpb25JZCA9ICtkYXRhLmxvY2F0aW9uSWQ7XG4gICAgdmFyICRtYXAgPSAkbW9kYWwuZmluZCgnI21vZGFsTG9jYXRpb25NYXAnKTtcbiAgICBcbiAgICAvLyBVc2UgcGFzc2VkIGluIGNvb3JkcyBvciBkZWZhdWx0IGNvb3Jkc1xuICAgIHZhciBjb29yZHMgPSBkYXRhLmNvb3JkcyA/IGRhdGEuY29vcmRzLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuICtzdHI7IH0pIDogY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzO1xuXG4gICAgdmFyIGVkaXRNYXAgPSBkYXRhLmNvbHVtbkVkaXQgPT0gJ3RydWUnOyAgICAgICAgXG4gICAgdmFyIHBvcHVwID0gZWRpdE1hcCAmJiBMLnBvcHVwKCk7XG4gICAgdmFyIG1hcElkID0gJG1vZGFsLmZpbmQoJy5tYXAnKVswXS5pZDtcbiAgICB2YXIgaGFzSW5pdGlhdGVkID0gJG1hcC5oYXNDbGFzcygnbG9hZGVkJyk7XG4gICAgdmFyIG1hcCA9IGhhc0luaXRpYXRlZCA/IG1hcEluc3RhbmNlc1swXSA6IEwubWFwKG1hcElkLCB7XG4gICAgICAgIGNlbnRlcjogY29vcmRzLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZE1hcmtlciA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICAgICAgbWFwLnNldFZpZXcoY29vcmRzLCAxMyk7XG4gICAgICAgIHZhciBtYXJrZXIgPSBMLm1hcmtlcihjb29yZHMpO1xuICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgbWFya2VyLmFkZFRvKG1hcCk7XG4gICAgfVxuXG4gICAgdmFyIGNsb3NlUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgfVxuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGUubG9jYXRpb24udXBkYXRlQ29vcmRzKGxvY2F0aW9uSWQsIGNvb3Jkc1swXSwgY29vcmRzWzFdKVxuICAgICAgICAudGhlbihzdWNjZXNzID0+IHtcbiAgICAgICAgICAgIGlmICggc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICBjbG9zZVBvcHVwKCk7XG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKGNvb3Jkcyk7XG4gICAgICAgICAgICAgICAgYnV0dG9uVHJpZ2dlcmVyLmlubmVyVGV4dCA9IGNkRGF0YS50cmFuc2xhdGlvbnMudmlld09uTWFwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsZXJ0KCdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRoZSBjb29yZGluYXRlcy4nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGVhY2ggbWFya2VyXG4gICAgICAgIGZvciAobGV0IGkgPSBtYXAuZGF0YS5tYXJrZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgbWFwLmRhdGEubWFya2Vycy5wb3AoKS5yZW1vdmUoKTtcblxuICAgICAgICBtYXAuY2xvc2VQb3B1cCgpO1xuICAgICAgICAvLyBSZXNldCBjZW50ZXIgdG8gZGVmYXVsdFxuICAgICAgICBtYXAuc2V0VmlldyhjZERhdGEubWFwLmRlZmF1bHRDb29yZHMsIDEzKTtcbiAgICAgICAgLy8gUmVtb3ZlIGxpc3RlbmVyc1xuICAgICAgICBtYXAub2ZmKCdjbGljaycpO1xuICAgIH1cblxuICAgIC8vIElmIGZpcnN0IHRpbWUgbG9hZGluZywgaW5pdGlhdGUgdGhlIG1hcCBhbmQgYmluZCBhbGwgbGlzdGVuZXJzXG4gICAgaWYgKCFoYXNJbml0aWF0ZWQpIHtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyBjZERhdGEubWFwLmFjY2Vzc1Rva2VuLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBNQl9BVFRSLFxuICAgICAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12MTEnLFxuICAgICAgICAgICAgdGlsZVNpemU6IDUxMixcbiAgICAgICAgICAgIHpvb21PZmZzZXQ6IC0xLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIG1hcC5kYXRhID0ge1xuICAgICAgICAgICAgbWFya2VyczogW11cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIExpc3RlbmVyIHRvIHNhdmUgY29vcmRzIHRvIERCXG4gICAgICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdC15ZXMnLCBvblN1Ym1pdCkub24oJ2NsaWNrJywgJy5zdWJtaXQtbm8nLCBjbG9zZVBvcHVwKTtcblxuICAgICAgICAvLyBPdmVycmlkZSB0aGUgdGhlIHRoaWNrYm94IG1vZGFsIGNsb3NlIGxpc3RlbmVyc1xuICAgICAgICB2YXIgb2xkX3RiX3JlbW92ZSA9IHdpbmRvdy50Yl9yZW1vdmU7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnRiX3JlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIG9sZF90Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI1RCX292ZXJsYXksICNUQl93aW5kb3cnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgd2luZG93LnRiX3JlbW92ZSk7XG5cbiAgICAgICAgJG1hcC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIGhhc0luaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY29vcmRzICYmICFlZGl0TWFwKSBhZGRNYXJrZXIoY29vcmRzKTtcblxuICAgIGlmIChlZGl0TWFwKSB7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29vcmRzID0gW2UubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nXTtcbiAgICAgICAgICAgIHBvcHVwXG4gICAgICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgICAgICAuc2V0Q29udGVudChcIlNldCB0aGlzIHBsYWNlIGFzIHRoZSBjZW50ZXI/PGJyIC8+PGEgY2xhc3M9J3N1Ym1pdC15ZXMgYnV0dG9uLXByaW1hcnknPlllczwvYT48YSBjbGFzcz0nYnV0dG9uIHN1Ym1pdC1ubyc+Tm88L2E+XCIpXG4gICAgICAgICAgICAgICAgLm9wZW5PbihlLnRhcmdldCk7XG4gICAgICAgICAgICBlLnRhcmdldC5zZXRWaWV3KGUubGF0bG5nKVxuICAgICAgICB9KTtcbiAgICB9XG59OyIsIi8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3Rcbi8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3Jcbi8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHR2YXIgdGltZW91dDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTsiLCJpbXBvcnQgeyByZXF1aXJlUHJvZHVjdFNlcnZpY2UsIGJyZWFkY3J1bWJQcm9kdWN0U2VydmljZXMgfSBmcm9tICdTY3JpcHRzL09mZmVyTmVlZC9Qcm9kdWN0U2VydmljZVR5cGUnO1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvbiBhbiBPZmZlcnNOZWVkcyBwb3N0IHR5cGUgcGFnZSAobmV3IHBvc3Qgb3IgZWRpdCBwb3N0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPZlBvc3RQYWdlKCk6Ym9vbGVhbiB7XG4gICAgcmV0dXJuIC9wb3N0LShuZXctKT9waHAvLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpICYmXG4gICAgICAgICAgIChuZXcgUmVnRXhwKGBwb3N0LXR5cGUtJHtjZERhdGEucG9zdFR5cGUub2ZmZXJzTmVlZHN9YCkpLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFBvc3RQYWdlKCk6Ym9vbGVhbiB7XG4gICAgaWYgKCFpc09mUG9zdFBhZ2UoKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmVxdWlyZVByb2R1Y3RTZXJ2aWNlKCk7XG4gICAgYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcygpO1xuICAgIGF1dG9maWxsSGFzaHRhZ1RpdGxlKCk7XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvZmlsbEhhc2h0YWdUaXRsZSgpIHtcbiAgICBjb25zdCAkdGl0bGVJbnB1dDpIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+IGpRdWVyeSgnI3RpdGxlJylbMF07XG4gICAgY29uc3QgJGhhc2h0YWdUaXRsZUlucHV0OkhUTUxJbnB1dEVsZW1lbnQgPVxuICAgICAgICA8SFRNTElucHV0RWxlbWVudD4galF1ZXJ5KGAjYWNmLSR7Y2REYXRhLnBhZ2VzLm9mZmVyc05lZWRzLmFjZi5oYXNodGFnX3RpdGxlfWApWzBdO1xuXG4gICAgJHRpdGxlSW5wdXQub25rZXl1cCA9IGV2ZW50ID0+IHtcbiAgICAgICAgJGhhc2h0YWdUaXRsZUlucHV0LnZhbHVlID0gaGFzaHRhZ2lmeSgoPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS52YWx1ZSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGhhc2h0YWdpZnkodGV4dDpzdHJpbmcpOnN0cmluZyB7XG4gICAgcmV0dXJuIGAjJHt0ZXh0LnNwbGl0KCcgJykubWFwKHZhbCA9PiB2YWxbMF0udG9VcHBlckNhc2UoKSArIHZhbC5zdWJzdHIoMSkpLmpvaW4oJycpfWA7XG59IiwiaW1wb3J0IGRlYm91bmNlIGZyb20gJ1NjcmlwdHMvSGVscGVyL2RlYm91bmNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVQcm9kdWN0U2VydmljZSgpIHtcbiAgICBjb25zdCAkcG9zdCA9IGpRdWVyeSgnI3Bvc3QnKTtcbiAgICBjb25zdCAkdGF4b25vbXlDb250YWluZXIgPSBqUXVlcnkoYCMke2NkRGF0YS50YXhvbm9teVR5cGUucHJvZHVjdFNlcnZpY2V9ZGl2YCkuYWRkQ2xhc3MoJ2ZvY3VzYWJsZScpXG4gICAgLy8gVGhlIHNlcmlhbGl6ZWQgZm9ybSdzIGtleSBmaWVsZFxuICAgIGNvbnN0IHByb2R1Y3RTZXJ2aWNlS2V5ID0gYHRheF9pbnB1dFske2NkRGF0YS50YXhvbm9teVR5cGUucHJvZHVjdFNlcnZpY2V9XVtdYDtcbiAgICBjb25zdCB2YWxpZGF0ZUhhc1RheG9ub215ID0gZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcHJvZHVjdFNlcnZpY2VGaWVsZHMgPSBqUXVlcnkoJyNwb3N0JylcbiAgICAgICAgICAgIC5zZXJpYWxpemVBcnJheSgpXG4gICAgICAgICAgICAuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUgPT09IHByb2R1Y3RTZXJ2aWNlS2V5KVxuICAgICAgICAgICAgLmZpbHRlcigoe3ZhbHVlfSkgPT4gdmFsdWUgIT0gJzAnKTtcblxuICAgICAgICAvLyBFdmVyeXRoaW5nIGlzIHZhbGlkXG4gICAgICAgIGlmIChwcm9kdWN0U2VydmljZUZpZWxkcy5sZW5ndGgpIHJldHVybiAkcG9zdC50cmlnZ2VyKCdzdWJtaXQnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnbWlzc2luZyB0YXgnKTtcbiAgICAgICAgLy8gT3RoZXJ3aXNl4oCmXG5cbiAgICAgICAgalF1ZXJ5KFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJHRheG9ub215Q29udGFpbmVyLm9mZnNldCgpLnRvcCArIC0xMDBcbiAgICAgICAgfSwgMjUwKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+ICR0YXhvbm9teUNvbnRhaW5lci5hZGRDbGFzcygnZm9jdXMnKSwgMjUwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiAkdGF4b25vbXlDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZvY3VzJyksIDEyNTApO1xuXG4gICAgICAgICRwb3N0Lm9uZSgnc3VibWl0JywgdmFsaWRhdGVIYXNUYXhvbm9teSk7XG4gICAgfTtcblxuICAgICRwb3N0Lm9uZSgnc3VibWl0JywgdmFsaWRhdGVIYXNUYXhvbm9teSk7XG59XG5cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVzID0ge1xuICAgIGxpc3RQYXJlbnQ6ICdwcy1wYXJlbnQnLFxuICAgIG9wZW5lZDogJ29wZW5lZCcsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcygpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0galF1ZXJ5KGAjJHtjZERhdGEudGF4b25vbXlUeXBlLnByb2R1Y3RTZXJ2aWNlfWNoZWNrbGlzdGApO1xuICAgIGlmICghJGNvbnRhaW5lci5sZW5ndGgpIHJldHVybjtcblxuICAgICRjb250YWluZXIuY2hpbGRyZW4oJ2xpJykuZWFjaChhcHBseUNoaWxkQnJlYWRjcnVtYik7XG5cbiAgICAkY29udGFpbmVyLm9uKCdjbGljaycsIGAuJHtjbGFzc05hbWVzLmxpc3RQYXJlbnR9YCwgZGVib3VuY2UoKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN0ID0galF1ZXJ5KGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjdC50b2dnbGVDbGFzcyhjbGFzc05hbWVzLm9wZW5lZCwgIWN0Lmhhc0NsYXNzKGNsYXNzTmFtZXMub3BlbmVkKSk7XG4gICAgfSwgMjUwLCB0cnVlKSk7XG4gICAgXG59XG5cbmZ1bmN0aW9uIGFwcGx5Q2hpbGRCcmVhZGNydW1iKGluZGV4LCBwb3NzaWJsZVBhcmVudCkge1xuICAgIGNvbnN0ICRwYXJlbnQgPSBqUXVlcnkocG9zc2libGVQYXJlbnQpO1xuICAgIGNvbnN0ICRjaGlsZHJlbiA9ICRwYXJlbnQuY2hpbGRyZW4oJy5jaGlsZHJlbicpLmNoaWxkcmVuKCdsaScpO1xuICAgIGlmICghJGNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgJHBhcmVudC5hZGRDbGFzcyhjbGFzc05hbWVzLmxpc3RQYXJlbnQpO1xuXG4gICAgJGNoaWxkcmVuLmVhY2goYXBwbHlDaGlsZEJyZWFkY3J1bWIpO1xufVxuIiwiXG5cbmV4cG9ydCBjb25zdCBNQl9BVFRSID0gJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcblx0XHRcdCdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nO1xuZXhwb3J0IGNvbnN0IE1CX1VSTCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgJ0FDQ0VTU19UT0tFTic7XG5leHBvcnQgY29uc3QgT1NNX1VSTCA9ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZyc7XG5leHBvcnQgY29uc3QgT1NNX0FUVFJJQiA9ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyc7XG4vLyBAdHMtaWdub3JlXG5leHBvcnQgY29uc3QgTEVBRkxFVF9MT0FERUQgPSAhIXdpbmRvdy5MO1xuXG5leHBvcnQgY29uc3QgZWxNYXJrZXIgPSBMLk1hcmtlci5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZWw6ICdhdHRhY2ggYW4gZWxlbWVudCdcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwSW5zdGFuY2VzID0gW107XG5leHBvcnQgY29uc3QgbWFwYm94VXJsID0gJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyBjZERhdGEubWFwLmFjY2Vzc1Rva2VuO1xuXG5pZiAoIExFQUZMRVRfTE9BREVEICkge1xuICAgIEwuTWFwLmFkZEluaXRIb29rKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwSW5zdGFuY2VzLnB1c2godGhpcyk7XG4gICAgfSk7XG59IiwiXG5jb25zdCBjYWNoZSA9IHtcbiAgICBsb2NhdGlvbnM6IG51bGwsXG4gICAgZW50aXRpZXM6IG51bGwsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2FjaGVkID0gY2FjaGUubG9jYXRpb25zO1xuICAgIHJldHVybiBjYWNoZWQgPyBqUXVlcnkud2hlbihjYWNoZWQpIDogalF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnbG9jYXRpb24vZ2V0JyAsXG4gICAgICAgIGRhdGE6IHsgIH0sXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICBjYWNoZS5sb2NhdGlvbnMgPSByZXNwb25zZTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEVudGl0aWVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBqUXVlcnkuZ2V0KCBjZERhdGEucmVzdEJhc2UgKyBjZERhdGEucG9zdFR5cGUuZW50aXR5ICk7XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlID0ge1xuICAgIGVudGl0eToge1xuICAgICAgICB1cGRhdGVMb2NhdGlvbjogKGVudGl0eUlkOm51bWJlciwgbG9jYXRpb25JZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnZW50aXR5L3VwZGF0ZS1lbnRpdHknLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBlbnRpdHlJZCxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25faWQ6IGxvY2F0aW9uSWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2NhdGlvbjoge1xuICAgICAgICB1cGRhdGVDb29yZHM6IChsb2NhdGlvbklkOm51bWJlciwgbGF0Om51bWJlciwgbG9uOm51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnbG9jYXRpb24vdXBkYXRlLWNvb3JkcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbl9pZDogbG9jYXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgbGF0LCBsb25cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9