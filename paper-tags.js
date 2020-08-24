/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/** 
An element for setting  displaying a single tag

### Example : 
    
    <paper-tags label-path="label" items='[{"id":1, "l" :"me", "label":"hello"},{"id":2, "label":"new"}]'></paper-tags>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-tags` | Mixin applied to the host | `{}`
`--paper-tags-item` | Mixin applied to the .paper-tag-item | `{}`
`--paper-tag-margin` | margin between tags | `3px`
`--paper-tag-focus-color` | the tag border color | `--default-primary-color`
`--paper-tag-text-color` | the tag text color | `--secondary-text-color`


@group Paper Elements
@element paper-input
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import  {PaperTagsMixin} from './paper-tags-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class PaperTags extends PaperTagsMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    [hidden] {
      display: none !important;
    }

    :host {
      display: block;
      @apply --paper-font-common-base;
      @apply --paper-tags;
    }

    div.paper-tag-item {
      margin-bottom: var(--paper-tag-margin, 3px);
      border: 1px solid var(--paper-tag-color, var(--primary-color));
      font-size: 13px;
      color: var(--paper-tag-text-color, var(--secondary-text-color));
      border-radius: 4px;
      @apply --paper-tag-item;
    }

    .paper-tag-item:last-of-type {
      margin-right: var(--paper-tag-margin, 3px);
    }

    paper-icon-button {
      color: var(--paper-tag-color, var(--primary-color));
      width: 20px;
      height: 20px;
      padding: 0;
    }

    .paper-tag-item-label {
      padding: var(--paper-tag-margin, 3px);
    }

    .paper-tag-item {
      display: inline-block;
    }
    </style>
    <template is="dom-repeat" items="[[items]]">
      <div style\$="[[getStyle(item)]]" class\$="paper-tag-item [[doGet(classPath, item, 'itemClass')]]">
        <span class="paper-tag-item-label">[[getLabel(item)]]</span>
        <paper-icon-button icon="[[doGet(iconPath, item, 'icon')]]"></paper-icon-button>
        <paper-icon-button icon="icons:close" hidden\$="[[preventRemoveTag]]" on-tap="_removeTag"></paper-icon-button>
      </div>
    </template>
`;
  }

  static get is() {
    return 'paper-tags';
  }

  static get properties() {
    return {
      /**
       * `readonly`prevents tags to be removed
       */
      readonly: {
        type: Boolean
      },


      /**
       * `items` the Array of tags
       */
      items: {
        type: Array,
        notify: true,
        value: function() {
          return [];
        }
      },

      /*
       * `getStyle` Style getter
       */
       getStyle: {
         type: Function,
         value: function() {
           return this.getStyle.bind(this);
         }
      },
       /*
       * `getLabel`Label getter
       */
       getLabel: {
         type: Function,
         value: function() {
           return this.getLabel.bind(this);
         }
      }
    };
  }

  doGet(path, item, name) {
  	if (!path && item && typeof item === 'string') {
      return item;
    }
    if(path && name) {
        return this.get(path, item) || this[name];
    }
    return '';
  }


  getLabel(item) {
    return this.doGet(this.labelPath, item, 'label');
    
  }

  _removeTag(event) {
    event.stopPropagation();
    if (this.readonly) {
      return;
    }
    const index = this.items.indexOf(event.model.item);
    if (index > -1) {
      this.splice('items', index, 1);
    }
  }

  getStyle(item) {
    return '';
  }
}

customElements.define(PaperTags.is, PaperTags);
