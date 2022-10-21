import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  token = '';

  constructor(
    private platform: Platform,
    private fcm: FirebaseMessaging
    ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is("cordova")) {
        ( window as any).plugins.EvergageBnextIntegration.start(
          'heinekenintlamer',
          'development',
          false
        );

        ( window as any).plugins.EvergageBnextIntegration.setUserId("3975118", 'rpaez@bnext.mx', 'Daniel', 'Paez');

        ( window as any).plugins.EvergageBnextIntegration.viewProduct(
          '29011892',
          'Coca-Cola'
        );

        await this.fcm.requestPermission().then(async () => {
          this.sendEventNotification('true');
        }).catch(async () => {
          this.sendEventNotification('false');
        });
      }
    });  
  }

  sendEventNotification(allow: string){
    if(allow ==='true'){
      this.callFirebase();

    }
  }

  callFirebase(){
    this.fcm.onMessage().subscribe( async payload => {
      console.log('Alfredo: '+ payload);
    });

    this.fcm.onBackgroundMessage().subscribe( async payload => {
      console.log('Alfredo: '+ payload);
    });

    // En caso de que se regenere el token entrara aqui
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('Alfredo: '+ token);
      this.updateToken(token);
    });

    // Se genera el token en caso de no existir
    this.getToken();
  }

  /**
   * Metodo para obtener el token de firebase
   * SOLO DEBE SER LLAMADA DESPUES DE QUE FIREBASE ESTE INCIADO
   */
   getToken() {
    this.fcm.getToken().then(token => {
      this.updateToken(token);
    });
  }

  /**
   * Metodo que actualiza la variable de ambiente de firebase y
   * manda a los servicios la notificacion de que el firebaseToken cambios
   *
   * @param token token generado por firebase
   */
  updateToken(token){
    this.token = token;
    console.log('Alfredo: '+token);

    ( window as any).plugins.Sfmcsdk.enableDebugger();
    ( window as any).plugins.Sfmcsdk.setContactKey('GLP484|' + '3975118');
  }
}
