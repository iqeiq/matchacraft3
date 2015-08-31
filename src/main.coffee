'use strict'

util = require './util'
Scene = require './scene'


class Main
  constructor: -> 
    Detector.addGetWebGLMessage() unless Detector.webgl

    @renderer = new THREE.WebGLRenderer
        alpha: true
        antialiasing: true
    @renderer.setSize window.innerWidth, window.innerHeight
    @renderer.setClearColor 0xa0d8ef, 1
    @renderer.autoClear = false
    @renderer.sortObjects = true
    $('#world').append @renderer.domElement

    @currentScene = new Scene @renderer
    
    @stats = new Stats
    @stats.setMode 0  # 0: fps, 1: ms, 2: mb
    @stats.domElement.style.position = 'absolute'
    @stats.domElement.style.left = '0px'
    @stats.domElement.style.top = '0px'
    $(document.body).append @stats.domElement

    $(window).resize =>
      width = window.innerWidth
      height = window.innerHeight
      @renderer.setSize width, height
      @currentScene.camera.aspect = width / height
      @currentScene.camera.updateProjectionMatrix()

  animate: ->
    requestAnimationFrame => do @animate
    @stats.begin()
    @renderer.clear()
    @currentScene?.update()
    @stats.end()


$ -> do new Main().animate
