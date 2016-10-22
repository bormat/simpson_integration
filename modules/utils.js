( function( ) {
	"use strict";

	/**
 *
 * @param {} -
 * @return
 */
	const mapFuncsToWindow = ( ) => {
		const mathFuncs = [
			"cos",
			"exp",
			"sin",
			"PI",
			"sqrt",
			"max",
			"min",
			"pow",
			"round",
			"tan",
			"abs",
			'floor',
			'round'
		]
		mathFuncs.forEach(key => window[key] = Math[key])
	}
	window.mapFuncsToWindow = mapFuncsToWindow

	/**
 *
 * @param {} -
 * @return
 */
	const defaultV = ( selector, defaultVal ) => {
		const $jq = $( "input[name=" + selector + "]" )
		const val = $jq.val( )
		if ( val !== undefined && val !== "" )
			return val
		$jq.val( defaultVal ) // si pas de valeur dans le champ on en met une
		return defaultVal
	}
	window.defaultV = defaultV

	/**
 *
 * @param {} -
 * @return
 */
	const getPointsArray = ( func, iMin, iMax, iPas ) => {
		const data = [ ]
		// on remplit les points de la function pour l'afficher
		for ( let i = iMin; i <= iMax; i += iPas ) {
			data.push([i, func( i )])
		}
		return data
	}
	window.getPointsArray = getPointsArray
})( )
