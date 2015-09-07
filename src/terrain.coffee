util = require './util'

class Terrain
  constructor: (@size, @heightMin = 0, @heightRange = 128, @seed = undefined)->
    @size2 = @size * @size
    @seed ?= util.rand 1000000
    @cell = new Uint8Array @size2 * @heightRange
    @generateMesh 32, 0.5, @heightMin, @heightMin + @heightRange - 1
    console.log "seed: #{@seed}"

  getType: (x, y, z)->
    return 0 if x < 0 or x > @size - 1
    return 0 if z < 0 or z > @size - 1
    return 0 if y < @heightMin or y > @heightMin + @heightRange - 1
    @cell[x + z * @size + y * @size2]

  getColor: (type)->
    black = new THREE.Color 0x000000
    white = new THREE.Color 0x111111
    dirt = new THREE.Color 0x8B4513
    grass = new THREE.Color 0x228b22

    switch type
      when 0 then [black, black, black, black, black, black] 
      when 1 then [dirt, dirt, dirt, dirt, dirt, dirt]
      when 2 then [grass, dirt, dirt, dirt, dirt, dirt]
      else [white, white, white, white, white, white]

  getCollider: (x, y, z)->
    [
      new THREE.Vector3(x, y, z)
      new THREE.Vector3(x + 1, y + 1, z + 1)
    ]
  
  getHeight: (x, z)->
    index = x + z * @size
    hmax = @heightMin + @heightRange - 1
    for h in [hmax..@heightMin]
      return h if @cell[index + h * @size2] isnt 0
    return @heightMin

  generateMesh: (inflate, incline, min, max)->
    height = new Int16Array @size * @size
    
    do =>
      hmax = min
      hmin = max
      
      for i in [0...@size2]
        x = (i % @size + 2) / 2
        z = (((i / @size) | 0) + 3) / 2
        quality = 2  
        for k in [0...4]
          height[i] += util.noise(x / quality, z / quality, @seed) * quality
          quality *= 4
        height[i] = ~~Math.max min, Math.min(max, height[i] * incline + inflate)
        for j in [0..height[i]]
          if j is height[i]
            @cell[i + j * @size2] = 2
          else
            @cell[i + j * @size2] = 1  
        hmax = Math.max hmax, height[i]
        hmin = Math.min hmin, height[i]
        
      console.log "height: [#{hmin}, #{hmax}]"

    @geometry = new THREE.BufferGeometry
    @material = new THREE.MeshLambertMaterial
        vertexColors: THREE.VertexColors

    do =>
      faceTemp = [
        [ [0.0, 1.0, 0.0], [0.0, 1.0, 1.0], [1.0, 1.0, 0.0], [1.0, 1.0, 1.0] ],
        [ [0.0, 1.0, 0.0], [0.0, 0.0, 0.0], [0.0, 1.0, 1.0], [0.0, 0.0, 1.0] ],
        [ [1.0, 1.0, 1.0], [1.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 0.0] ],
        [ [1.0, 1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0] ],
        [ [0.0, 1.0, 1.0], [0.0, 0.0, 1.0], [1.0, 1.0, 1.0], [1.0, 0.0, 1.0] ],
        [ [1.0, 0.0, 1.0], [0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0] ]
      ]
      indexTemp = [ [0, 1, 2], [2, 1, 3] ]
      dir = [[0,1,0], [-1,0,0], [1,0,0], [0,0,-1], [0,0,1], [0,-1,0]]

      #compute visible
      faceNum = 0
      do =>
        @cell.forEach (v, i)=>
          return if v is 0
          x = i % @size
          z = ((i % @size2) / @size) | 0
          y = (i / @size2) | 0
          dir.forEach (d)=>
            type = @getType x + d[0], y + d[1], z + d[2]
            if type is 0
              faceNum++

      console.log "faceNum: #{faceNum}"

      vertices = new Float32Array faceNum * 4 * 3
      indices = new Uint32Array faceNum * 2 * 3
      normals = new Float32Array faceNum * 4 * 3
      colors = new Float32Array faceNum * 4 * 3
      #uvs = new Float32Array faceNum * 4 * 2 
      current = 0
      padding = 0.00001
      
      @cell.forEach (v, i)=>
        return if v is 0
        x = i % @size
        z = ((i % @size2) / @size) | 0
        y = (i / @size2) | 0
        col = @getColor @getType(x, y, z)
        dir.forEach (d, face)=>
          type = @getType x + d[0], y + d[1], z + d[2]
          if type is 0
            faceTemp[face].forEach (pos, o)->
              vertices[ current*12 + o*3 + 0 ] = pos[0] + x + (if pos[0] < 0.5 then padding else -padding)
              vertices[ current*12 + o*3 + 1 ] = pos[1] + y + (if pos[1] < 0.5 then padding else -padding)
              vertices[ current*12 + o*3 + 2 ] = pos[2] + z + (if pos[2] < 0.5 then padding else -padding)
    
              normals[ current*12 + o*3 + 0 ] = if face is 1 then -1.0 else (if face is 2 then 1.0 else 0.0)
              normals[ current*12 + o*3 + 1 ] = if face is 5 then -1.0 else (if face is 0 then 1.0 else 0.0)
              normals[ current*12 + o*3 + 2 ] = if face is 3 then -1.0 else (if face is 4 then 1.0 else 0.0)
              
              c = col[face]
              colors[ current*12 + o*3 + 0 ] = c.r + util.randf(c.r / 8.0)
              colors[ current*12 + o*3 + 1 ] = c.g + util.randf(c.r / 8.0)
              colors[ current*12 + o*3 + 2 ] = c.b + util.randf(c.r / 8.0)
              #uvs[ current*8 + o*2 + 0 ] = 0.0
              #uvs[ current*8 + o*2 + 1 ] = 0.0

            indexTemp.forEach (ind, o)->
              indices[ current*6 + o*3 + 0 ] = ind[0] + current*4
              indices[ current*6 + o*3 + 1 ] = ind[1] + current*4
              indices[ current*6 + o*3 + 2 ] = ind[2] + current*4

            current++

      @geometry.addAttribute "position", new THREE.BufferAttribute(vertices, 3)
      @geometry.addAttribute "index", new THREE.BufferAttribute(indices, 3)
      @geometry.addAttribute "normal", new THREE.BufferAttribute(normals, 3)
      @geometry.addAttribute "color", new THREE.BufferAttribute(colors, 3)
      #@geometry.addAttribute "uv", new THREE.BufferAttribute(uvs, 2)

    @mesh = new THREE.Mesh @geometry, @material



module.exports = Terrain