BLOCK = require './block'
util = require './util'

class Chunk 
  # constant
  @dir: [[0,1,0], [-1,0,0], [1,0,0], [0,0,-1], [0,0,1], [0,-1,0]]
  @faceTable: [
    [ [0.0, 1.0, 0.0], [0.0, 1.0, 1.0], [1.0, 1.0, 0.0], [1.0, 1.0, 1.0] ],
    [ [0.0, 1.0, 0.0], [0.0, 0.0, 0.0], [0.0, 1.0, 1.0], [0.0, 0.0, 1.0] ],
    [ [1.0, 1.0, 1.0], [1.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 0.0] ],
    [ [1.0, 1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0] ],
    [ [0.0, 1.0, 1.0], [0.0, 0.0, 1.0], [1.0, 1.0, 1.0], [1.0, 0.0, 1.0] ],
    [ [1.0, 0.0, 1.0], [0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0] ]
  ]
  @indexTable: [ [0, 1, 2], [2, 1, 3] ]

  constructor: (@offsetx, @offsety, @offsetz, @size, @heightMin = 0, @heightRange = 128, @seed = undefined)->
    @seed ?= util.rand 1000000
    @size2 = @size * @size
    @heightMax = @heightMin + @heightRange - 1
    @grid = new Uint8Array @size2 * @heightRange
    @faceIndex = new Int16Array @size2 * @heightRange * 6
    @faceNum = 0
    @generateMesh 32, 0.5, @heightMin, @heightMax

    console.log "offset: #{@offsetx} #{@offsetz}"

  gridify: (rx, ry, rz)->
    x: Math.floor rx
    y: Math.floor ry
    z: Math.floor rz

  indexify: (x, y, z)->
    cx = x - @offsetx
    cy = y - @offsety
    cz = z - @offsetz
    return -1 unless 0 <= cx < @size
    return -1 unless 0 <= cz < @size
    return -1 unless @heightMin <= cy <= @heightMax
    cx + cz * @size + cy * @size2

  iindexify: (i)->
    x: i % @size + @offsetx
    z: ((i % @size2) / @size + @offsetz) | 0
    y: (i / @size2 + @offsety) | 0
    
  gridindexify: (rx, ry, rz)->
    {x, y, z} = @gridify rx, ry, rz
    @indexify x, y, z

  getType: (x, y, z)->
    index = @indexify x, y, z
    return BLOCK.TYPE.NONE if index < 0
    @grid[index]

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


  removeFace: (index, face, rangeUpdater)->
    attr = @geometry.attributes
    pos = attr.position
    nor = attr.normal
    col = attr.color
    ind = attr.index
    
    fii = index * 6 + face
    fi = @faceIndex[fii]
    return false if fi < 0
    @faceIndex[fii] = -1

    @faceNum--
    taili = @faceNum * 6
    return if fi is taili
    
    for i in [0, 1, 2, 5]
      dest = ind.array[fi + i] * 3
      src = ind.array[taili + i] * 3
        
      rangeUpdater dest, 3
      
      srcpos = []
      srcnor = []
      for k in [0...3]
        srcpos.push pos.array[src + k]
        pos.array[dest + k] = pos.array[src + k]
        srcnor.push nor.array[src + k]
        nor.array[dest + k] = nor.array[src + k]
        col.array[dest + k] = col.array[src + k]

      if i is 0
        srci = @gridindexify srcpos[0], srcpos[1], srcpos[2]
        srcf = @getFaceFromNormal srcnor[0], srcnor[1], srcnor[2]
        @faceIndex[srci * 6 + srcf] = fi

  addFace: (x, y, z, fi, type)->
    attr = @geometry.attributes
    pos = attr.position
    nor = attr.normal
    col = attr.color
    ind = attr.index

    taili = @faceNum * 6
    tailb = ind.array[taili - 1] + 1
    tailv = tailb * 3
    
    c = BLOCK.getColor(type)[fi]
    padding = 0.00001

    desti = @indexify x, y, z

    @faceIndex[desti * 6 + fi] = taili
    
    Chunk.indexTable.forEach (i, ii)->
      ind.array[ taili + ii*3     ] = i[0] + tailb
      ind.array[ taili + ii*3 + 1 ] = i[1] + tailb
      ind.array[ taili + ii*3 + 2 ] = i[2] + tailb

    Chunk.faceTable[fi].forEach (p)=>
      pos.array[ tailv     ] = p[0] + x + (if p[0] < 0.5 then padding else -padding)
      pos.array[ tailv + 1 ] = p[1] + y + (if p[1] < 0.5 then padding else -padding)
      pos.array[ tailv + 2 ] = p[2] + z + (if p[2] < 0.5 then padding else -padding)
      
      nor.array[ tailv     ] = Chunk.dir[fi][0]
      nor.array[ tailv + 1 ] = Chunk.dir[fi][1]
      nor.array[ tailv + 2 ] = Chunk.dir[fi][2]

      col.array[ tailv     ]  = c.r + util.randf(c.r / 4.0)
      col.array[ tailv + 1 ]  = c.g + util.randf(c.g / 4.0)
      col.array[ tailv + 2 ]  = c.b + util.randf(c.b / 4.0)

      tailv += 3

    @faceNum++


  removeBlock: (x, y, z)->
    index = @indexify x, y, z
    return if index < 0
    @grid[index] = 0
    
    ranges = []
    
    # remove face
    for fi in [0...6]
      @removeFace index, fi, (offset, cnt)->
        flag = true
        _.forEach ranges, (v, i)->
          return true if v[0] + v[1] < offset
          return true if offset + cnt < v[0]
          rmin = Math.min v[0], offset
          rmax = Math.max v[0] + v[1], offset + cnt
          ranges[i][0] = rmin
          ranges[i][1] = rmax - rmin
          return flag = false
        if flag
          ranges.push [offset, cnt]
    
    # add face
    taili = @faceNum * 6
    tailb = @geometry.attributes.index.array[taili - 1] + 1
    tailv = tailb * 3
    updateMin = tailv
    updateCount = 0
    updateMin2 = taili
    updateCount2 = 0

    for d in Chunk.dir
      type = @getType x + d[0], y + d[1], z + d[2]
      continue if type is 0
      face = @getInvFaceFromNormal d[0], d[1], d[2]
      
      @addFace x + d[0], y + d[1], z + d[2], face, type

      updateCount2 += 6
      updateCount += 12

    if updateCount > 0
      flag = true
      _.forEach ranges, (v, i)->
        return true if v[0] + v[1] < updateMin
        return true if updateMin + updateCount < v[0]
        rmin = Math.min v[0], updateMin
        rmax = Math.max v[0] + v[1], updateMin + updateCount
        ranges[i][0] = rmin
        ranges[i][1] = rmax - rmin
        return flag = false
      if flag
        ranges.push [updateMin, updateCount]

    if updateCount2 > 0
      @updateGeometry 'index', [[updateMin2, updateCount2]]
    
    if ranges.length > 0
      @updateGeometry 'position', ranges
      @updateGeometry 'color', ranges
      @updateGeometry 'normal', ranges

    @geometry.drawcalls[0].count = @faceNum * 6
  

  addBlock: (x, y, z, type)->
    index = @indexify x, y, z
    return if index < 0
    @grid[index] = type

    ranges = []
    
    # remove face
    for d in Chunk.dir
      type = @getType x + d[0], y + d[1], z + d[2]
      continue if type is 0
      index = @indexify x + d[0], y + d[1], z + d[2]
      face = @getInvFaceFromNormal d[0], d[1], d[2]

      @removeFace index, face, (offset, cnt)->
        flag = true
        _.forEach ranges, (v, i)->
          return true if v[0] + v[1] < offset
          return true if offset + cnt < v[0]
          rmin = Math.min v[0], offset
          rmax = Math.max v[0] + v[1], offset + cnt
          ranges[i][0] = rmin
          ranges[i][1] = rmax - rmin
          return flag = false
        if flag
          ranges.push [offset, cnt]
    
    # add face
    taili = @faceNum * 6
    tailb = @geometry.attributes.index.array[taili - 1] + 1
    tailv = tailb * 3
    updateMin = tailv
    updateCount = 0
    updateMin2 = taili
    updateCount2 = 0

    for d in Chunk.dir
      type = @getType x + d[0], y + d[1], z + d[2]
      continue if type isnt 0
      face = @getFaceFromNormal d[0], d[1], d[2]

      @addFace x, y, z, face, @getType(x, y, z)

      updateCount2 += 6
      updateCount += 12

    if updateCount > 0
      flag = true
      _.forEach ranges, (v, i)->
        return true if v[0] + v[1] < updateMin
        return true if updateMin + updateCount < v[0]
        rmin = Math.min v[0], updateMin
        rmax = Math.max v[0] + v[1], updateMin + updateCount
        ranges[i][0] = rmin
        ranges[i][1] = rmax - rmin
        return flag = false
      if flag
        ranges.push [updateMin, updateCount]

    if updateCount2 > 0
      @updateGeometry 'index', [[updateMin2, updateCount2]]
    
    if ranges.length > 0
      @updateGeometry 'position', ranges
      @updateGeometry 'color', ranges
      @updateGeometry 'normal', ranges

    @geometry.drawcalls[0].count = @faceNum * 6
    # @geometry.computeBoundingBox()
    @geometry.computeBoundingSphere()

  updateGeometry: (key, ranges)->
    THREE.updateGeometry @geometry, key, ranges
  
  getHeight: (x, z)->
    for h in [@heightMax..@heightMin]
      index = @indexify x, h, z
      return h if @grid[index] isnt 0
    return @heightMin

  generateMesh: (inflate, incline, min, max)->
    height = new Int16Array @size2
    faceMax = @size2 * @heightMax * 3 / 2
    console.log "faceMax: #{faceMax}"
    
    do =>
      hmax = min
      hmin = max
      
      for i in [0...@size2]
        x = (i % @size + @offsetx + 2) / 2
        z = (((i / @size + @offsetz) | 0) + 3) / 2
        quality = 2  
        for k in [0...4]
          height[i] += util.noise(x / quality, z / quality, @seed) * quality
          quality *= 4
        height[i] = ~~Math.max min, Math.min(max, height[i] * incline + inflate)
        for j in [0..height[i]]
          if j is height[i]
            @grid[i + j * @size2] = 2
          else
            @grid[i + j * @size2] = 1  
        hmax = Math.max hmax, height[i]
        hmin = Math.min hmin, height[i]
        
      console.log "height: [#{hmin}, #{hmax}]"

    @geometry = new THREE.BufferGeometry
    @material = new THREE.MeshLambertMaterial
        vertexColors: THREE.VertexColors

    vertices = new Float32Array faceMax * 4 * 3
    indices = new Uint32Array faceMax * 2 * 3
    normals = new Float32Array faceMax * 4 * 3
    colors = new Float32Array faceMax * 4 * 3
    #uvs = new Float32Array faceMax * 4 * 2 
    current = 0
    padding = 0.00001
    
    @grid.forEach (v, i)=>
      if v is 0
        @faceIndex[ i*6 + k] = -1 for k in [0...6]
        return
      {x, y, z} = @iindexify i
      col = BLOCK.getColor @getType(x, y, z)
      Chunk.dir.forEach (d, face)=>
        type = @getType x + d[0], y + d[1], z + d[2]
        if type is 0
          @faceNum++
          Chunk.faceTable[face].forEach (pos, o)=>
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

          @faceIndex[ i*6 + face ] = current * 6

          Chunk.indexTable.forEach (ind, o)->
            indices[ current*6 + o*3 + 0 ] = ind[0] + current * 4
            indices[ current*6 + o*3 + 1 ] = ind[1] + current * 4
            indices[ current*6 + o*3 + 2 ] = ind[2] + current * 4
            
          current++
        else
          @faceIndex[ i*6 + face ] = -1

    @geometry.addAttribute "position", new THREE.DynamicBufferAttribute(vertices, 3)
    @geometry.addAttribute "index", new THREE.DynamicBufferAttribute(indices, 3)
    @geometry.addAttribute "normal", new THREE.DynamicBufferAttribute(normals, 3)
    @geometry.addAttribute "color", new THREE.DynamicBufferAttribute(colors, 3)
    #@geometry.addAttribute "uv", new THREE.BufferAttribute(uvs, 2)

    @geometry.computeBoundingSphere()

    @geometry.drawcalls.push
      start: 0
      count: @faceNum * 2 * 3
      index: 0

    @mesh = new THREE.Mesh @geometry, @material

module.exports = Chunk