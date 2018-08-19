webpackJsonp([0],{

/***/ 109:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 109;

/***/ }),

/***/ 150:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 150;

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_media__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_midi_util_midi__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ionic_native_file_path__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, file, media, fileChooser, filePath) {
        this.navCtrl = navCtrl;
        this.file = file;
        this.media = media;
        this.fileChooser = fileChooser;
        this.filePath = filePath;
    }
    HomePage.prototype.selectFileURI = function () {
        var _this = this;
        this.fileChooser.open()
            .then(function (uri) {
            _this.fileUri = uri;
            _this.filePath.resolveNativePath(uri)
                .then(function (path) { return _this.fileConvertedPath = path; })
                .catch(function (e) { return console.log(e); });
        })
            .catch(function (e) { return console.log(e); });
    };
    HomePage.prototype.playMidiFile = function () {
        //const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
        var file = this.media.create(this.fileConvertedPath);
        file.play();
    };
    HomePage.prototype.loadMidi = function () {
        /*alert(this.fileConvertedPath.substr(0, this.fileConvertedPath.lastIndexOf('/')));
        alert(this.fileConvertedPath.substr(this.fileConvertedPath.lastIndexOf('/') + 1));*/
        var _this = this;
        this.file.readAsBinaryString(this.fileConvertedPath.substr(0, this.fileConvertedPath.lastIndexOf('/')), this.fileConvertedPath.substr(this.fileConvertedPath.lastIndexOf('/') + 1))
            .then(function (a) {
            try {
                _this.actualMidiFile = a;
                var midi = new __WEBPACK_IMPORTED_MODULE_4__app_midi_util_midi__["a" /* Midi */]();
                midi.setupMidiFromFile(a);
                _this.midi = midi;
            }
            catch (e) {
                alert(JSON.stringify(e));
            }
        }).catch(function (e) {
            alert(JSON.stringify(e));
        });
    };
    HomePage.prototype.createNewMidiFile = function () {
        alert(this.file.cacheDirectory);
        this.file.createFile(this.file.cacheDirectory, 'newMidiFile.mid', true)
            .then(function (a) { return alert(JSON.stringify(a)); })
            .catch(function (e) { return alert(JSON.stringify(e)); });
        /*let options: IWriteOptions = { replace: true };
        alert(this.actualMidiFile);
        this.fileConvertedPath = this.file.cacheDirectory + 'newMidiFile.mid'
        this.file.writeFile(this.file.cacheDirectory ,'newMidiFile.mid', this.actualMidiFile, options)
          .then(a => alert(JSON.stringify(a)))
          .catch(e => alert(JSON.stringify(e)));*/
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tag\teste\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Midi SandBox\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <p>\n    File URI: {{fileUri}}\n    <br>\n    File Path: {{fileConvertedPath}}\n    <br>\n    <!--Loaded Midi: {{JSON.stringify(midi)}}-->\n  </p>\n  <button ion-button full (click)=\'selectFileURI()\'>Find File</button>\n  <button ion-button full *ngIf=\'this.fileConvertedPath\' (click)=\'playMidiFile()\'>Play Midi File</button>\n  <button ion-button full *ngIf=\'this.fileConvertedPath\' (click)=\'loadMidi()\'>Load Midi</button>\n  <button ion-button full *ngIf=\'this.midi\' (click)=\'createNewMidiFile()\'>Generate New Midi</button>\n  <button ion-button full *ngIf=\'this.midi\' (click)=\'playNewMidiFile()\'>Play New Midi File</button>\n\n  <button ion-button full (click)=\'vai()\'>Vai</button>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tag\teste\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_media__["a" /* Media */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__["a" /* FileChooser */], __WEBPACK_IMPORTED_MODULE_6__node_modules_ionic_native_file_path__["a" /* FilePath */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(221);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_media__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_file_chooser__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_file_path__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_media__["a" /* Media */],
                //MediaObject
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_file_chooser__["a" /* FileChooser */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_file_path__["a" /* FilePath */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(193);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tag\teste\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tag\teste\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Midi; });
/* unused harmony export MidiTrack */
/* unused harmony export MidiEvent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hexa__ = __webpack_require__(273);

var Midi = /** @class */ (function () {
    function Midi() {
    }
    Object.defineProperty(Midi.prototype, "midiType", {
        get: function () {
            return this._midiType;
        },
        set: function (midiType) {
            this._midiType = midiType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midi.prototype, "numberOfTracks", {
        get: function () {
            return this._numberOfTracks;
        },
        set: function (numberOfTracks) {
            this._numberOfTracks = numberOfTracks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midi.prototype, "timeDivision", {
        get: function () {
            return this._timeDivision;
        },
        set: function (timeDivision) {
            this._timeDivision = timeDivision;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midi.prototype, "midiTracks", {
        get: function () {
            return this._midiTracks;
        },
        set: function (midiTracks) {
            this._midiTracks = midiTracks;
        },
        enumerable: true,
        configurable: true
    });
    Midi.prototype.setupMidiFromFile = function (binaryString) {
        if (binaryString.substr(0, 4) != 'MThd') {
            throw Error('Midi file must start with "MThd" header indication');
        }
        var fileMidiType = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToNumber(binaryString.substr(8, 2));
        if (fileMidiType > 0 || fileMidiType < 0) {
            throw Error('Midi file type must be 0');
        }
        this.midiType = fileMidiType;
        var fileNumberOfTracks = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToNumber(binaryString.substr(10, 2));
        this.numberOfTracks = fileNumberOfTracks;
        var fileTimeDividion = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(binaryString.substr(12, 2));
        this.timeDivision = fileTimeDividion;
        if (binaryString.substr(14, 4) != 'MTrk') {
            throw Error('Midi file track must start with "MTrk" header indication');
        }
        this.midiTracks = [];
        var midiTrack = new MidiTrack();
        var deltaTime = 0;
        for (var i = 22; i < binaryString.length;) {
            //deltaTime
            var deltaTimeStart = i;
            var deltaTimeLength = 1;
            while (!__WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].isLastDeltaTimeByte(binaryString.charAt(deltaTimeStart + deltaTimeLength - 1))) {
                deltaTimeLength++;
                //lança exceção se passar de 4
            }
            //let teste = binaryString.substr(deltaTimeStart, deltaTimeLength);
            //calcula delta time
            deltaTime += __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].calculateDeltaTime(binaryString.substr(deltaTimeStart, deltaTimeLength));
            i += deltaTimeLength;
            //create event or sum delta time
            var midiEvent = MidiEvent.getMidiEventData(deltaTime, binaryString.substr(i));
            //add event to track
            if (midiEvent.loadEvent) {
                deltaTime = 0;
                midiTrack.addMidiEvent(midiEvent);
            }
            i += midiEvent.getDataLength();
        }
        var ggg = 0;
    };
    return Midi;
}());

var MidiTrack = /** @class */ (function () {
    function MidiTrack() {
        this.midiEvents = [];
    }
    Object.defineProperty(MidiTrack.prototype, "midiEvents", {
        get: function () {
            return this._midiEvents;
        },
        set: function (midiEvents) {
            this._midiEvents = midiEvents;
        },
        enumerable: true,
        configurable: true
    });
    MidiTrack.prototype.addMidiEvent = function (midiEvent) {
        this.midiEvents.push(midiEvent);
    };
    return MidiTrack;
}());

var MidiEvent = /** @class */ (function () {
    function MidiEvent(deltaTime, midiEventType, midiEventData, loadEvent) {
        this.deltaTime = deltaTime;
        this.midiEventType = midiEventType;
        this.midiEventData = midiEventData;
        this.loadEvent = loadEvent;
    }
    Object.defineProperty(MidiEvent.prototype, "deltaTime", {
        get: function () {
            return this._deltaTime;
        },
        set: function (deltaTime) {
            this._deltaTime = deltaTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MidiEvent.prototype, "midiEventType", {
        get: function () {
            return this._midiEventType;
        },
        set: function (midiEventType) {
            this._midiEventType = midiEventType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MidiEvent.prototype, "midiEventData", {
        get: function () {
            return this._midiEventData;
        },
        set: function (midiEventData) {
            this._midiEventData = midiEventData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MidiEvent.prototype, "loadEvent", {
        get: function () {
            return this._loadEvent;
        },
        set: function (loadEvent) {
            this._loadEvent = loadEvent;
        },
        enumerable: true,
        configurable: true
    });
    MidiEvent.prototype.getDataLength = function () {
        return this.midiEventData.length / 2;
    };
    MidiEvent.getMidiEventData = function (deltaTime, midiData) {
        var firstEventByte = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 1));
        switch (firstEventByte.charAt(0)) {
            case '8':
                return new MidiEvent(__WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].getDeltaTimeStringFromNumber(deltaTime), MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3)), true);
            case '9':
                return new MidiEvent(__WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].getDeltaTimeStringFromNumber(deltaTime), MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3)), true);
            case 'a':
                return new MidiEvent('', MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3)), false);
            case 'b':
                return new MidiEvent('', MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3)), false);
            case 'c':
                return new MidiEvent('', MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 2)), false);
            case 'd':
                return new MidiEvent('', MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 2)), false);
            case 'e' || 'e':
                return new MidiEvent('', MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3)), false);
            case 'f':
                if (firstEventByte == 'f0' || firstEventByte == 'f7') {
                    return new MidiEvent('', MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 2 + __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToNumber(midiData.charAt(1)))), false);
                }
                if (firstEventByte == 'ff') {
                    var eventTypeByte = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.charAt(1));
                    return new MidiEvent(__WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].getDeltaTimeStringFromNumber(deltaTime), MidiEventType.MIDI_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3 + __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToNumber(midiData.charAt(2)))), eventTypeByte == '58' || eventTypeByte == '59' || eventTypeByte == '2f');
                }
                throw Error('Não mapeado...');
            default:
                throw Error('Não mapeado...');
        }
        //return null;
    };
    return MidiEvent;
}());

var MidiType;
(function (MidiType) {
    MidiType[MidiType["TYPE_0"] = 0] = "TYPE_0";
    MidiType[MidiType["TYPE_1"] = 1] = "TYPE_1";
    MidiType[MidiType["TYPE_2"] = 2] = "TYPE_2";
})(MidiType || (MidiType = {}));
var MidiEventType;
(function (MidiEventType) {
    MidiEventType[MidiEventType["MIDI_EVENT"] = 0] = "MIDI_EVENT";
    MidiEventType[MidiEventType["SYSEX_EVENT"] = 1] = "SYSEX_EVENT";
    MidiEventType[MidiEventType["META_EVENT"] = 2] = "META_EVENT";
})(MidiEventType || (MidiEventType = {}));
//# sourceMappingURL=midi.js.map

/***/ }),

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConvertionUtil; });
var ConvertionUtil = /** @class */ (function () {
    function ConvertionUtil() {
    }
    ConvertionUtil.convertBinaryStringToNumber = function (binaryString) {
        var hexString = ConvertionUtil.convertBinaryStringToHexString(binaryString);
        return parseInt(hexString, 16);
    };
    ConvertionUtil.convertBinaryStringToHexString = function (binaryString) {
        var hexString = '';
        var tempHexString;
        for (var i = 0; i < binaryString.length; i++) {
            tempHexString = binaryString.charCodeAt(i).toString(16);
            if (tempHexString.length < 2) {
                tempHexString = '0' + tempHexString;
            }
            hexString += tempHexString;
        }
        return hexString;
    };
    ConvertionUtil.isLastDeltaTimeByte = function (binaryString) {
        var binString = binaryString.charCodeAt(0).toString(2);
        return !(binString.length == 8 && binString.charAt(0) == '1');
    };
    ConvertionUtil.calculateDeltaTime = function (binaryString) {
        var binaryDeltaTime = '';
        for (var _i = 0, binaryString_1 = binaryString; _i < binaryString_1.length; _i++) {
            var str = binaryString_1[_i];
            var aaa = str.charCodeAt(0);
            var bbb = str.charCodeAt(0).toString(2);
            binaryDeltaTime += this.completeBits(str.charCodeAt(0).toString(2), 7);
        }
        return parseInt(binaryDeltaTime, 2);
    };
    ConvertionUtil.getDeltaTimeStringFromNumber = function (deltaTime) {
        var tempDeltaTimeBinary = deltaTime.toString(2);
        var deltaTimeBinary = '';
        var lastByte = false;
        while (tempDeltaTimeBinary.length >= 7) {
            deltaTimeBinary = (lastByte ? '1' : '0') + tempDeltaTimeBinary.substr(tempDeltaTimeBinary.length - 7, 7) + deltaTimeBinary;
            if (!lastByte) {
                lastByte = true;
            }
            tempDeltaTimeBinary = tempDeltaTimeBinary.substr(0, tempDeltaTimeBinary.length - 7);
        }
        if (tempDeltaTimeBinary.length > 0) {
            for (var i = tempDeltaTimeBinary.length; i < 7; i++) {
                tempDeltaTimeBinary = '0' + tempDeltaTimeBinary;
            }
            deltaTimeBinary = (lastByte ? '1' : '0') + tempDeltaTimeBinary.substr(tempDeltaTimeBinary.length - 7, 7) + deltaTimeBinary;
            if (!lastByte) {
                lastByte = true;
            }
        }
        var hexDeltaTime = parseInt(deltaTimeBinary, 2).toString(16);
        return (hexDeltaTime.length % 2 == 1 ? '0' : '') + hexDeltaTime;
    };
    ConvertionUtil.completeBits = function (binaryString, maxBits) {
        if (maxBits === void 0) { maxBits = 8; }
        if (binaryString.length >= maxBits) {
            return binaryString.substr(binaryString.length - maxBits, maxBits);
        }
        var newBinaryString = binaryString;
        for (var i = binaryString.length; i < maxBits; i++) {
            newBinaryString = '0' + newBinaryString;
        }
        return newBinaryString;
    };
    return ConvertionUtil;
}());

//# sourceMappingURL=hexa.js.map

/***/ })

},[198]);
//# sourceMappingURL=main.js.map