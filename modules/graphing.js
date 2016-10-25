( function( ) {
	"use strict";

	let updateLegendTimeout = null;
	let latestPosition;
	let plot;
	let legends;

	const defaultInputValues = {
		max: "12",
		min: "0",
		startPeriod: "0",
		endPeriod: "2*PI",
		nbPas: 1000,
		nbHarmonique: 100,
		func: "x < PI ? PI :  0",
		name: "f",
		yMax: 5,
		yMin: -2
	}

	const generateParamForGraph = ( ) => {

		let startTime = new Date( ).getTime( );
		// votre code à mesurer ici

		let iMax = +eval(defaultV( "max", defaultInputValues.max )),
			iMin = +eval(defaultV( "min", defaultInputValues.min )),
			iStartPeriod = +(eval(defaultV( "startPeriod", defaultInputValues.startPeriod ))),
			iEndPeriod = +(eval(defaultV( "endPeriod", defaultInputValues.endPeriod ))),
			iNbPas = +(defaultV( "nbPas", defaultInputValues.nbPas ));

		const iNbHarmonique = Math.floor(+ (defaultV( "nbHarmonique", defaultInputValues.nbHarmonique ))),
			//sFunc	= 	 defaultV("func","min(x < PI ? PI :  0 ,abs( 90*sin(x)))"),
			sFunc = defaultV( "func", "x < PI ? PI :  0" ),
			//sFunc	= 	 defaultV("func","x"),
			sName = defaultV( "name", defaultInputValues.name );
		//check min max order and reverse if needed
		if ( iStartPeriod > iEndPeriod )
			[ iStartPeriod, iEndPeriod ] = [ iEndPeriod, iStartPeriod ]
		if ( iMin > iMax )
			[ iMax, iMin ] = [ iMin, iMax ]

		const precisionCourbe = 0.01 / ( iEndPeriod - iStartPeriod );

		let iPeriode = iEndPeriod - iStartPeriod
		// on fait l'éval maintenant pour ne plus avoir à le faire à chaque appel
		let func;
		eval( "func = function(x){return " + sFunc + ";}" );
		let coefs = getCoefs( func, iStartPeriod, iPeriode, iNbHarmonique, iNbPas )
		displayCoef( coefs )
		//on affiche en concole le temps du script
		let elapsedTime = new Date( ).getTime( ) - startTime;
		console.log( elapsedTime );
		let funcRebuild = getFourrierReconstitutionFunc( coefs, iPeriode )
		let funcPeriodic = ( x ) => func(normaliseX( iStartPeriod, iPeriode, x ))

		let energie = getEnergie( iStartPeriod, iPeriode, iNbPas, func )

		$( "#energie-origin" ).html( "energie originale : <b>" + energie + "</b>" )
		let energieRebuild = getEnergie( iStartPeriod, iPeriode, iNbPas, funcRebuild )
		$( "#energie-reconst" ).html( "energie reconstiué : <b>" + energieRebuild + "</b>" )
		$( "#energie-err" ).html( "erreur : <b>" + 1e2 * ( energie / energieRebuild - 1 ) + "</b>" )
		$( "#script-time" ).html( "Durée du script : <b>" + elapsedTime + " ms</b>" )
		return [
			{
				data: getPointsArray( funcPeriodic, iMin, iMax, precisionCourbe ),
				//on crée le label le -0.00 sera remplacer par la bonne valeur en fonction de la position de la souris
				label: sName + "(x) = -0.00"
			}, {
				data: getPointsArray( funcRebuild, iMin, iMax, precisionCourbe ),
				label: "fonction reconstituée" + "(x) = -0.00"
			}
		]
	}

	const updateLegend = ( ) => {
		updateLegendTimeout = null;

		let pos = latestPosition;

		let axes = plot.getAxes( );
		if ( pos.x < axes.xaxis.min || pos.x > axes.xaxis.max || pos.y < axes.yaxis.min || pos.y > axes.yaxis.max )
			return;

		let i,
			j,
			dataset = plot.getData( );
		for ( i = 0; i < dataset.length; ++i ) {
			let series = dataset[i];

			// find the nearest points, x-wise
			for ( j = 0; j < series.data.length; ++j )
				if ( series.data[j][0 ] > pos.x)
					break;

			// now interpolate
			let y,
				p1 = series.data[j - 1],
				p2 = series.data[j];
			if ( p1 == null )
				y = p2[1];
			else if ( p2 == null )
				y = p1[1];
			else
				y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);

			legends
				.eq( i )
				.text(series.label.replace(/=.*/, "= " + y.toFixed( 2 )));
		}
		// fixes line break for too long value display
		$( ".legendLabel" ).attr( 'style', 'width:205px !important' )
	}

	/**
	 *
	 * paramètre de l'axe y
	 */
	const generateParamForAxe = ( ) => {
		let iyMax = defaultV( "yMax", defaultInputValues.yMax ),
			iyMin = defaultV( "yMin", defaultInputValues.yMin );
		if ( iyMin > iyMax )
			[ iyMax, iyMin ] = [ iyMin, iyMax ]

		return {
			series: {
				lines: {
					show: true
				}
			},
			crosshair: {
				mode: "x"
			},
			grid: {
				hoverable: true,
				autoHighlight: false
			},
			yaxis: {
				min: iyMin,
				max: iyMax
			}
		}
	}

	const generateGraph = ( ) => {
		$( function( ) {
			plot = $.plot($( "#placeholder" ), generateParamForGraph( ), generateParamForAxe( ));
			legends = $( "#placeholder .legendLabel" );
			legends.each( function( ) {
				// fix the widths so they don't jump around
				$( this ).css('width', $( this ).width( ));
			});

			latestPosition = null;
			updateLegendTimeout = null;

			$( "#placeholder" ).bind( "plothover", function( event, pos, item ) {
				latestPosition = pos;
				if ( !updateLegendTimeout )
					updateLegendTimeout = setTimeout( updateLegend, 50 );
				}
			)
		})
	}
	window.generateGraph = generateGraph
	window.defaultInputValues = defaultInputValues
})( )
