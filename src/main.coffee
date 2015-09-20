'use strict'

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

    THREE.gl = @renderer.context
    THREE.updateGeometry = (geometry, key, ranges)->
      attr = geometry.attributes[key]
      bufferType = if key is 'index' then THREE.gl.ELEMENT_ARRAY_BUFFER else THREE.gl.ARRAY_BUFFER
      THREE.gl.bindBuffer bufferType, attr.buffer
      for range in ranges
        offset = range[0]
        count = range[1]
        data = attr.array.subarray offset, offset + count
        THREE.gl.bufferSubData bufferType, offset * attr.array.BYTES_PER_ELEMENT, data
        data = null

    @currentScene = undefined
    transit = (s)=>
      @currentScene.input.offAll()
      @currentScene = s

    @currentScene = new Scene @renderer, transit
    
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
