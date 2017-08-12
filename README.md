# Card Tricks

Defines web components for use in card games. Mostly experimenting with how
a larger project can be built without relying on frameworks or creating
a *custom* framework. <s>Work</s> play in progress.

_TODO: Create animated GIF of dogs playing cards or something_

## Rules to the tricks

* No frameworks
* Web Components
* Only modern browsers
* Well documented and tested code

My goal is to not use an existing javascript framework like React or Angular.
I do think they have some good methodolgies especially when it comes to
component architecture.  Adopting best practices and such from these frameworks
is probably a good thing.

I am also focusing on creating web components for as many things that I can to
better isolate each functionality.  At the moment of this writing I have table,
pile, and card components that are pretty basic.  I'm also using template to
define the card graphics on such on the page.  I use the shadow DOM CSS to
isolate the styles to each component, but also make some things styleable by
inheriting styles from the page.  Mostly learning and applying as I go.

I plan to just use node-tap for testing and not try to mock any browser
internals.  There is a lot of boilerplate with web components and I don't want
to get slowed down with trying for 100% coverage by mocking all of that, too.

## How to Play

Grok the src/ ... glance over the package.json, Makefile, rollup.config.js and
then `npm install`.  Next run it locally in your browser.  

*Objective of the game?* Spend countless hours developing something that will
hopefully be awesome when it's done.  Contributors are welcome.

## Develop It

Watch for changes and build both app.js and component.js.

```
npm run dev-component & npm run dev-app &
```

Somewhat standard on running tests, except uses 
`make clean && make --jobs test`
and builds temporary `*.tmp.js` files.
```
npm run test
```

## Contributors

* Jake Hickenlooper


## License

AGPL-3.0

## Links and such

### Learning Resources

* [Shandow DOM](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom)
* [Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements)

* [Fisher Yates Shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle)


### Similiar projects

* https://github.com/pakastin/deck-of-cards
* http://playingcards.io
* http://greenmahjong.daniel-beck.org/#game
* https://github.com/geobalas/Poker
* [Tabletop Simulator](http://berserk-games.com/tabletop-simulator/)

### Graphics

* https://sourceforge.net/projects/pysolfc/files/PySolFC-Cardsets/PySolFC-Cardsets-2.0/
* https://sourceforge.net/projects/vector-cards/

### Other

* https://github.com/leereilly/games
