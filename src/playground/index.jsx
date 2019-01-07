// Polyfills
import 'es6-object-assign/auto';
import 'core-js/fn/array/includes';
import 'core-js/fn/promise/finally';
import 'intl'; // For Safari 9

import React from 'react';
import ReactDOM from 'react-dom';

import analytics from '../lib/analytics';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import BrowserModalComponent from '../components/browser-modal/browser-modal.jsx';
import supportedBrowser from '../lib/supported-browser';

import styles from './index.css';

(function($){
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  }
})(jQuery);

// Register "base" page view
analytics.pageview('/');

const appTarget = document.createElement('div');
appTarget.className = styles.app;
const scratchGui = require('./render-gui.jsx');
const scratchSelectorClass = ".mu-scratch-custom-editor";

const getScratchSelector = function () {
  return document.querySelector(scratchSelectorClass);
};

let onDestroyedInterval;

const reattachOnDestroy = function (validScratch) {
  $(scratchSelectorClass).bind('destroyed', () => {
    clearInterval(onDestroyedInterval);
    onDestroyedInterval = setInterval(() => {
      checkScratchPresence((scratchSelector) => {
        scratchVm.loadCurrentContent();
        scratchSelector.appendChild(validScratch);
        return scratchSelector;
      }, onDestroyedInterval);
    }, 200)
  })
};

const createScratchInterval = setInterval(function() {
  checkScratchPresence((scratchSelector) => {
    renderScratchGui(scratchSelector, appTarget);
    return getScratchSelector();
  }, createScratchInterval);
}, 200);

const checkScratchPresence = function (actions, interval) {
  let scratchSelector = getScratchSelector();
  if (scratchSelector) {
    clearInterval(interval);
    let validScratch = actions(scratchSelector);
    reattachOnDestroy(validScratch)
  }
};

const renderScratchGui = function (scratchSelector, appTarget) {
  scratchSelector.appendChild(appTarget);

  if (supportedBrowser()) {
    // require needed here to avoid importing unsupported browser-crashing code
    // at the top level
    scratchGui.default(appTarget);


  } else {
    BrowserModalComponent.setAppElement(appTarget);
    const WrappedBrowserModalComponent = AppStateHOC(BrowserModalComponent, true /* localesOnly */);
    const handleBack = () => {};
    // eslint-disable-next-line react/jsx-no-bind
    ReactDOM.render(<WrappedBrowserModalComponent onBack={handleBack} />, appTarget);
  }
};
