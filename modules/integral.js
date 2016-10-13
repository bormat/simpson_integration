(function(){
/**
 *
 * @param {} -
 * @return
 */
 const carre = (min,max,nbPas,func) => {
	let pas = (max - min) / nbPas
	var res = 0;
	for(;min < max;min += pas){
		res += func(min) * pas
	}
	return res
}

/**
 *
 * @param {} -
 * @return
 */
const trapeze = (min,max,nbPas,func) => {
	let pas = (max - min) / nbPas
	var res = 0;
	for(;min < max;min += pas){
		res += 0.5 * (func(min) + func(min + pas))
	}
	return res * pas
}

/**
 *
 * @param {} -
 * @return
 */
const simpson = (min,max,nbPas,func) => {
	return carre(min,max,nbPas,func)
	2/3+ trapeze(min,max,nbPas,func)/3
}

window.carre = carre
window.trapeze = trapeze
window.simpson = simpson
})()
