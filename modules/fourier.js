(function(){
"use strict";

/* obtient le modulo positif alors que % peut retourner des négatifs*/
const moduloPositive = (a,n) => {
    return a - n * Math[n > 0 ? 'floor' : 'ceil'](a/n); 
}

const getFourrierReconstitutionFunc = function([an0,ans,bns],iPeriode){
	return function(x){
		var res = an0;
		var omegaFoisX = 2* PI / iPeriode * x;
		var iNbHarmonique = ans.length;
		for(var i = 0 ;i < iNbHarmonique;++i){
			var nOmegaX = (i+1) * omegaFoisX
			res += ans[i] * cos(nOmegaX) + bns[i] * sin(nOmegaX)
		}
		return res
	}	
}
const displayCoef = function([an0,ans,bns]){
	let sRes = "<br>coef a"+ "0" +"=" + an0
	var iNbHarmonique = ans.length;
	for(var i = 1; i <= iNbHarmonique;++i){
		var n = i - 1
		sRes += "<br><br>a"+ i +"=" + ans[n].toFixed(20) + "<br> b"+i+"=" + bns[n].toFixed(15)
	}
	$("#resultat").html(sRes)
}

/** normaliser permet d'avoir un x dans les borne souhaitées
 * [iStartPeriod, iStartPeriod + iPeriode] en décalant de la periode le x 
 */
const normaliseX = (iStartPeriod,iPeriode,x) => {
	return moduloPositive(x - iStartPeriod,iPeriode) + iStartPeriod;
}

const getCoefs = (func,iStartPeriod,iPeriode,iNbHarmonique,iNbPas)=>{
	const deuxSurPeriode = 2/iPeriode,
		omega = deuxSurPeriode * PI,
		an0 = simpson(iStartPeriod,iPeriode,iNbPas,func) / iPeriode
	;
	/* retourne le coef a de i ou b de i si respectivement on a sinOrCos = cos ou sinOrCos = sin*/
	const getCoefsInternal = function(sinOrCosFunc){
		const coefs = []
		for(var i = 1; i <= iNbHarmonique;++i){//warning pas le 0
			let iFoixOmega = i * omega
			coefs.push(deuxSurPeriode * simpson(iStartPeriod,iPeriode,iNbPas,
				(x) => (sinOrCosFunc( iFoixOmega * x) * func(x)) || 0//si NAN on met 0
			)) 
		}
		return coefs	
	}
	return [an0,getCoefsInternal(Math.cos),getCoefsInternal(Math.sin)]//a0,ans,bns
}

const getEnergie = (iStartPeriod,iPeriode,iNbPas,func) => simpson(iStartPeriod,iPeriode,iNbPas,(x) => Math.pow(func(x),2))
const generateParamForGraphic = () => {

	var startTime = new Date().getTime();
	// votre code à mesurer ici

	let	iMax	= 	+eval(defaultV("max","8*PI")),
		iMin	= 	+eval(defaultV("min","-PI")),
		iStartPeriod = +(eval(defaultV("startPeriod","0"))),
		iEndPeriod = +(eval(defaultV("endPeriod","2*PI"))),
		iNbPas 	= 	+(defaultV("nbPas",1000))
	;
	/*let	iMax	= 	+eval(defaultV("max","0")),
		iMin	= 	+eval(defaultV("min","5")),
		iStartPeriod = +(eval(defaultV("startPeriod","0"))),
		iEndPeriod = +(eval(defaultV("endPeriod","1")))
	;*/
	const iNbHarmonique = Math.floor(+(defaultV("nbHarmonique",100))),
		//sFunc	= 	 defaultV("func","min(x < PI ? PI :  0 ,abs( 90*sin(x)))"),
		sFunc	= 	 defaultV("func","x < PI ? PI :  0"),
		//sFunc	= 	 defaultV("func","x"),
		sName  	= 	 defaultV("name","fonction d'origine")
	;
	//check min max order and reverse if needed
	if (iStartPeriod > iEndPeriod) [iStartPeriod,iEndPeriod] = [iEndPeriod,iStartPeriod]
	if (iMin > iMax) [iMax,iMin] = [iMin,iMax]

	const precisionCourbe = 0.01/(iEndPeriod - iStartPeriod);

	let iPeriode =  iEndPeriod - iStartPeriod
	// on fait l'éval maintenant pour ne plus avoir à le faire à chaque appel
	let func;eval("func = function(x){return "+ sFunc + ";}");
	let coefs = getCoefs(func,iStartPeriod,iPeriode,iNbHarmonique,iNbPas)
	displayCoef(coefs)
	//on affiche en concole le temps du script
	var elapsedTime = new Date().getTime() - startTime;
	console.log(elapsedTime);
	var funcRebuild = getFourrierReconstitutionFunc(coefs,iPeriode)	
	let funcPeriodic = (x) => func(normaliseX(iStartPeriod,iPeriode,x))

	var energie = getEnergie(iStartPeriod,iPeriode,iNbPas,func)
	let $info = $("#info");
	$info.html("")
	$info.append("energie originale =" + energie+"<br>")
	var energieRebuild = getEnergie(iStartPeriod,iPeriode,iNbPas,funcRebuild)
	$info.append("energie reconstiué =" + energieRebuild+"<br>")
	$info.append("Erreur en poucentage de l'energie reconstiué par rapport à l'energie originale =" + 1e2 * (energie/energieRebuild - 1) + "<br>")
	$info.append("durée du script en millisecondes :"+elapsedTime)
	return [{
		data : getPointsArray(funcPeriodic,iMin,iMax,precisionCourbe),
		//on crée le label le -0.00 sera remplacer par la bonne valeur en fonction de la position de la souris
		label : sName + "(x) = -0.00"
	},{
		data: getPointsArray(funcRebuild,iMin,iMax,precisionCourbe),
		label: "fourrier reconsitution" + "(x) = -0.00"
	}]
}
window.generateParamForGraphic = generateParamForGraphic
})()

