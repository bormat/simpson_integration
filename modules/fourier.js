(function(){
"use strict";
//paramètre pour l'abscisse(min,max), le nombre de pas, la fonction, le nom de la fonction,

/* obtient le modulo positif alors que % peut retourner des négatifs*/
const moduloPositive = (a,n) => {
    return a - n * Math[n > 0 ? 'floor' : 'ceil'](a/n); 
}

const getFourrierReconstitutionFunc = function([an0,ans,bns],iPeriode,iNbHarmonique){
	return function(x){
		var res = an0;
		var omegaFoisX = 2* PI / iPeriode * x;
		for(var i = 0 ;i < iNbHarmonique;++i){
			var nOmegaX = (i+1) * omegaFoisX
			res += ans[i] * cos(nOmegaX) + bns[i] * sin(nOmegaX)
		}
		return res
	}	
}
const displayCoef = function([an0,ans,bns],iNbHarmonique){
	let sRes = "<br>coef a"+ "0" +"=" + an0
	for(var i = 1; i <= iNbHarmonique;++i){
		var n = i - 1
		sRes += "<br><br>a"+ i +"=" + ans[n].toFixed(5) + "<br> b"+i+"=" + bns[n].toFixed(5)
	}
	$("#resultat").html(sRes)
}

const getXnormaliser = (iStartPeriod,iPeriode) => {
	/** normaliser permet d'avoir un x dans les borne souhaitées
	 * iStartPeriod,IendPeriod en décalant de la periode le x 
	 */
	return function(x){
		return moduloPositive(x - iStartPeriod,iPeriode) + iStartPeriod;
	}
}

const getCoefs = (func,iPeriode,iNbHarmonique)=>{
	const iNbPas 	= 	+(defaultV("nbPas",1000)),
		deuxSurPeriode = 2/iPeriode,
		omega = deuxSurPeriode * PI,
		an0 = deuxSurPeriode/2 * simpson(iPeriode,iNbPas,func)
	;
	/* retourne le coef a de i ou b de i si respectivement on a sinOrCos = cos ou sinOrCos = sin*/
	const getCoef = function(sinOrCos){
		const arr = []
		for(var i = 1; i <= iNbHarmonique;++i){//warning pas le 0
			arr.push(deuxSurPeriode * simpson(iPeriode,iNbPas,
				function(x){
					return (Math[sinOrCos]( i * omega * x) * func(x)) || 0;//si NAN on met 0
				})
			)
		}
		return arr	
	}
	return [an0,getCoef("cos"),getCoef("sin")]//a0,ans,bns
}
const generateParamForGraphic = () => {
	const precisionCourbe = 0.01;

	let	iMax	= 	+eval(defaultV("max","8*PI")),
		iMin	= 	+eval(defaultV("min","-PI")),
		iStartPeriod = +(eval(defaultV("startPeriod","0"))),
		iEndPeriod = +(eval(defaultV("endPeriod","2*PI")))
	;

	const iNbHarmonique = Math.floor(+(defaultV("nbHarmonique",10))),
		sFunc	= 	 defaultV("func","x < PI ? PI : 0"),
		sName  	= 	 defaultV("name","sin")
	;
	//check min max order and reverse id needed
	if (iStartPeriod > iEndPeriod) [iStartPeriod,iEndPeriod] = [iEndPeriod,iStartPeriod]
	if (iMin > iMax) [iMax,iMin] = [iMin,iMax]


	let iPeriode =  iEndPeriod - iStartPeriod
	const normaliseX = getXnormaliser(iStartPeriod,iPeriode)
	// on fait l'éval maintenant pour ne plus avoir à le faire à chaque appel
	let func;eval("func = function(x){x = normaliseX(x); return "+ sFunc + ";}");
	let coefs = getCoefs(func,iPeriode,iNbHarmonique)
	displayCoef(coefs,iNbHarmonique)
	var funcRebuild = getFourrierReconstitutionFunc(coefs,iPeriode,iNbHarmonique)

	return [{
		data : getPointsArray(func,iMin,iMax,precisionCourbe),
		//on crée le label le -0.00 sera remplacer par la bonne valeur en fonction de la position de la souris
		label : sName + "(x) = -0.00"
	},{
		data: getPointsArray(funcRebuild,iMin,iMax,precisionCourbe),
		label: "fourrier reconsitution" + "(x) = -0.00"
	}]
}
window.generateParamForGraphic = generateParamForGraphic
})()
