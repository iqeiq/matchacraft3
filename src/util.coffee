
module.exports.rand = (n)->
  Math.floor Math.random() * n

module.exports.randRange = (min, max)->
  Math.floor(Math.random() * (max - min + 1)) + min
  
module.exports.randArray = (arr)->
  arr[Math.floor Math.random() * arr.length]

module.exports.noise = do ->
  perlin = new ImprovedNoise
  (x, y, z)-> perlin.noise x, y, z
