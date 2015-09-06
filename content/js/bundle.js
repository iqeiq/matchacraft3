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


},{"./scene":4}],3:[function(require,module,exports){
var Mob,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Mob = (function(superClass) {
  extend(Mob, superClass);

  function Mob() {}

  Mob.prototype.update = function() {};

  return Mob;

})(THREE.Object3D);

module.exports = Mob;


},{}],4:[function(require,module,exports){
var Input, Mob, OrbitScene, PLScene, Scene, World,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Input = require('./input');

Mob = require('./mob');

World = require('./world');

Scene = (function() {
  function Scene(renderer, transit) {
    var height, width;
    this.renderer = renderer;
    this.transit = transit;
    this.clock = new THREE.Clock;
    this.input = new Input(document.body);
    this.scene = new THREE.Scene;
    width = window.innerWidth;
    height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(72, width / height, 1, 1000);
  }

  Scene.prototype.update = function() {
    return this.renderer.render(this.scene, this.camera);
  };

  return Scene;

})();

OrbitScene = (function(superClass) {
  extend(OrbitScene, superClass);

  function OrbitScene(renderer, transit) {
    this.renderer = renderer;
    this.transit = transit;
    OrbitScene.__super__.constructor.call(this, this.renderer, this.transit);
    this.camera.position.z = -50;
    this.camera.position.x = 50;
    this.camera.position.y = 100;
    this.controls = new THREE.OrbitControls(this.camera);
    this.world = new World(this.scene, 128);
  }

  OrbitScene.prototype.update = function() {
    this.world.update(this.clock.getDelta());
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


},{"./input":1,"./mob":3,"./world":7}],5:[function(require,module,exports){
var Terrain, util;

util = require('./util');

Terrain = (function() {
  function Terrain(size, seed) {
    this.size = size;
    this.seed = seed;
    this.size2 = this.size * this.size;
    if (this.seed == null) {
      this.seed = util.rand(1000000);
    }
    this.heightMin = 0;
    this.heightRange = 128;
    this.cell = new Uint8Array(this.size2 * this.heightRange);
    this.generateMesh(32, 0.5, this.heightMin, this.heightMin + this.heightRange - 1);
  }

  Terrain.prototype.getType = function(x, y, z) {
    if (x < 0 || x > this.size - 1) {
      return 0;
    }
    if (z < 0 || z > this.size - 1) {
      return 0;
    }
    if (y < this.heightMin || y > this.heightMin + this.heightRange - 1) {
      return 0;
    }
    return this.cell[x + z * this.size + y * this.size2];
  };

  Terrain.prototype.generateMesh = function(inflate, incline, min, max) {
    var height;
    height = new Int16Array(this.size * this.size);
    (function(_this) {
      return (function() {
        var hmax, hmin, l, ref, results;
        hmax = min;
        hmin = max;
        (function() {
          results = [];
          for (var l = 0, ref = _this.size2; 0 <= ref ? l < ref : l > ref; 0 <= ref ? l++ : l--){ results.push(l); }
          return results;
        }).apply(this).forEach(function(v, i) {
          var l, quality, ref, results, x, z;
          x = (i % _this.size + 2) / 2;
          z = (((i / _this.size) | 0) + 3) / 2;
          quality = 2;
          [0, 1, 2, 3].forEach(function(u, k) {
            height[i] += util.noise(x / quality, z / quality, _this.seed) * quality;
            return quality *= 4;
          });
          height[i] = ~~Math.max(min, Math.min(max, height[i] * incline + inflate));
          (function() {
            results = [];
            for (var l = 0, ref = height[i]; 0 <= ref ? l <= ref : l >= ref; 0 <= ref ? l++ : l--){ results.push(l); }
            return results;
          }).apply(this).forEach(function(w, j) {
            return _this.cell[i + j * _this.size2] = 1;
          });
          hmax = Math.max(hmax, height[i]);
          return hmin = Math.min(hmin, height[i]);
        });
        return console.log("height: [" + hmin + ", " + hmax + "]");
      });
    })(this)();
    this.geometry = new THREE.BufferGeometry;
    this.material = new THREE.MeshPhongMaterial({
      color: 0x864815,
      specular: 0x111111
    });
    (function(_this) {
      return (function() {
        var colors, current, dir, faceNum, faceTemp, indexTemp, indices, normals, padding, vertices;
        faceTemp = [[[0.0, 1.0, 0.0], [0.0, 1.0, 1.0], [1.0, 1.0, 0.0], [1.0, 1.0, 1.0]], [[0.0, 1.0, 0.0], [0.0, 0.0, 0.0], [0.0, 1.0, 1.0], [0.0, 0.0, 1.0]], [[1.0, 1.0, 1.0], [1.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 0.0]], [[1.0, 1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]], [[0.0, 1.0, 1.0], [0.0, 0.0, 1.0], [1.0, 1.0, 1.0], [1.0, 0.0, 1.0]], [[1.0, 0.0, 1.0], [0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0]]];
        indexTemp = [[0, 1, 2], [2, 1, 3]];
        dir = [[0, 1, 0], [-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1], [0, -1, 0]];
        faceNum = 0;
        (function() {
          return _this.cell.forEach(function(v, i) {
            var x, y, z;
            if (v === 0) {
              return;
            }
            x = i % _this.size;
            z = ((i % _this.size2) / _this.size) | 0;
            y = (i / _this.size2) | 0;
            return dir.forEach(function(d) {
              var type;
              type = _this.getType(x + d[0], y + d[1], z + d[2]);
              if (type === 0) {
                return faceNum++;
              }
            });
          });
        })();
        console.log("faceNum: " + faceNum);
        vertices = new Float32Array(faceNum * 4 * 3);
        indices = new Uint32Array(faceNum * 2 * 3);
        normals = new Float32Array(faceNum * 4 * 3);
        colors = new Float32Array(faceNum * 4 * 3);
        current = 0;
        padding = 0.00001;
        _this.cell.forEach(function(v, i) {
          var x, y, z;
          if (v === 0) {
            return;
          }
          x = i % _this.size;
          z = ((i % _this.size2) / _this.size) | 0;
          y = (i / _this.size2) | 0;
          return dir.forEach(function(d, face) {
            var type;
            type = _this.getType(x + d[0], y + d[1], z + d[2]);
            if (type === 0) {
              faceTemp[face].forEach(function(pos, o) {
                vertices[current * 12 + o * 3 + 0] = pos[0] + x + (pos[0] < 0.5 ? padding : -padding);
                vertices[current * 12 + o * 3 + 1] = pos[1] + y + (pos[1] < 0.5 ? padding : -padding);
                vertices[current * 12 + o * 3 + 2] = pos[2] + z + (pos[2] < 0.5 ? padding : -padding);
                normals[current * 12 + o * 3 + 0] = face === 1 ? -1.0 : (face === 2 ? 1.0 : 0.0);
                normals[current * 12 + o * 3 + 1] = face === 5 ? -1.0 : (face === 0 ? 1.0 : 0.0);
                normals[current * 12 + o * 3 + 2] = face === 3 ? -1.0 : (face === 4 ? 1.0 : 0.0);
                colors[current * 12 + o * 3 + 0] = 1.0;
                colors[current * 12 + o * 3 + 1] = 1.0;
                return colors[current * 12 + o * 3 + 2] = 1.0;
              });
              indexTemp.forEach(function(ind, o) {
                indices[current * 6 + o * 3 + 0] = ind[0] + current * 4;
                indices[current * 6 + o * 3 + 1] = ind[1] + current * 4;
                return indices[current * 6 + o * 3 + 2] = ind[2] + current * 4;
              });
              return current++;
            }
          });
        });
        _this.geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
        _this.geometry.addAttribute("index", new THREE.BufferAttribute(indices, 3));
        _this.geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));
        return _this.geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
      });
    })(this)();
    return this.mesh = new THREE.Mesh(this.geometry, this.material);
  };

  return Terrain;

})();

module.exports = Terrain;


},{"./util":6}],6:[function(require,module,exports){
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


},{}],7:[function(require,module,exports){
var Terrain, World;

Terrain = require('./terrain');

World = (function() {
  function World(scene, size) {
    this.scene = scene;
    this.size = size;
    this.terrain = new Terrain(this.size);
    this.scene.add(this.terrain.mesh);
    this.light = new THREE.DirectionalLight(0xffffff, 0.6);
    this.light.position.set(0.5, 0.7, 0.3).normalize();
    this.scene.add(this.light);
    this.light2 = new THREE.HemisphereLight(0xffffff, 0x111111, 0.3);
    this.scene.add(this.light2);
  }

  World.prototype.update = function(delta) {};

  return World;

})();

module.exports = World;


},{"./terrain":5}]},{},[2])


//# sourceMappingURL=bundle.js.map