var crdtrx = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var impetus = createCommonjsModule(function (module, exports) {
(function (global, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined(['exports', 'module'], factory);
    } else {
        factory(exports, module);
    }
})(commonjsGlobal, function (exports, module) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var stopThresholdDefault = 0.3;
    var bounceDeceleration = 0.04;
    var bounceAcceleration = 0.11;

    // fixes weird safari 10 bug where preventDefault is prevented
    // @see https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356
    window.addEventListener('touchmove', function () {});

    var Impetus = function Impetus(_ref) {
        var _ref$source = _ref.source;
        var sourceEl = _ref$source === undefined ? document : _ref$source;
        var updateCallback = _ref.update;
        var _ref$multiplier = _ref.multiplier;
        var multiplier = _ref$multiplier === undefined ? 1 : _ref$multiplier;
        var _ref$friction = _ref.friction;
        var friction = _ref$friction === undefined ? 0.92 : _ref$friction;
        var initialValues = _ref.initialValues;
        var boundX = _ref.boundX;
        var boundY = _ref.boundY;
        var _ref$bounce = _ref.bounce;
        var bounce = _ref$bounce === undefined ? true : _ref$bounce;

        _classCallCheck(this, Impetus);

        var boundXmin, boundXmax, boundYmin, boundYmax, pointerLastX, pointerLastY, pointerCurrentX, pointerCurrentY, pointerId, decVelX, decVelY;
        var targetX = 0;
        var targetY = 0;
        var stopThreshold = stopThresholdDefault * multiplier;
        var ticking = false;
        var pointerActive = false;
        var paused = false;
        var decelerating = false;
        var trackingPoints = [];

        /**
         * Initialize instance
         */
        (function init() {
            sourceEl = typeof sourceEl === 'string' ? document.querySelector(sourceEl) : sourceEl;
            if (!sourceEl) {
                throw new Error('IMPETUS: source not found.');
            }

            if (!updateCallback) {
                throw new Error('IMPETUS: update function not defined.');
            }

            if (initialValues) {
                if (initialValues[0]) {
                    targetX = initialValues[0];
                }
                if (initialValues[1]) {
                    targetY = initialValues[1];
                }
                callUpdateCallback();
            }

            // Initialize bound values
            if (boundX) {
                boundXmin = boundX[0];
                boundXmax = boundX[1];
            }
            if (boundY) {
                boundYmin = boundY[0];
                boundYmax = boundY[1];
            }

            sourceEl.addEventListener('touchstart', onDown);
            sourceEl.addEventListener('mousedown', onDown);
        })();

        /**
         * In edge cases where you may need to
         * reinstanciate Impetus on the same sourceEl
         * this will remove the previous event listeners
         */
        this.destroy = function () {
            sourceEl.removeEventListener('touchstart', onDown);
            sourceEl.removeEventListener('mousedown', onDown);
            // however it won't "destroy" a reference
            // to instance if you'd like to do that
            // it returns null as a convinience.
            // ex: `instance = instance.destroy();`
            return null;
        };

        /**
         * Disable movement processing
         * @public
         */
        this.pause = function () {
            pointerActive = false;
            paused = true;
        };

        /**
         * Enable movement processing
         * @public
         */
        this.resume = function () {
            paused = false;
        };

        /**
         * Update the current x and y values
         * @public
         * @param {Number} x
         * @param {Number} y
         */
        this.setValues = function (x, y) {
            if (typeof x === 'number') {
                targetX = x;
            }
            if (typeof y === 'number') {
                targetY = y;
            }
        };

        /**
         * Update the multiplier value
         * @public
         * @param {Number} val
         */
        this.setMultiplier = function (val) {
            multiplier = val;
            stopThreshold = stopThresholdDefault * multiplier;
        };

        /**
         * Update boundX value
         * @public
         * @param {Number[]} boundX
         */
        this.setBoundX = function (boundX) {
            boundXmin = boundX[0];
            boundXmax = boundX[1];
        };

        /**
         * Update boundY value
         * @public
         * @param {Number[]} boundY
         */
        this.setBoundY = function (boundY) {
            boundYmin = boundY[0];
            boundYmax = boundY[1];
        };

        /**
         * Executes the update function
         */
        function callUpdateCallback() {
            updateCallback.call(sourceEl, targetX, targetY);
        }

        /**
         * Creates a custom normalized event object from touch and mouse events
         * @param  {Event} ev
         * @returns {Object} with x, y, and id properties
         */
        function normalizeEvent(ev) {
            if (ev.type === 'touchmove' || ev.type === 'touchstart' || ev.type === 'touchend') {
                var touch = ev.targetTouches[0] || ev.changedTouches[0];
                return {
                    x: touch.clientX,
                    y: touch.clientY,
                    id: touch.identifier
                };
            } else {
                // mouse events
                return {
                    x: ev.clientX,
                    y: ev.clientY,
                    id: null
                };
            }
        }

        /**
         * Initializes movement tracking
         * @param  {Object} ev Normalized event
         */
        function onDown(ev) {
            var event = normalizeEvent(ev);
            if (!pointerActive && !paused) {
                pointerActive = true;
                decelerating = false;
                pointerId = event.id;

                pointerLastX = pointerCurrentX = event.x;
                pointerLastY = pointerCurrentY = event.y;
                trackingPoints = [];
                addTrackingPoint(pointerLastX, pointerLastY);

                // @see https://developers.google.com/web/updates/2017/01/scrolling-intervention
                document.addEventListener('touchmove', onMove, getPassiveSupported() ? { passive: false } : false);
                document.addEventListener('touchend', onUp);
                document.addEventListener('touchcancel', stopTracking);
                document.addEventListener('mousemove', onMove, getPassiveSupported() ? { passive: false } : false);
                document.addEventListener('mouseup', onUp);
            }
        }

        /**
         * Handles move events
         * @param  {Object} ev Normalized event
         */
        function onMove(ev) {
            ev.preventDefault();
            var event = normalizeEvent(ev);

            if (pointerActive && event.id === pointerId) {
                pointerCurrentX = event.x;
                pointerCurrentY = event.y;
                addTrackingPoint(pointerLastX, pointerLastY);
                requestTick();
            }
        }

        /**
         * Handles up/end events
         * @param {Object} ev Normalized event
         */
        function onUp(ev) {
            var event = normalizeEvent(ev);

            if (pointerActive && event.id === pointerId) {
                stopTracking();
            }
        }

        /**
         * Stops movement tracking, starts animation
         */
        function stopTracking() {
            pointerActive = false;
            addTrackingPoint(pointerLastX, pointerLastY);
            startDecelAnim();

            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
            document.removeEventListener('touchcancel', stopTracking);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('mousemove', onMove);
        }

        /**
         * Records movement for the last 100ms
         * @param {number} x
         * @param {number} y [description]
         */
        function addTrackingPoint(x, y) {
            var time = Date.now();
            while (trackingPoints.length > 0) {
                if (time - trackingPoints[0].time <= 100) {
                    break;
                }
                trackingPoints.shift();
            }

            trackingPoints.push({ x: x, y: y, time: time });
        }

        /**
         * Calculate new values, call update function
         */
        function updateAndRender() {
            var pointerChangeX = pointerCurrentX - pointerLastX;
            var pointerChangeY = pointerCurrentY - pointerLastY;

            targetX += pointerChangeX * multiplier;
            targetY += pointerChangeY * multiplier;

            if (bounce) {
                var diff = checkBounds();
                if (diff.x !== 0) {
                    targetX -= pointerChangeX * dragOutOfBoundsMultiplier(diff.x) * multiplier;
                }
                if (diff.y !== 0) {
                    targetY -= pointerChangeY * dragOutOfBoundsMultiplier(diff.y) * multiplier;
                }
            } else {
                checkBounds(true);
            }

            callUpdateCallback();

            pointerLastX = pointerCurrentX;
            pointerLastY = pointerCurrentY;
            ticking = false;
        }

        /**
         * Returns a value from around 0.5 to 1, based on distance
         * @param {Number} val
         */
        function dragOutOfBoundsMultiplier(val) {
            return 0.000005 * Math.pow(val, 2) + 0.0001 * val + 0.55;
        }

        /**
         * prevents animating faster than current framerate
         */
        function requestTick() {
            if (!ticking) {
                requestAnimFrame(updateAndRender);
            }
            ticking = true;
        }

        /**
         * Determine position relative to bounds
         * @param {Boolean} restrict Whether to restrict target to bounds
         */
        function checkBounds(restrict) {
            var xDiff = 0;
            var yDiff = 0;

            if (boundXmin !== undefined && targetX < boundXmin) {
                xDiff = boundXmin - targetX;
            } else if (boundXmax !== undefined && targetX > boundXmax) {
                xDiff = boundXmax - targetX;
            }

            if (boundYmin !== undefined && targetY < boundYmin) {
                yDiff = boundYmin - targetY;
            } else if (boundYmax !== undefined && targetY > boundYmax) {
                yDiff = boundYmax - targetY;
            }

            if (restrict) {
                if (xDiff !== 0) {
                    targetX = xDiff > 0 ? boundXmin : boundXmax;
                }
                if (yDiff !== 0) {
                    targetY = yDiff > 0 ? boundYmin : boundYmax;
                }
            }

            return {
                x: xDiff,
                y: yDiff,
                inBounds: xDiff === 0 && yDiff === 0
            };
        }

        /**
         * Initialize animation of values coming to a stop
         */
        function startDecelAnim() {
            var firstPoint = trackingPoints[0];
            var lastPoint = trackingPoints[trackingPoints.length - 1];

            var xOffset = lastPoint.x - firstPoint.x;
            var yOffset = lastPoint.y - firstPoint.y;
            var timeOffset = lastPoint.time - firstPoint.time;

            var D = timeOffset / 15 / multiplier;

            decVelX = xOffset / D || 0; // prevent NaN
            decVelY = yOffset / D || 0;

            var diff = checkBounds();

            if (Math.abs(decVelX) > 1 || Math.abs(decVelY) > 1 || !diff.inBounds) {
                decelerating = true;
                requestAnimFrame(stepDecelAnim);
            }
        }

        /**
         * Animates values slowing down
         */
        function stepDecelAnim() {
            if (!decelerating) {
                return;
            }

            decVelX *= friction;
            decVelY *= friction;

            targetX += decVelX;
            targetY += decVelY;

            var diff = checkBounds();

            if (Math.abs(decVelX) > stopThreshold || Math.abs(decVelY) > stopThreshold || !diff.inBounds) {

                if (bounce) {
                    var reboundAdjust = 2.5;

                    if (diff.x !== 0) {
                        if (diff.x * decVelX <= 0) {
                            decVelX += diff.x * bounceDeceleration;
                        } else {
                            var adjust = diff.x > 0 ? reboundAdjust : -reboundAdjust;
                            decVelX = (diff.x + adjust) * bounceAcceleration;
                        }
                    }
                    if (diff.y !== 0) {
                        if (diff.y * decVelY <= 0) {
                            decVelY += diff.y * bounceDeceleration;
                        } else {
                            var adjust = diff.y > 0 ? reboundAdjust : -reboundAdjust;
                            decVelY = (diff.y + adjust) * bounceAcceleration;
                        }
                    }
                } else {
                    if (diff.x !== 0) {
                        if (diff.x > 0) {
                            targetX = boundXmin;
                        } else {
                            targetX = boundXmax;
                        }
                        decVelX = 0;
                    }
                    if (diff.y !== 0) {
                        if (diff.y > 0) {
                            targetY = boundYmin;
                        } else {
                            targetY = boundYmax;
                        }
                        decVelY = 0;
                    }
                }

                callUpdateCallback();

                requestAnimFrame(stepDecelAnim);
            } else {
                decelerating = false;
            }
        }
    };

    module.exports = Impetus;
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    function getPassiveSupported() {
        var passiveSupported = false;

        try {
            var options = Object.defineProperty({}, "passive", {
                get: function get() {
                    passiveSupported = true;
                }
            });

            window.addEventListener("test", null, options);
        } catch (err) {}

        getPassiveSupported = function () {
            return passiveSupported;
        };
        return passiveSupported;
    }
});
});

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

var index$1 = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

var template = "<div id=card class=crdtrx-Card> <div id=card-side class=crdtrx-Card-face> <div id=card-front class=\"crdtrx-Card-side crdtrx-Card-side--front\"> </div> <div id=card-back class=\"crdtrx-Card-side crdtrx-Card-side--back\"> </div> </div> </div> <slot name=adjacent></slot> ";

var style = ":host {\n  display: block;\n  position: absolute;\n  border: 1px solid currentColor;\n  border-radius: 1%;\n  background-color: white;\n  color: black;\n}\n\n/* Card is being animated by the impetus lib */\n\n:host.hasImpetus {\n}\n\n/* 2.5 x 3.5 */\n\n.crdtrx-Card {\n  position: relative;\n  -webkit-perspective: 1000px;\n          perspective: 1000px;\n  width: 100%;\n  height: 100%;\n  -webkit-transition: -webkit-transform 0.4s;\n  transition: -webkit-transform 0.4s;\n  transition: transform 0.4s;\n  transition: transform 0.4s, -webkit-transform 0.4s;\n  -webkit-transform-origin: 50% 50%;\n          transform-origin: 50% 50%;\n}\n\n.crdtrx-Card-face {\n  position: relative;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  -webkit-transition: -webkit-transform 0.4s;\n  transition: -webkit-transform 0.4s;\n  transition: transform 0.4s;\n  transition: transform 0.4s, -webkit-transform 0.4s;\n  width: 100%;\n  height: 100%;\n}\n\n.crdtrx-Card-face.is-flipped {\n  -webkit-transform: rotateY(180deg);\n          transform: rotateY(180deg);\n}\n\n.crdtrx-Card-side {\n  display: block;\n  position: absolute;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.crdtrx-Card-side--front {\n  -webkit-transform: rotateY(0deg);\n          transform: rotateY(0deg);\n  z-index: 2;\n}\n\n.crdtrx-Card-side--back {\n  -webkit-transform: rotateY(180deg);\n          transform: rotateY(180deg);\n  z-index: 1;\n}\n\n/* A single img as the cloned template should be block. */\n\n.crdtrx-Card-side > img:first-child:last-child {\n  display: block;\n}\n";

const html = `
<style>${style}</style>
${template}
`;

// Poker size card 2.5 x 3.5
const defaultCardWidth = 100;
const defaultCardHeight = defaultCardWidth * 1.4;

class Card extends window.HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: 'open'});

    this.shadowRoot.innerHTML = html;

    this.shadowRoot.addEventListener('mousedown', this.handleMousedown.bind(this));
    this.shadowRoot.addEventListener('touchstart', this.handleMousedown.bind(this));

    this.shadowRoot.addEventListener('mouseup', this.handleMouseup.bind(this));
    this.shadowRoot.addEventListener('touchend', this.handleMouseup.bind(this));
    this.hasInitialized = false;
  }

  // Monitor these attributes for changes.
  static get observedAttributes () {
    return [
      'x',
      'y',
      'z',
      'r',
      'side',
      'friction'
      // TODO: add pileId to card attribute?
    ]
  }

  static get name () {
    return 'crdtrx-card'
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    // Skip rendering if it hasn't initialized yet
    if (!this.hasInitialized) {
      return
    }

    if (oldVal !== newVal) {
      // console.log('attributeChangedCallback', attrName, oldVal, newVal)
      if (attrName === 'friction') {
        // Friction attr has changed so destroy and optional create new impetus.
        if (this.impetus) {
          // this.impetus = this.impetus.destroy()
          this.destroy();
        }
        if (newVal) {
          this.setImpetus(this);
        }
      } else {
        this.render([attrName]);
      }
    }
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
    if (!this.hasInitialized) {
      this.init();
    }

    this.render();
  }

  // Fires when element is removed from DOM
  disconnectedCallback () {
    console.log('removed', this.id);
    this.destroy();
  }

  // Reflect the prop with the attr
  get x () {
    return this.getAttribute('x')
  }
  set x (val) {
    this.setAttribute('x', Math.round(val));
  }

  get y () {
    return this.getAttribute('y')
  }
  set y (val) {
    this.setAttribute('y', Math.round(val));
  }

  get z () {
    return this.getAttribute('z')
  }
  set z (val) {
    this.setAttribute('z', val);
  }

  get r () {
    return this.getAttribute('r')
  }
  set r (val) {
    this.setAttribute('r', Math.round(val));
  }

  get side () {
    return this.getAttribute('side')
  }
  set side (val) {
    this.setAttribute('side', val);
  }

  set pile (val) {
    console.log('pile set', val);
    // Send event up so the pile can remove if pileId !== val
    const cardPileSetEvent = new window.CustomEvent('crdtrx-card-pileset', {
      bubbles: true,
      composed: true,
      detail: {
        pileId: val,
        cardId: this.id
      }
    });
    this.dispatchEvent(cardPileSetEvent);
  }

  handleMousedown (ev) {
    // console.log('card mousedown', ev.pageX, ev.pageY)
    const cardMouseDownEvent = new window.CustomEvent('crdtrx-card-mousedown', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(cardMouseDownEvent);
  }

  handleMouseup (ev) {
    // console.log('card mouseup', ev.pageX, ev.pageY)
    const cardMouseUpEvent = new window.CustomEvent('crdtrx-card-mouseup', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(cardMouseUpEvent);
  }

  init () {
    const cardBackElement = this.shadowRoot.getElementById('card-back');
    const cardFrontElement = this.shadowRoot.getElementById('card-front');
    // Set the front side based on name attr
    const CardTemplate = document.getElementById(`card-${this.getAttribute('name')}`);
    const clonedCard = CardTemplate.content.cloneNode(true);
    cardFrontElement.appendChild(clonedCard);

    // Set the optional back side based on back attr
    const backAttr = this.getAttribute('back');
    if (backAttr) {
      const CardBackTemplate = document.getElementById(`card-${backAttr}`);
      const clonedBackCard = CardBackTemplate.content.cloneNode(true);
      cardBackElement.appendChild(clonedBackCard);
    }

    this.width = CardTemplate.getAttribute('width') || defaultCardWidth;
    this.height = CardTemplate.getAttribute('height') || defaultCardHeight;
    this.containerEl = document.getElementById(this.getAttribute('container'));

    this.cardElement = this.shadowRoot.getElementById('card');

    this.style.width = cardFrontElement.style.width = cardBackElement.style.width = `${this.width}px`;
    this.style.height = cardFrontElement.style.height = cardBackElement.style.height = `${this.height}px`;
    this.style.zIndex = this.z;
    // TODO: Update bounds if container changes dimensions
    if (this.getAttribute('friction')) {
      this.setImpetus(this);
    }
    this.hasInitialized = true;
  }

  /**
   * If attrs is empty then render all attrs. Otherwise, render only attrs listed.
   */
  render (attrs) {
    if (!attrs || attrs.includes('z')) {
      this.style.zIndex = this.z;
    }
    if (!attrs || (attrs.includes('x') || attrs.includes('y'))) {
      this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
      if (this.impetus) {
        this.impetus.setValues(Number(this.x), Number(this.y));
      }
    }
    if ((!attrs || attrs.includes('r')) && this.cardElement) {
      let rotate = Number(this.r) || 0;
      rotate = 360 - rotate === 360 ? 0 : 360 - rotate;
      this.cardElement.style.transform = `rotate(${rotate}deg)`;
    }
    if (!attrs || (attrs.includes('side'))) {
      // flip the card
      if (this.side === 'back') {
        this.shadowRoot.getElementById('card-side').classList.add('is-flipped');
      } else {
        this.shadowRoot.getElementById('card-side').classList.remove('is-flipped');
      }
    }
  }

  destroy () {
    this.impetus = this.impetus.destroy();
    this.classList.remove('hasImpetus');
    // Modern browsers shouldn't need to remove event listeners.
  }

  setImpetus (target) {
    const debouncedUpdateXY = index$1(function updateXY (x, y) {
      const cardXYEvent = new window.CustomEvent('crdtrx-card-xy', {
        bubbles: true,
        composed: true,
        detail: {
          x: x,
          y: y
        }
      });
      target.dispatchEvent(cardXYEvent);
    }, 200);

    this.classList.add('hasImpetus');
    this.impetus = new impetus({
      source: target,
      initialValues: [Number(this.x), Number(this.y)],
      // Set friction 0 - 1.0 or undefined to use impetus default (0.92)
      friction: Number(this.getAttribute('friction')) || undefined,
      boundX: [0, this.containerEl.clientWidth - this.width],
      boundY: [0, this.containerEl.clientHeight - this.height],
      bounce: false,
      update: function (x, y) {
        debouncedUpdateXY(Math.round(x), Math.round(y));
        target.x = x;
        target.y = y;
      }
    });
  }
}

window.customElements.define(Card.name, Card);

var crdtrxCard = Card.name;

function fisherYates$1 (count) {
  let result = [];

  // Scratch array with numbers 0 through count
  let scratch = Array(count);
  for (let i = 0; i < count; i++) {
    scratch[i] = i;
  }

  for (let i = count; i > 0; i--) {
    const rnd = Math.round(Math.random() * (i - 1));
    result.unshift(scratch.splice(rnd, 1)[0]);
  }

  return result
}

var template$1 = "<div class=crdtrx-Pile> <div id=footprint class=crdtrx-Pile-footprint> </div> <div id=area class=crdtrx-Pile-area> <slot name=area></slot> </div> </div> ";

var style$1 = "/* pile */\n:host {\n  display: block;\n  position: absolute;\n}\n/* At the time this doesn't seem well supported. */\nslot[name=area]::slotted(*) {\n  position: absolute;\n}\n.crdtrx-Pile {\n  position: absolute;\n}\n.crdtrx-Pile-footprint {\n  position: absolute;\n  background-color: rgba(0, 0, 0, 0.3);\n}\n.crdtrx-Pile-area {\n  position: absolute;\n}\n.crdtrx-Pile-area slot[name=area] {\n  position: absolute;\n}\n";

const html$1 = `
<style>${style$1}</style>
${template$1}
`;

/**
 * A pile of elements
 * Attributes:
 * - type: neat, vertical, horizontal, as-is
 */
class Pile extends window.HTMLElement {
  constructor () {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = html$1;

    // this.area = shadowRoot.getElementById('area')
    // this.areaSlot = this.querySelector('[slot=area]')
    // this.footprint = shadowRoot.getElementById('footprint')
    this.hasInitialized = false;
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
    if (!this.hasInitialized) {
      this.init();
    }
  }

  init () {
    this.hasInitialized = true;
    // TODO: set initial next card position based on stackType
    this.next = {
      x: 0,
      y: 0,
      r: 0
    };
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render();
    }
  }

  // Monitor these attributes for changes.
  static get observedAttributes () {
    return [
      'type',
      'multiplier'
    ]
  }

  // Reflect the prop with the attr
  get type () {
    return this.getAttribute('type') || 0
  }
  set type (val) {
    this.setAttribute('type', Math.round(val));
  }

  get multiplier () {
    return this.getAttribute('multiplier') || 0
  }
  set multiplier (val) {
    this.setAttribute('multiplier', Math.round(val));
  }

  render () {
    /* TODO: should there be any styles for the pile set here?
    this.footprint.style.width = `${this.width}px`
    this.footprint.style.height = `${this.height}px`
    this.footprint.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
    */
  }

  static get name () {
    return 'crdtrx-pile'
  }

  static randomListOfNumbers (count) {
    return fisherYates$1(count)
  }

  static positionForIndex (index, multiplier, type) {
    // based on stackType and index return the x,y,r.
    // use multiplier to exagarate the position
    const mx = Number(multiplier) || 0;
    const idx = Number(index) || 0;
    const pos = {};
    switch (type) {
      case 'neat':
        pos.x = Math.round((Math.random() * 15) * mx);
        pos.y = Math.round((Math.random() * 15) * mx);
        pos.r = Math.round(((Math.random() * 20) - 10) * mx);
        break
      case 'mess':
        pos.x = Math.round((Math.random() * 50) * mx);
        pos.y = Math.round((Math.random() * 50) * mx);
        pos.r = Math.round(((Math.random() * 40) - 20) * mx);
        break
      case 'shift':
        pos.x = Math.round(Math.sin(((Math.PI * 2) / 26) * idx) * 20 * mx);
        pos.y = Math.round(Math.cos(((Math.PI * 2) / 26) * idx) * 20 * mx);
        pos.r = Math.round(Math.random() * 4) - 2;
        break
      case 'flower':
        pos.x = Math.round(Math.sin(((Math.PI * 2) / 26) * idx) * 20 * mx);
        pos.y = Math.round(Math.cos(((Math.PI * 2) / 26) * idx) * 20 * mx);
        pos.r = ((idx * 6) * mx) % 360;
        break
      case 'spiral':
        pos.x = 0;
        pos.y = 0;
        pos.r = ((idx * 6) * mx) % 360;
        break
      case 'vertical-mess':
        pos.x = Math.round(Math.random() * 10) - 5;
        pos.y = Math.round((Math.round((Math.max(3.5, Math.random() * 5) + idx) * mx) + (idx * (5 * mx))) - mx);
        pos.r = Math.round(Math.random() * 16) - 8;
        break
      case 'horizontal-mess':
        pos.x = Math.round((Math.round((Math.max(3.5, Math.random() * 5) + idx) * mx) + (idx * (5 * mx))) - mx);
        pos.y = Math.round(Math.random() * 10) - 5;
        pos.r = Math.round(Math.random() * 16) - 8;
        break
      case 'vertical':
        pos.x = Math.round(Math.random() * 10) - 5;
        pos.y = Math.round((Math.round((5 + idx) * mx) + (idx * (5 * mx))) - mx);
        pos.r = Math.round(Math.random() * 4) - 2;
        break
      case 'horizontal':
        pos.x = Math.round((Math.round((5 + idx) * mx) + (idx * (5 * mx))) - mx);
        pos.y = Math.round(Math.random() * 10) - 5;
        pos.r = Math.round(Math.random() * 4) - 2;
        break
      default: // perfection
        pos.x = 0;
        pos.y = 0;
        pos.r = 0;
    }
    return pos
  }

  position (index) {
    return Pile.positionForIndex(index, this.multiplier, this.type)
  }

  stack (numberOfCards) {
    const list = [];
    for (let index = 0; index < numberOfCards; index++) {
      list.push(Pile.positionForIndex(index, this.multiplier, this.type));
    }
    const pileStackEvent = new window.CustomEvent('crdtrx-pile-stack', {
      bubbles: true,
      composed: true,
      detail: {
        list: list
      }
    });
    this.dispatchEvent(pileStackEvent);
  }

  shuffle (numberOfCards) {
    const list = Pile.randomListOfNumbers(numberOfCards);
    const pileShuffleEvent = new window.CustomEvent('crdtrx-pile-shuffle', {
      bubbles: true,
      composed: true,
      detail: {
        list: list
      }
    });
    this.dispatchEvent(pileShuffleEvent);
  }
}

window.customElements.define(Pile.name, Pile);

var crdtrxPile = Pile.name;

var template$2 = "<div class=crdtrx-Table> <div class=crdtrx-Table-surface id=surface> <slot name=surface></slot> </div> </div> ";

var style$2 = ":host {\n  display: block;\n}\n\n/* Optimize repaints, and overflow is hidden.  Resolution seems to\n * be worse, however. */\n\n:host-context([contained-surface]) {\n  contain: content;\n}\n\n/* At the time this doesn't seem well supported. */\n\nslot[name=surface]::slotted(*) {\n  position: absolute;\n}\n\n.crdtrx-Table {\n}\n\n.crdtrx-Table-surface {\n  width: 100%;\n  height: 100%;\n}\n\n.crdtrx-Table-surface slot[name=surface] {\n}\n";

const html$2 = `
<style>${style$2}</style>
${template$2}
`;
const Card$2 = window.customElements.whenDefined(crdtrxCard)
  .then(() => {
    return window.customElements.get(crdtrxCard)
  });

const Pile$2 = window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  });

class Table extends window.HTMLElement {
  constructor () {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = html$2;

    this.surface = shadowRoot.getElementById('surface');
    this.surfaceSlot = this.querySelector('[slot=surface]');
    this.hasInitialized = false;
  }

  connectedCallback () {
    if (!this.hasInitialized) {
      // table depends on having these custom elements defined
      Promise.all([Card$2, Pile$2]).then(values => {
        console.log(values[0] === Card$2);
        console.log(values[1] === Pile$2);
        // Card = values.shift()
        // Pile = values.shift()
        this.init();
      });
    }
  }

  init () {
    this.hasInitialized = true;
    const tableInitEvent = new window.CustomEvent('crdtrx-table-init', {
      bubbles: true,
      composed: true,
      detail: {
      }
    });
    this.dispatchEvent(tableInitEvent);

    this.render();
  }

  render () {
    /*
    this.debugEl.innerHTML = `
      <pre>${JSON.stringify(this.cardList, null, 2)}</pre>
    `
    */
  }

  static get name () {
    return 'crdtrx-table'
  }
}

window.customElements.define(Table.name, Table);

var crdtrxTable = Table.name;

var index = [
  crdtrxCard,
  crdtrxPile,
  crdtrxTable
];

return index;

}());
//# sourceMappingURL=crdtrx.js.map
