'use strict'

util = require './util'

class Input

  constructor: ->
    @keys = {}
    @listener = {}

    @keyMap =
      8: 'backspace'
      13: 'enter'
      16: 'shift'
      17: 'ctrl'
      18: 'alt'
      27: 'esc'
      32: 'space'
      37: 'left'
      38: 'up'
      39: 'right'
      40: 'down'

    mapper = (keycode, status)=>
      key: @keyMap[keycode] or String.fromCharCode(keycode).toLowerCase()
      status: status

    keydown = Bacon.fromEventTarget(document, 'keydown').map (e)=> mapper.call @, e.keyCode, true
    keyup = Bacon.fromEventTarget(document, 'keyup').map (e)=> mapper.call @, e.keyCode, false
    keydown.merge(keyup).filter (e)->
      code = e.key.charCodeAt 0
      47 < code < 58 or 96 < code < 123
    .onValue (e)=>
      @keys[e.key] = e.status
      return unless e.status 
      _.forEach @listener[e.key], (v)-> do v 

  on: (key, cb)->
    return @listener[key].push cb if @listener[key]
    @listener[key] = [cb]


class Main
  constructor: -> 

    @input = new Input

    @scene = new THREE.Scene
    
    @camera = new THREE.PerspectiveCamera 72, window.innerWidth / window.innerHeight, 1, 10000
    @camera.position.z = 1000

    @renderer = new THREE.WebGLRenderer
      alpha: true
      antialiasing: false
    @renderer.setSize window.innerWidth, window.innerHeight
    @renderer.setClearColor 0xa0d8ef, 1
    #@renderer.autoClear = false
    @renderer.sortObjects = true
    document.body.appendChild @renderer.domElement

    geometry = new THREE.BoxGeometry 200, 200, 200
    material = new THREE.MeshBasicMaterial
        color: 0xff0000
        wireframe: true
    @mesh = new THREE.Mesh geometry, material
    @scene.add @mesh
    
    @stats = new Stats
    @stats.setMode 0  # 0: fps, 1: ms, 2: mb
    @stats.domElement.style.position = 'absolute'
    @stats.domElement.style.left = '0px'
    @stats.domElement.style.top = '0px'
    document.body.appendChild @stats.domElement

    Bacon.fromEventTarget window, 'resize'
    .onValue =>
      width = window.innerWidth
      height = window.innerHeight
      @renderer.setSize width, height
      @camera.aspect = width / height
      @camera.updateProjectionMatrix()

    console.log "ready! dirname: #{__dirname} filename: #{__filename}"

    @input.on 'esc', ()->
      console.log "etc"
    

  animate: ->
    requestAnimationFrame => do @animate

    @stats.begin()
    
    @mesh.rotation.x += 0.01
    @mesh.rotation.y += 0.02

    @renderer.render @scene, @camera

    @stats.end()


do new Main().animate
