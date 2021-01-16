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

/***/ "./src/Scripts/index.ts":
/*!******************************!*\
  !*** ./src/Scripts/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_styl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.styl */ "./src/Scripts/index.styl");
/* harmony import */ var views_location_location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! views/location/location */ "./src/views/location/location.ts");


(function ($) {
    cdData.map.defaultCoords = [+cdData.map.defaultCoords[0], +cdData.map.defaultCoords[1]];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QcmllTXVzZXMtVGhlbWUvLi9zcmMvU2NyaXB0cy9UaGlyZFBhcnR5L2xlYWZsZXQudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL1NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lLy4vc3JjL3ZpZXdzL2xvY2F0aW9uL2xvY2F0aW9uLnRzIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS8uL3NyYy9TY3JpcHRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ByaWVNdXNlcy1UaGVtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUHJpZU11c2VzLVRoZW1lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sT0FBTyxHQUFHLG9HQUFvRztJQUN4SCx3REFBd0QsQ0FBQztBQUNyRCxJQUFNLE1BQU0sR0FBRyx1RUFBdUUsR0FBRyxjQUFjLENBQUM7QUFDeEcsSUFBTSxPQUFPLEdBQUcsb0RBQW9ELENBQUM7QUFDckUsSUFBTSxVQUFVLEdBQUcseUZBQXlGLENBQUM7QUFFN0csSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFFbEMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDcEMsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0YsRUFBRSxFQUFFLG1CQUFtQjtT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Ozs7Ozs7O0FDMUVEOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbW11bml0eS1kaXJlY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuZXhwb3J0IGNvbnN0IE1CX0FUVFIgPSAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuXHRcdFx0J0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPic7XG5leHBvcnQgY29uc3QgTUJfVVJMID0gJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPScgKyAnQUNDRVNTX1RPS0VOJztcbmV4cG9ydCBjb25zdCBPU01fVVJMID0gJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJztcbmV4cG9ydCBjb25zdCBPU01fQVRUUklCID0gJyZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJztcbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBjb25zdCBMRUFGTEVUX0xPQURFRCA9ICEhd2luZG93Lkw7XG5cbmV4cG9ydCBjb25zdCBlbE1hcmtlciA9IEwuTWFya2VyLmV4dGVuZCh7XG4gICAgb3B0aW9uczoge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBlbDogJ2F0dGFjaCBhbiBlbGVtZW50J1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBtYXBJbnN0YW5jZXMgPSBbXTtcblxuaWYgKCBMRUFGTEVUX0xPQURFRCApIHtcbiAgICBMLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1hcEluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgIH0pO1xufSIsImltcG9ydCAnLi9pbmRleC5zdHlsJztcbmltcG9ydCBsb2NhdGlvbkluaXQgZnJvbSAndmlld3MvbG9jYXRpb24vbG9jYXRpb24nO1xuXG4oZnVuY3Rpb24gKCQpIHtcbiAgICAvLyB0cy1pZ25vcmVcbiAgICBjZERhdGEubWFwLmRlZmF1bHRDb29yZHMgPSBbK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1swXSwgK2NkRGF0YS5tYXAuZGVmYXVsdENvb3Jkc1sxXV07XG4gICAgJCgoKSA9PiB7XG4gICAgICAgIGxvY2F0aW9uSW5pdCgkKTtcbiAgICB9KVxufSkoalF1ZXJ5KTsiLCJpbXBvcnQgeyBMYXRMbmdUdXBsZSwgTWFya2VyIH0gZnJvbSAnbGVhZmxldCc7XG5pbXBvcnQgeyBtYXBJbnN0YW5jZXMsIExFQUZMRVRfTE9BREVELCBNQl9BVFRSIH0gZnJvbSAnVGhpcmRQYXJ0eS9sZWFmbGV0JztcblxubGV0ICQ6SlF1ZXJ5U3RhdGljO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfJDpKUXVlcnlTdGF0aWMpIHtcbiAgICAkID0gXyQ7XG5cbiAgICBjb25zdCAkTWFwID0gJCgnI0xvY2F0aW9uTWFwJyk7XG4gICAgaWYgKCFMRUFGTEVUX0xPQURFRCB8fCAhJE1hcC5sZW5ndGgpIHJldHVybjtcblxuICAgIGluaXRNYXAoJE1hcCk7XG59XG5cbmZ1bmN0aW9uIGluaXRNYXAoJG1hcDpKUXVlcnk8SFRNTEVsZW1lbnQ+KSB7XG4gICAgY29uc3QgZGF0YSA9ICRtYXBbMF0uZGF0YXNldDtcbiAgICBsZXQgcG9wdXAgPSBMLnBvcHVwKCk7XG4gICAgLy8gLy8gVXNlIHBhc3NlZCBpbiBjb29yZHMgb3IgZGVmYXVsdCBjb29yZHNcbiAgICBjb25zdCBjZW50ZXI6YW55ID0gKChkYXRhLmNvb3JkcyAmJiBkYXRhLmNvb3Jkcy5zcGxpdCgnLCcpIHx8IGNkRGF0YS5tYXAuZGVmYXVsdENvb3JkcykubWFwKHN0ciA9PiArc3RyKSlcblxuICAgIGNvbnN0IG1hcE9wZW5Qb3B1cCA9ICgkZWxlbWVudCwgZSkgPT4ge1xuICAgICAgICBwb3B1cFxuICAgICAgICAgICAgLnNldExhdExuZyhlLmxhdGxuZylcbiAgICAgICAgICAgIC5zZXRDb250ZW50KCRlbGVtZW50Lmh0bWwoKSlcbiAgICAgICAgICAgIC5vcGVuT24oZS50YXJnZXQpO1xuICAgICAgICBtYXAuc2V0VmlldyhlLmxhdGxuZylcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlclBvaW50ID0gbWFwLmdldFNpemUoKS5kaXZpZGVCeSgyKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBvaW50ID0gY2VudGVyUG9pbnQuc3VidHJhY3QoWzAsIDYwXSk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMYXRMbmcgPSBtYXAuY29udGFpbmVyUG9pbnRUb0xhdExuZyh0YXJnZXRQb2ludCk7XG4gICAgICAgICAgICBtYXAucGFuVG8odGFyZ2V0TGF0TG5nKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IG1hcmtlcnM6TWFya2VyW10gPSAkbWFwLmNoaWxkcmVuKCcubWFya2VyJylcbiAgICAgICAgLm1hcCgoXywgZWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9ICBMLm1hcmtlcihbK2VsLmRhdGFzZXQubGF0LCArZWwuZGF0YXNldC5sb25dKTtcbiAgICAgICAgICAgIG1hcmtlci5iaW5kUG9wdXAocG9wdXApXG4gICAgICAgICAgICBtYXJrZXIub24oJ2NsaWNrJywgbWFwT3BlblBvcHVwLmJpbmQobnVsbCwgalF1ZXJ5KGVsKSkpXG4gICAgICAgICAgICByZXR1cm4gbWFya2VyO1xuICAgICAgICB9KVxuICAgICAgICAudG9BcnJheSgpO1xuXG4gICAgY29uc3QgbWFya2VyR3JvdXAgPSBMLmZlYXR1cmVHcm91cChtYXJrZXJzKTtcblxuICAgIGxldCBoYXNJbml0aWF0ZWQgPSAkbWFwLmhhc0NsYXNzKCdsb2FkZWQnKTtcbiAgICBjb25zdCBtYXAgPSBoYXNJbml0aWF0ZWQgPyBtYXBJbnN0YW5jZXNbMF0gOiBMLm1hcCgkbWFwWzBdLmlkLCB7XG4gICAgICAgIGNlbnRlcjogY2VudGVyLFxuICAgICAgICB6b29tOiAxM1xuICAgIH0pO1xuXG4gICAgXG5cbiAgICAvLyBJZiBmaXJzdCB0aW1lIGxvYWRpbmcsIGluaXRpYXRlIHRoZSBtYXAgYW5kIGJpbmQgYWxsIGxpc3RlbmVyc1xuICAgIGlmICghaGFzSW5pdGlhdGVkKSB7XG4gICAgICAgIEwudGlsZUxheWVyKCdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS97aWR9L3RpbGVzL3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj0nICsgY2REYXRhLm1hcC5hY2Nlc3NUb2tlbiwge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogTUJfQVRUUixcbiAgICAgICAgICAgIGlkOiAnbWFwYm94L3N0cmVldHMtdjExJyxcbiAgICAgICAgICAgIHRpbGVTaXplOiA1MTIsXG4gICAgICAgICAgICB6b29tT2Zmc2V0OiAtMSxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBtYXAuZGF0YSA9IHtcbiAgICAgICAgICAgIG1hcmtlcnM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgJG1hcC5hZGRDbGFzcygnbG9hZGVkJyk7XG4gICAgICAgIGhhc0luaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgbWFya2VyR3JvdXAuYWRkVG8obWFwKTtcbiAgICBtYXAuZml0Qm91bmRzKG1hcmtlckdyb3VwLmdldEJvdW5kcygpKTtcbn1cblxuXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9TY3JpcHRzL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==