Input = require './input'

class Player extends THREE.Object3D
  constructor: (x, y, z)->
    super()
    @velocity = new THREE.Vector3 0, 0, 0
    @canJump = false
    @gravity = true
    @height = 1.7
    @width = 0.8
    @mode = 1
    @position.set x, y, z
    @lookAt new THREE.Vector3(0, 0, 0)

  update: (delta)->

    if @gravity
      @velocity.y -= 9.8 * 2.7 * delta

    @translateX @velocity.x * delta
    @translateZ @velocity.z * delta
    @translateY @velocity.y * delta


module.exports = Player
