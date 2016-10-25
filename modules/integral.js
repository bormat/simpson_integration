( function( ) {
	"use strict";
	const simpson = ( iStartPeriod, iPeriode, nbPas, func ) => {
		let pas = iPeriode / nbPas,
			max = iStartPeriod + iPeriode;
		/*************************************
		 *************************************
		// pas = .0001;
		 *************************************
		 ************************************/
		const getIntegrale = ( callbackMethod ) => {
			let x = iStartPeriod;
			let res = 0;
			for ( ; x < max; x += pas )
				res += callbackMethod( x )
			return res * pas
		}

		const carre = ( x ) => func( x )
		const trapeze = ( x ) => 0.5 * (func( x ) + func( x + pas ))

		return (2 * getIntegrale( carre ) + getIntegrale( trapeze )) / 3
		return getIntegrale( trapeze )
		return getIntegrale( carre );
	}
	window.simpson = simpson
})( )
