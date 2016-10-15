carre: 
	nbPasIntégrale * complexitéFunction
trapeze:
	nbPasIntégrale * complexitéFunction * 2
simpson:
	carre + trapeze :
		= nbPasIntégrale * complexitéFunction * (1+2)
		= 3 * nbPasIntégrale * complexitéFunction

getCoefDeFourrier : 
	= 2 * iNbHarmonique * simpson * complexitéFunction * complexitéSinusOuCosinus

	= 3 * nbPasIntégrale * complexitéFunction * 
		2 * iNbHarmonique * complexitéFunction * complexitéSinusOuCosinus
	= 6 * nbPasIntégrale * complexitéFunction^2 * 
	iNbHarmonique * complexitéSinusOuCosinus

//on ne garde que ce qui dépend des paramètres
	= 6 * nbPasIntégrale * complexitéSinusOuCosinus
La complexité est donc de 6n si on fixe le nombre de pas de l'aire et le nombre d'harmonique en varriable 
de même si on prend le nbPasIntégrale  comme varriable

On a donc un algorythme en O(n)