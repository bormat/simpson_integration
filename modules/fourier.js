(function(){
//paramètre pour l'abscisse(min,max), le nombre de pas, la fonction, le nom de la fonction,
const generateParamForGraphic = () => {
  let iNbPas 	= 	+(defaultV("nbPas",1000)),
    sFunc	= 	 defaultV("func","x"),
    iMin	= 	+(defaultV("min",0)),
    iMax	= 	+(defaultV("max",20)),
    sName  	= 	 defaultV("name","sin")
    iPeriode =  +eval(defaultV("periode",20))
    $resIntegration = $("input[name=resIntegration]");
  ;
  let iPas = (iMax - iMin) / iNbPas
  if (iMin > iMax) [iMax,iMin] = [iMin,iMax]
  let func = new Function("x","return " + sFunc)

    let data = getPointsArray(func,iMin,iMax,iPas)

    //on crée le label le -0.00 sera remplacer par la bonne valeur en fonction de la position de la souris
    let label = sName + "(x) = -0.00"
  let paramFunc1 = {data,label}

  var aire = simpson(iMin,iMax,iNbPas,func)
  $resIntegration.val(aire)
  var an0 = 1/iPeriode * simpson(-iPeriode/2,iPeriode/2,iNbPas,func);
  $("#resultat").html(an0+"<br>");
  var omega = 2* PI / iPeriode;
  var ans = [];
  var bns = [];
  for(var i = 1; i < 50;++i){
    var anF = new Function("x","return cos(" + i * omega + "* x) * ("+sFunc+")");
    var an = 2/iPeriode * simpson(0,iPeriode,iNbPas,anF);
    var bnF = new Function("x","return sin(" + i * omega + "* x) * ("+sFunc+")");
    var bn = 2/iPeriode * simpson(0,iPeriode,iNbPas,bnF);
    $("#resultat").append("<br>coef an=" + an + " bn=" + bn)
    ans.push(an),
    bns.push(bn)
  }
  let label2 = "fourrier reconsitution" + "(x) = -0.00"

  //on crée une bonne fois pour toute la fonction d'approximation grace aux coef
  var sFunc2 = "an0"
  for(var i = 1 ;i < 50 - 1;++i){
    sFunc2 += " + ans["+ i +"] * cos("+ i +"* omega * x) + bns["+ i +"]*sin("+ i +"* omega * x)"
  }

  var resEval;
  var fourrierReconstitution = eval("resEval = function(x){return "+ sFunc2 + ";}");

  let data2 = getPointsArray(fourrierReconstitution,iMin,iMax,iPas)
  let paramFunc2 = {data:data2,label:label2}
  return [paramFunc1,paramFunc2]
}
window.generateParamForGraphic = generateParamForGraphic
})()
