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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvSGVscGVyL2RlYm91bmNlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL09mZmVyTmVlZC9Qb3N0UGFnZS50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9PZmZlck5lZWQvUHJvZHVjdFNlcnZpY2VUeXBlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL1RoaXJkUGFydHkvbGVhZmxldC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9yZXN0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9BZG1pbi9TY3JpcHRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7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QTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbW11bml0eS1kaXJlY3RvcnktYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vaW5kZXguc3R5bCc7XG5pbXBvcnQgaW5pdE1vZGFscyBmcm9tICdBZG1pbi92aWV3cy9tb2RhbHMvbW9kYWxzJztcbmltcG9ydCBpbml0U2V0dGluZ3MgZnJvbSAnQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MnO1xuaW1wb3J0IHsgaW5pdFBvc3RQYWdlIH0gZnJvbSAnU2NyaXB0cy9PZmZlck5lZWQvUG9zdFBhZ2UnO1xuXG52YXIgb25Cb2R5TG9hZGVkID0gZG9jdW1lbnQuYm9keS5vbmxvYWQ7XG5kb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGZ1bmN0aW9uIChldikge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjZERhdGEubWFwLmRlZmF1bHRDb29yZHMgPSBbK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1swXSwgK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1sxXV07XG4gICAgXG4gICAgaWYgKCBvbkJvZHlMb2FkZWQgJiYgb25Cb2R5TG9hZGVkICE9PSBkb2N1bWVudC5ib2R5Lm9ubG9hZCApIG9uQm9keUxvYWRlZC5jYWxsKHRoaXMsIGV2KTtcbiAgICBjb25zdCAkID0galF1ZXJ5O1xuXG4gICAgLy8gQ2VydGFpbiBidXR0b25zIG1heSBiZSBkaXNhYmxlZCB1bnRpbCBsb2FkXG4gICAgJCgnLmVuYWJsZS1vbi1sb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGVuYWJsZS1vbi1sb2FkJyk7XG5cbiAgICBpbml0TW9kYWxzKCQpO1xuICAgIGluaXRTZXR0aW5ncygkKTsgICAgXG4gICAgaW5pdFBvc3RQYWdlKCk7XG59OyIsImxldCAkOkpRdWVyeVN0YXRpYztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXyQ6SlF1ZXJ5U3RhdGljKSB7XG4gICAgJCA9IF8kO1xuXG4gICAgaWYgKCEkKCdib2R5LnRvcGxldmVsX3BhZ2VfY29tbXVuaXR5LWRpcmVjdG9yeScpLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgZWRpdExvY2F0aW9uVGFibGUoICQoJy5lZGl0LWxvY2F0aW9ucy10YWJsZScpICk7XG59XG5cbmZ1bmN0aW9uIGVkaXRMb2NhdGlvblRhYmxlICgkdGFibGU6SlF1ZXJ5PEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0ICRmb3JtOkpRdWVyeTxIVE1MRWxlbWVudD4gPSAkKCcjbWFpbmZvcm0nKTtcbiAgICBsZXQgbmV3RmllbGRJZDpudW1iZXIgPSAxO1xuICAgIFxuICAgICQoJy50YWJsZS1hZGQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lSWQ6bnVtYmVyID0gbmV3RmllbGRJZCsrO1xuICAgICAgICBjb25zdCAkY2xvbmUgPSAkdGFibGUuZmluZCgndHIuaGlkZScpLmNsb25lKHRydWUpLnJlbW92ZUNsYXNzKCdoaWRlIHRhYmxlLWxpbmUnKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LWZpZWxkJykuZWFjaChmdW5jdGlvbiAoaW5kZXg6bnVtYmVyLCBlbDpIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICAgICAgICBlbC5uYW1lID0gZWwubmFtZS5zdWJzdHIoMCwgZWwubmFtZS5sZW5ndGggLSAxKSArIGNsb25lSWQgKyAnXSc7XG5cbiAgICAgICAgICAgIC8vIE11c3QgYWRkIGNoYW5nZWQgdG8gbmV3IHN0YXR1cyBmaWVsZCBzbyBpdCBnZXRzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgaWYgKCQoZWwpLmhhc0NsYXNzKCdlZGl0LXN0YXR1cycpKSAkKGVsKS5hZGRDbGFzcygnY2hhbmdlZCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgJHRhYmxlLmFwcGVuZCgkY2xvbmUpO1xuICAgICAgICAkY2xvbmUuZmluZCgnLmVkaXQtbmFtZScpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICAvLyBEZWxldGVzIGxvY2F0aW9ucyB2aWEgYWpheFxuICAgICQoJy50YWJsZS1yZW1vdmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIWNvbmZpcm0oY2REYXRhLnRyYW5zbGF0aW9ucy5kZWxldGVMb2NhdGlvbikpIHJldHVybjtcblxuICAgIHZhciBsb2NJZCA9ICQodGhpcykuY2xvc2VzdCgndHInKVswXS5kYXRhc2V0LmxvY2F0aW9uSWQ7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbG9jYXRpb25faWQ6IGxvY0lkLFxuICAgICAgICBhY3Rpb246ICdsb2NhdGlvbl9kZWxldGUnLFxuICAgIH07XG5cbiAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgJC5wb3N0KGNkRGF0YS5hamF4VXJsLCBkYXRhLFxuICAgICAgICBmdW5jdGlvbihyZXNwb25zZSwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ID09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICQoJHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgYWxlcnQocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LW5hbWUnLCB7fSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gQWRkIGNoYW5nZWQgY2xhc3MgaWYgbmV3IHRleHQgZG9lc24ndCBtYXRjaCBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICB2YXIgaGFzQ2hhbmdlZCA9IGUudGFyZ2V0LmRhdGFzZXQub3JpZ2luYWxWYWx1ZSAhPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY2hhbmdlZCcsIGhhc0NoYW5nZWQpO1xuICAgIH0pO1xuXG4gICAgJHRhYmxlLm9uKCdjaGFuZ2UnLCAnLmVkaXQtc3RhdHVzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHN1Ym1pdCAoZSkge1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvLyBEZXRhY2ggYWxsIHVuY2hhbmdlZCBmaWVsZHNcbiAgICAgICAgJHRhYmxlLmZpbmQoJy5lZGl0LWZpZWxkOm5vdCguY2hhbmdlZCknKS5kZXRhY2goKTtcblxuICAgICAgICAkZm9ybS5vZmYoJ3N1Ym1pdCcsIHN1Ym1pdCkudHJpZ2dlcignc3VibWl0Jyk7XG4gICAgfVxuICAgIFxuICAgICRmb3JtLm9uKCdzdWJtaXQnLCBzdWJtaXQpO1xufTsiLCJpbXBvcnQgeyBtYXBJbnN0YW5jZXMsIE1CX0FUVFIgfSBmcm9tICdUaGlyZFBhcnR5L2xlYWZsZXQudHMnO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb25zLCB1cGRhdGUgfSBmcm9tICdTY3JpcHRzL3Jlc3QnO1xuXG5sZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmRlY2xhcmUgY29uc3QgTDphbnk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGlmICghJCgnYm9keS50b3BsZXZlbF9wYWdlX2NvbW11bml0eS1kaXJlY3RvcnknKS5sZW5ndGgpIHJldHVybjtcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy5zZWxlY3QtbG9jYXRpb24tbW9kYWwnLCBkZWZpbmVFbnRpdHlMb2NhdGlvbk1vZGFsKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcuc2VsZWN0LWNvb3Jkcy1tb2RhbCcsIGRlZmluZUNvb3Jkc01vZGFsKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmluZUVudGl0eUxvY2F0aW9uTW9kYWwgPSBmdW5jdGlvbiAoIGV2ZW50OkV2ZW50ICkge1xuICAgIGNvbnN0IHRhcmdldDpIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBlbnRpdHlJZCA9ICt0YXJnZXQuZGF0YXNldC5lbnRpdHlJZDtcbiAgICBjb25zdCAkbW9kYWwgPSAkKCcjbW9kYWxMb2NhdGlvbkxpc3QnKTtcbiAgICBjb25zdCAkY29sdW1uV3JhcHBlciA9ICQoJyMnICsgdGFyZ2V0LmRhdGFzZXQuY29sdW1uSWQpO1xuICAgIGNvbnN0ICRzZWxlY3Q6YW55ID0gJG1vZGFsLmZpbmQoJyNtb2RhbExvY2F0aW9uU2VsZWN0RmllbGQnKTtcbiAgICBjb25zdCAkc2F2ZSA9ICRtb2RhbC5maW5kKCcuc3VibWl0Jyk7XG5cbiAgICBpZiAoICEkbW9kYWxbMF0gKSBhbGVydCgnI21vZGFsTG9jYXRpb25MaXN0IG11c3QgYmUgcHJlc2VudCBpbiB0aGUgbWFya3VwJyk7XG5cbiAgICBpZiAoISRzZWxlY3QuaGFzQ2xhc3MoJ2xvYWRlZCcpKVxuICAgICAgICBnZXRMb2NhdGlvbnMoKS50aGVuKGZ1bmN0aW9uIChsb2NhdGlvbnMpIHtcbiAgICAgICAgICAgIGxvY2F0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiAobG9jKSB7XG4gICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInK2xvYy5pZCsnXCI+Jytsb2MuZGlzcGxheV9uYW1lKyc8L29wdGlvbj4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHNlbGVjdC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIH0pO1xuICAgIGVsc2Uge1xuICAgICAgICAkc2F2ZS50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgJHNlbGVjdFswXS52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgICRzZWxlY3Qub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNhdmUudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgIXRoaXMudmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkgcmV0dXJuO1xuXG4gICAgICAgIHVwZGF0ZS5lbnRpdHkudXBkYXRlTG9jYXRpb24oZW50aXR5SWQsICskc2VsZWN0WzBdLnZhbHVlKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkY29sdW1uV3JhcHBlci5lbXB0eSgpO1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXJbMF0uaW5uZXJIVE1MID0gJHNlbGVjdFswXS5vcHRpb25zWyRzZWxlY3RbMF0udmFsdWVdLmlubmVyVGV4dDtcbiAgICAgICAgICAgIHRiX3JlbW92ZSgpO1xuICAgICAgICAgICAgJG1vZGFsLm9mZignY2xpY2snLCAnLnN1Ym1pdCcsIG9uU3VibWl0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdCcsIG9uU3VibWl0KTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmluZUNvb3Jkc01vZGFsID0gZnVuY3Rpb24gKCBldmVudDpFdmVudCApIHtcbiAgICB2YXIgJG1vZGFsID0gJCgnI21vZGFsTWFwJyk7XG5cbiAgICBpZiAoICEkbW9kYWxbMF0gKSBhbGVydCgnI21vZGFsTWFwIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgbWFya3VwJyk7XG4gICAgXG4gICAgdmFyIGJ1dHRvblRyaWdnZXJlcjpIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICB2YXIgZGF0YSA9IGJ1dHRvblRyaWdnZXJlci5kYXRhc2V0O1xuICAgIHZhciBsb2NhdGlvbklkID0gK2RhdGEubG9jYXRpb25JZDtcbiAgICB2YXIgJG1hcCA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvbk1hcCcpO1xuICAgIFxuICAgIC8vIFVzZSBwYXNzZWQgaW4gY29vcmRzIG9yIGRlZmF1bHQgY29vcmRzXG4gICAgdmFyIGNvb3JkcyA9IGRhdGEuY29vcmRzID8gZGF0YS5jb29yZHMuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gK3N0cjsgfSkgOiBjZERhdGEubWFwLmRlZmF1bHRDb29yZHM7XG5cbiAgICB2YXIgZWRpdE1hcCA9IGRhdGEuY29sdW1uRWRpdCA9PSAndHJ1ZSc7ICAgICAgICBcbiAgICB2YXIgcG9wdXAgPSBlZGl0TWFwICYmIEwucG9wdXAoKTtcbiAgICB2YXIgbWFwSWQgPSAkbW9kYWwuZmluZCgnLm1hcCcpWzBdLmlkO1xuICAgIHZhciBoYXNJbml0aWF0ZWQgPSAkbWFwLmhhc0NsYXNzKCdsb2FkZWQnKTtcbiAgICB2YXIgbWFwID0gaGFzSW5pdGlhdGVkID8gbWFwSW5zdGFuY2VzWzBdIDogTC5tYXAobWFwSWQsIHtcbiAgICAgICAgY2VudGVyOiBjb29yZHMsXG4gICAgICAgIHpvb206IDEzXG4gICAgfSk7XG5cbiAgICB2YXIgYWRkTWFya2VyID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgICAgICBtYXAuc2V0Vmlldyhjb29yZHMsIDEzKTtcbiAgICAgICAgdmFyIG1hcmtlciA9IEwubWFya2VyKGNvb3Jkcyk7XG4gICAgICAgIG1hcC5kYXRhLm1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgICBtYXJrZXIuYWRkVG8obWFwKTtcbiAgICB9XG5cbiAgICB2YXIgY2xvc2VQb3B1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwLmNsb3NlUG9wdXAoKTtcbiAgICB9XG5cbiAgICB2YXIgb25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZS5sb2NhdGlvbi51cGRhdGVDb29yZHMobG9jYXRpb25JZCwgY29vcmRzWzBdLCBjb29yZHNbMV0pXG4gICAgICAgIC50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICAgICAgaWYgKCBzdWNjZXNzICkge1xuICAgICAgICAgICAgICAgIGNsb3NlUG9wdXAoKTtcbiAgICAgICAgICAgICAgICBhZGRNYXJrZXIoY29vcmRzKTtcbiAgICAgICAgICAgICAgICBidXR0b25UcmlnZ2VyZXIuaW5uZXJUZXh0ID0gY2REYXRhLnRyYW5zbGF0aW9ucy52aWV3T25NYXA7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxlcnQoJ1RoZXJlIHdhcyBhbiBlcnJvciBzYXZpbmcgdGhlIGNvb3JkaW5hdGVzLicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZW1vdmUgZWFjaCBtYXJrZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IG1hcC5kYXRhLm1hcmtlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnBvcCgpLnJlbW92ZSgpO1xuXG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgICAgIC8vIFJlc2V0IGNlbnRlciB0byBkZWZhdWx0XG4gICAgICAgIG1hcC5zZXRWaWV3KGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcywgMTMpO1xuICAgICAgICAvLyBSZW1vdmUgbGlzdGVuZXJzXG4gICAgICAgIG1hcC5vZmYoJ2NsaWNrJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgZmlyc3QgdGltZSBsb2FkaW5nLCBpbml0aWF0ZSB0aGUgbWFwIGFuZCBiaW5kIGFsbCBsaXN0ZW5lcnNcbiAgICBpZiAoIWhhc0luaXRpYXRlZCkge1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArIGNkRGF0YS5tYXAuYWNjZXNzVG9rZW4sIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246IE1CX0FUVFIsXG4gICAgICAgICAgICBpZDogJ21hcGJveC9zdHJlZXRzLXYxMScsXG4gICAgICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICAgICAgem9vbU9mZnNldDogLTEsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgbWFwLmRhdGEgPSB7XG4gICAgICAgICAgICBtYXJrZXJzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gTGlzdGVuZXIgdG8gc2F2ZSBjb29yZHMgdG8gREJcbiAgICAgICAgJG1vZGFsLm9uKCdjbGljaycsICcuc3VibWl0LXllcycsIG9uU3VibWl0KS5vbignY2xpY2snLCAnLnN1Ym1pdC1ubycsIGNsb3NlUG9wdXApO1xuXG4gICAgICAgIC8vIE92ZXJyaWRlIHRoZSB0aGUgdGhpY2tib3ggbW9kYWwgY2xvc2UgbGlzdGVuZXJzXG4gICAgICAgIHZhciBvbGRfdGJfcmVtb3ZlID0gd2luZG93LnRiX3JlbW92ZTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB3aW5kb3cudGJfcmVtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlICYmIGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgb2xkX3RiX3JlbW92ZSgpO1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjVEJfb3ZlcmxheSwgI1RCX3dpbmRvdycpLm9mZignY2xpY2snKS5vbignY2xpY2snLCB3aW5kb3cudGJfcmVtb3ZlKTtcblxuICAgICAgICAkbWFwLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgaGFzSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jb29yZHMgJiYgIWVkaXRNYXApIGFkZE1hcmtlcihjb29yZHMpO1xuXG4gICAgaWYgKGVkaXRNYXApIHtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb29yZHMgPSBbZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmddO1xuICAgICAgICAgICAgcG9wdXBcbiAgICAgICAgICAgICAgICAuc2V0TGF0TG5nKGUubGF0bG5nKVxuICAgICAgICAgICAgICAgIC5zZXRDb250ZW50KFwiU2V0IHRoaXMgcGxhY2UgYXMgdGhlIGNlbnRlcj88YnIgLz48YSBjbGFzcz0nc3VibWl0LXllcyBidXR0b24tcHJpbWFyeSc+WWVzPC9hPjxhIGNsYXNzPSdidXR0b24gc3VibWl0LW5vJz5ObzwvYT5cIilcbiAgICAgICAgICAgICAgICAub3Blbk9uKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGUudGFyZ2V0LnNldFZpZXcoZS5sYXRsbmcpXG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwiLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4vLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG5cdHZhciB0aW1lb3V0O1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9O1xuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdH07XG59OyIsImltcG9ydCB7IHJlcXVpcmVQcm9kdWN0U2VydmljZSwgYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcyB9IGZyb20gJ1NjcmlwdHMvT2ZmZXJOZWVkL1Byb2R1Y3RTZXJ2aWNlVHlwZSc7XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9uIGFuIE9mZmVyc05lZWRzIHBvc3QgdHlwZSBwYWdlIChuZXcgcG9zdCBvciBlZGl0IHBvc3QpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09mUG9zdFBhZ2UoKTpib29sZWFuIHtcbiAgICByZXR1cm4gL3Bvc3QtKG5ldy0pP3BocC8udGVzdChkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSkgJiZcbiAgICAgICAgICAgKG5ldyBSZWdFeHAoYHBvc3QtdHlwZS0ke2NkRGF0YS5wb3N0VHlwZS5vZmZlcnNOZWVkc31gKSkudGVzdChkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0UG9zdFBhZ2UoKTpib29sZWFuIHtcbiAgICBpZiAoIWlzT2ZQb3N0UGFnZSgpKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXF1aXJlUHJvZHVjdFNlcnZpY2UoKTtcbiAgICBicmVhZGNydW1iUHJvZHVjdFNlcnZpY2VzKCk7XG4gICAgYXV0b2ZpbGxIYXNodGFnVGl0bGUoKTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9maWxsSGFzaHRhZ1RpdGxlKCkge1xuICAgIGNvbnN0ICR0aXRsZUlucHV0OkhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD4galF1ZXJ5KCcjdGl0bGUnKVswXTtcbiAgICBjb25zdCAkaGFzaHRhZ1RpdGxlSW5wdXQ6SFRNTElucHV0RWxlbWVudCA9XG4gICAgICAgIDxIVE1MSW5wdXRFbGVtZW50PiBqUXVlcnkoYCNhY2YtJHtjZERhdGEucGFnZXMub2ZmZXJzTmVlZHMuYWNmLmhhc2h0YWdfdGl0bGV9YClbMF07XG5cbiAgICAkdGl0bGVJbnB1dC5vbmtleXVwID0gZXZlbnQgPT4ge1xuICAgICAgICAkaGFzaHRhZ1RpdGxlSW5wdXQudmFsdWUgPSBoYXNodGFnaWZ5KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGhhc2h0YWdpZnkodGV4dDpzdHJpbmcpOnN0cmluZyB7XG4gICAgcmV0dXJuIGAjJHt0ZXh0LnNwbGl0KCcgJykubWFwKHZhbCA9PiB2YWxbMF0udG9VcHBlckNhc2UoKSArIHZhbC5zdWJzdHIoMSkpLmpvaW4oJycpfWA7XG59IiwiaW1wb3J0IGRlYm91bmNlIGZyb20gJ1NjcmlwdHMvSGVscGVyL2RlYm91bmNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVQcm9kdWN0U2VydmljZSgpIHtcbiAgICBjb25zdCAkcG9zdCA9IGpRdWVyeSgnI3Bvc3QnKTtcbiAgICBjb25zdCAkdGF4b25vbXlDb250YWluZXIgPSBqUXVlcnkoYCMke2NkRGF0YS50YXhvbm9teVR5cGUucHJvZHVjdFNlcnZpY2V9ZGl2YCkuYWRkQ2xhc3MoJ2ZvY3VzYWJsZScpXG4gICAgLy8gVGhlIHNlcmlhbGl6ZWQgZm9ybSdzIGtleSBmaWVsZFxuICAgIGNvbnN0IHByb2R1Y3RTZXJ2aWNlS2V5ID0gYHRheF9pbnB1dFske2NkRGF0YS50YXhvbm9teVR5cGUucHJvZHVjdFNlcnZpY2V9XVtdYDtcbiAgICBjb25zdCB2YWxpZGF0ZUhhc1RheG9ub215ID0gZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcHJvZHVjdFNlcnZpY2VGaWVsZHMgPSBqUXVlcnkoJyNwb3N0JylcbiAgICAgICAgICAgIC5zZXJpYWxpemVBcnJheSgpXG4gICAgICAgICAgICAuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUgPT09IHByb2R1Y3RTZXJ2aWNlS2V5KVxuICAgICAgICAgICAgLmZpbHRlcigoe3ZhbHVlfSkgPT4gdmFsdWUgIT0gJzAnKTtcblxuICAgICAgICAvLyBFdmVyeXRoaW5nIGlzIHZhbGlkXG4gICAgICAgIGlmIChwcm9kdWN0U2VydmljZUZpZWxkcy5sZW5ndGgpIHJldHVybiAkcG9zdC50cmlnZ2VyKCdzdWJtaXQnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnbWlzc2luZyB0YXgnKTtcbiAgICAgICAgLy8gT3RoZXJ3aXNl4oCmXG5cbiAgICAgICAgalF1ZXJ5KFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJHRheG9ub215Q29udGFpbmVyLm9mZnNldCgpLnRvcCArIC0xMDBcbiAgICAgICAgfSwgMjUwKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+ICR0YXhvbm9teUNvbnRhaW5lci5hZGRDbGFzcygnZm9jdXMnKSwgMjUwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiAkdGF4b25vbXlDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZvY3VzJyksIDEyNTApO1xuXG4gICAgICAgICRwb3N0Lm9uZSgnc3VibWl0JywgdmFsaWRhdGVIYXNUYXhvbm9teSk7XG4gICAgfTtcblxuICAgICRwb3N0Lm9uZSgnc3VibWl0JywgdmFsaWRhdGVIYXNUYXhvbm9teSk7XG59XG5cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVzID0ge1xuICAgIGxpc3RQYXJlbnQ6ICdwcy1wYXJlbnQnLFxuICAgIG9wZW5lZDogJ29wZW5lZCcsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcygpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0galF1ZXJ5KGAjJHtjZERhdGEudGF4b25vbXlUeXBlLnByb2R1Y3RTZXJ2aWNlfWNoZWNrbGlzdGApO1xuICAgIGlmICghJGNvbnRhaW5lci5sZW5ndGgpIHJldHVybjtcblxuICAgICRjb250YWluZXIuY2hpbGRyZW4oJ2xpJykuZWFjaChhcHBseUNoaWxkQnJlYWRjcnVtYik7XG5cbiAgICAkY29udGFpbmVyLm9uKCdjbGljaycsIGAuJHtjbGFzc05hbWVzLmxpc3RQYXJlbnR9YCwgZGVib3VuY2UoKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN0ID0galF1ZXJ5KGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjdC50b2dnbGVDbGFzcyhjbGFzc05hbWVzLm9wZW5lZCwgIWN0Lmhhc0NsYXNzKGNsYXNzTmFtZXMub3BlbmVkKSk7XG4gICAgfSwgMjUwLCB0cnVlKSk7XG4gICAgXG59XG5cbmZ1bmN0aW9uIGFwcGx5Q2hpbGRCcmVhZGNydW1iKGluZGV4LCBwb3NzaWJsZVBhcmVudCkge1xuICAgIGNvbnN0ICRwYXJlbnQgPSBqUXVlcnkocG9zc2libGVQYXJlbnQpO1xuICAgIGNvbnN0ICRjaGlsZHJlbiA9ICRwYXJlbnQuY2hpbGRyZW4oJy5jaGlsZHJlbicpLmNoaWxkcmVuKCdsaScpO1xuICAgIGlmICghJGNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgJHBhcmVudC5hZGRDbGFzcyhjbGFzc05hbWVzLmxpc3RQYXJlbnQpO1xuXG4gICAgJGNoaWxkcmVuLmVhY2goYXBwbHlDaGlsZEJyZWFkY3J1bWIpO1xufVxuIiwiXG5cbmV4cG9ydCBjb25zdCBNQl9BVFRSID0gJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcblx0XHRcdCdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nO1xuZXhwb3J0IGNvbnN0IE1CX1VSTCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgJ0FDQ0VTU19UT0tFTic7XG5leHBvcnQgY29uc3QgT1NNX1VSTCA9ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZyc7XG5leHBvcnQgY29uc3QgT1NNX0FUVFJJQiA9ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyc7XG4vLyBAdHMtaWdub3JlXG5leHBvcnQgY29uc3QgTEVBRkxFVF9MT0FERUQgPSAhIXdpbmRvdy5MO1xuXG5leHBvcnQgY29uc3QgZWxNYXJrZXIgPSBMLk1hcmtlci5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZWw6ICdhdHRhY2ggYW4gZWxlbWVudCdcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwSW5zdGFuY2VzID0gW107XG5leHBvcnQgY29uc3QgbWFwYm94VXJsID0gJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyBjZERhdGEubWFwLmFjY2Vzc1Rva2VuO1xuXG5pZiAoIExFQUZMRVRfTE9BREVEICkge1xuICAgIEwuTWFwLmFkZEluaXRIb29rKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwSW5zdGFuY2VzLnB1c2godGhpcyk7XG4gICAgfSk7XG59IiwiXG5jb25zdCBjYWNoZSA9IHtcbiAgICBsb2NhdGlvbnM6IG51bGwsXG4gICAgZW50aXRpZXM6IG51bGwsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2FjaGVkID0gY2FjaGUubG9jYXRpb25zO1xuICAgIHJldHVybiBjYWNoZWQgPyBqUXVlcnkud2hlbihjYWNoZWQpIDogalF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnbG9jYXRpb24vZ2V0JyAsXG4gICAgICAgIGRhdGE6IHsgIH0sXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICBjYWNoZS5sb2NhdGlvbnMgPSByZXNwb25zZTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEVudGl0aWVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBqUXVlcnkuZ2V0KCBjZERhdGEucmVzdEJhc2UgKyBjZERhdGEucG9zdFR5cGUuZW50aXR5ICk7XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlID0ge1xuICAgIGVudGl0eToge1xuICAgICAgICB1cGRhdGVMb2NhdGlvbjogKGVudGl0eUlkOm51bWJlciwgbG9jYXRpb25JZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnZW50aXR5L3VwZGF0ZS1lbnRpdHknLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBlbnRpdHlJZCxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25faWQ6IGxvY2F0aW9uSWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2NhdGlvbjoge1xuICAgICAgICB1cGRhdGVDb29yZHM6IChsb2NhdGlvbklkOm51bWJlciwgbGF0Om51bWJlciwgbG9uOm51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBjZERhdGEucmVzdEJhc2UgKyAnbG9jYXRpb24vdXBkYXRlLWNvb3JkcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbl9pZDogbG9jYXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgbGF0LCBsb25cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCBjZERhdGEud3Bfbm9uY2UgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL0FkbWluL1NjcmlwdHMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9