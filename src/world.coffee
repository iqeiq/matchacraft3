Terrain = require './terrain'
Player = require './player'

class World
  constructor: (@scene, @size)->
    worldHeight = 128
    @terrain = new Terrain @size, 0, worldHeight
    @scene.add @terrain.mesh

    @light = new THREE.DirectionalLight 0xffffff, 0.6
    @light.position.set(0.5, 0.7, 0.3).normalize()
    @scene.add @light

    @light2 = new THREE.HemisphereLight 0xffffff, 0x111111, 0.3
    @scene.add @light2
    
    #@scene.add new THREE.AmbientLight 0x404040

    @player = new Player @size / 2, worldHeight / 2, @size / 2


  update: (delta)->
    @player.update delta


  syncCamera: (controls)->
    pos = @player.position.clone().add new THREE.Vector3(0, @player.height - 0.6, 0)
    controls.getObject().position.copy pos 
    @player.rotation.copy controls.getObject().rotation


module.exports = World
