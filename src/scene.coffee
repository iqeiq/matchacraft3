Input = require './input'

class Scene
  constructor: (@renderer)->
    @clock = new THREE.Clock

    @input = new Input document.body

    @scene = new THREE.Scene
    
    @camera = new THREE.PerspectiveCamera 72, window.innerWidth / window.innerHeight, 1, 10000
    @camera.position.z = 1000

    @controls = new THREE.OrbitControls @camera
    
    geometry = new THREE.BoxGeometry 200, 200, 200
    material = new THREE.MeshBasicMaterial
        color: 0xff0000
        wireframe: true
    @mesh = new THREE.Mesh geometry, material
    @scene.add @mesh

    @light = new THREE.PointLight 0xffffff
    @light.position.set 0, 10, 0
    @scene.add @light

  update: ->
    @controls.update()
    @renderer.render @scene, @camera


class Scene2
  constructor: (@scene, @camera)->
    #@controls = new THREE.PointerLockControls @camera
    #@scene.add @controls.getObject()
    ###$('#world').click =>
      @controls.enabled = true
      unless document.pointerLockElement
        document.body.requestPointerLock()
    
    @input.on 'p', =>
      @controls.enabled = false
      if document.pointerLockElement
        document.exitPointerLock()###


module.exports = Scene