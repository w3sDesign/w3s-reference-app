import { LOCALE_ID } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  // TODO Internationalization
  // Set locale for the app . Used for i18n and pipes.
  // https://angular.io/api/core/LOCALE_ID
  providers: [{provide: LOCALE_ID, useValue: 'de'}]
})
  .catch(err => console.error(err));
