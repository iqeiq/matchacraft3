Input = require './input'

class Scene
  constructor: (@renderer, @transit)->
    @clock = new THREE.Clock
    @input = new Input document.body
    @scene = new THREE.Scene
    @camera = new THREE.PerspectiveCamera 72, window.innerWidth / window.innerHeight, 1, 1000
    
  update: ->
    @renderer.render @scene, @camera

class OrbitScene extends Scene
  constructor: (@renderer, @transit)-> 
    super @renderer, @transit
    @camera.position.z = 100
    @controls = new THREE.OrbitControls @camera

    geometry = new THREE.BoxGeometry 20, 20, 20
    material = new THREE.MeshPhongMaterial
        color: 0xff0000
        wireframe: false
    @mesh = new THREE.Mesh geometry, material
    @scene.add @mesh

    @light = new THREE.DirectionalLight 0xffffff, 1.0
    @light.position.set(0.5, 0.7, 0.3).normalize()
    @scene.add @light

    @input.onMouseDown THREE.MOUSE.RIGHT, =>
      console.log "transit PLScene"
      @transit new PLScene @renderer, @transit

  update: ->
    @controls.update()
    super()
    

class PLScene extends Scene
  constructor: (@renderer, @transit)-> 
    super @renderer, @transit
    @camera.position.z = 100
    @controls = new THREE.PointerLockControls @camera
    @scene.add @controls.getObject()

    geometry = new THREE.BoxGeometry 20, 20, 20
    material = new THREE.MeshBasicMaterial
        color: 0xff0000
        wireframe: true
    @mesh = new THREE.Mesh geometry, material
    @scene.add @mesh

    @input.onMouseDown THREE.MOUSE.LEFT, =>
      console.log "poyo"
      @controls.enabled = true
      unless document.pointerLockElement
        document.body.requestPointerLock()
    
    @input.onDoubleClick =>
      @controls.enabled = false
      if document.pointerLockElement
        document.exitPointerLock()
      console.log "transit OrbitScene"
      @transit new OrbitScene @renderer, @transit
      

module.exports = OrbitScene