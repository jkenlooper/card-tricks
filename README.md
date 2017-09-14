# Card Tricks

[Card Tricks Example application](https://jkenlooper.github.io/card-tricks/)

Defines web components for use in card games. Does not include actual card
graphics or full application.  See the examples to see how an application could
use various components. 

Also see 
[Cards on a Plane](http://jkenlooper.gitlab.io/cards-on-a-plane/)
which is in development.

_TODO: Create animated GIF of dogs playing cards or something_

## Rules to the tricks

* No frameworks
* Web Components
* Only modern browsers
* Well documented and tested code with examples that showcase just the web component

I am also focusing on creating web components for as many things that I can to
better isolate each functionality.  At the moment of this writing I have table,
pile, and card components that are pretty basic.  I'm also using template to
define the card graphics on the page.  I use the shadow DOM CSS to
isolate the styles to each component, but also make some things styleable by
inheriting styles from the page.  Mostly learning and applying as I go.

I plan to just use node-tap for testing and not try to mock any browser
internals.  There is a lot of boilerplate with web components and I don't want
to get slowed down with trying for 100% coverage by mocking all of that, too.

## How to Play

This is just a library of web components that may be useful for creating card
games.  Each component is sorta developed in isolation and contains an example
of how to use it in a web application.  Each component is in its own directory
within the src directory.

Grok the src/ ... glance over the package.json, Makefile, rollup.config.js and
then `npm install`.  Next check the examples locally in your browser.  

*Objective of the game?* Spend countless hours developing something that will
hopefully be awesome when it's done.  Contributors are welcome.

## Develop It

Watch for changes and build it.

```
npm run dev
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

LGPL-3.0+

## Links and such

Card graphics from [PySolFC-Cardsets](https://sourceforge.net/projects/pysolfc/files/PySolFC-Cardsets/PySolFC-Cardsets-2.0/).

### Learning Resources

* [Shadow DOM](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom)
* [Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements)

* [Fisher Yates Shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle)


### Similiar projects

* [HTML5 Deck of Cards](https://github.com/pakastin/deck-of-cards)

