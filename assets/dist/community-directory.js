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
        var popupOpenEvent = new CustomEvent(cdData.events.map.popupOpen, { detail: { $element: $element, e: e } });
        window.dispatchEvent(popupOpenEvent);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9UaGlyZFBhcnR5L2xlYWZsZXQudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL3ZpZXdzL21hcC9tYXAudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sT0FBTyxHQUFHLG9HQUFvRztJQUN4SCx3REFBd0QsQ0FBQztBQUNyRCxJQUFNLE1BQU0sR0FBRyx1RUFBdUUsR0FBRyxjQUFjLENBQUM7QUFDeEcsSUFBTSxPQUFPLEdBQUcsb0RBQW9ELENBQUM7QUFDckUsSUFBTSxVQUFVLEdBQUcseUZBQXlGLENBQUM7QUFFN0csSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFFbEMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDcEMsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0YsRUFBRSxFQUFFLG1CQUFtQjtTQUMxQjtLQUNKO0NBQ0osQ0FBQyxDQUFDO0FBRUksSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLElBQU0sU0FBUyxHQUFHLHVFQUF1RSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBRTFILElBQUssY0FBYyxFQUFHO0lBQ2xCLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ2QsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztDQUNOOzs7Ozs7Ozs7Ozs7OztBQ3pCcUI7QUFDYztBQUVwQyxDQUFDLFVBQVUsQ0FBQztJQUVSLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQyxDQUFDO1FBQ0Usc0RBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUjJFO0FBRXRGLElBQUksQ0FBYyxDQUFDO0FBRW5CLDZCQUFlLG9DQUFTLEVBQWU7SUFDbkMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVQLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMvQixJQUFJLENBQUMsOERBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUU1QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLElBQXdCO0lBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDN0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBR3RCLElBQU0sTUFBTSxHQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQUcsSUFBSSxRQUFDLEdBQUcsRUFBSixDQUFJLENBQUMsQ0FBQztJQUV6RyxJQUFNLFlBQVksR0FBRyxVQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLEtBQUs7YUFDQSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUNuQixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXJCLFVBQVUsQ0FBQztZQUNQLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM3RCxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdSLElBQU0sY0FBYyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsWUFBRSxDQUFDLEtBQUUsRUFBRSxDQUFDLENBQUM7UUFDakcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7SUFFRixJQUFNLE9BQU8sR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztTQUM1QyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsRUFBRTtRQUNQLElBQU0sTUFBTSxHQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFDO1NBQ0QsT0FBTyxFQUFFLENBQUM7SUFFZixJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTVDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQywrREFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDM0QsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsRUFBRTtLQUNYLENBQUMsQ0FBQztJQUdILElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDZixDQUFDLENBQUMsU0FBUyxDQUFDLHlEQUFTLEVBQUU7WUFDbkIsRUFBRSxFQUFFLG1CQUFtQjtZQUN2QixRQUFRLEVBQUUsR0FBRztZQUNiLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDZCxXQUFXLEVBQUUsdURBQU87U0FDdkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVkLEdBQUcsQ0FBQyxJQUFJLEdBQUc7WUFDUCxPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUM7UUFFRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLFlBQVksR0FBRyxJQUFJLENBQUM7S0FDdkI7SUFFRCxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFFdkMsSUFBSSxJQUFJLENBQUMsWUFBWTtRQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0MsQ0FBQzs7Ozs7Ozs7Ozs7O0FDaEZEOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbW11bml0eS1kaXJlY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuZXhwb3J0IGNvbnN0IE1CX0FUVFIgPSAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuXHRcdFx0J0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPic7XG5leHBvcnQgY29uc3QgTUJfVVJMID0gJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyAnQUNDRVNTX1RPS0VOJztcbmV4cG9ydCBjb25zdCBPU01fVVJMID0gJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJztcbmV4cG9ydCBjb25zdCBPU01fQVRUUklCID0gJyZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJztcbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBjb25zdCBMRUFGTEVUX0xPQURFRCA9ICEhd2luZG93Lkw7XG5cbmV4cG9ydCBjb25zdCBlbE1hcmtlciA9IEwuTWFya2VyLmV4dGVuZCh7XG4gICAgb3B0aW9uczoge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBlbDogJ2F0dGFjaCBhbiBlbGVtZW50J1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBtYXBJbnN0YW5jZXMgPSBbXTtcbmV4cG9ydCBjb25zdCBtYXBib3hVcmwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArIGNkRGF0YS5tYXAuYWNjZXNzVG9rZW47XG5cbmlmICggTEVBRkxFVF9MT0FERUQgKSB7XG4gICAgTC5NYXAuYWRkSW5pdEhvb2soZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXBJbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICB9KTtcbn0iLCJpbXBvcnQgJy4vaW5kZXguc3R5bCc7XG5pbXBvcnQgbWFwSW5pdCBmcm9tICd2aWV3cy9tYXAvbWFwJztcblxuKGZ1bmN0aW9uICgkKSB7XG4gICAgLy8gdHMtaWdub3JlXG4gICAgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzID0gWytjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMF0sICtjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMV1dO1xuICAgICQoKCkgPT4ge1xuICAgICAgICBtYXBJbml0KCQpO1xuICAgIH0pXG59KShqUXVlcnkpOyIsImltcG9ydCB7IE1hcmtlciB9IGZyb20gJ2xlYWZsZXQnO1xuaW1wb3J0IHsgbWFwSW5zdGFuY2VzLCBMRUFGTEVUX0xPQURFRCwgTUJfQVRUUiwgbWFwYm94VXJsIH0gZnJvbSAnVGhpcmRQYXJ0eS9sZWFmbGV0JztcblxubGV0ICQ6SlF1ZXJ5U3RhdGljO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfJDpKUXVlcnlTdGF0aWMpIHtcbiAgICAkID0gXyQ7XG5cbiAgICBjb25zdCAkTWFwID0gJCgnI0luc3RhbmNlTWFwJyk7XG4gICAgaWYgKCFMRUFGTEVUX0xPQURFRCB8fCAhJE1hcC5sZW5ndGgpIHJldHVybjtcblxuICAgIGluaXRNYXAoJE1hcCk7XG59XG5cbmZ1bmN0aW9uIGluaXRNYXAoJG1hcDpKUXVlcnk8SFRNTEVsZW1lbnQ+KSB7XG4gICAgY29uc3QgZGF0YSA9ICRtYXBbMF0uZGF0YXNldDtcbiAgICBsZXQgcG9wdXAgPSBMLnBvcHVwKCk7XG4gICAgLy8gVXNlIHBhc3NlZCBpbiBjb29yZHMgb3IgZGVmYXVsdCBjb29yZHNcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgY2VudGVyOmFueSA9ICgoZGF0YS5jb29yZHMgJiYgZGF0YS5jb29yZHMuc3BsaXQoJywnKSB8fCBjZERhdGEubWFwLmRlZmF1bHRDb29yZHMpLm1hcChzdHIgPT4gK3N0cikpXG5cbiAgICBjb25zdCBtYXBPcGVuUG9wdXAgPSAoJGVsZW1lbnQsIGUpID0+IHtcbiAgICAgICAgcG9wdXBcbiAgICAgICAgICAgIC5zZXRMYXRMbmcoZS5sYXRsbmcpXG4gICAgICAgICAgICAuc2V0Q29udGVudCgkZWxlbWVudC5odG1sKCkpXG4gICAgICAgICAgICAub3Blbk9uKGUudGFyZ2V0KTtcbiAgICAgICAgbWFwLnNldFZpZXcoZS5sYXRsbmcpXG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXJQb2ludCA9IG1hcC5nZXRTaXplKCkuZGl2aWRlQnkoMik7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQb2ludCA9IGNlbnRlclBvaW50LnN1YnRyYWN0KFswLCA2MF0pO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TGF0TG5nID0gbWFwLmNvbnRhaW5lclBvaW50VG9MYXRMbmcodGFyZ2V0UG9pbnQpO1xuICAgICAgICAgICAgbWFwLnBhblRvKHRhcmdldExhdExuZyk7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICAgIFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IHBvcHVwT3BlbkV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGNkRGF0YS5ldmVudHMubWFwLnBvcHVwT3BlbiwgeyBkZXRhaWw6IHsgJGVsZW1lbnQsIGUgfSB9KTtcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQocG9wdXBPcGVuRXZlbnQpO1xuICAgIH07XG4gICAgXG4gICAgY29uc3QgbWFya2VyczpNYXJrZXJbXSA9ICRtYXAuY2hpbGRyZW4oJy5tYXJrZXInKVxuICAgICAgICAubWFwKChfLCBlbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gIEwubWFya2VyKFsrZWwuZGF0YXNldC5sYXQsICtlbC5kYXRhc2V0Lmxvbl0pO1xuICAgICAgICAgICAgaWYgKCFkYXRhLnNpbmdsZU1hcmtlcikge1xuICAgICAgICAgICAgICAgIG1hcmtlci5iaW5kUG9wdXAocG9wdXApXG4gICAgICAgICAgICAgICAgbWFya2VyLm9uKCdjbGljaycsIG1hcE9wZW5Qb3B1cC5iaW5kKG51bGwsIGpRdWVyeShlbCkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hcmtlcjtcbiAgICAgICAgfSlcbiAgICAgICAgLnRvQXJyYXkoKTtcblxuICAgIGNvbnN0IG1hcmtlckdyb3VwID0gTC5mZWF0dXJlR3JvdXAobWFya2Vycyk7XG5cbiAgICBsZXQgaGFzSW5pdGlhdGVkID0gJG1hcC5oYXNDbGFzcygnbG9hZGVkJyk7XG4gICAgY29uc3QgbWFwID0gaGFzSW5pdGlhdGVkID8gbWFwSW5zdGFuY2VzWzBdIDogTC5tYXAoJG1hcFswXS5pZCwge1xuICAgICAgICBjZW50ZXI6IGNlbnRlcixcbiAgICAgICAgem9vbTogMTNcbiAgICB9KTtcblxuICAgIC8vIElmIGZpcnN0IHRpbWUgbG9hZGluZywgaW5pdGlhdGUgdGhlIG1hcCBhbmQgYmluZCBhbGwgbGlzdGVuZXJzXG4gICAgaWYgKCFoYXNJbml0aWF0ZWQpIHtcbiAgICAgICAgTC50aWxlTGF5ZXIobWFwYm94VXJsLCB7XG4gICAgICAgICAgICBpZDogJ21hcGJveC9zdHJlZXRzLXY4JyxcbiAgICAgICAgICAgIHRpbGVTaXplOiA1MTIsXG4gICAgICAgICAgICB6b29tT2Zmc2V0OiAtMSxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBNQl9BVFRSXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgbWFwLmRhdGEgPSB7XG4gICAgICAgICAgICBtYXJrZXJzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgICRtYXAuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuICAgICAgICBoYXNJbml0aWF0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG1hcmtlckdyb3VwLmFkZFRvKG1hcCk7XG4gICAgbWFwLmZpdEJvdW5kcyhtYXJrZXJHcm91cC5nZXRCb3VuZHMoKSk7XG4gICAgXG4gICAgaWYgKGRhdGEuc2luZ2xlTWFya2VyKSBtYXAuc2V0Wm9vbSgxNik7XG59XG5cblxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvU2NyaXB0cy9pbmRleC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=