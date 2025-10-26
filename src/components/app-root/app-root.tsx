import { Component, State, h } from '@stencil/core';
import { serviceFacade } from '../../services';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {

  @State() translationMenuOverview = serviceFacade.__('menu-overview');
  @State() translationMenuSelection = serviceFacade.__('menu-selection');
  @State() translationMenuLanguage = serviceFacade.__('menu-language');

  async componentDidLoad() {
    // update language of menu items, whenever navigation goes to default page
    // this happens after language change
    serviceFacade.getRoutingService().addRouteChangeListener('/stations/default', () => {
      this.update();
    });
  }

  update() {
    this.translationMenuOverview = serviceFacade.__('menu-overview');
    this.translationMenuSelection = serviceFacade.__('menu-selection');
    this.translationMenuLanguage = serviceFacade.__('menu-language');
  }

  async navigate(route: string) {
    await serviceFacade.getMenuService().close();

    // ignore if navigation goes to stations/default and we are already on stations page
    if (!(route == 'stations/default' && /#\/stations\/.+/.exec(window.location.hash))) {
      await serviceFacade.getRoutingService().pushReplaceCurrent(`/${route}`);
    }
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={true}>
          <ion-route
            url="/"
            component="sc-page-loading"
            componentProps={{ 
              facade: serviceFacade, 
              image: "assets/logo.png"
            }}
          />
          <ion-route
            url="/language"
            component="sc-page-language"
            componentProps={{ facade: serviceFacade }}
          />
          <ion-route
            url="/selection"
            component="sc-page-selection"
            componentProps={{ facade: serviceFacade }}
            beforeEnter={() => serviceFacade.canLoadRoute()}
          />
          <ion-route
            url="/stations/:stationId"
            component="sc-page-stations"
            componentProps={{ facade: serviceFacade }}
            beforeEnter={() => serviceFacade.canLoadRoute()}
          />
          <ion-route
            url="/pin"
            component="sc-page-pin"
            componentProps={{ facade: serviceFacade }}
            beforeEnter={() => serviceFacade.canLoadRoute()}
          />
          <ion-route
            url="/error"
            component="sc-page-error"
            componentProps={{ facade: serviceFacade }}
          />
        </ion-router>

        <ion-split-pane when="md" content-id="main">
          <ion-menu contentId="main">
            <ion-content>
              <img id="main-menu-image" src="assets/logo.png"></img>
              <ion-list lines="full">
                <ion-item onClick={() => this.navigate("stations/default")}>
                  <ion-icon name="list" slot="start"></ion-icon>
                  <ion-label>{this.translationMenuOverview}</ion-label>
                </ion-item>
                <ion-item onClick={() => this.navigate("selection")}>
                  <ion-icon name="keypad" slot="start"></ion-icon>
                  <ion-label>{this.translationMenuSelection}</ion-label>
                </ion-item>
                <ion-item onClick={() => this.navigate("language")}>
                  <ion-icon name="chatbubbles" slot="start"></ion-icon>
                  <ion-label>{this.translationMenuLanguage}</ion-label>
                </ion-item>
              </ion-list>
            </ion-content>
          </ion-menu>
          <ion-nav id="main" />
        </ion-split-pane>
      </ion-app>
    );
  }
}
