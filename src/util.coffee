class Utility
  @rand = (n)->
    Math.floor Math.random() * n

  @randRange = (min, max)->
    Math.floor(Math.random() * (max - min + 1)) + min
  
  @randArray = (arr)->
    arr[Math.floor Math.random() * arr.length]

  @noise = do ->
    perlin = new ImprovedNoise
    (x, y, z)-> perlin.noise x, y, z


module.exports = Utility