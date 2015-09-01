util = require './util'
Input = require './input'

class Scene
  constructor: (@renderer, @transit)->
    @clock = new THREE.Clock
    @input = new Input document.body
    @scene = new THREE.Scene
    @camera = new THREE.PerspectiveCamera 72, window.innerWidth / window.innerHeight, 1, 1000
    
  update: ->
    @renderer.render @scene, @camera

class OrbitScene extends Scene
  constructor: (@renderer, @transit)-> 
    super @renderer, @transit
    #@scene.fog = new THREE.Fog 0xffffff, 100, 1000
    @camera.position.z = 100
    @controls = new THREE.OrbitControls @camera

    @SIZE = 64
    min = -@SIZE / 2
    max = @SIZE / 2 
    range = max - min

    points = []
    values = []
    hash = util.rand 1000

    height = []
    hmax = -@SIZE / 2
    hmin = @SIZE / 2

    do =>
      size = @SIZE * @SIZE
      quality = 2

      [0...size].forEach (i)-> height.push 0

      [0...4].forEach (k)=>
        [0...size].forEach (i)=>
          x = i % @SIZE
          z = (i / @SIZE) | 0
          x /= 2
          z /= 2
          height[i] += util.noise(x / quality, z / quality, hash) * quality
        quality *= 4

      [0...size].forEach (i)-> 
        console.log height[i] = -@SIZE / 2 if height[i] < -@SIZE / 2
        console.log height[i] = @SIZE / 2 if height[i] > @SIZE / 2
        height[i] *= 0.5
        hmax = height[i] if height[i] > hmax
        hmin = height[i] if height[i] < hmin

    [0...@SIZE].forEach (k)=>
      [0...@SIZE].forEach (j)=>
        [0...@SIZE].forEach (i)=>
          x = min + range * i / (@SIZE - 1)
          y = min + range * j / (@SIZE - 1)
          z = min + range * k / (@SIZE - 1)
          points.push new THREE.Vector3(x, y, z)
          value = if height[k*@SIZE + i] > y then height[k*@SIZE + i] + @SIZE / 2  else -1 
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
    
          isolevel = 0
    
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
    @scene.add @mesh

    bgeometry = new THREE.BoxGeometry @SIZE, hmax - hmin, @SIZE
    bmaterial = new THREE.MeshBasicMaterial
        color: 0x00ffff
        wireframe: true
    bmesh = new THREE.Mesh bgeometry, bmaterial
    @scene.add bmesh
    bmesh.position.y += (hmax + hmin)/2
    
    @light = new THREE.DirectionalLight 0xffffff, 1.0
    @light.position.set(0.5, 0.7, 0.3).normalize()
    @scene.add @light

    @scene.add new THREE.AmbientLight 0x202020

    #@input.onMouseDown THREE.MOUSE.RIGHT, =>
    #  console.log "transit PLScene"
    #  @transit new PLScene @renderer, @transit


  update: ->
    @controls.update()
    super()
    

class PLScene extends Scene
  constructor: (@renderer, @transit)-> 
    super @renderer, @transit
    @camera.position.z = 100
    @controls = new THREE.PointerLockControls @camera
    @scene.add @controls.getObject()

    geometry = new THREE.BoxGeometry 20, 20, 20
    material = new THREE.MeshBasicMaterial
        color: 0xff0000
        wireframe: true
    @mesh = new THREE.Mesh geometry, material
    @scene.add @mesh

    @input.onMouseDown THREE.MOUSE.LEFT, =>
      console.log "poyo"
      @controls.enabled = true
      unless document.pointerLockElement
        document.body.requestPointerLock()
    
    @input.onDoubleClick =>
      @controls.enabled = false
      if document.pointerLockElement
        document.exitPointerLock()
      console.log "transit OrbitScene"
      @transit new OrbitScene @renderer, @transit
      

module.exports = OrbitScene