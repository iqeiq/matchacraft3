(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Input,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  hasProp = {}.hasOwnProperty;

Input = (function() {
  function Input(domElement) {
    var buttons, keydown, keyup, mapper, mouseEvent, ref, ref1, ref2, ref3;
    this.domElement = domElement != null ? domElement : document;
    this.keys = {};
    this.listener = {};
    this.keyMap = {
      8: 'backspace',
      13: 'enter',
      16: 'shift',
      17: 'ctrl',
      18: 'alt',
      27: 'esc',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    mapper = (function(_this) {
      return function(keycode, status) {
        return {
          key: _this.keyMap[keycode] || String.fromCharCode(keycode).toLowerCase(),
          status: status
        };
      };
    })(this);
    keydown = Bacon.fromEventTarget(this.domElement, 'keydown').map((function(_this) {
      return function(e) {
        return mapper.call(_this, e.keyCode, true);
      };
    })(this));
    keyup = Bacon.fromEventTarget(this.domElement, 'keyup').map((function(_this) {
      return function(e) {
        return mapper.call(_this, e.keyCode, false);
      };
    })(this));
    keydown.merge(keyup).filter(function(e) {
      var code;
      code = e.key.charCodeAt(0);
      return (47 < code && code < 58) || (96 < code && code < 123);
    }).onValue((function(_this) {
      return function(e) {
        var ref;
        _this.keys[e.key] = e.status;
        if (!e.status) {
          return;
        }
        return (ref = _this.listener[e.key]) != null ? ref.forEach(function(v) {
          return v();
        }) : void 0;
      };
    })(this));
    buttons = [THREE.MOUSE.LEFT, THREE.MOUSE.RIGHT];
    mouseEvent = (function(_this) {
      return function(type) {
        var listener;
        listener = {};
        buttons.forEach(function(e) {
          return listener[e] = [];
        });
        Bacon.fromEventTarget(_this.domElement, type).filter(function(e) {
          var ref;
          return ref = e.button, indexOf.call(buttons, ref) >= 0;
        }).onValue(function(e) {
          return listener[e.button].forEach(function(v) {
            return v(e.clientX, e.clientY);
          });
        });
        return [
          function(btn, cb) {
            var ref;
            return (ref = listener[btn]) != null ? ref.push(cb) : void 0;
          }, function(btn, cb) {
            return _.remove(listener[btn], function(v) {
              if (cb != null) {
                return v === cb;
              } else {
                return true;
              }
            });
          }
        ];
      };
    })(this);
    ref = mouseEvent('mousedown'), this.onMouseDown = ref[0], this.offMouseDown = ref[1];
    ref1 = mouseEvent('mouseup'), this.onMouseUp = ref1[0], this.offMouseUp = ref1[1];
    ref2 = _.transform(mouseEvent('dblclick'), function(res, e) {
      return res.push(e.bind(this, THREE.MOUSE.LEFT));
    }), this.onDoubleClick = ref2[0], this.offDoubleClick = ref2[1];
    ref3 = (function(_this) {
      return function() {
        var active, listener, md, mu;
        listener = {};
        active = {};
        buttons.forEach(function(e) {
          active[e] = false;
          return listener[e] = [];
        });
        md = Bacon.fromEventTarget(_this.domElement, 'mousedown').map(function(e) {
          return [e.button, true];
        });
        mu = Bacon.fromEventTarget(_this.domElement, 'mouseup').map(function(e) {
          return [e.button, false];
        });
        md.merge(mu).onValue(function(e) {
          if (active[e[0]] != null) {
            return active[e[0]] = e[1];
          }
        });
        Bacon.fromEventTarget(_this.domElement, 'mousemove').onValue(function(e) {
          var k, results, v;
          results = [];
          for (k in listener) {
            if (!hasProp.call(listener, k)) continue;
            v = listener[k];
            results.push(v.forEach(function(u) {
              if (active[k]) {
                return u(e.clientX, e.clientY);
              }
            }));
          }
          return results;
        });
        return [
          function(btn, cb) {
            var ref3;
            return (ref3 = listener[btn]) != null ? ref3.push(cb) : void 0;
          }, function(btn, cb) {
            return _.remove(listener[btn], function(v) {
              if (cb != null) {
                return v === cb;
              } else {
                return true;
              }
            });
          }
        ];
      };
    })(this)(), this.onMouseMove = ref3[0], this.offMouseMove = ref3[1];
    this.offAll = (function(_this) {
      return function() {
        var k, ref4, results, v;
        buttons.forEach(function(v) {
          _this.offMouseDown(v);
          _this.offMouseUp(v);
          return _this.offMouseMove(v);
        });
        _this.offDoubleClick();
        ref4 = _this.listener;
        results = [];
        for (k in ref4) {
          if (!hasProp.call(ref4, k)) continue;
          v = ref4[k];
          results.push(_this.off(k));
        }
        return results;
      };
    })(this);
  }

  Input.prototype.on = function(key, cb) {
    if (this.listener[key]) {
      return this.listener[key].push(cb);
    }
    return this.listener[key] = [cb];
  };

  Input.prototype.off = function(key, cb) {
    if (cb == null) {
      cb = allremove;
    }
    return _.remove(this.listener[key], function(v) {
      return v === cb;
    });
  };

  return Input;

})();

module.exports = Input;


},{}],2:[function(require,module,exports){
'use strict';
var Main, Scene;

Scene = require('./scene');

Main = (function() {
  function Main() {
    var transit;
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialiasing: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xa0d8ef, 1);
    this.renderer.autoClear = false;
    this.renderer.sortObjects = true;
    $('#world').append(this.renderer.domElement);
    this.currentScene = void 0;
    transit = (function(_this) {
      return function(s) {
        _this.currentScene.input.offAll();
        return _this.currentScene = s;
      };
    })(this);
    this.currentScene = new Scene(this.renderer, transit);
    this.stats = new Stats;
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    $(document.body).append(this.stats.domElement);
    $(window).resize((function(_this) {
      return function() {
        var height, width;
        width = window.innerWidth;
        height = window.innerHeight;
        _this.renderer.setSize(width, height);
        _this.currentScene.camera.aspect = width / height;
        return _this.currentScene.camera.updateProjectionMatrix();
      };
    })(this));
  }

  Main.prototype.animate = function() {
    var ref;
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.animate();
      };
    })(this));
    this.stats.begin();
    this.renderer.clear();
    if ((ref = this.currentScene) != null) {
      ref.update();
    }
    return this.stats.end();
  };

  return Main;

})();

$(function() {
  return (new Main().animate)();
});


},{"./scene":5}],3:[function(require,module,exports){
var Marching, util;

util = require('./util');

Marching = (function() {
  function Marching(SIZE, isolevel, generator) {
    var geometry, l, m, material, max, min, points, range, ref, ref1, results, results1, size2, values, vertexIndex, vlist;
    this.SIZE = SIZE;
    points = [];
    values = [];
    min = 0;
    max = this.SIZE;
    range = max - min - 1;
    (function() {
      results = [];
      for (var l = 0, ref = this.SIZE; 0 <= ref ? l < ref : l > ref; 0 <= ref ? l++ : l--){ results.push(l); }
      return results;
    }).apply(this).forEach((function(_this) {
      return function(k) {
        var l, ref, results;
        return (function() {
          results = [];
          for (var l = 0, ref = _this.SIZE; 0 <= ref ? l < ref : l > ref; 0 <= ref ? l++ : l--){ results.push(l); }
          return results;
        }).apply(this).forEach(function(j) {
          var l, ref, results;
          return (function() {
            results = [];
            for (var l = 0, ref = _this.SIZE; 0 <= ref ? l < ref : l > ref; 0 <= ref ? l++ : l--){ results.push(l); }
            return results;
          }).apply(this).forEach(function(i) {
            var value, x, y, z;
            x = min + range * i / (_this.SIZE - 1);
            y = min + range * j / (_this.SIZE - 1);
            z = min + range * k / (_this.SIZE - 1);
            points.push(new THREE.Vector3(x, y, z));
            value = generator(x, y, z, i, j, k);
            return values.push(value);
          });
        });
      };
    })(this));
    size2 = this.SIZE * this.SIZE;
    vlist = new Array(12);
    geometry = new THREE.Geometry();
    vertexIndex = 0;
    (function() {
      results1 = [];
      for (var m = 0, ref1 = this.SIZE - 1; 0 <= ref1 ? m < ref1 : m > ref1; 0 <= ref1 ? m++ : m--){ results1.push(m); }
      return results1;
    }).apply(this).forEach((function(_this) {
      return function(z) {
        var m, ref1, results1;
        return (function() {
          results1 = [];
          for (var m = 0, ref1 = _this.SIZE - 1; 0 <= ref1 ? m < ref1 : m > ref1; 0 <= ref1 ? m++ : m--){ results1.push(m); }
          return results1;
        }).apply(this).forEach(function(y) {
          var m, ref1, results1;
          return (function() {
            results1 = [];
            for (var m = 0, ref1 = _this.SIZE - 1; 0 <= ref1 ? m < ref1 : m > ref1; 0 <= ref1 ? m++ : m--){ results1.push(m); }
            return results1;
          }).apply(this).forEach(function(x) {
            var bits, cubeindex, face, i, index1, index2, index3, mu, p, px, pxy, pxyz, pxz, py, pyz, pz, results1, value0, value1, value2, value3, value4, value5, value6, value7;
            p = x + _this.SIZE * y + size2 * z;
            px = p + 1;
            py = p + _this.SIZE;
            pxy = py + 1;
            pz = p + size2;
            pxz = px + size2;
            pyz = py + size2;
            pxyz = pxy + size2;
            value0 = values[p];
            value1 = values[px];
            value2 = values[py];
            value3 = values[pxy];
            value4 = values[pz];
            value5 = values[pxz];
            value6 = values[pyz];
            value7 = values[pxyz];
            cubeindex = 0;
            if (value0 < isolevel) {
              cubeindex |= 1;
            }
            if (value1 < isolevel) {
              cubeindex |= 2;
            }
            if (value2 < isolevel) {
              cubeindex |= 8;
            }
            if (value3 < isolevel) {
              cubeindex |= 4;
            }
            if (value4 < isolevel) {
              cubeindex |= 16;
            }
            if (value5 < isolevel) {
              cubeindex |= 32;
            }
            if (value6 < isolevel) {
              cubeindex |= 128;
            }
            if (value7 < isolevel) {
              cubeindex |= 64;
            }
            bits = MARCH.edgeTable[cubeindex];
            if (bits === 0) {
              return;
            }
            mu = 0.5;
            if (bits & 1) {
              mu = (isolevel - value0) / (value1 - value0);
              vlist[0] = points[p].clone().lerp(points[px], mu);
            }
            if (bits & 2) {
              mu = (isolevel - value1) / (value3 - value1);
              vlist[1] = points[px].clone().lerp(points[pxy], mu);
            }
            if (bits & 4) {
              mu = (isolevel - value2) / (value3 - value2);
              vlist[2] = points[py].clone().lerp(points[pxy], mu);
            }
            if (bits & 8) {
              mu = (isolevel - value0) / (value2 - value0);
              vlist[3] = points[p].clone().lerp(points[py], mu);
            }
            if (bits & 16) {
              mu = (isolevel - value4) / (value5 - value4);
              vlist[4] = points[pz].clone().lerp(points[pxz], mu);
            }
            if (bits & 32) {
              mu = (isolevel - value5) / (value7 - value5);
              vlist[5] = points[pxz].clone().lerp(points[pxyz], mu);
            }
            if (bits & 64) {
              mu = (isolevel - value6) / (value7 - value6);
              vlist[6] = points[pyz].clone().lerp(points[pxyz], mu);
            }
            if (bits & 128) {
              mu = (isolevel - value4) / (value6 - value4);
              vlist[7] = points[pz].clone().lerp(points[pyz], mu);
            }
            if (bits & 256) {
              mu = (isolevel - value0) / (value4 - value0);
              vlist[8] = points[p].clone().lerp(points[pz], mu);
            }
            if (bits & 512) {
              mu = (isolevel - value1) / (value5 - value1);
              vlist[9] = points[px].clone().lerp(points[pxz], mu);
            }
            if (bits & 1024) {
              mu = (isolevel - value3) / (value7 - value3);
              vlist[10] = points[pxy].clone().lerp(points[pxyz], mu);
            }
            if (bits & 2048) {
              mu = (isolevel - value2) / (value6 - value2);
              vlist[11] = points[py].clone().lerp(points[pyz], mu);
            }
            i = 0;
            cubeindex <<= 4;
            results1 = [];
            while (MARCH.triTable[cubeindex + i] !== -1) {
              index1 = MARCH.triTable[cubeindex + i];
              index2 = MARCH.triTable[cubeindex + i + 1];
              index3 = MARCH.triTable[cubeindex + i + 2];
              geometry.vertices.push(vlist[index1].clone());
              geometry.vertices.push(vlist[index2].clone());
              geometry.vertices.push(vlist[index3].clone());
              face = new THREE.Face3(vertexIndex, vertexIndex + 1, vertexIndex + 2);
              face.color = new THREE.Color(0, 0.5 + util.randf(0.5), 0);
              geometry.faces.push(face);
              geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
              vertexIndex += 3;
              results1.push(i += 3);
            }
            return results1;
          });
        });
      };
    })(this));
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    material = new THREE.MeshLambertMaterial({
      vertexColors: THREE.VertexColors
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  return Marching;

})();

module.exports = Marching;


},{"./util":6}],4:[function(require,module,exports){
var Mob;

Mob = (function() {
  function Mob() {}

  Mob.prototype.update = function() {};

  return Mob;

})();

module.exports = Mob;


},{}],5:[function(require,module,exports){
var Input, Marching, Mob, OrbitScene, PLScene, Scene, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

util = require('./util');

Input = require('./input');

Mob = require('./mob');

Marching = require('./marching');

Scene = (function() {
  function Scene(renderer, transit) {
    this.renderer = renderer;
    this.transit = transit;
    this.clock = new THREE.Clock;
    this.input = new Input(document.body);
    this.scene = new THREE.Scene;
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 1, 1000);
  }

  Scene.prototype.update = function() {
    return this.renderer.render(this.scene, this.camera);
  };

  return Scene;

})();

OrbitScene = (function(superClass) {
  extend(OrbitScene, superClass);

  function OrbitScene(renderer, transit) {
    var bgeometry, bmaterial, bmesh, hash, height, hmax, hmin;
    this.renderer = renderer;
    this.transit = transit;
    OrbitScene.__super__.constructor.call(this, this.renderer, this.transit);
    this.camera.position.z = 100;
    this.controls = new THREE.OrbitControls(this.camera);
    hash = util.rand(1000000);
    console.log("seed: " + hash);
    hash = 342468;
    this.SIZE = 32;
    height = [];
    hmax = 0;
    hmin = this.SIZE - 1;
    (function(_this) {
      return (function() {
        var l, m, quality, results, results1, size;
        size = _this.SIZE * _this.SIZE;
        quality = 2;
        (function() {
          results = [];
          for (var l = 0; 0 <= size ? l < size : l > size; 0 <= size ? l++ : l--){ results.push(l); }
          return results;
        }).apply(this).forEach(function(i) {
          return height.push(0);
        });
        [0, 1, 2, 3].forEach(function(k) {
          var m, results1;
          (function() {
            results1 = [];
            for (var m = 0; 0 <= size ? m < size : m > size; 0 <= size ? m++ : m--){ results1.push(m); }
            return results1;
          }).apply(this).forEach(function(i) {
            var x, z;
            x = i % _this.SIZE;
            z = (i / _this.SIZE) | 0;
            x = (x + 2) / 2;
            z = (z + 3) / 2;
            return height[i] += util.noise(x / quality, z / quality, hash) * quality;
          });
          return quality *= 4;
        });
        (function() {
          results1 = [];
          for (var m = 0; 0 <= size ? m < size : m > size; 0 <= size ? m++ : m--){ results1.push(m); }
          return results1;
        }).apply(this).forEach(function(i) {
          height[i] *= 0.5;
          height[i] += _this.SIZE / 2;
          if (height[i] < 0) {
            console.log(height[i] = 0);
          }
          if (height[i] > _this.SIZE - 1) {
            console.log(height[i] = _this.SIZE - 1);
          }
          hmax = Math.max(height[i], hmax);
          return hmin = Math.min(height[i], hmin);
        });
        return console.log("height: [" + hmin + ", " + hmax + "]");
      });
    })(this)();
    this.march = new Marching(this.SIZE, 0.001, (function(_this) {
      return function(x, y, z, i, j, k) {
        var h, v;
        h = height[k * _this.SIZE + i];
        return v = h < y ? 0 : 1;
      };
    })(this));
    this.scene.add(this.march.mesh);
    bgeometry = new THREE.BoxGeometry(this.SIZE, hmax - hmin, this.SIZE);
    bmaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true
    });
    bmesh = new THREE.Mesh(bgeometry, bmaterial);
    this.scene.add(bmesh);
    bmesh.position.set(this.SIZE / 2, (hmax + hmin) / 2, this.SIZE / 2);
    this.light = new THREE.DirectionalLight(0xffffff, 0.7);
    this.light.position.set(0.5, 0.7, 0.3).normalize();
    this.scene.add(this.light);
    this.scene.add(new THREE.AmbientLight(0x202020));
  }

  OrbitScene.prototype.update = function() {
    this.controls.update();
    return OrbitScene.__super__.update.call(this);
  };

  return OrbitScene;

})(Scene);

PLScene = (function(superClass) {
  extend(PLScene, superClass);

  function PLScene(renderer, transit) {
    var geometry, material;
    this.renderer = renderer;
    this.transit = transit;
    PLScene.__super__.constructor.call(this, this.renderer, this.transit);
    this.camera.position.z = 100;
    this.controls = new THREE.PointerLockControls(this.camera);
    this.scene.add(this.controls.getObject());
    geometry = new THREE.BoxGeometry(20, 20, 20);
    material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.input.onMouseDown(THREE.MOUSE.LEFT, (function(_this) {
      return function() {
        console.log("poyo");
        _this.controls.enabled = true;
        if (!document.pointerLockElement) {
          return document.body.requestPointerLock();
        }
      };
    })(this));
    this.input.onDoubleClick((function(_this) {
      return function() {
        _this.controls.enabled = false;
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
        console.log("transit OrbitScene");
        return _this.transit(new OrbitScene(_this.renderer, _this.transit));
      };
    })(this));
  }

  return PLScene;

})(Scene);

module.exports = OrbitScene;


},{"./input":1,"./marching":3,"./mob":4,"./util":6}],6:[function(require,module,exports){
var Utility;

Utility = (function() {
  function Utility() {}

  Utility.rand = function(n) {
    return Math.floor(Math.random() * n);
  };

  Utility.randf = function(n) {
    return Math.random() * n;
  };

  Utility.randRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Utility.randArray = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  Utility.noise = (function() {
    var perlin;
    perlin = new ImprovedNoise;
    return function(x, y, z) {
      return perlin.noise(x, y, z);
    };
  })();

  return Utility;

})();

module.exports = Utility;


},{}]},{},[2])


//# sourceMappingURL=bundle.js.map