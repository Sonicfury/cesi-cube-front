// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  appName: '(Re)sources (Re)lationnelles',
  description: 'La plateforme pour améliorer vos relations',
  version: '1.0.0',

  apiUrl: 'http://217.160.246.113:8000/api',
  // apiUrl: 'http://localhost:8000/api',

  algolia: {
    appId: 'QJ2R3NDPI9',
    publicKey: 'ca8b11f89a1f2163648ad58ec3cbc3ab'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
