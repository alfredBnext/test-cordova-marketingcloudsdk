import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
declare let MCCordovaPlugin;

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

        ( window as any).plugins.EvergageBnextIntegration.setUserId("14092022", '', '', '');

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
      MCCordovaPlugin.enablePush(success => {
        console.log('Alfredo: '+ success);
      }, error => {
        console.log('Alfredo: ', error);
      });

      MCCordovaPlugin.enableVerboseLogging(success => {
        console.log('Alfredo: '+ success);
      }, error => {
        console.log('Alfredo: '+ error);
      });

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

    MCCordovaPlugin.setAttribute('pushToken', this.token, result => {
      console.log('Alfredo: '+result);
    });

    MCCordovaPlugin.setAttribute('token', this.token, result => {
      console.log('Alfredo: '+result);
    });

    MCCordovaPlugin.setAttribute('firebaseToken', this.token, result => {
      console.log('Alfredo: '+result);
    });
  }
}
