(function(){
"use strict";

/**
 *
 * @param {} -
 * @return
 */
 const carre = (max,nbPas,func) => {
	let pas = (max - 0) / nbPas
	var res = 0;
	let min = 0;
	for(;min < max;min += pas){
		res += func(min) 
	}
	return res * pas
}

/**
 *
 * @param {} -
 * @return
 */
const trapeze = (max,nbPas,func) => {
	let pas = (max - 0) / nbPas
	var res = 0;
	let min = 0;
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
const simpson = (iPeriode,nbPas,func) => {
	return 2/3 * carre(iPeriode,nbPas,func) + trapeze(iPeriode,nbPas,func)/3
}

window.carre = carre
window.trapeze = trapeze
window.simpson = simpson
})()
