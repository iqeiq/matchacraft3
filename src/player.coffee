Input = require './input'
{inspect} = require 'util'

class Player extends THREE.Object3D
  constructor: (@world, x, y, z)->
    super()
    @input = @world.input
    @velocity = new THREE.Vector3 0, 0, 0
    @canJump = false
    @canDoubleJump = false
    @doubleJumpFlag = false
    @gravity = true
    @height = 1.7
    @width = 0.7
    @mode = 1
    @sneak = false
    @position.set x, y, z
    @lookAt new THREE.Vector3(x, 0, z)
    @ray = new THREE.Raycaster
    @ray.near = 0
    @ray.far = 5
    @pickFlag = false

    @input.onMouseDown THREE.MOUSE.LEFT, =>
      @pickFlag = true
    @input.onMouseUp THREE.MOUSE.LEFT, =>
      @pickFlag = false
    
    
  getCollider: ->
    @collider = [
      @position.clone().add new THREE.Vector3(- @width / 2, -0.5, -@width / 2)
      @position.clone().add new THREE.Vector3( @width / 2, @height - 0.5, @width / 2)
    ]

  getCell: ->
    obj = 
      x: Math.floor @position.x
      y: Math.floor @position.y
      z: Math.floor @position.z

  getAroundColliders: (axis, d)->
    result = []
    {x, y, z} = @getCell()
    dirs = []
    for a in [-1, 0, 1]
      for b in [-1, 0, 1]
        dirs.push [d, a, b] if axis is 'x'
        dirs.push [a, d, b] if axis is 'y'
        dirs.push [a, b, d] if axis is 'z'

    for dir in dirs
      tx = x + dir[0]
      ty = y + dir[1]
      tz = z + dir[2]
      if @world.terrain.getType tx, ty, tz
        result.push @world.terrain.getCollider(tx, ty, tz)

    result

  collides: (colls)->
    p = @getCollider()
    colls.some (c)->
      return false if c[0].x > p[1].x
      return false if c[0].y > p[1].y
      return false if c[0].z > p[1].z
      return false if c[1].x < p[0].x
      return false if c[1].y < p[0].y
      return false if c[1].z < p[0].z
      true

  pick: ->
    origin = @position.clone().add new THREE.Vector3(0, @height - 0.75, 0)
    mouse =  new THREE.Vector3 0, 0, 1
    mouse.unproject @world.camera
    direction = mouse.sub(origin).normalize()
    @ray.set origin, direction 
    intersects = @ray.intersectObjects @world.terrain.getMeshes()
    if intersects.length > 0
      intersect = intersects[0]
      face = intersect.face
      attrs = intersect.object.geometry.attributes
      pos = attrs.position
      nor = attrs.normal
      #fi = intersect.faceIndex
      #fi = fi - if fi % 6 then 3 else 0
      #console.log fi
      
      v1 = face.a * 3  
      {x, y, z} = @world.terrain.gridify pos.array[v1], pos.array[v1+1], pos.array[v1+2]
      if @input.keys['q']
        @world.terrain.removeBlock x, y, z
      else if @input.keys['e']
        nx = nor.array[v1]
        ny = nor.array[v1+1]
        nz = nor.array[v1+2]

        p = @getCell()
        unless p.x is x + nx and p.z is z + nz and (p.y is y + ny or p.y + 1 is y + ny )
          @world.terrain.addBlock x + nx, y + ny, z + nz, 2


  action: (delta)->
    eps = 0.001
    gravityUpdate = false

    @velocity.x -= @velocity.x * 3.0 * delta
    @velocity.z -= @velocity.z * 3.0 * delta

    @velocity.x = 0 if Math.abs(@velocity.x) < eps
    @velocity.z = 0 if Math.abs(@velocity.z) < eps

    if @gravity
      if -@velocity.y * delta < 0.5
        @velocity.y -= 9.8 * 2.7 * delta

    for axis in ['x', 'y', 'z'] 
      if Math.abs(@velocity[axis]) * delta > 0.7
        @velocity[axis] = 0.7 * (if @velocity[axis] < 0 then -1 else 1) / delta

    
    if @input.keys["shift"]
      @sneak = true if @canJump
    else
      gravityUpdate = true
      @sneak = false
    speed = if @sneak then 2.0 else 12.0

    if @input.keys["w"]
      @velocity.z -= speed * delta
      gravityUpdate = true
    if @input.keys["a"]
      @velocity.x -= speed * delta
      gravityUpdate = true
    if @input.keys["s"]
      @velocity.z += speed * delta
      gravityUpdate = true
    if @input.keys["d"]
      @velocity.x += speed * delta
      gravityUpdate = true
    if @input.keys["space"] and not @sneak
      if @gravity
        if @canDoubleJump
          @velocity.y = 14.0
          @velocity.x *= 3.0
          @velocity.z *= 3.0
          @canDoubleJump = false
      else if @canJump
        @velocity.y = 8.5
        @canJump = false
        @gravity = true
        @doubleJumpFlag = true
    else
      if @doubleJumpFlag
        @canDoubleJump = true
        @doubleJumpFlag = false
    if gravityUpdate
      @gravity = true
      @canJump = false

  hitCheck: (delta)->
    eps = 0.001
    prev = @position.clone()
    
    @translateX @velocity.x * delta
    @translateZ @velocity.z * delta
    @translateY @velocity.y * delta

    move = 
      x: @position.x - prev.x
      z: @position.z - prev.z
      y: @position.y - prev.y

    @position.copy prev

    if @sneak
      for axis in ['x', 'z']
        m = move[axis]
        continue if Math.abs(m) < eps 
        old = @position[axis]
        @position[axis] += m
        colls = @getAroundColliders axis, (if m < 0 then -1 else 1)
        if @collides colls
          @position[axis] = old
        else
          continue if move.y > 0
          oldy = @position.y
          @position.y -= 0.5
          colls = @getAroundColliders 'y', -1
          unless @collides colls
            @position[axis] = old
          @position.y = oldy
      
      @velocity.y = 0
      @gravity = false
    else 
      for axis in ['x', 'z', 'y']
        m = move[axis]
        continue if Math.abs(m) < eps 
        old = @position[axis]
        @position[axis] += m
        colls = @getAroundColliders axis, (if m < 0 then -1 else 1)
        if @collides colls
          @position[axis] = old
          if axis is 'y'
            @velocity.y = 0
            if m < 0
              @canJump = true
              @canDoubleJump = false
              @doubleJumpFlag = false
              @gravity = false

  update: (delta)->
    @pick() if @pickFlag
    @action delta
    @hitCheck delta
    
    
        
module.exports = Player
