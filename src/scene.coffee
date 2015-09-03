util = require './util'
Input = require './input'
Mob = require './mob'
Marching = require './marching'

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
    #@scene.fog = new THREE.Fog 0xffffff, 100, 1000
    @camera.position.z = 100
    @controls = new THREE.OrbitControls @camera

    hash = util.rand 1000000
    console.log "seed: #{hash}"
    hash = 342468

    @SIZE = 32
    height = []
    hmax = 0
    hmin = @SIZE - 1

    do =>
      size = @SIZE * @SIZE
      quality = 2

      [0...size].forEach (i)-> height.push 0

      [0...4].forEach (k)=>
        [0...size].forEach (i)=>
          x = i % @SIZE
          z = (i / @SIZE) | 0
          x = (x + 2) / 2
          z = (z + 3) / 2
          height[i] += util.noise(x / quality, z / quality, hash) * quality
        quality *= 4

      [0...size].forEach (i)=> 
        height[i] *= 0.5
        height[i] += @SIZE / 2
        console.log height[i] = 0 if height[i] < 0
        console.log height[i] = @SIZE - 1 if height[i] > @SIZE - 1
        hmax = Math.max height[i], hmax
        hmin = Math.min height[i], hmin

      console.log "height: [#{hmin}, #{hmax}]"

    @march = new Marching @SIZE, 0.001, (x, y, z, i, j, k)=>
      h = height[k * @SIZE + i]
      v = if h < y then 0  else 1 
    @scene.add @march.mesh


    bgeometry = new THREE.BoxGeometry @SIZE, hmax - hmin, @SIZE
    bmaterial = new THREE.MeshBasicMaterial
        color: 0x00ffff
        wireframe: true
    bmesh = new THREE.Mesh bgeometry, bmaterial
    @scene.add bmesh
    bmesh.position.set @SIZE / 2, (hmax + hmin) / 2, @SIZE / 2
    
    @light = new THREE.DirectionalLight 0xffffff, 0.7
    @light.position.set(0.5, 0.7, 0.3).normalize()
    @scene.add @light

    #@light2 = new THREE.HemisphereLight 0xffffff, 0x111111, 0.1
    #@scene.add @light2
    
    @scene.add new THREE.AmbientLight 0x202020

    #@input.onMouseDown THREE.MOUSE.RIGHT, =>
    #  console.log "transit PLScene"
    #  @transit new PLScene @renderer, @transit


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