'use strict'

util = require './util'


class Hoge
  constructor: -> 
    @scene = new THREE.Scene
    
    @camera = new THREE.PerspectiveCamera 75, window.innerWidth / window.innerHeight, 1, 10000
    @camera.position.z = 1000

    @renderer = new THREE.WebGLRenderer
    @renderer.setSize window.innerWidth, window.innerHeight
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

    console.log "ready! #{__dirname}"
    _.each [1, 2, util.rand 5], (e)-> console.log e

  animate: ->
    requestAnimationFrame => do @animate

    @stats.begin()
    
    @mesh.rotation.x += 0.01
    @mesh.rotation.y += 0.02

    @renderer.render @scene, @camera

    @stats.end()


do new Hoge().animate
