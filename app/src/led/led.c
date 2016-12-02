#include <wiringPi.h>
int main (int argc,char *argv[])
{
  wiringPiSetup () ;
  pinMode (22, OUTPUT) ;

  //Decode options
if(argc>1 && argv[1][0] == '-'){

		switch (argv[1][1]){

			case 'h':
							digitalWrite (22, HIGH); delay (500) ;
							break;
			case 'l':
							digitalWrite (22,  LOW); delay (500) ;
							break;
			default:
					break;

		}
	}
  return 0 ;
}