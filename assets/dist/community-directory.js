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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9UaGlyZFBhcnR5L2xlYWZsZXQudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL3ZpZXdzL21hcC9tYXAudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXguc3R5bCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sT0FBTyxHQUFHLG9HQUFvRztJQUN4SCx3REFBd0QsQ0FBQztBQUNyRCxJQUFNLE1BQU0sR0FBRyx1RUFBdUUsR0FBRyxjQUFjLENBQUM7QUFDeEcsSUFBTSxPQUFPLEdBQUcsb0RBQW9ELENBQUM7QUFDckUsSUFBTSxVQUFVLEdBQUcseUZBQXlGLENBQUM7QUFFN0csSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFFbEMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDcEMsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0YsRUFBRSxFQUFFLG1CQUFtQjtTQUMxQjtLQUNK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Ozs7Ozs7O0FDeEVEOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbW11bml0eS1kaXJlY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuZXhwb3J0IGNvbnN0IE1CX0FUVFIgPSAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuXHRcdFx0J0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPic7XG5leHBvcnQgY29uc3QgTUJfVVJMID0gJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyAnQUNDRVNTX1RPS0VOJztcbmV4cG9ydCBjb25zdCBPU01fVVJMID0gJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJztcbmV4cG9ydCBjb25zdCBPU01fQVRUUklCID0gJyZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJztcbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBjb25zdCBMRUFGTEVUX0xPQURFRCA9ICEhd2luZG93Lkw7XG5cbmV4cG9ydCBjb25zdCBlbE1hcmtlciA9IEwuTWFya2VyLmV4dGVuZCh7XG4gICAgb3B0aW9uczoge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBlbDogJ2F0dGFjaCBhbiBlbGVtZW50J1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBtYXBJbnN0YW5jZXMgPSBbXTtcbmV4cG9ydCBjb25zdCBtYXBib3hVcmwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArIGNkRGF0YS5tYXAuYWNjZXNzVG9rZW47XG5cbmlmICggTEVBRkxFVF9MT0FERUQgKSB7XG4gICAgTC5NYXAuYWRkSW5pdEhvb2soZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXBJbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICB9KTtcbn0iLCJpbXBvcnQgJy4vaW5kZXguc3R5bCc7XG5pbXBvcnQgbWFwSW5pdCBmcm9tICd2aWV3cy9tYXAvbWFwJztcblxuKGZ1bmN0aW9uICgkKSB7XG4gICAgLy8gdHMtaWdub3JlXG4gICAgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzID0gWytjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMF0sICtjZERhdGEubWFwLmRlZmF1bHRDb29yZHNbMV1dO1xuICAgICQoKCkgPT4ge1xuICAgICAgICBtYXBJbml0KCQpO1xuICAgIH0pXG59KShqUXVlcnkpOyIsImltcG9ydCB7IExhdExuZ1R1cGxlLCBNYXJrZXIgfSBmcm9tICdsZWFmbGV0JztcbmltcG9ydCB7IG1hcEluc3RhbmNlcywgTEVBRkxFVF9MT0FERUQsIE1CX0FUVFIsIG1hcGJveFVybCB9IGZyb20gJ1RoaXJkUGFydHkvbGVhZmxldCc7XG5cbmxldCAkOkpRdWVyeVN0YXRpYztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXyQ6SlF1ZXJ5U3RhdGljKSB7XG4gICAgJCA9IF8kO1xuXG4gICAgY29uc3QgJE1hcCA9ICQoJyNJbnN0YW5jZU1hcCcpO1xuICAgIGlmICghTEVBRkxFVF9MT0FERUQgfHwgISRNYXAubGVuZ3RoKSByZXR1cm47XG5cbiAgICBpbml0TWFwKCRNYXApO1xufVxuXG5mdW5jdGlvbiBpbml0TWFwKCRtYXA6SlF1ZXJ5PEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGRhdGEgPSAkbWFwWzBdLmRhdGFzZXQ7XG4gICAgbGV0IHBvcHVwID0gTC5wb3B1cCgpO1xuICAgIC8vIFVzZSBwYXNzZWQgaW4gY29vcmRzIG9yIGRlZmF1bHQgY29vcmRzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNlbnRlcjphbnkgPSAoKGRhdGEuY29vcmRzICYmIGRhdGEuY29vcmRzLnNwbGl0KCcsJykgfHwgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzKS5tYXAoc3RyID0+ICtzdHIpKVxuXG4gICAgY29uc3QgbWFwT3BlblBvcHVwID0gKCRlbGVtZW50LCBlKSA9PiB7XG4gICAgICAgIHBvcHVwXG4gICAgICAgICAgICAuc2V0TGF0TG5nKGUubGF0bG5nKVxuICAgICAgICAgICAgLnNldENvbnRlbnQoJGVsZW1lbnQuaHRtbCgpKVxuICAgICAgICAgICAgLm9wZW5PbihlLnRhcmdldCk7XG4gICAgICAgIG1hcC5zZXRWaWV3KGUubGF0bG5nKVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2VudGVyUG9pbnQgPSBtYXAuZ2V0U2l6ZSgpLmRpdmlkZUJ5KDIpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UG9pbnQgPSBjZW50ZXJQb2ludC5zdWJ0cmFjdChbMCwgNjBdKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldExhdExuZyA9IG1hcC5jb250YWluZXJQb2ludFRvTGF0TG5nKHRhcmdldFBvaW50KTtcbiAgICAgICAgICAgIG1hcC5wYW5Ubyh0YXJnZXRMYXRMbmcpO1xuICAgICAgICB9LCAyNTApO1xuICAgIH07XG4gICAgXG4gICAgY29uc3QgbWFya2VyczpNYXJrZXJbXSA9ICRtYXAuY2hpbGRyZW4oJy5tYXJrZXInKVxuICAgICAgICAubWFwKChfLCBlbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gIEwubWFya2VyKFsrZWwuZGF0YXNldC5sYXQsICtlbC5kYXRhc2V0Lmxvbl0pO1xuICAgICAgICAgICAgbWFya2VyLmJpbmRQb3B1cChwb3B1cClcbiAgICAgICAgICAgIG1hcmtlci5vbignY2xpY2snLCBtYXBPcGVuUG9wdXAuYmluZChudWxsLCBqUXVlcnkoZWwpKSlcbiAgICAgICAgICAgIHJldHVybiBtYXJrZXI7XG4gICAgICAgIH0pXG4gICAgICAgIC50b0FycmF5KCk7XG5cbiAgICBjb25zdCBtYXJrZXJHcm91cCA9IEwuZmVhdHVyZUdyb3VwKG1hcmtlcnMpO1xuXG4gICAgbGV0IGhhc0luaXRpYXRlZCA9ICRtYXAuaGFzQ2xhc3MoJ2xvYWRlZCcpO1xuICAgIGNvbnN0IG1hcCA9IGhhc0luaXRpYXRlZCA/IG1hcEluc3RhbmNlc1swXSA6IEwubWFwKCRtYXBbMF0uaWQsIHtcbiAgICAgICAgY2VudGVyOiBjZW50ZXIsXG4gICAgICAgIHpvb206IDEzXG4gICAgfSk7XG5cbiAgICAvLyBJZiBmaXJzdCB0aW1lIGxvYWRpbmcsIGluaXRpYXRlIHRoZSBtYXAgYW5kIGJpbmQgYWxsIGxpc3RlbmVyc1xuICAgIGlmICghaGFzSW5pdGlhdGVkKSB7XG4gICAgICAgIEwudGlsZUxheWVyKG1hcGJveFVybCwge1xuICAgICAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12OCcsXG4gICAgICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICAgICAgem9vbU9mZnNldDogLTEsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogTUJfQVRUUlxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIG1hcC5kYXRhID0ge1xuICAgICAgICAgICAgbWFya2VyczogW11cbiAgICAgICAgfTtcblxuICAgICAgICAkbWFwLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgaGFzSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBtYXJrZXJHcm91cC5hZGRUbyhtYXApO1xuICAgIG1hcC5maXRCb3VuZHMobWFya2VyR3JvdXAuZ2V0Qm91bmRzKCkpO1xufVxuXG5cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL1NjcmlwdHMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9