( function( ) {
	"use strict";

	/* obtient le modulo positif alors que % peut retourner des négatifs*/
	const moduloPositive = ( a, n ) => {
		return a - n * Math[n > 0
				? 'floor'
				: 'ceil']( a / n );
	}

	const getFourrierReconstitutionFunc = function( [
		an0, ans, bns
	], iPeriode ) {
		return function( x ) {
			let res = an0;
			let omegaFoisX = 2 * PI / iPeriode * x;
			let iNbHarmonique = ans.length;
			for ( let i = 0; i < iNbHarmonique; ++i ) {
				let nOmegaX = ( i + 1 ) * omegaFoisX
				res += ans[i] * cos( nOmegaX ) + bns[i] * sin( nOmegaX )
			}
			return res
		}
	}
	window.getFourrierReconstitutionFunc = getFourrierReconstitutionFunc

	const displayCoef = function([ an0, ans, bns ]) {
		let sRes = "<div><b>a0</b>" +
		" = " + an0.toFixed( 15 ) + "</div>"
		let iNbHarmonique = ans.length;

		for ( let i = 1; i <= ans.length; ++i ) {
			let n = i - 1
			sRes += "<div><b>a" + i + "</b> = " + ans[n].toFixed( 15 ) + "</div><div> <b>b" + i + "</b> = " + bns[n].toFixed( 15 ) + "</div>"
		}
		$( "#resultat-content" )
			.html( sRes )
			.css( 'display', 'flex' )
		$( "#empty-msg" ).css( 'display', 'none' )

	}
	window.displayCoef = displayCoef

	/** normaliser permet d'avoir un x dans les borne souhaitées
 * [iStartPeriod, iStartPeriod + iPeriode] en décalant de la periode le x
 */
	const normaliseX = ( iStartPeriod, iPeriode, x ) => {
		return moduloPositive( x - iStartPeriod, iPeriode ) + iStartPeriod;
	}
	window.normaliseX = normaliseX

	const getCoefs = ( func, iStartPeriod, iPeriode, iNbHarmonique, iNbPas ) => {
		const deuxSurPeriode = 2 / iPeriode,
			omega = deuxSurPeriode * PI,
			an0 = simpson( iStartPeriod, iPeriode, iNbPas, func ) / iPeriode;
		/* retourne le coef a de i ou b de i si respectivement on a sinOrCos = cos ou sinOrCos = sin*/
		const getCoefsInternal = function( sinOrCosFunc ) {
			const coefs = [ ]
			for ( let i = 1; i <= iNbHarmonique; ++i ) { //warning pas le 0
				let iFoixOmega = i * omega
				coefs.push(deuxSurPeriode * simpson( iStartPeriod, iPeriode, iNbPas, ( x ) => (sinOrCosFunc( iFoixOmega * x ) * func( x )) || 0 //si NAN on met 0
				))
			}
			return coefs
		}
		return [
			an0,
			getCoefsInternal( Math.cos ),
			getCoefsInternal( Math.sin )
		] //a0,ans,bns
	}
	window.getCoefs = getCoefs

	const getEnergie = ( iStartPeriod, iPeriode, iNbPas, func ) => simpson(iStartPeriod, iPeriode, iNbPas, ( x ) => Math.pow( func( x ), 2 ))
	window.getEnergie = getEnergie

})( )
