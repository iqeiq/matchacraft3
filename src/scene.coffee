Input = require './input'
World = require './world'

class Scene
  constructor: (@renderer, @transit)->
    @clock = new THREE.Clock
    @input = new Input document.body
    @scene = new THREE.Scene
    width = window.innerWidth
    height = window.innerHeight
    @camera = new THREE.PerspectiveCamera 72, width / height, 0.1, 1000
    #@camera = new THREE.OrthographicCamera width / - 2, width / 2, height / 2, height / - 2, 1, 1000 

  update: ->
    @renderer.render @scene, @camera

class MainScene extends Scene
  constructor: (@renderer, @transit)-> 
    super @renderer, @transit
    @scene.fog = new THREE.Fog 0xffffff, 100, 1000
    
    @controls = new THREE.PointerLockControls @camera
    @scene.add @controls.getObject()
    
    @world = new World @renderer, @scene, @input, @camera, 8
    @world.syncCamera @controls
    
    @input.onMouseDown THREE.MOUSE.LEFT, =>
      unless document.pointerLockElement
        @controls.enabled = true
        document.body.requestPointerLock()

    ###@input.onDoubleClick =>
      if document.pointerLockElement
        @controls.enabled = false
        document.exitPointerLock()###
      #console.log "transit OrbitScene"
      #@transit new OrbitScene @renderer, @transit
    
    #@input.onMouseDown THREE.MOUSE.RIGHT, =>
    #  console.log "transit PLScene"
    #  @transit new PLScene @renderer, @transit

  update: ->
    if @controls.enabled
      delta = @clock.getDelta()
      delta = Math.min(1.0/60, delta)
      @world.update delta
      @world.syncCamera @controls
    super()
    
module.exports = MainScene