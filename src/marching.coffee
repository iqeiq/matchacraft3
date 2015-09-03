util = require './util'

class Marching
  constructor: (@SIZE, isolevel, generator)->
    points = []
    values = []
    min = 0
    max = @SIZE 
    range = max - min - 1

    [0...@SIZE].forEach (k)=>
      [0...@SIZE].forEach (j)=>
        [0...@SIZE].forEach (i)=>
          x = min + range * i / (@SIZE - 1)
          y = min + range * j / (@SIZE - 1)
          z = min + range * k / (@SIZE - 1)
          points.push new THREE.Vector3(x, y, z)
          value = generator x, y, z, i, j, k
          values.push value
   
    size2 = @SIZE * @SIZE
    
    vlist = new Array 12
  
    geometry = new THREE.Geometry()
    vertexIndex = 0
  
    [0...@SIZE-1].forEach (z)=>
      [0...@SIZE-1].forEach (y)=>
        [0...@SIZE-1].forEach (x)=>
          p     = x   + @SIZE * y + size2 * z
          px    = p   + 1
          py    = p   + @SIZE
          pxy   = py  + 1
          pz    = p   + size2
          pxz   = px  + size2
          pyz   = py  + size2
          pxyz  = pxy + size2
    
          value0 = values[p]
          value1 = values[px]
          value2 = values[py]
          value3 = values[pxy]
          value4 = values[pz]
          value5 = values[pxz]
          value6 = values[pyz]
          value7 = values[pxyz]
    
          cubeindex = 0
          cubeindex |= 1    if value0 < isolevel
          cubeindex |= 2    if value1 < isolevel
          cubeindex |= 8    if value2 < isolevel
          cubeindex |= 4    if value3 < isolevel
          cubeindex |= 16   if value4 < isolevel
          cubeindex |= 32   if value5 < isolevel
          cubeindex |= 128  if value6 < isolevel
          cubeindex |= 64   if value7 < isolevel
    
          bits = MARCH.edgeTable[cubeindex]
    
          return if bits is 0
    
          mu = 0.5 
    
          if bits & 1
            mu = (isolevel - value0) / (value1 - value0)
            vlist[0] = points[p].clone().lerp points[px], mu
          if bits & 2
            mu = (isolevel - value1) / (value3 - value1)
            vlist[1] = points[px].clone().lerp points[pxy], mu
          if bits & 4
            mu = (isolevel - value2) / (value3 - value2)
            vlist[2] = points[py].clone().lerp points[pxy], mu
          if bits & 8
            mu = (isolevel - value0) / (value2 - value0)
            vlist[3] = points[p].clone().lerp points[py], mu
          if bits & 16
            mu = (isolevel - value4) / (value5 - value4)
            vlist[4] = points[pz].clone().lerp points[pxz], mu
          if bits & 32
            mu = (isolevel - value5) / (value7 - value5)
            vlist[5] = points[pxz].clone().lerp points[pxyz], mu
          if bits & 64
            mu = (isolevel - value6) / (value7 - value6)
            vlist[6] = points[pyz].clone().lerp points[pxyz], mu
          if bits & 128
            mu = (isolevel - value4) / (value6 - value4)
            vlist[7] = points[pz].clone().lerp points[pyz], mu
          if bits & 256
            mu = (isolevel - value0) / (value4 - value0)
            vlist[8] = points[p].clone().lerp points[pz], mu
          if bits & 512
            mu = (isolevel - value1) / (value5 - value1)
            vlist[9] = points[px].clone().lerp points[pxz], mu
          if bits & 1024
            mu = (isolevel - value3) / (value7 - value3)
            vlist[10] = points[pxy].clone().lerp points[pxyz], mu 
          if bits & 2048 
            mu = (isolevel - value2) / (value6 - value2)
            vlist[11] = points[py].clone().lerp points[pyz], mu
          
          i = 0
          cubeindex <<= 4
          
          until MARCH.triTable[cubeindex + i] is -1 
            index1 = MARCH.triTable[cubeindex + i]
            index2 = MARCH.triTable[cubeindex + i + 1]
            index3 = MARCH.triTable[cubeindex + i + 2]
            
            geometry.vertices.push vlist[index1].clone()
            geometry.vertices.push vlist[index2].clone()
            geometry.vertices.push vlist[index3].clone()
            face = new THREE.Face3 vertexIndex, vertexIndex + 1, vertexIndex + 2
            face.color = new THREE.Color(0, 0.5 + util.randf(0.5), 0)
            #face.vertexColors[0] = new THREE.Color 0x000ff
            #face.vertexColors[1] = new THREE.Color 0x00ff00
            #face.vertexColors[2] = new THREE.Color 0x0000ff
            geometry.faces.push face
            geometry.faceVertexUvs[0].push [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]
            vertexIndex += 3
            i += 3
    
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()

    material = new THREE.MeshLambertMaterial
        #color: 0x00cc33
        #side: THREE.DoubleSide
        vertexColors: THREE.VertexColors
    @mesh = new THREE.Mesh geometry, material


module.exports = Marching
