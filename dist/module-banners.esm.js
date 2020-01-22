import Vue from 'vue';
import Component, { createDecorator } from 'vue-class-component';
import Vuex from 'vuex';
import axios from 'axios';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/** vue-property-decorator verson 8.2.2 MIT LICENSE copyright 2019 kaorun343 */
/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
var reflectMetadataIsSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined';
function applyMetadata(options, target, key) {
    if (reflectMetadataIsSupported) {
        if (!Array.isArray(options) &&
            typeof options !== 'function' &&
            typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
    }
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        applyMetadata(options, target, key);
        createDecorator(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}

let ListBanners = class ListBanners extends Vue {
};
__decorate([
    Prop()
], ListBanners.prototype, "banner", void 0);
ListBanners = __decorate([
    Component({
        components: {}
    })
], ListBanners);
var script = ListBanners;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "item-banner" }, [
    _c("div", { staticClass: "item-banner__container" }, [
      _c(
        "div",
        { staticClass: "item-banner__img-wrapper" },
        [
          _c("IMG", {
            staticClass: "item-banner__img",
            attrs: { src: _vm.banner.bannerImageUrl }
          })
        ],
        1
      ),
      _c("div", { staticClass: "item-banner__info" }, [
        _vm.banner.bannerDate
          ? _c(
              "div",
              {
                staticClass:
                  "item-banner__info-item item-banner__info-item_banner-date"
              },
              [
                _c("div", { staticClass: "item-banner__title" }, [
                  _vm._v("Banner Date: "),
                  _c("span", { staticClass: "item-banner__text" }, [
                    _vm._v(_vm._s(_vm.banner.bannerDate))
                  ])
                ])
              ]
            )
          : _vm._e(),
        _vm.banner.createdAt
          ? _c(
              "div",
              {
                staticClass:
                  "item-banner__info-item item-banner__info-item_created-at"
              },
              [
                _c("div", { staticClass: "item-banner__title" }, [
                  _vm._v("Created At: "),
                  _c("span", { staticClass: "item-banner__text" }, [
                    _vm._v(_vm._s(_vm.banner.createdAt))
                  ])
                ])
              ]
            )
          : _vm._e()
      ])
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = "data-v-d7ef2942";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

const service = axios.create({
    // baseURL: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1',
    headers: { Authorization: `Bearer SjXGagud3addBJsyBNtEsrxRqnyNLsVsr296afaB` }
});

Vue.use(Vuex);
var Store = new Vuex.Store({
    state: {
        list: [],
    },
    getters: {
        listSortedAndCleared(state) {
            // const cleared = state.list && state.list.filter(banner => banner.isActive)
            return state.list && state.list.sort((a, b) => {
                const keyA = a.sort;
                const keyB = a.sort;
                if (keyA > keyB)
                    return 1;
                else if (keyA < keyB)
                    return -1;
                else
                    return 0;
            });
        }
    },
    mutations: {
        saveList: (state, payload) => state.list = payload
    },
    actions: {
        async getList({ commit }) {
            return new Promise((resolve) => {
                service.get('api/v1/banners-list')
                    .then((res) => {
                    while (!Array.isArray(res))
                        res = res.data;
                    commit('saveList', res);
                    resolve();
                });
            });
        }
    }
});

let ListBanners$1 = class ListBanners extends Vue {
    // @Getter('listSortedAndCleared') list! : Banner[]
    get list() { return Store.getters.listSortedAndCleared; }
};
ListBanners$1 = __decorate([
    Component({
        components: {
            ItemBanner: __vue_component__
        }
    })
], ListBanners$1);
var script$1 = ListBanners$1;

/* script */
const __vue_script__$1 = script$1;
/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "list-banners" }, [
    _vm.list && _vm.list.length
      ? _c(
          "div",
          { staticClass: "list-banners__container" },
          _vm._l(_vm.list, function(item) {
            return _c("ItemBanner", {
              key: item.id,
              staticClass: "list-banners__item",
              attrs: { banner: item }
            })
          }),
          1
        )
      : _vm._e()
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = "data-v-69b7211e";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

let App = class App extends Vue {
    get list() { return Store.getters.listSortedAndCleared; }
    async created() {
        // await this.getList()
        if (!this.list || !this.list.length)
            await Store.dispatch('getList');
    }
    async mounted() {
        // await this.getList()
        if (!this.list || !this.list.length)
            await Store.dispatch('getList');
    }
};
App = __decorate([
    Component({
        components: {
            ListBanners: __vue_component__$1
        }
    })
], App);
var script$2 = App;

/* script */
const __vue_script__$2 = script$2;
/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "app" }, [
    _c(
      "div",
      { staticClass: "app__container container" },
      [_c("ListBanners", { staticClass: "app__list" })],
      1
    )
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = "data-v-63024ed2";
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

export default __vue_component__$2;