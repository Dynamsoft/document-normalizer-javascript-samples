import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import "./dce";
import "./cvr";


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
