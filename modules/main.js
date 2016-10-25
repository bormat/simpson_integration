mapFuncsToWindow( )
$( document ).ready(( ) => {
	if ( window.innerWidth >= 1350 )
		$( '#fullpage' ).fullpage( )
})
$( 'input[name=func]' ).mSelectDBox({
	"list": [ "x < PI ? PI :  0","x < 0 ? 1+x : 1-x" , "x**3" ]
});
$(document.body, '.m-select-d-box__list-item', ( ) => alert( ))
$( '#generate' ).click( generateGraph )
// $( '#generate' ).click( )

$('#fourier-inputs > div:nth-child(1) > div:nth-child(1) > input[type="text"]').focusout(function(){
	setTimeout(()=>{
	 switch(this.value){
		case "x < PI ? PI :  0":
	 		$('input[name=startPeriod]').val('0')
	 		$('input[name=endPeriod]').val('2*PI')
	 		$('input[name=min]').val('0')
	 		$('input[name=max]').val('12')
	 		$('input[name=yMin]').val('-2')
	 		$('input[name=yMax]').val('5')
	 		break;
		case "x**3":
	 		$('input[name=startPeriod]').val('-2')
	 		$('input[name=endPeriod]').val('2')
	 		$('input[name=min]').val('0')
	 		$('input[name=max]').val('12')
	 		$('input[name=yMin]').val('-10')
	 		$('input[name=yMax]').val('10')
	 		break;
		case "x < 0 ? 1+x : 1-x":
	 		$('input[name=startPeriod]').val('-2')
	 		$('input[name=endPeriod]').val('2')
	 		$('input[name=min]').val('-4')
	 		$('input[name=max]').val('8')
	 		$('input[name=yMin]').val('-1.5')
	 		$('input[name=yMax]').val('1.5')
	 	default: break;
	 }
	},200)
})
//#energie-err > b