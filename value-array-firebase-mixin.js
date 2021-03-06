/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '@polymer/polymer/polymer-legacy.js';

/**
 * `Polymer.ValueArrayFirebaseMixin` ensures the binding between array values and firebase objects.
 *
 * @demo demo/index.html
 */

export const ValueArrayFirebaseMixin = function(superClass) {
    return class extends superClass {
        static get properties() {
            return  {
                /**
                 * `valueObject` store value as object keys `{"value1": true, "value2": true}`
                 */
                valueObject: {
                  type: Object,
                  notify: true
                },
            
                /**
                 * `valueArray` store value as array `["value1", "value2"]`
                 */
                valueArray: {
                  type: Array,
                  notify: true
                },
            
                /**
                 * `valueJoin` joins values in a string
                 */
                valueJoin: {
                  type: String,
                  notify: true,
                  readOnly: true,
                }
              }
        }
        static get observers() {
             return [
              '_observeValueObject(valueObject.*)',
              '_observeValueArrayInit(valueArray)',
              '_observeValueArray(valueArray.splices)',
            ]
        }
        //called when we set/reset valueArray 
        _observeValueArrayInit(valueArray) {
          this._isInitiatingValueArray = true;
          if (valueArray && !this._isUpdatingValueObject) {
            var o = {};
            this.valueArray.forEach(function(item) {
              o[item] = true;
            });
            this.set('valueObject', o);
            this._setValueJoin(this.valueArray.join(', '));
          }
          delete this._isInitiatingValueArray;
        }

        /**
         * `_observeValueArray` ensures valueArray and valueObject are in sync
         */
        _observeValueArray(splices) {
          if (!splices) {
            return;
          }
          this._isUpdatingValueArray = true;
          // console.log('ARRAY SPLICE', splices);
          if (!this._isUpdatingValueObject) {
            splices.indexSplices.forEach(function(splice) {
              splice.removed.forEach(function(removed) {
                this.set('valueObject.' + removed, null); // so that it is deleted at firebase level
                this.dispatchEvent(new CustomEvent('tag-removed',{bubbles: true, composed: true,detail: removed}));
              }, this);
              if (splice.addedCount) {
                for (var i = 0; i < splice.addedCount; i++) {
                  var index = splice.index + i;
                  var newValue = splice.object[index];
                  this.set('valueObject.' + newValue, true);
                  this.dispatchEvent(new CustomEvent('tag-added',{bubbles: true, composed: true,detail: newValue}));
                }
              }
            }, this);
        
            this._setValueJoin((this.valueArray || []).join(', '));
          }
          delete this._isUpdatingValueArray;
        }
        
        /**
         * `_observeValueObject` ensures valueArray and valueObject are in sync
         */
        _observeValueObject(obj) {
          this._isUpdatingValueObject = true;
          if (!this._isUpdatingValueArray && !this._isInitiatingValueArray) {
            var keys = Object.keys(this.valueObject).filter(function(item) {
              return !!item;
            });
            this.syncValueArrayWithKeys(keys);
        
            this._setValueJoin(this.valueArray.join(', '));
          }
          delete this._isUpdatingValueObject;
        }
        
        syncValueArrayWithKeys(keys) {
          if (!this.valueArray) {
            this.valueArray = [];
          }
          // removed values not present in keys
          var tmpArray = [].concat(this.valueArray);
          tmpArray.forEach((v) => {
            if (keys.indexOf(v) < 0) {
              this.splice('valueArray', this.valueArray.indexOf(v), 1);
            }
          });
          // add all missing keys
          keys.forEach((k) => {
            if (this.valueArray.indexOf(k) < 0) {
              this.push('valueArray', k);
            }
          });
        }
    };
};