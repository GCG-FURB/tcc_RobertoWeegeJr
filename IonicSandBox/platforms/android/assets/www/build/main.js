webpackJsonp([2],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SumFiles; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_media__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_file__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_midi_util_midi__ = __webpack_require__(156);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





/**
 * Generated class for the VisualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SumFiles = /** @class */ (function () {
    function SumFiles(navCtrl, navParams, media, file) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.media = media;
        this.file = file;
        this.melodiaMidiPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Melodia.mid';
        this.harmoniaMidiPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Harmonia.mid';
        this.bassMidiPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Bass.mid';
    }
    SumFiles.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SumFiles');
    };
    SumFiles.prototype.playMidiFile = function (path) {
        //const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
        try {
            var file = this.media.create(path);
            file.play();
        }
        catch (e) {
            alert('erro ' + e);
        }
    };
    SumFiles.prototype.sumFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var melodia, harmonia, bass, newMidi, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.loadMidi(this.melodiaMidiPath)];
                    case 1:
                        melodia = _a.sent();
                        return [4 /*yield*/, this.loadMidi(this.harmoniaMidiPath)];
                    case 2:
                        harmonia = _a.sent();
                        return [4 /*yield*/, this.loadMidi(this.bassMidiPath)];
                    case 3:
                        bass = _a.sent();
                        newMidi = new __WEBPACK_IMPORTED_MODULE_4__app_midi_util_midi__["a" /* Midi */]();
                        return [4 /*yield*/, newMidi.generateMidiType1([melodia, harmonia, bass])];
                    case 4:
                        _a.sent();
                        this.createNewMidiFile(newMidi);
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        alert(JSON.stringify(e_1));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SumFiles.prototype.loadMidi = function (fileConvertedPath) {
        return __awaiter(this, void 0, void 0, function () {
            var midi, m, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        midi = new __WEBPACK_IMPORTED_MODULE_4__app_midi_util_midi__["a" /* Midi */]();
                        return [4 /*yield*/, this.file.readAsBinaryString(fileConvertedPath.substr(0, fileConvertedPath.lastIndexOf('/')), fileConvertedPath.substr(fileConvertedPath.lastIndexOf('/') + 1))];
                    case 1:
                        m = _a.sent();
                        midi.setupMidiFromFile(m);
                        return [2 /*return*/, midi];
                    case 2:
                        e_2 = _a.sent();
                        alert(JSON.stringify(e_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SumFiles.prototype.createNewMidiFile = function (midi) {
        /*alert(this.file.externalDataDirectory);
        this.file.createFile(this.file.externalDataDirectory ,'newMidiFile.mid', true)
        .then(a => alert(JSON.stringify(a)))
        .catch(e => alert(JSON.stringify(e)));*/
        var _this = this;
        var options = { replace: true };
        var newMidi = midi.getBinaryString();
        var len = newMidi.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = newMidi.charCodeAt(i);
        }
        this.file.writeFile(this.file.externalDataDirectory, 'newMidiFileSum.mid', bytes.buffer, options)
            .then(function (a) { return _this.fileNewConvertedPath = _this.file.externalDataDirectory + 'newMidiFileSum.mid'; })
            .catch(function (e) { return alert(JSON.stringify(e)); });
    };
    SumFiles = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-sum-files',template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\sum-files\sum-files.html"*/'<!--\n\n  Generated template for the VisualPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n    <ion-navbar>\n\n      <ion-title>Sum file</ion-title>\n\n    </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n\n\n    <ion-card>  \n\n        <ion-card-header>\n\n        Cabeçalho geral\n\n        </ion-card-header>\n\n    </ion-card>\n\n    <button ion-button full *ngIf=\'this.melodiaMidiPath\'      (click)=\'playMidiFile(this.melodiaMidiPath)\'>Play Melodia</button>\n\n    <button ion-button full *ngIf=\'this.harmoniaMidiPath\'     (click)=\'playMidiFile(this.harmoniaMidiPath)\'>Play Harmonia</button>\n\n    <button ion-button full *ngIf=\'this.bassMidiPath\'         (click)=\'playMidiFile(this.bassMidiPath)\'>Play Bass</button>\n\n    <button ion-button full *ngIf=\'this.melodiaMidiPath\'      (click)=\'sumFiles()\'>Generate New Midi</button>\n\n    <button ion-button full *ngIf=\'this.fileNewConvertedPath\' (click)=\'playMidiFile(this.fileNewConvertedPath)\'>Play New Midi File</button>\n\n    \n\n</ion-content>\n\n  '/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\sum-files\sum-files.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_media__["a" /* Media */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_file__["a" /* File */]])
    ], SumFiles);
    return SumFiles;
}());

//# sourceMappingURL=sum-files.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VisualPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the VisualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VisualPage = /** @class */ (function () {
    function VisualPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    VisualPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad VisualPage');
    };
    VisualPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-visual',template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\visual\visual.html"*/'<!--\n  Generated template for the VisualPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>visual</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n  <ion-card>\n\n    <ion-card-header>\n      Cabeçalho geral\n    </ion-card-header>\n  \n    <ion-card-content class="inline-class">\n      <button ion-button icon-only clear large>\n        <ion-icon name="play"></ion-icon>\n      </button>\n      <button ion-button icon-only clear large>\n        <ion-icon name="download"></ion-icon>\n      </button>\n\n      <button ion-button icon-only clear large>\n          <ion-icon name="arrow-down"></ion-icon>\n        </button>\n      <div class="inline-class"><p>BPM: 60</p></div>\n      <button ion-button icon-only clear large>\n        <ion-icon name="arrow-up"></ion-icon>\n      </button>\n\n      <button ion-button icon-only clear large>\n          <ion-icon name="arrow-down"></ion-icon>\n        </button>\n      <div class="inline-class"><p>Tom: Dó#</p></div>\n      <button ion-button icon-only clear large>\n        <ion-icon name="arrow-up"></ion-icon>\n      </button>\n\n    </ion-card-content>\n\n\n  </ion-card>\n\n  <ion-card>\n    \n      <ion-card-header>\n        Composição:\n      </ion-card-header>\n    \n      <ion-card-content>\n        <br>\n        <p>Parte 3:</p>        \n        <br>\n        <p>Melodia: Opção 2 - Trompete</p>        \n        <p>Harmonia: Opção 3 - Piano</p>        \n        <br>\n        <p>Escolha um instrumento:</p>\n        <ion-list radio-group>\n            <ion-item>\n                <ion-label>Bateria Acústica</ion-label>\n                <ion-radio checked="true" value="Bateria Acústica"></ion-radio>\n            </ion-item>  \n            <ion-item>\n                <ion-label>Bateria Eletrônica</ion-label>\n                <ion-radio value="Bateria Eletrônica"></ion-radio>\n            </ion-item>    \n        </ion-list>        \n        <br>\n        <p>Escolha uma opção:</p>\n        <ion-list radio-group>\n            <ion-item>\n                <ion-label>\n                    <button ion-button icon-start clear large>\n                      <ion-icon name="play"></ion-icon>\n                      Opção 1\n                    </button>\n                </ion-label>\n                <ion-radio checked="true" value="Opção 1"></ion-radio>\n            </ion-item>  \n            <ion-item>\n                <ion-label>\n                    <button ion-button icon-start clear large>\n                      <ion-icon name="play"></ion-icon>\n                      Opção 2\n                    </button>\n                </ion-label>\n                <ion-radio value="Opção 2"></ion-radio>\n            </ion-item>    \n        </ion-list>       \n        <br>\n        <button ion-button full>\n          Próxima composição\n        </button>\n      </ion-card-content>\n\n    </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\visual\visual.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */]])
    ], VisualPage);
    return VisualPage;
}());

//# sourceMappingURL=visual.js.map

/***/ }),

/***/ 113:
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
webpackEmptyAsyncContext.id = 113;

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/sum-files/sum-files.module": [
		278,
		1
	],
	"../pages/visual/visual.module": [
		279,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 154;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Midi; });
/* unused harmony export MidiTrack */
/* unused harmony export MidiEvent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hexa__ = __webpack_require__(258);

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
    Midi.prototype.generateMidiType1 = function (midis) {
        this.midiType = MidiType.TYPE_1;
        this.midiTracks = [];
        this.timeDivision = midis[0].timeDivision;
        this.numberOfTracks = 0;
        for (var _i = 0, midis_1 = midis; _i < midis_1.length; _i++) {
            var midi = midis_1[_i];
            //validar
            this.midiTracks.push(midi.midiTracks[0]);
            this.numberOfTracks++;
        }
    };
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
        this.midiTracks.push(midiTrack);
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
    };
    Midi.prototype.getBinaryString = function () {
        var midiHeaderString;
        var midiTracksString = '';
        var midiEndBinaryString = '';
        var midiType = this.midiType + '';
        while (midiType.length < 4) {
            midiType = '0' + midiType;
        }
        var trackQuantity = this.midiTracks.length + '';
        while (trackQuantity.length < 4) {
            trackQuantity = '0' + trackQuantity;
        }
        midiHeaderString = 'MThd' + __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertHexStringToBinararyString('00000006'
            + midiType + trackQuantity + this.timeDivision);
        for (var _i = 0, _a = this.midiTracks; _i < _a.length; _i++) {
            var midiTrack = _a[_i];
            midiTracksString += 'MTrk';
            midiEndBinaryString = '';
            for (var _b = 0, _c = midiTrack.midiEvents; _b < _c.length; _b++) {
                var midiEvent = _c[_b];
                midiEndBinaryString += midiEvent.deltaTime + midiEvent.midiEventData;
            }
            midiEndBinaryString = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertHexStringToBinararyString(midiEndBinaryString);
            var midiSizeBinaryString = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertNumberToBinararyString(midiEndBinaryString.length, 4);
            midiTracksString += midiSizeBinaryString + midiEndBinaryString;
        }
        return midiHeaderString + midiTracksString;
    };
    Midi.prototype.getMidiDescription = function () {
        var description = "Midi Type: " + this.midiType + "\nNumber of Tracks: " + this.midiType + "\nTime division: " + this.timeDivision + "\nMidi Events:";
        for (var _i = 0, _a = this.midiTracks; _i < _a.length; _i++) {
            var midiTrack = _a[_i];
            for (var _b = 0, _c = midiTrack.midiEvents; _b < _c.length; _b++) {
                var midiEvent = _c[_b];
                description += "    DeltaTime: " + midiEvent.deltaTime + " - Data: " + midiEvent.midiEventData;
            }
        }
        return description;
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
                    return new MidiEvent('', MidiEventType.SYSEX_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 2 + __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToNumber(midiData.charAt(1)))), false);
                }
                if (firstEventByte == 'ff') {
                    var eventTypeByte = __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.charAt(1));
                    return new MidiEvent(__WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].getDeltaTimeStringFromNumber(deltaTime), MidiEventType.META_EVENT, __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToHexString(midiData.substr(0, 3 + __WEBPACK_IMPORTED_MODULE_0__hexa__["a" /* ConvertionUtil */].convertBinaryStringToNumber(midiData.charAt(2)))), eventTypeByte == '51' || eventTypeByte == '58' || eventTypeByte == '59' || eventTypeByte == '2f');
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

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_media__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_midi_util_midi__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ionic_native_file_path__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__visual_visual__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sum_files_sum_files__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__drag_drag__ = __webpack_require__(201);
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
        this.title = 'Rotate Me!';
        this.fileConvertedPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Harmonia.mid';
        this.angle = 0;
        this.transformStyle = "rotate(0deg)";
    }
    HomePage.prototype.onRotation = function (event) {
        this.angle = event.angle;
        this.transformStyle = "rotate(" + this.angle + "deg)";
    };
    HomePage.prototype.goToVisualPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__visual_visual__["a" /* VisualPage */]);
    };
    HomePage.prototype.goToSumFiles = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__sum_files_sum_files__["a" /* SumFiles */]);
    };
    HomePage.prototype.goToDragPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__drag_drag__["a" /* DragPage */]);
    };
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
    HomePage.prototype.playMidiFile = function (path) {
        //const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
        var file = this.media.create(path);
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
        /*alert(this.file.externalDataDirectory);
        this.file.createFile(this.file.externalDataDirectory ,'newMidiFile.mid', true)
        .then(a => alert(JSON.stringify(a)))
        .catch(e => alert(JSON.stringify(e)));*/
        var _this = this;
        var options = { replace: true };
        var newMidi = this.midi.getBinaryString();
        var len = newMidi.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = newMidi.charCodeAt(i);
        }
        this.file.writeFile(this.file.externalDataDirectory, 'newMidiFile.mid', bytes.buffer, options)
            .then(function (a) { return _this.fileNewConvertedPath = _this.file.externalDataDirectory + 'newMidiFile.mid'; })
            .catch(function (e) { return alert(JSON.stringify(e)); });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Midi SandBox\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  aaa 02\n  <p *ngIf=\'this.fileUri\'>File URI: {{fileUri}}</p>\n  <p *ngIf=\'this.fileConvertedPath\'>File Path: {{fileConvertedPath}}</p>\n  <p *ngIf=\'this.fileNewConvertedPath\'>New File Path: {{fileNewConvertedPath}}</p>\n  <p *ngIf=\'this.midi\'>Midi Json: {{midi.getMidiDescription()}}</p>\n  <button ion-button full (click)=\'selectFileURI()\'>Find File</button>\n  <button ion-button full *ngIf=\'this.fileConvertedPath\' (click)=\'playMidiFile(this.fileConvertedPath)\'>Play Midi File</button>\n  <button ion-button full *ngIf=\'this.fileConvertedPath\' (click)=\'loadMidi()\'>Load Midi</button>\n  <button ion-button full *ngIf=\'this.midi\' (click)=\'createNewMidiFile()\'>Generate New Midi</button>\n  <button ion-button full *ngIf=\'this.fileNewConvertedPath\' (click)=\'playMidiFile(this.fileNewConvertedPath)\'>Play New Midi File</button>\n  <button ion-button full (click)="goToVisualPage()">Go to visual page</button>\n  <button ion-button full (click)="goToSumFiles()">Go to sum files</button>\n  <button ion-button full (click)="goToDragPage()">Go to drag page</button>\n\n</ion-content>'/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_media__["a" /* Media */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__["a" /* FileChooser */], __WEBPACK_IMPORTED_MODULE_6__node_modules_ionic_native_file_path__["a" /* FilePath */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DragPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DragPage = /** @class */ (function () {
    function DragPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    DragPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'drag-page',template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\drag\drag.html"*/'<ion-header absolute-drag>\n\n        <ion-navbar>\n\n          <ion-title>\n\n            Ionic Blank\n\n          </ion-title>\n\n        </ion-navbar>\n\n      </ion-header>\n\n       \n\n      <ion-content fullscreen>\n\n       \n\n          <button ion-button absolute-drag startLeft="20" startTop="100">Drag Me!</button>\n\n       \n\n          <button ion-button absolute-drag>Drag Me!</button>\n\n       \n\n          <ion-card absolute-drag startLeft="200" startTop="200">\n\n              <ion-card-content>\n\n                  Drag me!\n\n              </ion-card-content>\n\n          </ion-card>\n\n       \n\n          <p absolute-drag>\n\n              Drag me!\n\n          </p>\n\n       \n\n      </ion-content>\n\n    \n\n    '/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\pages\drag\drag.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], DragPage);
    return DragPage;
}());

//# sourceMappingURL=drag.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(225);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_media__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_file_chooser__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_file_path__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_visual_visual__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_sum_files_sum_files__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__directives_absolute_drag__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_drag_drag__ = __webpack_require__(201);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













//import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
//import { RotateCustomeDirective } from '../directives/rotate-custom-directive';


/*export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'rotate': { enable: true } //rotate is disabled by default, so we need to enable it
  }
}*/
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_visual_visual__["a" /* VisualPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_sum_files_sum_files__["a" /* SumFiles */],
                __WEBPACK_IMPORTED_MODULE_13__directives_absolute_drag__["a" /* AbsoluteDrag */],
                __WEBPACK_IMPORTED_MODULE_14__pages_drag_drag__["a" /* DragPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/sum-files/sum-files.module#VisualPageModule', name: 'SumFiles', segment: 'sum-files', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/visual/visual.module#VisualPageModule', name: 'VisualPage', segment: 'visual', priority: 'low', defaultHistory: [] }
                    ]
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_visual_visual__["a" /* VisualPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_sum_files_sum_files__["a" /* SumFiles */],
                __WEBPACK_IMPORTED_MODULE_14__pages_drag_drag__["a" /* DragPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_media__["a" /* Media */],
                //MediaObject
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_file_chooser__["a" /* FileChooser */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_file_path__["a" /* FilePath */] /*,
                {
                  provide: HAMMER_GESTURE_CONFIG,
                  useClass: CustomHammerConfig
                }*/
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 258:
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
    ConvertionUtil.convertHexStringToBinararyString = function (hexString) {
        var bytes = new Uint8Array(hexString.length / 2);
        for (var i = 0; i < hexString.length / 2; i++) {
            bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
        }
        return String.fromCharCode.apply(String, bytes);
    };
    ConvertionUtil.convertNumberToBinararyString = function (num, numberOfBytes) {
        var hexNum = num.toString(16);
        for (var i = hexNum.length; i < numberOfBytes * 2; i++) {
            hexNum = '0' + hexNum;
        }
        return this.convertHexStringToBinararyString(hexNum);
    };
    return ConvertionUtil;
}());

//# sourceMappingURL=hexa.js.map

/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(198);
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\Roberto Weege Jr\Desktop\Tagarela\robertoweegejr\IonicSandBox\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AbsoluteDrag; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AbsoluteDrag = /** @class */ (function () {
    function AbsoluteDrag(element, renderer, domCtrl) {
        this.element = element;
        this.renderer = renderer;
        this.domCtrl = domCtrl;
    }
    AbsoluteDrag.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.setElementStyle(this.element.nativeElement, 'position', 'absolute');
        this.renderer.setElementStyle(this.element.nativeElement, 'left', this.startLeft + 'px');
        this.renderer.setElementStyle(this.element.nativeElement, 'top', this.startTop + 'px');
        var hammer = new window['Hammer'](this.element.nativeElement);
        hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_ALL });
        hammer.on('pan', function (ev) {
            _this.handlePan(ev);
        });
    };
    AbsoluteDrag.prototype.handlePan = function (ev) {
        var _this = this;
        var newLeft = ev.center.x;
        var newTop = ev.center.y;
        this.domCtrl.write(function () {
            _this.renderer.setElementStyle(_this.element.nativeElement, 'left', newLeft + 'px');
            _this.renderer.setElementStyle(_this.element.nativeElement, 'top', newTop + 'px');
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])('startLeft'),
        __metadata("design:type", Object)
    ], AbsoluteDrag.prototype, "startLeft", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])('startTop'),
        __metadata("design:type", Object)
    ], AbsoluteDrag.prototype, "startTop", void 0);
    AbsoluteDrag = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["s" /* Directive */])({
            selector: '[absolute-drag]'
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Renderer */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* DomController */]])
    ], AbsoluteDrag);
    return AbsoluteDrag;
}());

//# sourceMappingURL=absolute-drag.js.map

/***/ })

},[202]);
//# sourceMappingURL=main.js.map