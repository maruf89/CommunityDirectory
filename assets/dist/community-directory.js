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

/***/ "./src/Scripts/index.ts":
/*!******************************!*\
  !*** ./src/Scripts/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_styl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.styl */ "./src/Scripts/index.styl");
/* harmony import */ var views_location_location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! views/location/location */ "./src/views/location/location.ts");


(function ($) {
    $(function () {
        (0,views_location_location__WEBPACK_IMPORTED_MODULE_1__.default)($);
    });
})(jQuery);


/***/ }),

/***/ "./src/views/location/location.ts":
/*!****************************************!*\
  !*** ./src/views/location/location.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ThirdParty/leaflet */ "./src/Scripts/ThirdParty/leaflet.ts");

var $;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(_$) {
    $ = _$;
    var $Map = $('#LocationMap');
    if (!ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.LEAFLET_LOADED || !$Map.length)
        return;
    initMap($Map);
}
function initMap($map) {
    var data = $map[0].dataset;
    var coords = ((data.coords && data.coords.split(',') || cdData.map.defaultCoords).map(function (str) { return +str; }));
    var markers = $map.children('.marker')
        .map(function (_, el) { return [[+el.dataset.lat, +el.dataset.lon]]; })
        .toArray();
    var hasInitiated = $map.hasClass('loaded');
    var map = hasInitiated ? ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.mapInstances[0] : L.map($map[0].id, {
        center: coords,
        zoom: 13
    });
    if (!hasInitiated) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + cdData.map.accessToken, {
            maxZoom: 18,
            attribution: ThirdParty_leaflet__WEBPACK_IMPORTED_MODULE_0__.MB_ATTR,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);
        map.data = {
            markers: []
        };
        $map.addClass('loaded');
        hasInitiated = true;
    }
    var addMarker = function (coords) {
        map.setView(coords, 13);
        var marker = L.marker(coords);
        map.data.markers.push(marker);
        marker.addTo(map);
    };
    markers.forEach(addMarker);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9UaGlyZFBhcnR5L2xlYWZsZXQudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL3ZpZXdzL2xvY2F0aW9uL2xvY2F0aW9uLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sSUFBTSxPQUFPLEdBQUcsb0dBQW9HO0lBQ3hILHdEQUF3RCxDQUFDO0FBQ3JELElBQU0sTUFBTSxHQUFHLHVFQUF1RSxHQUFHLGNBQWMsQ0FBQztBQUN4RyxJQUFNLE9BQU8sR0FBRyxvREFBb0QsQ0FBQztBQUNyRSxJQUFNLFVBQVUsR0FBRyx5RkFBeUYsQ0FBQztBQUU3RyxJQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUVsQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFFL0IsSUFBSyxjQUFjLEVBQUc7SUFDbEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFDZCxZQUFZLENBQUMsSUFB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Ozs7Ozs7Ozs7Ozs7QUM3REQ7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29tbXVuaXR5LWRpcmVjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY29uc3QgTUJfQVRUUiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG5cdFx0XHQnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JztcbmV4cG9ydCBjb25zdCBNQl9VUkwgPSAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArICdBQ0NFU1NfVE9LRU4nO1xuZXhwb3J0IGNvbnN0IE9TTV9VUkwgPSAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnO1xuZXhwb3J0IGNvbnN0IE9TTV9BVFRSSUIgPSAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnO1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IExFQUZMRVRfTE9BREVEID0gISF3aW5kb3cuTDtcblxuZXhwb3J0IGNvbnN0IG1hcEluc3RhbmNlcyA9IFtdO1xuXG5pZiAoIExFQUZMRVRfTE9BREVEICkge1xuICAgIEwuTWFwLmFkZEluaXRIb29rKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFwSW5zdGFuY2VzLnB1c2godGhpcyk7XG4gICAgfSk7XG59IiwiaW1wb3J0ICcuL2luZGV4LnN0eWwnO1xuaW1wb3J0IGxvY2F0aW9uSW5pdCBmcm9tICd2aWV3cy9sb2NhdGlvbi9sb2NhdGlvbic7XG5cbihmdW5jdGlvbiAoJCkge1xuICAgICQoKCkgPT4ge1xuICAgICAgICBsb2NhdGlvbkluaXQoJCk7XG4gICAgfSlcbn0pKGpRdWVyeSk7IiwiaW1wb3J0IHsgTGF0TG5nVHVwbGUgfSBmcm9tICdsZWFmbGV0JztcbmltcG9ydCB7IG1hcEluc3RhbmNlcywgTEVBRkxFVF9MT0FERUQsIE1CX0FUVFIgfSBmcm9tICdUaGlyZFBhcnR5L2xlYWZsZXQnO1xuXG5sZXQgJDpKUXVlcnlTdGF0aWM7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8kOkpRdWVyeVN0YXRpYykge1xuICAgICQgPSBfJDtcblxuICAgIGNvbnN0ICRNYXAgPSAkKCcjTG9jYXRpb25NYXAnKTtcbiAgICBpZiAoIUxFQUZMRVRfTE9BREVEIHx8ICEkTWFwLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgaW5pdE1hcCgkTWFwKTtcbn1cblxuZnVuY3Rpb24gaW5pdE1hcCgkbWFwOkpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICAvLyB2YXIgYnV0dG9uVHJpZ2dlcmVyID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciBkYXRhID0gJG1hcFswXS5kYXRhc2V0O1xuICAgIC8vIHZhciBsb2NhdGlvbklkID0gK2RhdGEubG9jYXRpb25JZDtcbiAgICAvLyB2YXIgJG1hcCA9ICRtb2RhbC5maW5kKCcjbW9kYWxMb2NhdGlvbk1hcCcpO1xuICAgIFxuICAgIC8vIC8vIFVzZSBwYXNzZWQgaW4gY29vcmRzIG9yIGRlZmF1bHQgY29vcmRzXG4gICAgdmFyIGNvb3JkczphbnkgPSAoKGRhdGEuY29vcmRzICYmIGRhdGEuY29vcmRzLnNwbGl0KCcsJykgfHwgY2REYXRhLm1hcC5kZWZhdWx0Q29vcmRzKS5tYXAoc3RyID0+ICtzdHIpKVxuICAgIGNvbnN0IG1hcmtlcnM6YW55ID0gJG1hcC5jaGlsZHJlbignLm1hcmtlcicpXG4gICAgICAgIC5tYXAoKF8sIGVsKSA9PiBbWytlbC5kYXRhc2V0LmxhdCwgK2VsLmRhdGFzZXQubG9uXV0pXG4gICAgICAgIC50b0FycmF5KCk7XG5cbiAgICAvLyB2YXIgZWRpdE1hcCA9IGRhdGEuY29sdW1uRWRpdCA9PSAndHJ1ZSc7ICAgICAgICBcbiAgICAvLyB2YXIgcG9wdXAgPSBlZGl0TWFwICYmIEwucG9wdXAoKTtcbiAgICAvLyB2YXIgbWFwSWQgPSAkbW9kYWwuZmluZCgnLm1hcCcpWzBdLmlkO1xuICAgIGxldCBoYXNJbml0aWF0ZWQgPSAkbWFwLmhhc0NsYXNzKCdsb2FkZWQnKTtcbiAgICBjb25zdCBtYXAgPSBoYXNJbml0aWF0ZWQgPyBtYXBJbnN0YW5jZXNbMF0gOiBMLm1hcCgkbWFwWzBdLmlkLCB7XG4gICAgICAgIGNlbnRlcjogY29vcmRzLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgLy8gSWYgZmlyc3QgdGltZSBsb2FkaW5nLCBpbml0aWF0ZSB0aGUgbWFwIGFuZCBiaW5kIGFsbCBsaXN0ZW5lcnNcbiAgICBpZiAoIWhhc0luaXRpYXRlZCkge1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEve2lkfS90aWxlcy97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49JyArIGNkRGF0YS5tYXAuYWNjZXNzVG9rZW4sIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246IE1CX0FUVFIsXG4gICAgICAgICAgICBpZDogJ21hcGJveC9zdHJlZXRzLXYxMScsXG4gICAgICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICAgICAgem9vbU9mZnNldDogLTEsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgbWFwLmRhdGEgPSB7XG4gICAgICAgICAgICBtYXJrZXJzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgICRtYXAuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuICAgICAgICBoYXNJbml0aWF0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZE1hcmtlciA9IGNvb3JkcyA9PiB7XG4gICAgICAgIG1hcC5zZXRWaWV3KGNvb3JkcywgMTMpO1xuICAgICAgICB2YXIgbWFya2VyID0gTC5tYXJrZXIoY29vcmRzKTtcbiAgICAgICAgbWFwLmRhdGEubWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICAgIG1hcmtlci5hZGRUbyhtYXApO1xuICAgIH1cblxuICAgIG1hcmtlcnMuZm9yRWFjaChhZGRNYXJrZXIpO1xufSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL1NjcmlwdHMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9