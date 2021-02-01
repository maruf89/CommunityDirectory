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
    if (window.location.search.indexOf('tab=entity') > -1)
        entityListTable();
}
function entityListTable() {
    $('#the-list').on('click', '.row-actions .delete, .row-actions .delete_entire', function (event) {
        var title = $(event.currentTarget).closest('.title').children('a')[0].innerText;
        if (!window.confirm('Are you sure you want to delete entity ' + title + '?')) {
            event.preventDefault();
            return false;
        }
    });
}
function editLocationTable($table) {
    if (!$table.length)
        return;
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
/* harmony export */   "initPostPage": () => /* binding */ initPostPage
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
    return true;
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
        event.stopPropagation();
        if (jQuery(event.target).parent().hasClass(classNames.listParent)) {
            var ct = jQuery(event.currentTarget);
            ct.toggleClass(classNames.opened, !ct.hasClass(classNames.opened));
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvQWRtaW4vU2V0dGluZ3Mvc2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvSGVscGVyL2RlYm91bmNlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL09mZmVyTmVlZC9Qb3N0UGFnZS50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9PZmZlck5lZWQvUHJvZHVjdFNlcnZpY2VUeXBlLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL1RoaXJkUGFydHkvbGVhZmxldC50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9yZXN0LnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9BZG1pbi9TY3JpcHRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7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QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29tbXVuaXR5LWRpcmVjdG9yeS1hZG1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9pbmRleC5zdHlsJztcbmltcG9ydCBpbml0TW9kYWxzIGZyb20gJ0FkbWluL3ZpZXdzL21vZGFscy9tb2RhbHMnO1xuaW1wb3J0IGluaXRTZXR0aW5ncyBmcm9tICdBZG1pbi9TZXR0aW5ncy9zZXR0aW5ncyc7XG5pbXBvcnQgeyBpbml0UG9zdFBhZ2UgfSBmcm9tICdTY3JpcHRzL09mZmVyTmVlZC9Qb3N0UGFnZSc7XG5cbnZhciBvbkJvZHlMb2FkZWQgPSBkb2N1bWVudC5ib2R5Lm9ubG9hZDtcbmRvY3VtZW50LmJvZHkub25sb2FkID0gZnVuY3Rpb24gKGV2KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcyA9IFsrY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzWzBdLCArY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzWzFdXTtcbiAgICBcbiAgICBpZiAoIG9uQm9keUxvYWRlZCAmJiBvbkJvZHlMb2FkZWQgIT09IGRvY3VtZW50LmJvZHkub25sb2FkICkgb25Cb2R5TG9hZGVkLmNhbGwodGhpcywgZXYpO1xuICAgIGNvbnN0ICQgPSBqUXVlcnk7XG5cbiAgICAvLyBDZXJ0YWluIGJ1dHRvbnMgbWF5IGJlIGRpc2FibGVkIHVudGlsIGxvYWRcbiAgICAkKCcuZW5hYmxlLW9uLWxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgZW5hYmxlLW9uLWxvYWQnKTtcblxuICAgIGluaXRNb2RhbHMoJCk7XG4gICAgaW5pdFNldHRpbmdzKCQpOyAgICBcbiAgICBpbml0UG9zdFBhZ2UoKTtcbn07IiwibGV0ICQ6SlF1ZXJ5U3RhdGljO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfJDpKUXVlcnlTdGF0aWMpIHtcbiAgICAkID0gXyQ7XG5cbiAgICBpZiAoISQoJ2JvZHkudG9wbGV2ZWxfcGFnZV9jb21tdW5pdHktZGlyZWN0b3J5JykubGVuZ3RoKSByZXR1cm47XG5cbiAgICBlZGl0TG9jYXRpb25UYWJsZSggJCgnLmVkaXQtbG9jYXRpb25zLXRhYmxlJykgKTtcbiAgICBpZiAoIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5kZXhPZigndGFiPWVudGl0eScpID4gLTEgKSBlbnRpdHlMaXN0VGFibGUoKVxufVxuXG5mdW5jdGlvbiBlbnRpdHlMaXN0VGFibGUoKSB7XG4gICAgLy8gQ29uZmlybSB1c2VyIHdhbnRzIHRvIGRlbGV0ZSBhbiBlbnRpdHkgYmVmb3JlIGRvaW5nIHNvXG4gICAgJCgnI3RoZS1saXN0Jykub24oJ2NsaWNrJywgJy5yb3ctYWN0aW9ucyAuZGVsZXRlLCAucm93LWFjdGlvbnMgLmRlbGV0ZV9lbnRpcmUnLCBldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCcudGl0bGUnKS5jaGlsZHJlbignYScpWzBdLmlubmVyVGV4dDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBlbnRpdHkgJyArIHRpdGxlICsgJz8nKSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBlZGl0TG9jYXRpb25UYWJsZSAoJHRhYmxlOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICBpZiAoISR0YWJsZS5sZW5ndGgpIHJldHVybjtcbiAgICBcbiAgICBjb25zdCAkZm9ybTpKUXVlcnk8SFRNTEVsZW1lbnQ+ID0gJCgnI21haW5mb3JtJyk7XG4gICAgbGV0IG5ld0ZpZWxkSWQ6bnVtYmVyID0gMTtcbiAgICBcbiAgICAkKCcudGFibGUtYWRkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjbG9uZUlkOm51bWJlciA9IG5ld0ZpZWxkSWQrKztcbiAgICAgICAgY29uc3QgJGNsb25lID0gJHRhYmxlLmZpbmQoJ3RyLmhpZGUnKS5jbG9uZSh0cnVlKS5yZW1vdmVDbGFzcygnaGlkZSB0YWJsZS1saW5lJyk7XG4gICAgICAgICRjbG9uZS5maW5kKCcuZWRpdC1maWVsZCcpLmVhY2goZnVuY3Rpb24gKGluZGV4Om51bWJlciwgZWw6SFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICAgICAgZWwubmFtZSA9IGVsLm5hbWUuc3Vic3RyKDAsIGVsLm5hbWUubGVuZ3RoIC0gMSkgKyBjbG9uZUlkICsgJ10nO1xuXG4gICAgICAgICAgICAvLyBNdXN0IGFkZCBjaGFuZ2VkIHRvIG5ldyBzdGF0dXMgZmllbGQgc28gaXQgZ2V0cyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGlmICgkKGVsKS5oYXNDbGFzcygnZWRpdC1zdGF0dXMnKSkgJChlbCkuYWRkQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICR0YWJsZS5hcHBlbmQoJGNsb25lKTtcbiAgICAgICAgJGNsb25lLmZpbmQoJy5lZGl0LW5hbWUnKS50cmlnZ2VyKCdmb2N1cycpO1xuICAgIH0pO1xuXG4gICAgLy8gRGVsZXRlcyBsb2NhdGlvbnMgdmlhIGFqYXhcbiAgICAkKCcudGFibGUtcmVtb3ZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCFjb25maXJtKGNkRGF0YS50cmFuc2xhdGlvbnMuZGVsZXRlTG9jYXRpb24pKSByZXR1cm47XG5cbiAgICB2YXIgbG9jSWQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJylbMF0uZGF0YXNldC5sb2NhdGlvbklkO1xuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxvY2F0aW9uX2lkOiBsb2NJZCxcbiAgICAgICAgYWN0aW9uOiAnbG9jYXRpb25fZGVsZXRlJyxcbiAgICB9O1xuXG4gICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICQucG9zdChjZERhdGEuYWpheFVybCwgZGF0YSxcbiAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkKCR0aGlzKS5jbG9zZXN0KCd0cicpLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkdGFibGUub24oJ2NoYW5nZScsICcuZWRpdC1uYW1lJywge30sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIEFkZCBjaGFuZ2VkIGNsYXNzIGlmIG5ldyB0ZXh0IGRvZXNuJ3QgbWF0Y2ggb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBlLnRhcmdldC5kYXRhc2V0Lm9yaWdpbmFsVmFsdWUgIT0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NoYW5nZWQnLCBoYXNDaGFuZ2VkKTtcbiAgICB9KTtcblxuICAgICR0YWJsZS5vbignY2hhbmdlJywgJy5lZGl0LXN0YXR1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBoYXNDaGFuZ2VkID0gZS50YXJnZXQuZGF0YXNldC5vcmlnaW5hbFZhbHVlICE9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjaGFuZ2VkJywgaGFzQ2hhbmdlZCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzdWJtaXQgKGUpIHtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gRGV0YWNoIGFsbCB1bmNoYW5nZWQgZmllbGRzXG4gICAgICAgICR0YWJsZS5maW5kKCcuZWRpdC1maWVsZDpub3QoLmNoYW5nZWQpJykuZGV0YWNoKCk7XG5cbiAgICAgICAgJGZvcm0ub2ZmKCdzdWJtaXQnLCBzdWJtaXQpLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgIH1cbiAgICBcbiAgICAkZm9ybS5vbignc3VibWl0Jywgc3VibWl0KTtcbn07IiwiaW1wb3J0IHsgbWFwSW5zdGFuY2VzLCBNQl9BVFRSIH0gZnJvbSAnVGhpcmRQYXJ0eS9sZWFmbGV0LnRzJztcbmltcG9ydCB7IGdldExvY2F0aW9ucywgdXBkYXRlIH0gZnJvbSAnU2NyaXB0cy9yZXN0JztcblxubGV0ICQ6SlF1ZXJ5U3RhdGljO1xuXG5kZWNsYXJlIGNvbnN0IEw6YW55O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfJDpKUXVlcnlTdGF0aWMpIHtcbiAgICAkID0gXyQ7XG5cbiAgICBpZiAoISQoJ2JvZHkudG9wbGV2ZWxfcGFnZV9jb21tdW5pdHktZGlyZWN0b3J5JykubGVuZ3RoKSByZXR1cm47XG5cbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcuc2VsZWN0LWxvY2F0aW9uLW1vZGFsJywgZGVmaW5lRW50aXR5TG9jYXRpb25Nb2RhbCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCAnLnNlbGVjdC1jb29yZHMtbW9kYWwnLCBkZWZpbmVDb29yZHNNb2RhbCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVFbnRpdHlMb2NhdGlvbk1vZGFsID0gZnVuY3Rpb24gKCBldmVudDpFdmVudCApIHtcbiAgICBjb25zdCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgZW50aXR5SWQgPSArdGFyZ2V0LmRhdGFzZXQuZW50aXR5SWQ7XG4gICAgY29uc3QgJG1vZGFsID0gJCgnI21vZGFsTG9jYXRpb25MaXN0Jyk7XG4gICAgY29uc3QgJGNvbHVtbldyYXBwZXIgPSAkKCcjJyArIHRhcmdldC5kYXRhc2V0LmNvbHVtbklkKTtcbiAgICBjb25zdCAkc2VsZWN0OmFueSA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvblNlbGVjdEZpZWxkJyk7XG4gICAgY29uc3QgJHNhdmUgPSAkbW9kYWwuZmluZCgnLnN1Ym1pdCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbExvY2F0aW9uTGlzdCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuXG4gICAgaWYgKCEkc2VsZWN0Lmhhc0NsYXNzKCdsb2FkZWQnKSlcbiAgICAgICAgZ2V0TG9jYXRpb25zKCkudGhlbihmdW5jdGlvbiAobG9jYXRpb25zKSB7XG4gICAgICAgICAgICBsb2NhdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24gKGxvYykge1xuICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKCc8b3B0aW9uIHZhbHVlPVwiJytsb2MuaWQrJ1wiPicrbG9jLmRpc3BsYXlfbmFtZSsnPC9vcHRpb24+Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzZWxlY3QuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuICAgICAgICB9KTtcbiAgICBlbHNlIHtcbiAgICAgICAgJHNhdmUudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICRzZWxlY3RbMF0udmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAkc2VsZWN0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzYXZlLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcsICF0aGlzLnZhbHVlKTtcbiAgICB9KTtcblxuICAgIHZhciBvblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHJldHVybjtcblxuICAgICAgICB1cGRhdGUuZW50aXR5LnVwZGF0ZUxvY2F0aW9uKGVudGl0eUlkLCArJHNlbGVjdFswXS52YWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGNvbHVtbldyYXBwZXIuZW1wdHkoKTtcbiAgICAgICAgICAgICRjb2x1bW5XcmFwcGVyWzBdLmlubmVySFRNTCA9ICRzZWxlY3RbMF0ub3B0aW9uc1skc2VsZWN0WzBdLnZhbHVlXS5pbm5lclRleHQ7XG4gICAgICAgICAgICB0Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgICRtb2RhbC5vZmYoJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkbW9kYWwub24oJ2NsaWNrJywgJy5zdWJtaXQnLCBvblN1Ym1pdCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVDb29yZHNNb2RhbCA9IGZ1bmN0aW9uICggZXZlbnQ6RXZlbnQgKSB7XG4gICAgdmFyICRtb2RhbCA9ICQoJyNtb2RhbE1hcCcpO1xuXG4gICAgaWYgKCAhJG1vZGFsWzBdICkgYWxlcnQoJyNtb2RhbE1hcCBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIG1hcmt1cCcpO1xuICAgIFxuICAgIHZhciBidXR0b25UcmlnZ2VyZXI6SFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgdmFyIGRhdGEgPSBidXR0b25UcmlnZ2VyZXIuZGF0YXNldDtcbiAgICB2YXIgbG9jYXRpb25JZCA9ICtkYXRhLmxvY2F0aW9uSWQ7XG4gICAgdmFyICRtYXAgPSAkbW9kYWwuZmluZCgnI21vZGFsTG9jYXRpb25NYXAnKTtcbiAgICBcbiAgICAvLyBVc2UgcGFzc2VkIGluIGNvb3JkcyBvciBkZWZhdWx0IGNvb3Jkc1xuICAgIHZhciBjb29yZHMgPSBkYXRhLmNvb3JkcyA/IGRhdGEuY29vcmRzLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuICtzdHI7IH0pIDogY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzO1xuXG4gICAgdmFyIGVkaXRNYXAgPSBkYXRhLmNvbHVtbkVkaXQgPT0gJ3RydWUnOyAgICAgICAgXG4gICAgdmFyIHBvcHVwID0gZWRpdE1hcCAmJiBMLnBvcHVwKCk7XG4gICAgdmFyIG1hcElkID0gJG1vZGFsLmZpbmQoJy5tYXAnKVswXS5pZDtcbiAgICB2YXIgaGFzSW5pdGlhdGVkID0gJG1hcC5oYXNDbGFzcygnbG9hZGVkJyk7XG4gICAgdmFyIG1hcCA9IGhhc0luaXRpYXRlZCA/IG1hcEluc3RhbmNlc1swXSA6IEwubWFwKG1hcElkLCB7XG4gICAgICAgIGNlbnRlcjogY29vcmRzLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZE1hcmtlciA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICAgICAgbWFwLnNldFZpZXcoY29vcmRzLCAxMyk7XG4gICAgICAgIHZhciBtYXJrZXIgPSBMLm1hcmtlcihjb29yZHMpO1xuICAgICAgICBtYXAuZGF0YS5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgbWFya2VyLmFkZFRvKG1hcCk7XG4gICAgfVxuXG4gICAgdmFyIGNsb3NlUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcC5jbG9zZVBvcHVwKCk7XG4gICAgfVxuXG4gICAgdmFyIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGUubG9jYXRpb24udXBkYXRlQ29vcmRzKGxvY2F0aW9uSWQsIGNvb3Jkc1swXSwgY29vcmRzWzFdKVxuICAgICAgICAudGhlbihzdWNjZXNzID0+IHtcbiAgICAgICAgICAgIGlmICggc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICBjbG9zZVBvcHVwKCk7XG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKGNvb3Jkcyk7XG4gICAgICAgICAgICAgICAgYnV0dG9uVHJpZ2dlcmVyLmlubmVyVGV4dCA9IGNkRGF0YS50cmFuc2xhdGlvbnMudmlld09uTWFwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsZXJ0KCdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRoZSBjb29yZGluYXRlcy4nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGVhY2ggbWFya2VyXG4gICAgICAgIGZvciAobGV0IGkgPSBtYXAuZGF0YS5tYXJrZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgbWFwLmRhdGEubWFya2Vycy5wb3AoKS5yZW1vdmUoKTtcblxuICAgICAgICBtYXAuY2xvc2VQb3B1cCgpO1xuICAgICAgICAvLyBSZXNldCBjZW50ZXIgdG8gZGVmYXVsdFxuICAgICAgICBtYXAuc2V0VmlldyhjZERhdGEubWFwLmRlZmF1bHRDb29yZHMsIDEzKTtcbiAgICAgICAgLy8gUmVtb3ZlIGxpc3RlbmVyc1xuICAgICAgICBtYXAub2ZmKCdjbGljaycpO1xuICAgIH1cblxuICAgIC8vIElmIGZpcnN0IHRpbWUgbG9hZGluZywgaW5pdGlhdGUgdGhlIG1hcCBhbmQgYmluZCBhbGwgbGlzdGVuZXJzXG4gICAgaWYgKCFoYXNJbml0aWF0ZWQpIHtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyBjZERhdGEubWFwLmFjY2Vzc1Rva2VuLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBNQl9BVFRSLFxuICAgICAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12MTEnLFxuICAgICAgICAgICAgdGlsZVNpemU6IDUxMixcbiAgICAgICAgICAgIHpvb21PZmZzZXQ6IC0xLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIG1hcC5kYXRhID0ge1xuICAgICAgICAgICAgbWFya2VyczogW11cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIExpc3RlbmVyIHRvIHNhdmUgY29vcmRzIHRvIERCXG4gICAgICAgICRtb2RhbC5vbignY2xpY2snLCAnLnN1Ym1pdC15ZXMnLCBvblN1Ym1pdCkub24oJ2NsaWNrJywgJy5zdWJtaXQtbm8nLCBjbG9zZVBvcHVwKTtcblxuICAgICAgICAvLyBPdmVycmlkZSB0aGUgdGhlIHRoaWNrYm94IG1vZGFsIGNsb3NlIGxpc3RlbmVyc1xuICAgICAgICB2YXIgb2xkX3RiX3JlbW92ZSA9IHdpbmRvdy50Yl9yZW1vdmU7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnRiX3JlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIG9sZF90Yl9yZW1vdmUoKTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI1RCX292ZXJsYXksICNUQl93aW5kb3cnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgd2luZG93LnRiX3JlbW92ZSk7XG5cbiAgICAgICAgJG1hcC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIGhhc0luaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY29vcmRzICYmICFlZGl0TWFwKSBhZGRNYXJrZXIoY29vcmRzKTtcblxuICAgIGlmIChlZGl0TWFwKSB7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29vcmRzID0gW2UubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nXTtcbiAgICAgICAgICAgIHBvcHVwXG4gICAgICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgICAgICAuc2V0Q29udGVudChcIlNldCB0aGlzIHBsYWNlIGFzIHRoZSBjZW50ZXI/PGJyIC8+PGEgY2xhc3M9J3N1Ym1pdC15ZXMgYnV0dG9uLXByaW1hcnknPlllczwvYT48YSBjbGFzcz0nYnV0dG9uIHN1Ym1pdC1ubyc+Tm88L2E+XCIpXG4gICAgICAgICAgICAgICAgLm9wZW5PbihlLnRhcmdldCk7XG4gICAgICAgICAgICBlLnRhcmdldC5zZXRWaWV3KGUubGF0bG5nKVxuICAgICAgICB9KTtcbiAgICB9XG59OyIsIi8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3Rcbi8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3Jcbi8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHR2YXIgdGltZW91dDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTsiLCJpbXBvcnQgeyByZXF1aXJlUHJvZHVjdFNlcnZpY2UsIGJyZWFkY3J1bWJQcm9kdWN0U2VydmljZXMgfSBmcm9tICdTY3JpcHRzL09mZmVyTmVlZC9Qcm9kdWN0U2VydmljZVR5cGUnO1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvbiBhbiBPZmZlcnNOZWVkcyBwb3N0IHR5cGUgcGFnZSAobmV3IHBvc3Qgb3IgZWRpdCBwb3N0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPZlBvc3RQYWdlKCk6Ym9vbGVhbiB7XG4gICAgcmV0dXJuIC9wb3N0LShuZXctKT9waHAvLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpICYmXG4gICAgICAgICAgIChuZXcgUmVnRXhwKGBwb3N0LXR5cGUtJHtjZERhdGEucG9zdFR5cGUub2ZmZXJzTmVlZHN9YCkpLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFBvc3RQYWdlKCk6Ym9vbGVhbiB7XG4gICAgaWYgKCFpc09mUG9zdFBhZ2UoKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmVxdWlyZVByb2R1Y3RTZXJ2aWNlKCk7XG4gICAgYnJlYWRjcnVtYlByb2R1Y3RTZXJ2aWNlcygpO1xuICAgIFxuICAgIHJldHVybiB0cnVlO1xufSIsImltcG9ydCBkZWJvdW5jZSBmcm9tICdTY3JpcHRzL0hlbHBlci9kZWJvdW5jZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlUHJvZHVjdFNlcnZpY2UoKSB7XG4gICAgY29uc3QgJHBvc3QgPSBqUXVlcnkoJyNwb3N0Jyk7XG4gICAgY29uc3QgJHRheG9ub215Q29udGFpbmVyID0galF1ZXJ5KGAjJHtjZERhdGEudGF4b25vbXlUeXBlLnByb2R1Y3RTZXJ2aWNlfWRpdmApLmFkZENsYXNzKCdmb2N1c2FibGUnKVxuICAgIC8vIFRoZSBzZXJpYWxpemVkIGZvcm0ncyBrZXkgZmllbGRcbiAgICBjb25zdCBwcm9kdWN0U2VydmljZUtleSA9IGB0YXhfaW5wdXRbJHtjZERhdGEudGF4b25vbXlUeXBlLnByb2R1Y3RTZXJ2aWNlfV1bXWA7XG4gICAgY29uc3QgdmFsaWRhdGVIYXNUYXhvbm9teSA9IGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHByb2R1Y3RTZXJ2aWNlRmllbGRzID0galF1ZXJ5KCcjcG9zdCcpXG4gICAgICAgICAgICAuc2VyaWFsaXplQXJyYXkoKVxuICAgICAgICAgICAgLmZpbHRlcigoe25hbWV9KSA9PiBuYW1lID09PSBwcm9kdWN0U2VydmljZUtleSlcbiAgICAgICAgICAgIC5maWx0ZXIoKHt2YWx1ZX0pID0+IHZhbHVlICE9ICcwJyk7XG5cbiAgICAgICAgLy8gRXZlcnl0aGluZyBpcyB2YWxpZFxuICAgICAgICBpZiAocHJvZHVjdFNlcnZpY2VGaWVsZHMubGVuZ3RoKSByZXR1cm4gJHBvc3QudHJpZ2dlcignc3VibWl0Jyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ21pc3NpbmcgdGF4Jyk7XG4gICAgICAgIC8vIE90aGVyd2lzZeKAplxuXG4gICAgICAgIGpRdWVyeShbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICR0YXhvbm9teUNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyAtMTAwXG4gICAgICAgIH0sIDI1MCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiAkdGF4b25vbXlDb250YWluZXIuYWRkQ2xhc3MoJ2ZvY3VzJyksIDI1MCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gJHRheG9ub215Q29udGFpbmVyLnJlbW92ZUNsYXNzKCdmb2N1cycpLCAxMjUwKTtcblxuICAgICAgICAkcG9zdC5vbmUoJ3N1Ym1pdCcsIHZhbGlkYXRlSGFzVGF4b25vbXkpO1xuICAgIH07XG5cbiAgICAkcG9zdC5vbmUoJ3N1Ym1pdCcsIHZhbGlkYXRlSGFzVGF4b25vbXkpO1xufVxuXG5leHBvcnQgY29uc3QgY2xhc3NOYW1lcyA9IHtcbiAgICBsaXN0UGFyZW50OiAncHMtcGFyZW50JyxcbiAgICBvcGVuZWQ6ICdvcGVuZWQnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJyZWFkY3J1bWJQcm9kdWN0U2VydmljZXMoKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGpRdWVyeShgIyR7Y2REYXRhLnRheG9ub215VHlwZS5wcm9kdWN0U2VydmljZX1jaGVja2xpc3RgKTtcbiAgICBpZiAoISRjb250YWluZXIubGVuZ3RoKSByZXR1cm47XG5cbiAgICAkY29udGFpbmVyLmNoaWxkcmVuKCdsaScpLmVhY2goYXBwbHlDaGlsZEJyZWFkY3J1bWIpO1xuXG4gICAgJGNvbnRhaW5lci5vbignY2xpY2snLCBgLiR7Y2xhc3NOYW1lcy5saXN0UGFyZW50fWAsIGRlYm91bmNlKGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChqUXVlcnkoZXZlbnQudGFyZ2V0KS5wYXJlbnQoKS5oYXNDbGFzcyhjbGFzc05hbWVzLmxpc3RQYXJlbnQpKSB7XG4gICAgICAgICAgICBjb25zdCBjdCA9IGpRdWVyeShldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIGN0LnRvZ2dsZUNsYXNzKGNsYXNzTmFtZXMub3BlbmVkLCAhY3QuaGFzQ2xhc3MoY2xhc3NOYW1lcy5vcGVuZWQpKTtcbiAgICAgICAgfVxuICAgIH0sIDI1MCwgdHJ1ZSkpO1xuICAgIFxufVxuXG5mdW5jdGlvbiBhcHBseUNoaWxkQnJlYWRjcnVtYihpbmRleCwgcG9zc2libGVQYXJlbnQpIHtcbiAgICBjb25zdCAkcGFyZW50ID0galF1ZXJ5KHBvc3NpYmxlUGFyZW50KTtcbiAgICBjb25zdCAkY2hpbGRyZW4gPSAkcGFyZW50LmNoaWxkcmVuKCcuY2hpbGRyZW4nKS5jaGlsZHJlbignbGknKTtcbiAgICBpZiAoISRjaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcblxuICAgICRwYXJlbnQuYWRkQ2xhc3MoY2xhc3NOYW1lcy5saXN0UGFyZW50KTtcblxuICAgICRjaGlsZHJlbi5lYWNoKGFwcGx5Q2hpbGRCcmVhZGNydW1iKTtcbn1cbiIsIlxuXG5leHBvcnQgY29uc3QgTUJfQVRUUiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG5cdFx0XHQnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JztcbmV4cG9ydCBjb25zdCBNQl9VUkwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArICdBQ0NFU1NfVE9LRU4nO1xuZXhwb3J0IGNvbnN0IE9TTV9VUkwgPSAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnO1xuZXhwb3J0IGNvbnN0IE9TTV9BVFRSSUIgPSAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnO1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IExFQUZMRVRfTE9BREVEID0gISF3aW5kb3cuTDtcblxuZXhwb3J0IGNvbnN0IGVsTWFya2VyID0gTC5NYXJrZXIuZXh0ZW5kKHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGVsOiAnYXR0YWNoIGFuIGVsZW1lbnQnXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG1hcEluc3RhbmNlcyA9IFtdO1xuZXhwb3J0IGNvbnN0IG1hcGJveFVybCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgY2REYXRhLm1hcC5hY2Nlc3NUb2tlbjtcblxuaWYgKCBMRUFGTEVUX0xPQURFRCApIHtcbiAgICBMLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcEluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgIH0pO1xufSIsIlxuY29uc3QgY2FjaGUgPSB7XG4gICAgbG9jYXRpb25zOiBudWxsLFxuICAgIGVudGl0aWVzOiBudWxsLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0TG9jYXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNhY2hlZCA9IGNhY2hlLmxvY2F0aW9ucztcbiAgICByZXR1cm4gY2FjaGVkID8galF1ZXJ5LndoZW4oY2FjaGVkKSA6IGpRdWVyeS5hamF4KHtcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2xvY2F0aW9uL2dldCcgLFxuICAgICAgICBkYXRhOiB7ICB9LFxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIGNkRGF0YS53cF9ub25jZSApO1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlc3BvbnNlICkge1xuICAgICAgICAgICAgY2FjaGUubG9jYXRpb25zID0gcmVzcG9uc2U7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRFbnRpdGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4galF1ZXJ5LmdldCggY2REYXRhLnJlc3RCYXNlICsgY2REYXRhLnBvc3RUeXBlLmVudGl0eSApO1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZSA9IHtcbiAgICBlbnRpdHk6IHtcbiAgICAgICAgdXBkYXRlTG9jYXRpb246IChlbnRpdHlJZDpudW1iZXIsIGxvY2F0aW9uSWQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2VudGl0eS91cGRhdGUtZW50aXR5JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogZW50aXR5SWQsXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uX2lkOiBsb2NhdGlvbklkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIGNkRGF0YS53cF9ub25jZSApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgICAgdXBkYXRlQ29vcmRzOiAobG9jYXRpb25JZDpudW1iZXIsIGxhdDpudW1iZXIsIGxvbjpudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogY2REYXRhLnJlc3RCYXNlICsgJ2xvY2F0aW9uL3VwZGF0ZS1jb29yZHMnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25faWQ6IGxvY2F0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgIGxhdCwgbG9uXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgY2REYXRhLndwX25vbmNlICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9BZG1pbi9TY3JpcHRzL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==