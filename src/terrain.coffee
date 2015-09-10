util = require './util'

class Terrain
  constructor: (@world, @size, @heightMin = 0, @heightRange = 128, @seed = undefined)->
    @size2 = @size * @size
    @seed ?= util.rand 1000000
    @cell = new Uint8Array @size2 * @heightRange
    @cellFace = new Int32Array @size2 * @heightRange * 6
    @faceNum = 0
    @generateMesh 32, 0.5, @heightMin, @heightMin + @heightRange - 1
    console.log "seed: #{@seed}"

  getCell: (x, y, z)->
    res = 
      x: Math.floor x
      y: Math.floor y
      z: Math.floor z

  getIndex: (x, y, z)->
    return -1 if x < 0 or x > @size - 1
    return -1 if z < 0 or z > @size - 1
    return -1 if y < @heightMin or y > @heightMin + @heightRange - 1
    x + z * @size + y * @size2

  getIndex2: (x, y, z)->
    {x, y, z} = @getCell x, y, z
    return -1 if x < 0 or x > @size - 1
    return -1 if z < 0 or z > @size - 1
    return -1 if y < @heightMin or y > @heightMin + @heightRange - 1
    x + z * @size + y * @size2

  getType: (x, y, z)->
    index = @getIndex x, y, z
    return 0 if index < 0
    @cell[index]

  getFaceIndex: (index, k)->
    @cellFace[index * 6 + k]

  getFaceFromNormal: (x, y, z)->
    # y = 1 => 0
    # x = -1 => 1
    # x = 1 => 2
    # z = -1 => 3
    # z = 1 => 4
    # y = -1 => 5
    x * x * (3 + x) / 2 + y * y * (5 - y * 5) / 2 + z * z * (7 + z) / 2

  getInvFaceFromNormal: (x, y, z)->
    x * x * (3 - x) / 2 + y * y * (5 + y * 5) / 2 + z * z * (7 - z) / 2

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

  removeBlock: (x, y, z)->
    index = @getIndex x, y, z
    return if index < 0
    @cell[index] = 0
    attr = @geometry.attributes
    pos = attr.position
    nor = attr.normal
    col = attr.color
    ind = attr.index
    #faces = @getFaceIndex index
    ranges = []
    
    # remove face
    for fi in [0...6]
      face = @getFaceIndex index, fi
      continue if face is -1
      @faceNum--
      tail = @faceNum * 6
      if face is tail
        console.log "last face!!"
        continue
      console.log "[remove] #{face}"
      for i in [0, 1, 2, 5]
        dest = ind.array[face + i] * 3
        src = ind.array[tail + i] * 3
        # console.log "#{dest} <- #{src} / #{tail}"
        flag = true
        ranges.forEach (v, i)->
          if v[0] <= dest <= v[0] + v[1]
            ranges[i][1] += 3 if v[0] + v[1] is dest
            flag = false
          else if dest <= v[0] <= dest + 3
            ranges[i][0] = dest
            ranges[i][1] += 3 if v[0] isnt dest
            flag = false
        if flag
          ranges.push [dest, 3]
        
        srcpos = []
        srcnor = []
        for k in [0...3]
          srcpos.push pos.array[src + k]
          pos.array[dest + k] = pos.array[src + k]
          srcnor.push nor.array[src + k]
          nor.array[dest + k] = nor.array[src + k]
          col.array[dest + k] = col.array[src + k]

        if i is 0
          srci = 6 * @getIndex2 srcpos[0], srcpos[1], srcpos[2]
          srcf = @getFaceFromNormal srcnor[0], srcnor[1], srcnor[2]
          @cellFace[srci + srcf] = face
          console.log "[move] #{tail}"
        
    for i in [0...6]
      @cellFace[index * 6 + i] = -1
    
    # add face
    dir = [[0,1,0], [-1,0,0], [1,0,0], [0,0,-1], [0,0,1], [0,-1,0]]
    faceTemp = [
      [ [0.0, 1.0, 0.0], [0.0, 1.0, 1.0], [1.0, 1.0, 0.0], [1.0, 1.0, 1.0] ],
      [ [0.0, 1.0, 0.0], [0.0, 0.0, 0.0], [0.0, 1.0, 1.0], [0.0, 0.0, 1.0] ],
      [ [1.0, 1.0, 1.0], [1.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 0.0] ],
      [ [1.0, 1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0] ],
      [ [0.0, 1.0, 1.0], [0.0, 0.0, 1.0], [1.0, 1.0, 1.0], [1.0, 0.0, 1.0] ],
      [ [1.0, 0.0, 1.0], [0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0] ]
    ]
    indexTemp = [ [0, 1, 2], [2, 1, 3] ]
    padding = 0.00001
    taili = @faceNum * 6
    tailb = ind.array[taili - 1] + 1
    tailv = tailb * 3
    # console.log "taili: #{taili} / tailv: #{tailv}"
    updateMin = tailv
    updateCount = 0
    updateMin2 = taili
    updateCount2 = 0

    for d in dir
      type = @getType x + d[0], y + d[1], z + d[2]
      continue if type is 0
      face = @getInvFaceFromNormal d[0], d[1], d[2]
      console.log "[add] #{taili} face: #{face} / d: " + d

      c = @getColor(type)[face]
      desti = @getIndex x + d[0], y + d[1], z + d[2]

      
      @cellFace[ desti*6 + face ] = taili
      

      indexTemp.forEach (i)->
        ind.array[ taili     ] = i[0] + tailb
        ind.array[ taili + 1 ] = i[1] + tailb
        ind.array[ taili + 2 ] = i[2] + tailb
        taili += 3
      tailb += 4

      faceTemp[face].forEach (p)->
        pos.array[ tailv     ] = p[0] + x + d[0] + (if p[0] < 0.5 then padding else -padding)
        pos.array[ tailv + 1 ] = p[1] + y + d[1] + (if p[1] < 0.5 then padding else -padding)
        pos.array[ tailv + 2 ] = p[2] + z + d[2] + (if p[2] < 0.5 then padding else -padding)
        
        nor.array[ tailv     ] = -d[0]
        nor.array[ tailv + 1 ] = -d[1]
        nor.array[ tailv + 2 ] = -d[2]

        col.array[ tailv     ]  = c.r + util.randf(c.r / 4.0)
        col.array[ tailv + 1 ]  = c.g + util.randf(c.g / 4.0)
        col.array[ tailv + 2 ]  = c.b + util.randf(c.b / 4.0)

        tailv += 3

      updateCount2 += 6
      updateCount += 12
      @faceNum++

    if updateCount > 0
      ranges.push [updateMin, updateCount]

    if updateCount2 > 0
      @updateGeometry 'index', [[updateMin2, updateCount2]]
    
    console.log "range: " + ranges
    if ranges.length > 0
      @updateGeometry 'position', ranges
      @updateGeometry 'color', ranges
      @updateGeometry 'normal', ranges

    @geometry.drawcalls[0].count = @faceNum * 6
    
  addBlock: (x, y, z, type)->
    index = @getIndex x, y, z
    return index < -1
    @cell[index] = type



  updateGeometry: (key, ranges)->
    _gl = @world.renderer.context
    attributes = @geometry.attributes
    attr = attributes[key]
    bufferType = if key is 'index' then _gl.ELEMENT_ARRAY_BUFFER else _gl.ARRAY_BUFFER
    _gl.bindBuffer bufferType, attr.buffer
    for range in ranges
      offset = range[0]
      count = range[1]
      data = attr.array.subarray offset, offset + count
      _gl.bufferSubData bufferType, offset * attr.array.BYTES_PER_ELEMENT, data
      data = null


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
    height = new Int16Array @size2
    faceMax = @size2 * (@heightMin + @heightRange - 1) * 3
    console.log "faceMax: #{faceMax}"
    
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

      vertices = new Float32Array faceMax * 4 * 3
      indices = new Uint32Array faceMax * 2 * 3
      normals = new Float32Array faceMax * 4 * 3
      colors = new Float32Array faceMax * 4 * 3
      #uvs = new Float32Array faceMax * 4 * 2 
      current = 0
      padding = 0.00001
      
      @cell.forEach (v, i)=>
        if v is 0
          @cellFace[ i*6 + k] = -1 for k in [0...6]
          return
        x = i % @size
        z = ((i % @size2) / @size) | 0
        y = (i / @size2) | 0
        col = @getColor @getType(x, y, z)
        dir.forEach (d, face)=>
          type = @getType x + d[0], y + d[1], z + d[2]
          if type is 0
            @faceNum++
            faceTemp[face].forEach (pos, o)->
              vertices[ current*12 + o*3 + 0 ] = pos[0] + x + (if pos[0] < 0.5 then padding else -padding)
              vertices[ current*12 + o*3 + 1 ] = pos[1] + y + (if pos[1] < 0.5 then padding else -padding)
              vertices[ current*12 + o*3 + 2 ] = pos[2] + z + (if pos[2] < 0.5 then padding else -padding)
    
              normals[ current*12 + o*3 + 0 ] = if face is 1 then -1.0 else (if face is 2 then 1.0 else 0.0)
              normals[ current*12 + o*3 + 1 ] = if face is 5 then -1.0 else (if face is 0 then 1.0 else 0.0)
              normals[ current*12 + o*3 + 2 ] = if face is 3 then -1.0 else (if face is 4 then 1.0 else 0.0)
              
              c = col[face]
              colors[ current*12 + o*3 + 0 ] = c.r + util.randf(c.r / 4.0)
              colors[ current*12 + o*3 + 1 ] = c.g + util.randf(c.g / 4.0)
              colors[ current*12 + o*3 + 2 ] = c.b + util.randf(c.b / 4.0)
              #uvs[ current*8 + o*2 + 0 ] = 0.0
              #uvs[ current*8 + o*2 + 1 ] = 0.0

            @cellFace[ i*6 + face ] = current * 6

            indexTemp.forEach (ind, o)->
              indices[ current*6 + o*3 + 0 ] = ind[0] + current * 4
              indices[ current*6 + o*3 + 1 ] = ind[1] + current * 4
              indices[ current*6 + o*3 + 2 ] = ind[2] + current * 4
              
            current++
          else
            @cellFace[ i*6 + face ] = -1

      @geometry.addAttribute "position", new THREE.DynamicBufferAttribute(vertices, 3)
      @geometry.addAttribute "index", new THREE.DynamicBufferAttribute(indices, 3)
      @geometry.addAttribute "normal", new THREE.DynamicBufferAttribute(normals, 3)
      @geometry.addAttribute "color", new THREE.DynamicBufferAttribute(colors, 3)
      #@geometry.addAttribute "uv", new THREE.BufferAttribute(uvs, 2)

      @geometry.drawcalls.push
        start: 0
        count: @faceNum * 2 * 3
        index: 0

    @mesh = new THREE.Mesh @geometry, @material



module.exports = Terrain
