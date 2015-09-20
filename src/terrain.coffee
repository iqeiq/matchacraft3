util = require './util'
Chunk = require './chunk'

class Terrain

  @chunkSize: 16

  constructor: (@size, @heightMin = 0, @heightRange = 128, @seed = undefined)->
    @div = Math.floor @size / Terrain.chunkSize
    console.log "div: #{@div}"
    @size2 = @size * @size
    @seed ?= util.rand 1000000
    console.log "seed: #{@seed}"

    @chunk = []
    for oz in [0...@div]
      for ox in [0...@div]
        c =  new Chunk ox * Terrain.chunkSize, 0, oz * Terrain.chunkSize, Terrain.chunkSize, @heightMin, @heightRange, @seed
        @chunk.push c

  getMeshes: ->
    ret = []
    for c in @chunk
      ret.push c.mesh
    ret

  chunkify: (x, y, z)->
    cx = Math.floor x / Terrain.chunkSize
    cz = Math.floor z / Terrain.chunkSize
    return -1 unless 0 <= cx < @div
    return -1 unless 0 <= cz < @div
    cx + cz * @div

  getHeight: (x, z)->
    c = @chunkify x, 0, z
    return @heightMin if c < 0
    @chunk[c].getHeight x, z

  gridify: (rx, ry, rz)->
    x: Math.floor rx
    y: Math.floor ry
    z: Math.floor rz

  getCollider: (x, y, z)->
    [
      new THREE.Vector3(x, y, z)
      new THREE.Vector3(x + 1, y + 1, z + 1)
    ]

  getType: (x, y, z)->
    c = @chunkify x, y, z
    return 0 if c < 0
    @chunk[c].getType x, y, z

  addBlock: (x, y, z, type)->
    c = @chunkify x, y, z
    return if c < 0
    @chunk[c].addBlock x, y, z, type
  
  removeBlock: (x, y, z)->
    c = @chunkify x, y, z
    return if c < 0
    @chunk[c].removeBlock x, y, z

module.exports = Terrain
