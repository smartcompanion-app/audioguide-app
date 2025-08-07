# SmartCompanion Audioguide App

## Customize App Content

The content is loaded from a `data.json` file, which contains all texts and references to assets like images and audio files. Inside the `stencil.config.ts` the `DATA_URL` should point to your `data.json` file. The sample data, which is used for the demo of the app can be found [here](https://github.com/smartcompanion-app/sample-data/tree/main/animals). Custom data needs to be structured according to the example.

## Customize App Appearance

### App Colors

 - scss variables and ionic primary color in `src/global/app.scss`
 - background_color and theme_color in `manifest.json`
 - theme_color in `index.html`

### Text

 - title and description in `index.html`
 - title in `stencil.config.ts`

 ### Images

  - `logo.png` in `assets` folder
  - `favicon.ico` and `icon.png` in `assets/icon` folder
