Terrain = require './terrain'

class World
  constructor: (@scene, @size)->
    @terrain = new Terrain @size
    @scene.add @terrain.mesh

    @light = new THREE.DirectionalLight 0xffffff, 0.6
    @light.position.set(0.5, 0.7, 0.3).normalize()
    @scene.add @light

    @light2 = new THREE.HemisphereLight 0xffffff, 0x111111, 0.3
    @scene.add @light2
    
    #@scene.add new THREE.AmbientLight 0x404040


  update: (delta)->


module.exports = World
