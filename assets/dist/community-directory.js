/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/Scripts/index.ts":
/*!******************************!*\
  !*** ./src/Scripts/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_styl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.styl */ "./src/Scripts/index.styl");
/* harmony import */ var views_map_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! views/map/map */ "./src/views/map/map.ts");
/* harmony import */ var Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Scripts/OfferNeed/ProductServiceType */ "./src/Scripts/OfferNeed/ProductServiceType.ts");



(function ($) {
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    $(function () {
        (0,views_map_map__WEBPACK_IMPORTED_MODULE_1__.default)($);
        if (Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_2__.isOfPostPage())
            Scripts_OfferNeed_ProductServiceType__WEBPACK_IMPORTED_MODULE_2__.breadcrumbProductServices();
    });
})(jQuery);


/***/ }),

/***/ "./src/views/map/map.ts":
/*!******************************!*\
  !*** ./src/views/map/map.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ThirdParty/leaflet */ "./src/Scripts/ThirdParty/leaflet.ts");

var $;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(_$) {
    $ = _$;
    var $Map = $('#InstanceMap');
    if (!ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.LEAFLET_LOADED || !$Map.length)
        return;
    initMap($Map);
}
function initMap($map) {
    var data = $map[0].dataset;
    var popup = L.popup();
    var center = ((data.coords && data.coords.split(',') || cdData.map.defaultCoords).map(function (str) { return +str; }));
    var mapOpenPopup = function ($element, e) {
        popup
            .setLatLng(e.latlng)
            .setContent($element.html())
            .openOn(e.target);
        map.setView(e.latlng);
        setTimeout(function () {
            var centerPoint = map.getSize().divideBy(2);
            var targetPoint = centerPoint.subtract([0, 60]);
            var targetLatLng = map.containerPointToLatLng(targetPoint);
            map.panTo(targetLatLng);
        }, 250);
    };
    var markers = $map.children('.marker')
        .map(function (_, el) {
        var marker = L.marker([+el.dataset.lat, +el.dataset.lon]);
        marker.bindPopup(popup);
        marker.on('click', mapOpenPopup.bind(null, jQuery(el)));
        return marker;
    })
        .toArray();
    var markerGroup = L.featureGroup(markers);
    var hasInitiated = $map.hasClass('loaded');
    var map = hasInitiated ? ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.mapInstances[0] : L.map($map[0].id, {
        center: center,
        zoom: 13
    });
    if (!hasInitiated) {
        L.tileLayer(ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.mapboxUrl, {
            id: 'mapbox/streets-v8',
            tileSize: 512,
            zoomOffset: -1,
            attribution: ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.MB_ATTR
        }).addTo(map);
        map.data = {
            markers: []
        };
        $map.addClass('loaded');
        hasInitiated = true;
    }
    markerGroup.addTo(map);
    map.fitBounds(markerGroup.getBounds());
}


/***/ }),

/***/ "./src/Scripts/index.styl":
/*!********************************!*\
  !*** ./src/Scripts/index.styl ***!
  \********************************/
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
/******/ 	__webpack_require__("./src/Scripts/index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9IZWxwZXIvZGVib3VuY2UudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvT2ZmZXJOZWVkL1Byb2R1Y3RTZXJ2aWNlVHlwZS50cyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9UaGlyZFBhcnR5L2xlYWZsZXQudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL3ZpZXdzL21hcC9tYXAudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBSWUsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTO0lBQ3JELElBQUksT0FBTyxDQUFDO0lBQ1osT0FBTztRQUNOLElBQUksT0FBTyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHO1lBQ1gsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFT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UyxFQUFFLENBQUMsQ0FBQztBQUMzQyxDQUFDOzs7Ozs7Ozs7Ozs7QUN4RUQ7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29tbXVuaXR5LWRpcmVjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3Rcbi8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3Jcbi8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHR2YXIgdGltZW91dDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTsiLCJpbXBvcnQgZGVib3VuY2UgZnJvbSAnU2NyaXB0cy9IZWxwZXIvZGVib3VuY2UnO1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvbiBhbiBPZmZlcnNOZWVkcyBwb3N0IHR5cGUgcGFnZSAobmV3IHBvc3Qgb3IgZWRpdCBwb3N0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPZlBvc3RQYWdlKCk6Ym9vbGVhbiB7XG4gICAgcmV0dXJuIC9wb3N0LShuZXctKT9waHAvLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpICYmXG4gICAgICAgICAgIChuZXcgUmVnRXhwKGBwb3N0LXR5cGUtJHtjZERhdGEucG9zdFR5cGUub2ZmZXJzTmVlZHN9YCkpLnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgY2xhc3NOYW1lcyA9IHtcbiAgICBsaXN0UGFyZW50OiAncHMtcGFyZW50JyxcbiAgICBvcGVuZWQ6ICdvcGVuZWQnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJyZWFkY3J1bWJQcm9kdWN0U2VydmljZXMoKSB7XG4gICAgY29uc3QgY29udGFpbmVySWQgPSBjZERhdGEudGF4b25vbXlUeXBlLnByb2R1Y3RTZXJ2aWNlO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBqUXVlcnkoYCMke2NvbnRhaW5lcklkfWNoZWNrbGlzdGApO1xuICAgIGlmICghJGNvbnRhaW5lci5sZW5ndGgpIHJldHVybjtcblxuICAgICRjb250YWluZXIuY2hpbGRyZW4oJ2xpJykuZWFjaChhcHBseUNoaWxkQnJlYWRjcnVtYik7XG5cbiAgICAkY29udGFpbmVyLm9uKCdjbGljaycsIGAuJHtjbGFzc05hbWVzLmxpc3RQYXJlbnR9YCwgZGVib3VuY2UoKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN0ID0galF1ZXJ5KGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjdC50b2dnbGVDbGFzcyhjbGFzc05hbWVzLm9wZW5lZCwgIWN0Lmhhc0NsYXNzKGNsYXNzTmFtZXMub3BlbmVkKSk7XG4gICAgfSwgMjUwLCB0cnVlKSk7XG4gICAgXG59XG5cbmZ1bmN0aW9uIGFwcGx5Q2hpbGRCcmVhZGNydW1iKGluZGV4LCBwb3NzaWJsZVBhcmVudCkge1xuICAgIGNvbnN0ICRwYXJlbnQgPSBqUXVlcnkocG9zc2libGVQYXJlbnQpO1xuICAgIGNvbnN0ICRjaGlsZHJlbiA9ICRwYXJlbnQuY2hpbGRyZW4oJy5jaGlsZHJlbicpLmNoaWxkcmVuKCdsaScpO1xuICAgIGlmICghJGNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgJHBhcmVudC5hZGRDbGFzcyhjbGFzc05hbWVzLmxpc3RQYXJlbnQpO1xuXG4gICAgJGNoaWxkcmVuLmVhY2goYXBwbHlDaGlsZEJyZWFkY3J1bWIpO1xufSIsIlxuXG5leHBvcnQgY29uc3QgTUJfQVRUUiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG5cdFx0XHQnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JztcbmV4cG9ydCBjb25zdCBNQl9VUkwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArICdBQ0NFU1NfVE9LRU4nO1xuZXhwb3J0IGNvbnN0IE9TTV9VUkwgPSAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnO1xuZXhwb3J0IGNvbnN0IE9TTV9BVFRSSUIgPSAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnO1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IExFQUZMRVRfTE9BREVEID0gISF3aW5kb3cuTDtcblxuZXhwb3J0IGNvbnN0IGVsTWFya2VyID0gTC5NYXJrZXIuZXh0ZW5kKHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGVsOiAnYXR0YWNoIGFuIGVsZW1lbnQnXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG1hcEluc3RhbmNlcyA9IFtdO1xuZXhwb3J0IGNvbnN0IG1hcGJveFVybCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgY2REYXRhLm1hcC5hY2Nlc3NUb2tlbjtcblxuaWYgKCBMRUFGTEVUX0xPQURFRCApIHtcbiAgICBMLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcEluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgIH0pO1xufSIsImltcG9ydCAnLi9pbmRleC5zdHlsJztcbmltcG9ydCBtYXBJbml0IGZyb20gJ3ZpZXdzL21hcC9tYXAnO1xuaW1wb3J0ICogYXMgU2VydmljZVR5cGUgZnJvbSAnU2NyaXB0cy9PZmZlck5lZWQvUHJvZHVjdFNlcnZpY2VUeXBlJztcblxuKGZ1bmN0aW9uICgkKSB7XG4gICAgLy8gdHMtaWdub3JlXG4gICAgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzID0gWytjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMF0sICtjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMV1dO1xuICAgICQoKCkgPT4ge1xuICAgICAgICBtYXBJbml0KCQpO1xuICAgICAgICBpZiAoU2VydmljZVR5cGUuaXNPZlBvc3RQYWdlKCkpIFNlcnZpY2VUeXBlLmJyZWFkY3J1bWJQcm9kdWN0U2VydmljZXMoKTtcbiAgICB9KVxufSkoalF1ZXJ5KTsiLCJpbXBvcnQgeyBMYXRMbmdUdXBsZSwgTWFya2VyIH0gZnJvbSAnbGVhZmxldCc7XG5pbXBvcnQgeyBtYXBJbnN0YW5jZXMsIExFQUZMRVRfTE9BREVELCBNQl9BVFRSLCBtYXBib3hVcmwgfSBmcm9tICdUaGlyZFBhcnR5L2xlYWZsZXQnO1xuXG5sZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGNvbnN0ICRNYXAgPSAkKCcjSW5zdGFuY2VNYXAnKTtcbiAgICBpZiAoIUxFQUZMRVRfTE9BREVEIHx8ICEkTWFwLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgaW5pdE1hcCgkTWFwKTtcbn1cblxuZnVuY3Rpb24gaW5pdE1hcCgkbWFwOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCBkYXRhID0gJG1hcFswXS5kYXRhc2V0O1xuICAgIGxldCBwb3B1cCA9IEwucG9wdXAoKTtcbiAgICAvLyBVc2UgcGFzc2VkIGluIGNvb3JkcyBvciBkZWZhdWx0IGNvb3Jkc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjZW50ZXI6YW55ID0gKChkYXRhLmNvb3JkcyAmJiBkYXRhLmNvb3Jkcy5zcGxpdCgnLCcpIHx8IGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcykubWFwKHN0ciA9PiArc3RyKSlcblxuICAgIGNvbnN0IG1hcE9wZW5Qb3B1cCA9ICgkZWxlbWVudCwgZSkgPT4ge1xuICAgICAgICBwb3B1cFxuICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgIC5zZXRDb250ZW50KCRlbGVtZW50Lmh0bWwoKSlcbiAgICAgICAgICAgIC5vcGVuT24oZS50YXJnZXQpO1xuICAgICAgICBtYXAuc2V0VmlldyhlLmxhdGxuZylcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlclBvaW50ID0gbWFwLmdldFNpemUoKS5kaXZpZGVCeSgyKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBvaW50ID0gY2VudGVyUG9pbnQuc3VidHJhY3QoWzAsIDYwXSk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMYXRMbmcgPSBtYXAuY29udGFpbmVyUG9pbnRUb0xhdExuZyh0YXJnZXRQb2ludCk7XG4gICAgICAgICAgICBtYXAucGFuVG8odGFyZ2V0TGF0TG5nKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IG1hcmtlcnM6TWFya2VyW10gPSAkbWFwLmNoaWxkcmVuKCcubWFya2VyJylcbiAgICAgICAgLm1hcCgoXywgZWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9ICBMLm1hcmtlcihbK2VsLmRhdGFzZXQubGF0LCArZWwuZGF0YXNldC5sb25dKTtcbiAgICAgICAgICAgIG1hcmtlci5iaW5kUG9wdXAocG9wdXApXG4gICAgICAgICAgICBtYXJrZXIub24oJ2NsaWNrJywgbWFwT3BlblBvcHVwLmJpbmQobnVsbCwgalF1ZXJ5KGVsKSkpXG4gICAgICAgICAgICByZXR1cm4gbWFya2VyO1xuICAgICAgICB9KVxuICAgICAgICAudG9BcnJheSgpO1xuXG4gICAgY29uc3QgbWFya2VyR3JvdXAgPSBMLmZlYXR1cmVHcm91cChtYXJrZXJzKTtcblxuICAgIGxldCBoYXNJbml0aWF0ZWQgPSAkbWFwLmhhc0NsYXNzKCdsb2FkZWQnKTtcbiAgICBjb25zdCBtYXAgPSBoYXNJbml0aWF0ZWQgPyBtYXBJbnN0YW5jZXNbMF0gOiBMLm1hcCgkbWFwWzBdLmlkLCB7XG4gICAgICAgIGNlbnRlcjogY2VudGVyLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgLy8gSWYgZmlyc3QgdGltZSBsb2FkaW5nLCBpbml0aWF0ZSB0aGUgbWFwIGFuZCBiaW5kIGFsbCBsaXN0ZW5lcnNcbiAgICBpZiAoIWhhc0luaXRpYXRlZCkge1xuICAgICAgICBMLnRpbGVMYXllcihtYXBib3hVcmwsIHtcbiAgICAgICAgICAgIGlkOiAnbWFwYm94L3N0cmVldHMtdjgnLFxuICAgICAgICAgICAgdGlsZVNpemU6IDUxMixcbiAgICAgICAgICAgIHpvb21PZmZzZXQ6IC0xLFxuICAgICAgICAgICAgYXR0cmlidXRpb246IE1CX0FUVFJcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBtYXAuZGF0YSA9IHtcbiAgICAgICAgICAgIG1hcmtlcnM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgJG1hcC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIGhhc0luaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgbWFya2VyR3JvdXAuYWRkVG8obWFwKTtcbiAgICBtYXAuZml0Qm91bmRzKG1hcmtlckdyb3VwLmdldEJvdW5kcygpKTtcbn1cblxuXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9TY3JpcHRzL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==