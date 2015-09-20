module.exports = do ->
  
  black = new THREE.Color 0x000000
  white = new THREE.Color 0x111111
  dirt  = new THREE.Color 0x8B4513
  grass = new THREE.Color 0x228b22

  TYPE = 
    NONE: 0
    DIRT: 1 
    GRASS: 2
    UNKNOWN: 255
    
  getColor = (type)->
    switch type
      when TYPE.NONE then [black, black, black, black, black, black]
      when TYPE.DIRT then [dirt, dirt, dirt, dirt, dirt, dirt]
      when TYPE.GRASS then [grass, dirt, dirt, dirt, dirt, dirt]
      else [white, white, white, white, white, white]

  return { TYPE, getColor }
