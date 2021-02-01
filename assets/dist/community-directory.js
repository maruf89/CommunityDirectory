/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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


(function ($) {
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
    $(function () {
        (0,views_map_map__WEBPACK_IMPORTED_MODULE_1__.default)($);
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
        if (!data.singleMarker) {
            marker.bindPopup(popup);
            marker.on('click', mapOpenPopup.bind(null, jQuery(el)));
        }
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
    if (data.singleMarker)
        map.setZoom(16);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9UaGlyZFBhcnR5L2xlYWZsZXQudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL3ZpZXdzL21hcC9tYXAudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sT0FBTyxHQUFHLG9HQUFvRztJQUN4SCx3REFBd0QsQ0FBQztBQUNyRCxJQUFNLE1BQU0sR0FBRyx1RUFBdUUsR0FBRyxjQUFjLENBQUM7QUFDeEcsSUFBTSxPQUFPLEdBQUcsb0RBQW9ELENBQUM7QUFDckUsSUFBTSxVQUFVLEdBQUcseUZBQXlGLENBQUM7QUFFN0csSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFFbEMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDcEMsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0YsRUFBRSxFQUFFLG1CQUFtQjtTQUMxQjtLQUNK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LENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUV2QyxJQUFJLElBQUksQ0FBQyxZQUFZO1FBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQyxDQUFDOzs7Ozs7Ozs7Ozs7QUM1RUQ7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29tbXVuaXR5LWRpcmVjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY29uc3QgTUJfQVRUUiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG5cdFx0XHQnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JztcbmV4cG9ydCBjb25zdCBNQl9VUkwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArICdBQ0NFU1NfVE9LRU4nO1xuZXhwb3J0IGNvbnN0IE9TTV9VUkwgPSAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnO1xuZXhwb3J0IGNvbnN0IE9TTV9BVFRSSUIgPSAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnO1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IExFQUZMRVRfTE9BREVEID0gISF3aW5kb3cuTDtcblxuZXhwb3J0IGNvbnN0IGVsTWFya2VyID0gTC5NYXJrZXIuZXh0ZW5kKHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGVsOiAnYXR0YWNoIGFuIGVsZW1lbnQnXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG1hcEluc3RhbmNlcyA9IFtdO1xuZXhwb3J0IGNvbnN0IG1hcGJveFVybCA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgY2REYXRhLm1hcC5hY2Nlc3NUb2tlbjtcblxuaWYgKCBMRUFGTEVUX0xPQURFRCApIHtcbiAgICBMLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcEluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgIH0pO1xufSIsImltcG9ydCAnLi9pbmRleC5zdHlsJztcbmltcG9ydCBtYXBJbml0IGZyb20gJ3ZpZXdzL21hcC9tYXAnO1xuXG4oZnVuY3Rpb24gKCQpIHtcbiAgICAvLyB0cy1pZ25vcmVcbiAgICBjZERhdGEubWFwLmRlZmF1bHRDb29yZHMgPSBbK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1swXSwgK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1sxXV07XG4gICAgJCgoKSA9PiB7XG4gICAgICAgIG1hcEluaXQoJCk7XG4gICAgfSlcbn0pKGpRdWVyeSk7IiwiaW1wb3J0IHsgTWFya2VyIH0gZnJvbSAnbGVhZmxldCc7XG5pbXBvcnQgeyBtYXBJbnN0YW5jZXMsIExFQUZMRVRfTE9BREVELCBNQl9BVFRSLCBtYXBib3hVcmwgfSBmcm9tICdUaGlyZFBhcnR5L2xlYWZsZXQnO1xuXG5sZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGNvbnN0ICRNYXAgPSAkKCcjSW5zdGFuY2VNYXAnKTtcbiAgICBpZiAoIUxFQUZMRVRfTE9BREVEIHx8ICEkTWFwLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgaW5pdE1hcCgkTWFwKTtcbn1cblxuZnVuY3Rpb24gaW5pdE1hcCgkbWFwOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCBkYXRhID0gJG1hcFswXS5kYXRhc2V0O1xuICAgIGxldCBwb3B1cCA9IEwucG9wdXAoKTtcbiAgICAvLyBVc2UgcGFzc2VkIGluIGNvb3JkcyBvciBkZWZhdWx0IGNvb3Jkc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjZW50ZXI6YW55ID0gKChkYXRhLmNvb3JkcyAmJiBkYXRhLmNvb3Jkcy5zcGxpdCgnLCcpIHx8IGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcykubWFwKHN0ciA9PiArc3RyKSlcblxuICAgIGNvbnN0IG1hcE9wZW5Qb3B1cCA9ICgkZWxlbWVudCwgZSkgPT4ge1xuICAgICAgICBwb3B1cFxuICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgIC5zZXRDb250ZW50KCRlbGVtZW50Lmh0bWwoKSlcbiAgICAgICAgICAgIC5vcGVuT24oZS50YXJnZXQpO1xuICAgICAgICBtYXAuc2V0VmlldyhlLmxhdGxuZylcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlclBvaW50ID0gbWFwLmdldFNpemUoKS5kaXZpZGVCeSgyKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBvaW50ID0gY2VudGVyUG9pbnQuc3VidHJhY3QoWzAsIDYwXSk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMYXRMbmcgPSBtYXAuY29udGFpbmVyUG9pbnRUb0xhdExuZyh0YXJnZXRQb2ludCk7XG4gICAgICAgICAgICBtYXAucGFuVG8odGFyZ2V0TGF0TG5nKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IG1hcmtlcnM6TWFya2VyW10gPSAkbWFwLmNoaWxkcmVuKCcubWFya2VyJylcbiAgICAgICAgLm1hcCgoXywgZWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9ICBMLm1hcmtlcihbK2VsLmRhdGFzZXQubGF0LCArZWwuZGF0YXNldC5sb25dKTtcbiAgICAgICAgICAgIGlmICghZGF0YS5zaW5nbGVNYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBtYXJrZXIuYmluZFBvcHVwKHBvcHVwKVxuICAgICAgICAgICAgICAgIG1hcmtlci5vbignY2xpY2snLCBtYXBPcGVuUG9wdXAuYmluZChudWxsLCBqUXVlcnkoZWwpKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXJrZXI7XG4gICAgICAgIH0pXG4gICAgICAgIC50b0FycmF5KCk7XG5cbiAgICBjb25zdCBtYXJrZXJHcm91cCA9IEwuZmVhdHVyZUdyb3VwKG1hcmtlcnMpO1xuXG4gICAgbGV0IGhhc0luaXRpYXRlZCA9ICRtYXAuaGFzQ2xhc3MoJ2xvYWRlZCcpO1xuICAgIGNvbnN0IG1hcCA9IGhhc0luaXRpYXRlZCA/IG1hcEluc3RhbmNlc1swXSA6IEwubWFwKCRtYXBbMF0uaWQsIHtcbiAgICAgICAgY2VudGVyOiBjZW50ZXIsXG4gICAgICAgIHpvb206IDEzXG4gICAgfSk7XG5cbiAgICAvLyBJZiBmaXJzdCB0aW1lIGxvYWRpbmcsIGluaXRpYXRlIHRoZSBtYXAgYW5kIGJpbmQgYWxsIGxpc3RlbmVyc1xuICAgIGlmICghaGFzSW5pdGlhdGVkKSB7XG4gICAgICAgIEwudGlsZUxheWVyKG1hcGJveFVybCwge1xuICAgICAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12OCcsXG4gICAgICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICAgICAgem9vbU9mZnNldDogLTEsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogTUJfQVRUUlxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIG1hcC5kYXRhID0ge1xuICAgICAgICAgICAgbWFya2VyczogW11cbiAgICAgICAgfTtcblxuICAgICAgICAkbWFwLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgaGFzSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBtYXJrZXJHcm91cC5hZGRUbyhtYXApO1xuICAgIG1hcC5maXRCb3VuZHMobWFya2VyR3JvdXAuZ2V0Qm91bmRzKCkpO1xuICAgIFxuICAgIGlmIChkYXRhLnNpbmdsZU1hcmtlcikgbWFwLnNldFpvb20oMTYpO1xufVxuXG5cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL1NjcmlwdHMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9