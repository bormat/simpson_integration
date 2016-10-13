(function(){
/**
 *
 * @param {} -
 * @return
 */
const mapFuncsToWindow = () => {
  const mathFuncs = ["cos","exp","sin","PI","sqrt","max","min","pow","round","tan","abs",'floor','round']
  mathFuncs.forEach(key => window[key] = Math[key])
}

/**
 *
 * @param {} -
 * @return
 */
const defaultV = (selector, defaultVal) => {
  const $jq = $("input[name="+selector+"]")
  const val = $jq.val()
  if (val !== undefined && val !== "") return val
  $jq.val(defaultVal)// si pas de valeur dans le champ on en met une
  return defaultVal
}

/**
 *
 * @param {} -
 * @return
 */
const getPointsArray = (func, iMin, iMax, iPas) => {
  const data = []
  // on remplit les points de la function pour l'afficher
  for (let i = iMin; i <= iMax; i += iPas) {
    data.push([i, func(i)])
  }
  return data
}

/**
 *
 * paramètre de l'axe y
 */
const generateParamForAxe = () => {
  let
    iyMax = defaultV("yMax",10),
    iyMin = defaultV("yMin",-10)
  ;
  return {
    series: {
      lines: { show: true }
    },
    crosshair: { mode: "x" },
    grid: { hoverable: true, autoHighlight: false },
    yaxis: { min: iyMin, max: iyMax }
  }
}
window.mapFuncsToWindow = mapFuncsToWindow
window.defaultV = defaultV
window.getPointsArray = getPointsArray
window.generateParamForAxe = generateParamForAxe
})()
