(function(){
"use strict";
//paramètre pour l'abscisse(min,max), le nombre de pas, la fonction, le nom de la fonction,

/* obtient le modulo positif alors que % peut retourner des négatifs*/
const moduloPositive = (a,n) => {
    return a - n * Math[n > 0 ? 'floor' : 'ceil'](a/n); 
}
const generateParamForGraphic = () => {
	let iNbPas 	= 	+(defaultV("nbPas",1000)),
		iNbHarmonique = Math.floor(+(defaultV("nbHarmonique",10))),
		sFunc	= 	 defaultV("func","x < PI ? PI : 0"),
		iMin	= 	+eval(defaultV("min","-PI")),
		iMax	= 	+eval(defaultV("max","8*PI")),
		sName  	= 	 defaultV("name","sin"),
		$resIntegration = $("input[name=resIntegration]"),
		iStartPeriod = +(eval(defaultV("startPeriod","0"))),
		iEndPeriod = +(eval(defaultV("endPeriod","2*PI")))
	;
	if (iMin > iMax) [iMax,iMin] = [iMin,iMax]
	if (iStartPeriod > iEndPeriod) [iStartPeriod,iEndPeriod] = [iStartPeriod,iEndPeriod]
	let iPas = (iMax - iMin) / iNbPas
	let iPeriode =  iEndPeriod - iStartPeriod

	var nbPeriode = (iStartPeriod / iPeriode) | 0;
	const normaliseX = function(x){//closure: iEndPeriod,iPeriode
		x = moduloPositive(x,iPeriode);
		x += nbPeriode * iPeriode
		while(x > iEndPeriod){
			x -= iPeriode
		}
		while(x < iStartPeriod){
			x += iPeriode
		}
		return x
	}
	const func = eval("resEval = function(x){x = normaliseX(x); return "+ sFunc + ";}");
	//on crée le label le -0.00 sera remplacer par la bonne valeur en fonction de la position de la souris
	let paramFunc1 = {
		data : getPointsArray(func,iMin,iMax,iPas),
		label : sName + "(x) = -0.00"
	}

	var aire = simpson(iMin,iMax,iNbPas,func)
	$resIntegration.val(aire)
	var an0 = 1/iPeriode * simpson(iStartPeriod,iEndPeriod,iNbPas,func),
		omega = 2* PI / iPeriode,
		ans = [],
		sRes = "<br>coef a"+ "0" +"=" + an0,
		bns = []
	;
	window.normaliseX = normaliseX;
	var ABn = function(i,sinOrCos,x){
		x = normaliseX(x);
		return Math[sinOrCos]( i * omega * x) * func(x);
	}
	var deuxSurPeriode = 2/iPeriode
	for(var i = 1; i <= iNbHarmonique;++i){
		var	an = deuxSurPeriode * simpson(0,iPeriode,iNbPas,ABn.bind(null,i,"cos")),
			bn = deuxSurPeriode * simpson(0,iPeriode,iNbPas,ABn.bind(null,i,"sin"))
		;
		sRes += "<br><br>a"+ i +"=" + an.toFixed(5) + "<br> b"+i+"=" + bn.toFixed(5)
		ans.push(an)
		bns.push(bn)
	}
	$("#resultat").html(sRes)
 

	//on crée une bonne fois pour toute la fonction d'approximation grace aux coef
	var sFunc2 = "an0"
	for(var i = 0 ;i < iNbHarmonique;++i){
		sFunc2 += " + ans["+ i +"] * cos("+ i +"* omega * x) + bns["+ i +"]*sin("+ (i+1) +"* omega * x)"
	}

	var resEval;
	var fourrierReconstitution = eval("resEval = function(x){return "+ sFunc2 + ";}");
	let paramFunc2 = {
		data: getPointsArray(fourrierReconstitution,iMin,iMax,iPas),
		label: "fourrier reconsitution" + "(x) = -0.00"
	}
	return [paramFunc1,paramFunc2]
}
window.generateParamForGraphic = generateParamForGraphic
})()
