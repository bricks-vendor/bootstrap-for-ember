/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

(function() {
  var Bootstrap;

  Bootstrap = window.Bootstrap = Ember.Namespace.create();

}).call(this);

(function() {
  var Bootstrap, get;

  Bootstrap = window.Bootstrap;

  get = Ember.get;

  Bootstrap.WithRouter = Ember.Mixin.create({
    router: Ember.computed(function() {
      return get(this, "controller").container.lookup("router:main");
    })
  });

}).call(this);

(function() {
  var Bootstrap, get, set;

  Bootstrap = window.Bootstrap;

  get = Ember.get;

  set = Ember.set;

  Bootstrap.TypeSupport = Ember.Mixin.create({
    classTypePrefix: Ember.required(String),
    classNameBindings: ['typeClass'],
    type: 'default',
    typeClass: (function() {
      var pref, type;
      type = this.get('type');
      if (type == null) {
        type = 'default';
      }
      pref = this.get('classTypePrefix');
      return "" + pref + "-" + type;
    }).property('type').cacheable()
  });

}).call(this);

(function() {
  var Bootstrap, get, set;

  Bootstrap = window.Bootstrap;

  get = Ember.get;

  set = Ember.set;

  Bootstrap.SizeSupport = Ember.Mixin.create({
    classTypePrefix: Ember.required(String),
    classNameBindings: ['sizeClass', 'largeSizeClass', 'smallSizeClass', 'extraSmallSizeClass'],
    size: null,
    xs: null,
    small: null,
    large: null,
    extraSmallSizeClass: (function() {
      var pref;
      pref = this.get('classTypePrefix');
      if (this.xs) {
        return "" + pref + "-xs";
      } else {
        return null;
      }
    }).property('xs').cacheable(),
    smallSizeClass: (function() {
      var pref;
      pref = this.get('classTypePrefix');
      if (this.small) {
        return "" + pref + "-sm";
      } else {
        return null;
      }
    }).property('small').cacheable(),
    largeSizeClass: (function() {
      var pref;
      pref = this.get('classTypePrefix');
      if (this.large) {
        return "" + pref + "-lg";
      } else {
        return null;
      }
    }).property('large').cacheable(),
    sizeClass: (function() {
      var pref, size;
      size = this.get('size');
      pref = this.get('classTypePrefix');
      if (size) {
        return "" + pref + "-" + size;
      } else {
        return null;
      }
    }).property('size').cacheable()
  });

}).call(this);

/*
A mixin for Items that have a value property
*/


(function() {
  Bootstrap.ItemValue = Ember.Mixin.create({
    /*
    The value of the item, currently Items content supports only an array of strings, so value is the actual 'content' property
    of the item.
    */

    value: (function() {
      var itemsView, value;
      itemsView = this.get('parentView');
      if (itemsView == null) {
        return;
      }
      value = this.get('content');
      return value;
    }).property('content').cacheable()
  });

}).call(this);

/*
A Mixin to enhance items enhanced with the 'IsItem' Mixin with selection capability.

When a click event is received the current item will be stored in the parent view 'selected' property,
An extra 'active' css class will be assigned to the Item (this) if this is a selected item.
*/


(function() {
  Bootstrap.ItemSelection = Ember.Mixin.create(Bootstrap.ItemValue, Bootstrap.WithRouter, {
    classNameBindings: ["isActive:active"],
    init: function() {
      this._super();
      return this.didRouteChange();
    },
    didRouteChange: (function() {
      var itemsView, linkTo, _ref;
      linkTo = this.get('content.linkTo');
      if (linkTo == null) {
        return;
      }
      itemsView = this.get('parentView');
      if (itemsView == null) {
        return;
      }
      if ((_ref = this.get('router')) != null ? _ref.isActive(linkTo) : void 0) {
        return itemsView.set('selected', this.get('value'));
      }
    }).observes('router.url'),
    /*
    Determine whether the current item is selected,
    if true the 'active' css class will be associated with the this DOM's element.
    
    This is a calculated property and will be retriggered if the 'value' property of the item has changed or the 'selected' property
    in the parent ItemsView.
    */

    isActive: (function() {
      var itemsView, selected, value;
      itemsView = this.get('parentView');
      if (itemsView == null) {
        return false;
      }
      selected = itemsView.get('selected');
      value = this.get('value');
      if (value == null) {
        return false;
      }
      return selected === value;
    }).property('value', 'parentView.selected', 'content.linkTo').cacheable(),
    /*
    Handle selection by click event.
    
    The identifier of the selection is based on the 'content' property of this item.
    */

    click: function(event) {
      var content, itemsView;
      event.preventDefault();
      itemsView = this.get('parentView');
      if (itemsView == null) {
        return;
      }
      content = this.get('content');
      if (typeof content === 'object') {
        if (content.get('disabled')) {
          return;
        }
      }
      if (this.get('content.linkTo') != null) {
        return;
      }
      return itemsView.set('selected', this.get('value'));
    }
  });

}).call(this);

/*
A Mixin to enhance views that extends from 'ItemsView' with selection capability.
*/


(function() {
  Bootstrap.ItemsSelection = Ember.Mixin.create({
    /*
    If true, multiple selection is supported
    */

    multiSelection: false,
    /*
    An array of selected item(s), can be also bound to a controller property via 'selectedBinding'
    */

    selected: []
  });

}).call(this);

/*
A Mixin that provides the basic configuration for rendering a Bootstrap navigation such as tabs and pills
*/


(function() {
  Bootstrap.Nav = Ember.Mixin.create({
    classNames: ['nav'],
    classNameBindings: ['navTypeClass'],
    tagName: 'ul',
    navType: null,
    navTypeClass: (function() {
      if (this.navType != null) {
        return "nav-" + this.navType;
      } else {
        return null;
      }
    }).property('navType').cacheable()
  });

}).call(this);

/*
A Mixin that provides the basic configuration for rendering and interacting with Bootstrap navigation item such a pill or a tab.
*/


(function() {
  Bootstrap.NavItem = Ember.Mixin.create(Bootstrap.SelectableView);

}).call(this);

(function() {
  var getParentView, getProperty;

  getParentView = function(view) {
    var ok, parentView;
    if (!(view && (parentView = view.get('parentView')))) {
      return;
    }
    ok = parentView instanceof Bootstrap.ItemsView;
    Ember.assert("The parent view must be an instance of Bootstrap.ItemsView or any inherited class", ok);
    if (ok) {
      return parentView;
    } else {
      return void 0;
    }
  };

  getProperty = function(obj, prop, noGetReturns) {
    if (!(Ember.typeOf(obj) === 'instance' || Ember.canInvoke(obj, 'get'))) {
      return noGetReturns;
    }
    return obj.get(prop);
  };

  /*
  Views that are rendered as an Item of the ItemsView should extends from this view.
  
  When a click event is received the current item will be stored in the parent view 'selected' property,
  An extra 'active' css class will be assigned to the Item (this) if this is a selected item.
  
  Views that extends this view can be enhanced with:
  ItemSelection: Makes the item selectable.
  */


  Bootstrap.ItemView = Ember.View.extend({
    isItem: true,
    classNameBindings: ['disabled'],
    /*
    A calculated property that defines the title of the item.
    */

    title: (function() {
      var content, itemTitleKey, itemsView;
      if (!(itemsView = getParentView(this))) {
        return;
      }
      itemTitleKey = itemsView.get('itemTitleKey') || 'title';
      content = this.get('content');
      return getProperty(content, itemTitleKey, content);
    }).property('content').cacheable(),
    /*
    Determine whether the item is disabled or not
    */

    disabled: (function() {
      var content, disabled, itemsView;
      if (!(itemsView = getParentView(this))) {
        return;
      }
      content = this.get('content');
      disabled = !!getProperty(content, 'disabled', false);
      if (disabled && this.get('isActive')) {
        itemsView.set('selected', null);
      }
      return disabled;
    }).property('content', 'content.disabled').cacheable()
  });

}).call(this);

/*
A parent view of views that supports multiple items rendering such as Navigations (Tabs, Pills)

Views that inherits from this view can be enhanced with:
- ItemsSelection: Enhances with selection capability.
*/


(function() {
  Bootstrap.ItemsView = Ember.CollectionView.extend({
    didInsertElement: function() {
      var defaultTab, view, _i, _len, _ref, _ref1;
      if (this.get('default')) {
        defaultTab = this.get('default');
        _ref = this._childViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (((_ref1 = view.get('content')) != null ? _ref1.get('title') : void 0) === defaultTab) {
            this.set('selected', view.get('content'));
          }
        }
        return Ember.assert("Could not activate default tab " + defaultTab + " as it doesnt exist", defaultTab);
      }
    }
  });

}).call(this);

(function() {
  Bootstrap.ItemPaneView = Ember.View.extend({
    template: Ember.Handlebars.compile(['{{#if view.content.template}}', '{{bsItemPanePartial view.content.template}}', '{{/if}}'].join("\n")),
    corrItem: (function() {
      var view, _i, _len, _ref;
      if (this.get('parentView').get('corrItemsView') != null) {
        _ref = this.get('parentView').get('corrItemsView')._childViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.content === this.get('content')) {
            return view;
          }
        }
      }
    }).property('parentView.corrItemsView'),
    isVisible: (function() {
      var _ref;
      return (_ref = this.get('corrItem')) != null ? _ref.get('isActive') : void 0;
    }).property('corrItem.isActive'),
    controller: (function() {
      var controller, itemController;
      controller = this.get('parentView.controller');
      if (this.get('content.controller')) {
        itemController = this.get('container').lookup("controller:" + (this.get('content.controller')));
        if (itemController) {
          controller = itemController;
        }
      }
      return controller;
    }).property('content')
  });

  Ember.Handlebars.helper("bsItemPanePartial", function(templateName, options) {
    var template, view;
    view = options.data.view;
    template = view.templateForName(templateName);
    Ember.assert("Unable to find template with name '" + templateName + "'", template);
    return template(this, {
      data: options.data
    });
  });

}).call(this);

(function() {
  Bootstrap.ItemsPanesView = Ember.CollectionView.extend({
    viewsInserted: false,
    corrItemsView: (function() {
      var itemsView;
      itemsView = Ember.View.views[this.get('items-id')];
      return itemsView;
    }).property('viewsInserted'),
    didInsertElement: function() {
      this._super();
      return this.set('viewsInserted', true);
    }
  });

}).call(this);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

(function() {
  Bootstrap.BsAlertComponent = Ember.Component.extend(Bootstrap.TypeSupport, {
    classNames: ['alert'],
    classNameBindings: ['fade', 'fade:in'],
    layoutName: 'components/bs-alert',
    classTypePrefix: 'alert',
    attributeBindings: ['data-timeout'],
    dismissAfter: 0,
    closedParam: null,
    didInsertElement: function() {
      var _this = this;
      if (this.dismissAfter > 0) {
        Ember.run.later(this, 'dismiss', this.dismissAfter * 1000);
      }
      Ember.$("#" + this.elementId).bind('closed.bs.alert', function() {
        _this.sendAction('closed', _this.get('closedParam'));
        return _this.destroy();
      });
      return Ember.$("#" + this.elementId).bind('close.bs.alert', function() {
        return _this.sendAction('close', _this.get('closedParam'));
      });
    },
    dismiss: function() {
      return Ember.$("#" + this.elementId).alert('close');
    }
  });

  Ember.Handlebars.helper('bs-alert', Bootstrap.BsAlertComponent);

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-alert"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, self=this, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("\n    <a class=\"close\" data-dismiss=\"alert\" href=\"#\">&times;</a>\n");
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "dismiss", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  return buffer;
  
});
/*
Breadcrumbs compponent.
*/


(function() {
  Bootstrap.BsBreadcrumbsItem = Bootstrap.ItemView.extend({
    tagName: ['li'],
    classNameBindings: ["isActive:active"],
    template: Ember.Handlebars.compile('{{#unless view.isActive}}{{#if view.content.model}}{{#link-to view.content.route model.id}}{{view.content.name}}{{/link-to}}{{else}}{{#link-to view.content.route}}{{view.content.name}}{{/link-to}}{{/if}}{{else}}{{view.content.name}}{{/unless}}'),
    isActive: (function() {
      return this.get('content.active');
    }).property('content.active')
  });

  Bootstrap.BsBreadcrumbs = Bootstrap.ItemsView.extend(Bootstrap.WithRouter, {
    tagName: ['ol'],
    classNames: ['breadcrumb'],
    currentPathObserver: (function() {
      this.get('router');
      return this.send('updateCrumbsByRoute');
    }).observes('router.url').on('init'),
    content: [],
    itemViewClass: Bootstrap.BsBreadcrumbsItem,
    nameDictionary: void 0,
    dictionaryNamePrefix: 'breadcrumbs',
    actions: {
      currentPathDidChange: function() {
        return this.send('updateCrumbsByRoute');
      },
      updateCrumbsByRoute: function() {
        var routes,
          _this = this;
        this.get('content').clear();
        routes = this.get('container').lookup('router:main');
        routes.get('router.currentHandlerInfos').forEach(function(route, i, arr) {
          var crumb, displayName, name, routeName, _ref, _ref1, _ref2;
          name = route.name;
          if (name.indexOf('.index') !== -1 || name === 'application') {
            return;
          }
          if ((_ref = route.handler.breadcrumbs) != null ? _ref.hidden : void 0) {
            return;
          }
          routeName = route.handler.routeName;
          if ((_ref1 = route.handler.breadcrumbs) != null ? _ref1.name : void 0) {
            displayName = route.handler.breadcrumbs.name;
          } else if ((_ref2 = _this.get('nameDictionary')) != null ? _ref2["" + _this.dictionaryNamePrefix + "." + routeName] : void 0) {
            displayName = _this.get('nameDictionary')["" + _this.dictionaryNamePrefix + "." + routeName];
          } else {
            displayName = route.handler.routeName.split('.').pop();
            displayName = displayName[0].toUpperCase() + displayName.slice(1).toLowerCase();
          }
          crumb = Ember.Object.create({
            route: route.handler.routeName,
            name: displayName,
            model: null
          });
          if (_this.get('content').length === 0) {
            crumb.set('icon', 'fa fa-home home-icon');
          }
          if (route.isDynamic) {
            crumb.setProperties({
              model: route.handler.context,
              name: route.handler.context.get('name')
            });
          }
          return _this.get('content').pushObject(crumb);
        });
        return this.get('content.lastObject').set('active', true);
      }
    }
  });

  Ember.Handlebars.helper('bs-breadcrumbs', Bootstrap.BsBreadcrumbs);

}).call(this);

(function() {
  Bootstrap.BsLabelComponent = Ember.Component.extend(Bootstrap.TypeSupport, {
    layoutName: 'components/bs-label',
    tagName: 'span',
    classNames: ['label'],
    classTypePrefix: 'label'
  });

  Ember.Handlebars.helper('bs-label', Bootstrap.BsLabelComponent);

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-label"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});
(function() {
  Bootstrap.BsBadgeComponent = Ember.Component.extend(Bootstrap.TypeSupport, {
    layoutName: 'components/bs-badge',
    tagName: 'span',
    classNames: ['badge'],
    classTypePrefix: 'badge'
  });

  Ember.Handlebars.helper('bs-badge', Bootstrap.BsBadgeComponent);

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-badge"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});
(function() {
  Bootstrap.BsWellComponent = Ember.Component.extend({
    layoutName: 'components/bs-well',
    classNameBindings: ['small:well-sm', 'large:well-lg'],
    classNames: ['well'],
    click: function() {
      return this.sendAction('clicked');
    }
  });

  Ember.Handlebars.helper('bs-well', Bootstrap.BsWellComponent);

}).call(this);

(function() {
  Bootstrap.BsPageHeaderComponent = Ember.Component.extend({
    layoutName: 'components/bs-page-header',
    classNames: ['page-header']
  });

  Ember.Handlebars.helper('bs-page-header', Bootstrap.BsPageHeaderComponent);

}).call(this);

(function() {
  Bootstrap.BsPanelComponent = Ember.Component.extend(Bootstrap.TypeSupport, {
    layoutName: 'components/bs-panel',
    classNames: ['panel'],
    classTypePrefix: ['panel'],
    classNameBindings: ['fade', 'fade:in'],
    clicked: null,
    onClose: null,
    fade: true,
    collapsible: false,
    open: true,
    actions: {
      close: function(event) {
        this.sendAction('onClose');
        this.$().removeClass('in');
        return setTimeout((function() {
          return this.destroy();
        }).bind(this), 250);
      }
    },
    click: function(event) {
      return this.sendAction('clicked');
    },
    collapsibleBodyId: (function() {
      return "" + (this.get('elementId')) + "_body";
    }).property('collapsible'),
    collapsibleBodyLink: (function() {
      return "#" + (this.get('elementId')) + "_body";
    }).property('collapsibleBodyId')
  });

  Ember.Handlebars.helper('bs-panel', Bootstrap.BsPanelComponent);

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-page-header"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n        <small>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "sub", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</small>\n    ");
  return buffer;
  }

  data.buffer.push("<h1>\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "sub", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</h1>");
  return buffer;
  
});

this["Ember"]["TEMPLATES"]["components/bs-well"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

this["Ember"]["TEMPLATES"]["components/bs-panel"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"panel-heading\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "collapsible", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "dismiss", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n            <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion\" ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "ID"};
  options = {hash:{
    'href': ("collapsibleBodyLink")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n                ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "heading", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            </a>\n        ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "heading", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        ");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            <a class=\"close\" data-dismiss=\"panel\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">&times;</a>\n        ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    <div ");
  hashContexts = {'id': depth0};
  hashTypes = {'id': "ID"};
  options = {hash:{
    'id': ("collapsibleBodyId")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': (":panel-collapse :collapse open:in")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        <div class=\"panel-body\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n    </div>\n");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <div id=\"collapseOne\" class=\"panel-body\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n");
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"panel-footer\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "footer", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "heading", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "collapsible", {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "footer", {hash:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});
/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

(function() {
  Bootstrap.BsButtonComponent = Ember.Component.extend(Bootstrap.TypeSupport, Bootstrap.SizeSupport, {
    layoutName: 'components/bs-button',
    tagName: 'button',
    classNames: ['btn'],
    classNameBindings: ['blockClass'],
    classTypePrefix: 'btn',
    clickedParam: null,
    block: null,
    attributeBindings: ['disabled', 'dismiss:data-dismiss', '_type:type', 'style'],
    _type: 'button',
    bubbles: true,
    allowedProperties: ['title', 'type', 'size', 'block', 'disabled', 'clicked', 'dismiss', 'class'],
    icon_active: void 0,
    icon_inactive: void 0
  }, {
    init: function() {
      var attr, c, key, _i, _len, _ref, _results;
      this._super();
      if ((this.get('content') != null) && Ember.typeOf(this.get('content')) === 'instance') {
        c = this.get('content');
        _ref = this.get('allowedProperties');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (c[key] != null) {
            this.set(key, c[key]);
          }
        }
      } else {
        if (this.get('title') == null) {
          this.set('title', this.get('content'));
        }
      }
      _results = [];
      for (attr in this) {
        if (attr.match(/^data-[\w-]*$/) != null) {
          _results.push(this.attributeBindings.pushObject(attr));
        }
      }
      return _results;
    },
    blockClass: (function() {
      if (this.block) {
        return "" + this.classTypePrefix + "-block";
      } else {
        return null;
      }
    }).property('block').cacheable(),
    click: function(evt) {
      if (!this.get('bubbles')) {
        evt.stopPropagation();
      }
      return this.sendAction('clicked', this.get('clickedParam'));
    },
    loadingChanged: (function() {
      var loading;
      loading = this.get('loading') !== null ? this.get('loading') : "reset";
      return Ember.$("#" + this.elementId).button(loading);
    }).observes('loading'),
    icon: (function() {
      if (this.get('isActive')) {
        return this.get('icon_active');
      } else {
        return this.get('icon_inactive');
      }
    }).property('isActive')
  });

  Ember.Handlebars.helper('bs-button', Bootstrap.BsButtonComponent);

}).call(this);

/*
Button Group.

In its simple form, each item in the button group is a Bootstrap.Button component,
In case this is a Radio, each item is rendered as a label.
*/


(function() {
  Bootstrap.BsBtnGroup = Bootstrap.ItemsView.extend(Bootstrap.SizeSupport, Bootstrap.ItemsSelection, {
    classTypePrefix: ['btn-group'],
    classNames: ['btn-group'],
    classNameBindings: ['vertical:btn-group-vertical'],
    itemViewClass: Bootstrap.BsButtonComponent.extend(Bootstrap.ItemValue, Bootstrap.ItemSelection, {
      init: function() {
        this._super();
        this.set('icon_active', this.get('parentView.icon_active'));
        return this.set('icon_inactive', this.get('parentView.icon_inactive'));
      }
    })
  });

  Ember.Handlebars.helper('bs-btn-group', Bootstrap.BsBtnGroup);

}).call(this);

/*
Button Toolbar.

A collection of button groups
*/


(function() {
  Bootstrap.BsBtnToolbarComponent = Ember.Component.extend({
    layoutName: 'components/bs-btn-toolbar',
    classNames: ['btn-toolbar']
  });

  Ember.Handlebars.helper('bs-btn-toolbar', Bootstrap.BsBtnToolbarComponent);

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-button"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    <i ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("></i>\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "icon", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  return buffer;
  
});
this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-btn-toolbar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});
/*
Parent component of a progressbar component
*/


(function() {
  Bootstrap.BsProgressComponent = Ember.Component.extend({
    layoutName: 'components/bs-progress',
    classNames: ['progress'],
    classNameBindings: ['animated:active', 'stripped:progress-striped'],
    progress: null,
    stripped: false,
    animated: false,
    "default": (function() {
      return this.progress;
    }).property('progress')
  });

  Ember.Handlebars.helper('bs-progress', Bootstrap.BsProgressComponent);

}).call(this);

(function() {
  Bootstrap.BsProgressbarComponent = Ember.Component.extend(Bootstrap.TypeSupport, {
    layoutName: 'components/bs-progressbar',
    classNames: ['progress-bar'],
    attributeBindings: ['style', 'role', 'aria-valuemin', 'ariaValueNow:aria-valuenow', 'aria-valuemax'],
    classTypePrefix: 'progress-bar',
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    init: function() {
      return this._super();
    },
    style: (function() {
      return "width:" + this.progress + "%;";
    }).property('progress').cacheable(),
    ariaValueNow: (function() {
      return this.progress;
    }).property('progress').cacheable()
  });

  Ember.Handlebars.helper('bs-progressbar', Bootstrap.BsProgressbarComponent);

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-progress"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    ");
  hashContexts = {'progress': depth0,'type': depth0};
  hashTypes = {'progress': "ID",'type': "ID"};
  options = {hash:{
    'progress': ("progress"),
    'type': ("type")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bs-progressbar'] || depth0['bs-progressbar']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bs-progressbar", options))));
  data.buffer.push("\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "default", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

this["Ember"]["TEMPLATES"]["components/bs-progressbar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"sr-only\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "progress", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("% Complete</span>");
  return buffer;
  
});
(function() {
  Bootstrap.BsPill = Bootstrap.ItemView.extend(Bootstrap.NavItem, Bootstrap.ItemSelection, {
    template: Ember.Handlebars.compile('{{#if view.content.linkTo}}\n    {{#if view.parentView.dynamicLink}}\n        {{#link-to view.content.linkTo model}}{{view.title}}{{/link-to}}\n    {{else}}\n        {{#link-to view.content.linkTo}}{{view.title}}{{/link-to}}\n    {{/if}}\n{{else}}\n    {{view view.pillAsLinkView}}\n{{/if}}'),
    pillAsLinkView: Ember.View.extend({
      tagName: 'a',
      template: Ember.Handlebars.compile('{{view.parentView.title}}'),
      attributeBindings: ['href'],
      href: "#"
    })
  });

}).call(this);

(function() {
  Bootstrap.BsPills = Bootstrap.ItemsView.extend(Bootstrap.Nav, {
    navType: 'pills',
    classNameBindings: ['stacked:nav-stacked', 'justified:nav-justified'],
    attributeBindings: ['style'],
    itemViewClass: Bootstrap.BsPill
  });

  Ember.Handlebars.helper('bs-pills', Bootstrap.BsPills);

}).call(this);

(function() {
  Bootstrap.BsTabPane = Bootstrap.ItemPaneView.extend();

}).call(this);

(function() {
  Bootstrap.BsTabsPanes = Bootstrap.ItemsPanesView.extend({
    classNames: ['tab-content'],
    itemViewClass: Bootstrap.BsTabPane
  });

  Ember.Handlebars.helper('bs-tabs-panes', Bootstrap.BsTabsPanes);

}).call(this);

(function() {
  Bootstrap.BsTabs = Bootstrap.ItemsView.extend(Bootstrap.Nav, {
    navType: 'tabs',
    classNameBindings: ['justified:nav-justified'],
    attributeBindings: ['style'],
    itemViewClass: Bootstrap.BsPill
  });

  Ember.Handlebars.helper('bs-tabs', Bootstrap.BsTabs);

}).call(this);

/*
A view that displays notification (messages).

Currently a single notification is displayed as an Alert on top of the screen, each notification in a time.
*/


(function() {
  Bootstrap.NotificationsView = Ember.CollectionView.extend({
    classNames: ['notifications'],
    attributeBindings: ['style'],
    contentBinding: 'Bootstrap.NM.content',
    showTime: 2000,
    fadeInTime: 500,
    fadeOutTime: 3000,
    showTimeTimeoutId: null,
    /*
    itemViewClass: Bootstrap.BsAlertComponent.extend(
        messageBinding: 'content.message'
        typeBinding: 'content.type'
        fadeInTimeBinding: 'parentView.fadeInTime'
        isVisible: false
    
        didInsertElement: ->
            @$().fadeIn(@get('fadeInTime'))
    )
    */

    itemViewClass: Ember.View.extend({
      classNames: ['alert', 'notification'],
      template: Ember.Handlebars.compile('{{view.content.message}}'),
      classNameBindings: ["alertType"],
      isVisible: false,
      alertType: (function() {
        return this.get('content').get('classType');
      }).property('content'),
      didInsertElement: function() {
        return this.$().fadeIn(this.get('fadeInTime'));
      }
    }),
    contentChanged: (function() {
      if (this.get('content').length > 0) {
        return this.resetShowTime();
      }
    }).observes('content.length'),
    resetShowTime: function() {
      var _this = this;
      this.$().css({
        display: 'block'
      });
      if (this.$().is(":animated")) {
        this.$().stop().animate({
          opacity: "100"
        });
      }
      if (this.showTimeTimeoutId != null) {
        clearTimeout(this.showTimeTimeoutId);
      }
      return this.showTimeTimeoutId = setTimeout(function() {
        return _this.fadeOut(_this);
      }, this.showTime);
    },
    fadeOut: function(that) {
      return that.$().fadeOut(that.fadeOutTime, function() {
        return that.get('content').clear();
      });
    },
    mouseEnter: function() {
      if (this.$().is(":animated")) {
        return this.$().stop().animate({
          opacity: "100"
        });
      }
    },
    mouseLeave: function() {
      return this.resetShowTime();
    }
  });

  Ember.Handlebars.helper('bs-notifications', Bootstrap.NotificationsView);

  Bootstrap.NM = Bootstrap.NotificationManager = Ember.Object.create({
    content: Ember.A(),
    push: function(message, type) {
      var notif;
      type = type != null ? type : type = 'info';
      notif = Bootstrap.Notification.create({
        message: message,
        type: type
      });
      return this.get('content').pushObject(notif);
    }
  });

  /*
  This object represents a notification to be displayed.
  Notification(s) are added into the NotificationQueue by the pushNotification function.
  */


  Bootstrap.Notification = Ember.Object.extend({
    classType: (function() {
      if (this.type != null) {
        return "alert-" + this.type;
      } else {
        return null;
      }
    }).property('type').cacheable()
  });

}).call(this);

(function() {
  var popoverTemplate, template, tooltipTemplate;

  popoverTemplate = '' + '<div class="arrow"></div>' + '{{#if title}}<h3 class="popover-title">{{title}}</h3>{{/if}}' + '<div class="popover-content">' + '{{#if template}}' + '   {{partial partialTemplateName}}' + '{{else}}' + '   {{#if content}}' + '       {{#if html}}' + '           {{{content}}}' + '       {{else}}' + '           {{content}}' + '       {{/if}}' + '   {{else}}' + '       {{yield}}' + '   {{/if}}' + '{{/if}}' + '    </div>';

  Ember.TEMPLATES["components/bs-popover"] = Ember.Handlebars.compile(popoverTemplate);

  tooltipTemplate = '' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner">' + '{{#if html}}' + '   {{{content}}}' + '{{else}}' + '   {{content}}' + '{{/if}}' + '</div>';

  Ember.TEMPLATES["components/bs-tooltip"] = Ember.Handlebars.compile(tooltipTemplate);

  Bootstrap.BsPopoverComponent = Ember.Component.extend({
    layoutName: 'components/bs-popover',
    classNames: "popover",
    classNameBindings: ["fade", "in", "top", "left", "right", "bottom"],
    top: (function() {
      return this.get("realPlacement") === "top";
    }).property("realPlacement"),
    left: (function() {
      return this.get("realPlacement") === "left";
    }).property("realPlacement"),
    right: (function() {
      return this.get("realPlacement") === "right";
    }).property("realPlacement"),
    bottom: (function() {
      return this.get("realPlacement") === "bottom";
    }).property("realPlacement"),
    titleBinding: "data.title",
    content: Ember.computed.alias('data.content'),
    html: false,
    delay: 0,
    animation: true,
    fade: (function() {
      return this.get("animation");
    }).property("animation"),
    "in": (function() {
      return this.get("isVisible");
    }).property("isVisible"),
    placement: (function() {
      return this.get("data.placement") || "top";
    }).property("data.placement"),
    $element: null,
    $tip: null,
    inserted: false,
    styleUpdater: (function() {
      var actualHeight, actualWidth, calculatedOffset, placement, pos;
      if (!this.$tip || !this.get("isVisible")) {
        return;
      }
      this.$tip.css({
        top: 0,
        left: 0,
        display: "block"
      }).addClass(this.get("realPlacement"));
      placement = this.get("realPlacement");
      pos = this.getPosition();
      actualWidth = this.$tip[0].offsetWidth;
      actualHeight = this.$tip[0].offsetHeight;
      calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
      this.$tip.css("top", calculatedOffset.top);
      this.$tip.css("left", calculatedOffset.left);
      if (this.firstTime) {
        this.firstTime = false;
        this.styleUpdater();
        return this.firstTime = true;
      }
    }).observes("content", "realPlacement", "inserted", "isVisible"),
    init: function() {
      var name, tpl;
      this._super();
      this.set("html", this.get("data.html") || false);
      this.set("template", this.get("data.template") !== undefined);
      if (this.get("template")) {
        name = "components/bs-popover/_partial-content-" + this.get("tip_id");
        tpl = this.get("data.template");
        if (typeof tpl === "function") {
          Ember.TEMPLATES[name] = tpl;
        } else {
          Ember.TEMPLATES[name] = Ember.Handlebars.compile(tpl);
        }
        return this.set("partialTemplateName", name);
      }
    },
    didInsertElement: function() {
      var name,
        _this = this;
      this.$tip = this.$();
      name = Bootstrap.TooltipBoxManager.attribute;
      name = "[" + name + "='" + this.get("tip_id") + "']";
      this.$element = $(name);
      this.set("inserted", true);
      if (this.get("data.trigger") === "hover" && this.get("data.sticky")) {
        this.$().on("mouseenter", function() {
          return clearTimeout(Bootstrap.TooltipBoxManager.timeout);
        });
      }
      this.$().on("mouseleave", function() {
        return Bootstrap.TooltipBoxManager.removeTip(_this.get("tip_id"));
      });
      return this.$().find("img").load(function() {
        return _this.afterRender();
      });
    },
    afterRender: function() {
      return this.notifyPropertyChange("content");
    },
    realPlacement: (function() {
      var $parent, actualHeight, actualWidth, autoPlace, autoToken, docScroll, orgPlacement, parentHeight, parentLeft, parentWidth, placement, pos;
      if (!this.$tip) {
        return null;
      }
      placement = this.get("placement") || "";
      autoToken = /\s?auto?\s?/i;
      autoPlace = autoToken.test(placement);
      if (autoPlace) {
        placement = placement.replace(autoToken, "") || "top";
      }
      pos = this.getPosition();
      actualWidth = this.$tip[0].offsetWidth;
      actualHeight = this.$tip[0].offsetHeight;
      if (autoPlace) {
        $parent = this.$element.parent();
        orgPlacement = placement;
        docScroll = document.documentElement.scrollTop || document.body.scrollTop;
        parentWidth = window.innerWidth;
        parentHeight = window.innerHeight;
        parentLeft = 0;
        placement = (placement === "bottom" && pos.top + pos.height + actualHeight - docScroll > parentHeight ? "top" : (placement === "top" && pos.top - docScroll - actualHeight < 0 ? "bottom" : (placement === "right" && pos.right + actualWidth > parentWidth ? "left" : (placement === "left" && pos.left - actualWidth < parentLeft ? "right" : placement))));
      }
      return placement;
    }).property("placement", "inserted"),
    hasContent: function() {
      return this.get("title");
    },
    getPosition: function() {
      var el;
      el = this.$element[0];
      return $.extend({}, (typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : {
        width: el.offsetWidth,
        height: el.offsetHeight
      }), this.$element.offset());
    },
    getCalculatedOffset: function(placement, pos, actualWidth, actualHeight) {
      if (placement === "bottom") {
        return {
          top: pos.top + pos.height,
          left: pos.left + pos.width / 2 - actualWidth / 2
        };
      } else if (placement === "top") {
        return {
          top: pos.top - actualHeight,
          left: pos.left + pos.width / 2 - actualWidth / 2
        };
      } else if (placement === "left") {
        return {
          top: pos.top + pos.height / 2 - actualHeight / 2,
          left: pos.left - actualWidth
        };
      } else {
        return {
          top: pos.top + pos.height / 2 - actualHeight / 2,
          left: pos.left + pos.width
        };
      }
    },
    actions: {
      close: function() {
        return Bootstrap.TooltipBoxManager.removeTip(this.get("tip_id"));
      }
    }
  });

  Ember.Handlebars.helper('bs-popover', Bootstrap.BsPopoverComponent);

  Bootstrap.BsTooltipComponent = Bootstrap.BsPopoverComponent.extend({
    classNames: "tooltip",
    layoutName: 'components/bs-tooltip',
    init: function() {
      this._super();
      this.classNames.removeObject("popover");
      return this.set("content", this.get("content") || this.get("title"));
    }
  });

  Ember.Handlebars.helper('bs-tooltip', Bootstrap.BsTooltipComponent);

  /*
  The tooltipBox controller is used to render the popovers into the named outlet "bs-tooltip-box"
  with the template tooltip-box
  */


  Bootstrap.TooltipBoxController = Ember.Controller.extend({
    popoversBinding: "Bootstrap.TooltipBoxManager.popovers",
    tooltipsBinding: "Bootstrap.TooltipBoxManager.tooltips"
  });

  template = "" + "{{#each pop in popovers}}" + "   {{bs-popover" + "       tip_id=pop.tip_id" + "       data=pop.data" + "   }}" + "{{/each}}" + "{{#each pop in tooltips}}" + "   {{bs-tooltip" + "       tip_id=pop.tip_id" + "       data=pop.data" + "   }}" + "{{/each}}";

  Ember.TEMPLATES["bs-tooltip-box"] = Ember.Handlebars.compile(template);

  /*
  The Manager is based on the code from the emberjs action helper.
  the tooltip/popover helper sets the attribute TooltipBoxManager.attribute (currently: bootstrap-tip-id)
  with an id that will be increased with each tip.
  AfterRender the manager binds a function to each element containing the attribute "bootstrap-tip-id"
  and on "willClearRender" it will be removed
  */


  Bootstrap.TooltipBoxManager = Ember.Object.create({
    uuid: 0,
    attribute: "bootstrap-tip-id",
    willSetup: false,
    registeredTips: {},
    registerTip: function(type, object, options) {
      var id, self;
      id = ++this.uuid;
      self = this;
      this.registeredTips[id] = {
        id: id,
        data: object,
        eventName: object.trigger || (type === "popover" ? "click" : "hover"),
        bound: false,
        type: type,
        sticky: object.sticky,
        show: function() {
          self.showTip(id);
        },
        hide: function() {
          self.hideTip(id, true);
        },
        toggle: function() {
          self.toggleTip(id);
        }
      };
      if (!this.willSetup) {
        this.willSetup = true;
        Ember.run.scheduleOnce("afterRender", this, function() {
          self.setupBindings();
        });
      }
      options.data.view.on("willClearRender", function() {
        Bootstrap.TooltipBoxManager.removeTip(id);
        $("[" + self.attribute + "='" + id + "']").unbind();
        delete Bootstrap.TooltipBoxManager.registeredTips[id];
      });
      return id;
    },
    setupBindings: function() {
      var elem, i, pop;
      for (i in this.registeredTips) {
        pop = this.registeredTips[i];
        if (pop.bound === false) {
          pop.bound = true;
          elem = $("[" + this.attribute + "='" + i + "']");
          switch (pop.eventName) {
            case "click":
              elem.on("click", $.proxy(pop.toggle, pop));
              break;
            case "hover":
              elem.on("mouseenter", $.proxy(pop.show, pop));
              elem.on("mouseleave", $.proxy(pop.hide, pop));
              break;
            case "focus":
              elem.on("focusin", $.proxy(pop.show, pop));
              elem.on("focusout", $.proxy(pop.hide, pop));
              break;
            case "manual":
              pop.data.addObserver("show", pop, function(sender, key) {
                var value;
                value = sender.get(key);
                if (value) {
                  this.show();
                } else {
                  this.hide();
                }
              });
              if (pop.data.show) {
                this.show();
              }
          }
        }
      }
      this.willSetup = false;
    },
    popovers: [],
    tooltips: [],
    showing: {},
    timeout: null,
    showTip: function(id) {
      var data, obj, type;
      data = this.registeredTips[id].data;
      type = this.registeredTips[id].type;
      if (!this.showing[id]) {
        this.showing[id] = true;
        obj = Ember.Object.create({
          data: data,
          tip_id: id
        });
        if (type === "tooltip") {
          this.tooltips.pushObject(obj);
        } else {
          this.popovers.pushObject(obj);
        }
      }
    },
    hideTip: function(id, allowTimer) {
      var data;
      if (this.showing[id]) {
        data = this.registeredTips[id].data;
        if (allowTimer && data.sticky) {
          this.timedRemove(id);
        } else {
          this.removeTip(id);
        }
      }
    },
    toggleTip: function(id) {
      if (this.showing[id]) {
        this.hideTip(id);
      } else {
        this.showTip(id);
      }
    },
    timedRemove: function(id) {
      var self;
      self = this;
      this.timeout = setTimeout(function() {
        self.removeTip(id);
      }, 100);
    },
    removeTip: function(id) {
      var pop;
      pop = this.popovers.findProperty("tip_id", id) || this.tooltips.findProperty("tip_id");
      this.popovers.removeObject(pop);
      this.tooltips.removeObject(pop);
      delete this.showing[id];
    },
    addFromView: function(view, type, object) {
      var id, options;
      if (!view.attributeBindings.contains(Bootstrap.TooltipBoxManager.attribute)) {
        console.warn("TooltipBoxManager.addFromView: You need to add \"TooltipBoxManager.attribute\" to the attributeBindings!");
        return;
      }
      options = {
        data: {
          view: view
        }
      };
      id = Bootstrap.TooltipBoxManager.registerTip(type, object, options);
      view.set(Bootstrap.TooltipBoxManager.attribute, id);
    },
    helper: function(path, object, options) {
      var binding, keyword, name, o, p, type, value;
      if ((typeof path === "string") && path !== "") {
        p = path.split(".");
        keyword = p[0];
        o = options.data.keywords[keyword];
        if (o) {
          p.removeAt(0);
          p.insertAt(0, "this");
          p = p.join(".");
          object = o.get(p);
        } else {
          object = this.get(path);
        }
      }
      if (path instanceof Object) {
        object = Ember.Object.create({});
        for (name in path.hash) {
          value = path.hash[name];
          type = options.hashTypes[name];
          if (type === "STRING") {
            object.set(name, value);
          } else if (type === "ID") {
            p = value.split(".");
            keyword = p[0];
            o = options.data.keywords[keyword];
            if (!o) {
              o = this;
            } else {
              p.removeAt(0);
            }
            if (!object._bindings) {
              object._bindings = o;
            }
            p.insertAt(0, "_bindings");
            p = p.join(".");
            object[name] = "";
            binding = Ember.Binding.from(p).to(name);
            binding.connect(object);
          }
        }
      }
      return object;
    }
  });

  Ember.Handlebars.registerHelper("bs-bind-popover", function(path) {
    var id, object, options;
    options = arguments[arguments.length - 1];
    object = this;
    object = Bootstrap.TooltipBoxManager.helper.call(this, path, object, options);
    id = Bootstrap.TooltipBoxManager.registerTip("popover", object, options);
    return new Ember.Handlebars.SafeString(Bootstrap.TooltipBoxManager.attribute + "='" + id + "'");
  });

  Ember.Handlebars.registerHelper("bs-bind-tooltip", function(path) {
    var id, object, options;
    options = arguments[arguments.length - 1];
    object = this;
    object = Bootstrap.TooltipBoxManager.helper.call(this, path, object, options);
    id = Bootstrap.TooltipBoxManager.registerTip("tooltip", object, options);
    return new Ember.Handlebars.SafeString(Bootstrap.TooltipBoxManager.attribute + "='" + id + "'");
  });

}).call(this);

/*
A Growl-like notifications component.
Originally written by Aaron Haurwitz (http://aaron.haurwitz.com/), licensed under MIT.
*/


(function() {
  Bootstrap.GrowlNotifications = Ember.CollectionView.extend({
    /*
    @property {String[]} The array of concrete class names to put on this view's element
    */

    classNames: ['growl-notifications'],
    /*
    Binding to the GrowlNotificationManager's notifications array
    Each of the array element will be rendered as a notification view (see ItemViewClass)
    */

    contentBinding: 'Bootstrap.GNM.notifications',
    attributeBindings: ['style'],
    showTime: 10000,
    /*
    @property {View} Notification view class
    Determines what view class to render for each item in the content array.
    */

    itemViewClass: Ember.View.extend({
      classNames: ['growl-notification'],
      template: Ember.Handlebars.compile('<span class="icon"><i class="fa {{unbound view.iconType}}"></i></span>\n<a class="close-notification" {{action "close" target="view"}}>\n    <span style="font-size: 15px;"><i class="fa fa-times"></i></span>\n</a>\n<strong>\n    {{view.content.title}}\n</strong>\n<p>\n    {{view.content.sub}}\n</p>'),
      classNameBindings: [":growl-notification", "content.closed", "isOpaque"],
      attributeBindings: ['style'],
      /*
      @property {Number} Will be set by `didInsertElement`, used for clearing the auto-hide timeout.
      */

      timeoutId: null,
      /*
      @property {Boolean} should the view be opaque now?
      Used for fancy fading purposes.
      */

      isOpaque: false,
      /*
      Lifecycle hook - called when view is created.
      */

      init: function() {
        var fn,
          _this = this;
        this._super();
        fn = (function() {
          return _this.notifyPropertyChange("style");
        });
        this.set("_recomputeStyle", fn);
        return $(window).bind("resize", fn);
      },
      /*
      View lifecycle hook - called when the view enters the DOM.
      */

      didInsertElement: function() {
        var _this = this;
        this.set("timeoutId", setTimeout((function() {
          return _this.send("close");
        }), this.get("parentView.showTime")));
        return Ember.run.later(this, (function() {
          return this.set("isOpaque", true);
        }), 1);
      },
      /*
      Lifecycle hook - called right before view is destroyed
      */

      willDestroyElement: function() {
        return $(window).unbind('resize', this.get('_recomputeStyle'));
      },
      style: (function() {
        var column, index, notifications, rightPx, row, topPx, unitHeight, unitWidth, unitsPerColumn, viewportHeight;
        notifications = this.get('parentView.content').rejectProperty('closed', true);
        index = notifications.indexOf(this.get('content'));
        viewportHeight = $(window).height();
        unitHeight = 80;
        unitWidth = 320;
        unitsPerColumn = Math.floor(viewportHeight / unitHeight);
        column = Math.floor(index / unitsPerColumn);
        row = index % unitsPerColumn;
        if (index === -1) {
          return '';
        }
        topPx = row * unitHeight;
        rightPx = column * unitWidth;
        return 'top: ' + topPx + 'px; right: ' + rightPx + 'px;';
      }).property('parentView.content.@each.closed'),
      /*
      This is simply computed property for mapping a meaningful type name to a FontAwesome CSS class.
      */

      iconType: (function() {
        var hash, type;
        type = this.get('content.type');
        hash = {
          'info': 'fa-bullhorn',
          'success': 'fa-check',
          'warning': 'fa-exclamation',
          'danger': 'fa-times'
        };
        return hash[type] || '';
      }).property('content.type'),
      actions: {
        close: function() {
          var _this = this;
          this.set('isOpaque', false);
          return setTimeout((function() {
            _this.get('parentView.content').removeObject(_this.get('content'));
            return clearTimeout(_this.get("timeoutId"));
          }), 300);
        }
      }
    })
  });

  Ember.Handlebars.helper('bs-growl-notifications', Bootstrap.GrowlNotifications);

  /*
  A manager that is responsible for getting told about new notifications and storing them within an array.
  */


  Bootstrap.GNM = Bootstrap.GrowlNotificationManager = Ember.Object.create({
    /*
    @property {Array} A global array for storing notification objects.
    */

    notifications: Ember.A(),
    /*
    An exposed method for pushing new notification.
    @param title {String} leading text
    @param sub {String} supporting text
    @param type {String} classification; used for which icon to show
    */

    push: function(title, sub, type) {
      var notif;
      type = type != null ? type : type = 'info';
      notif = Bootstrap.Notification.create({
        title: title,
        sub: sub,
        type: type,
        closed: false
      });
      return this.get('notifications').pushObject(notif);
    }
  });

  /*
  An object that represents a notification to be displayed.
  */


  Bootstrap.GrowlNotification = Ember.Object.extend();

}).call(this);

/*
Modal component.
*/


(function() {
  Bootstrap.BsModalComponent = Ember.Component.extend(Ember.Evented, {
    layoutName: 'components/bs-modal',
    classNames: ['modal'],
    attributeBindings: ['role', 'aria-labelledby', 'isAriaHidden:aria-hidden', "ariaLabelledBy:aria-labelledby"],
    isAriaHidden: (function() {
      return "" + (this.get('isVisible'));
    }).property('isVisible'),
    modalBackdrop: '<div class="modal-backdrop fade in"></div>',
    role: 'dialog',
    footerViews: [],
    backdrop: true,
    title: null,
    isVisible: false,
    manual: false,
    didInsertElement: function() {
      var name;
      this._super();
      this.setupBinders();
      name = this.get('name');
      Ember.assert("Modal name is required for modal view " + (this.get('elementId')), this.get('name'));
      if (name == null) {
        name = this.get('elementId');
      }
      Bootstrap.ModalManager.add(name, this);
      if (this.manual) {
        return this.show();
      }
    },
    becameVisible: function() {
      if (this.get("backdrop")) {
        return this.appendBackdrop();
      }
    },
    becameHidden: function() {
      if (this._backdrop) {
        return this._backdrop.remove();
      }
    },
    appendBackdrop: function() {
      var parentElement;
      parentElement = this.$().parent();
      return this._backdrop = Em.$(this.modalBackdrop).appendTo(parentElement);
    },
    show: function() {
      return this.set('isVisible', true);
    },
    hide: function() {
      return this.set('isVisible', false);
    },
    toggle: function() {
      return this.toggleProperty('isVisible');
    },
    click: function(event) {
      var target, targetDismiss;
      target = event.target;
      targetDismiss = target.getAttribute("data-dismiss");
      if (targetDismiss === 'modal') {
        return this.close();
      }
    },
    keyPressed: function(event) {
      if (event.keyCode === 27) {
        return this.close(event);
      }
    },
    close: function(event) {
      this.hide();
      this.sendAction('closed');
      if (this.get('manual')) {
        return this.destroy();
      }
    },
    willDestroyElement: function() {
      var name;
      this.removeHandlers();
      name = this.get('name');
      if (name == null) {
        name = this.get('elementId');
      }
      Bootstrap.ModalManager.remove(name, this);
      if (this._backdrop) {
        return this._backdrop.remove();
      }
    },
    removeHandlers: function() {
      return jQuery(window.document).unbind("keyup", this._keyUpHandler);
    },
    setupBinders: function() {
      var handler,
        _this = this;
      handler = function(event) {
        return _this.keyPressed(event);
      };
      jQuery(window.document).bind("keyup", handler);
      return this._keyUpHandler = handler;
    }
  });

  /*
  Bootstrap.BsModalComponent = Bootstrap.BsModalComponent.reopenClass(
      build: (options) ->
          options = {}  unless options
          options.manual = true
          modalPane = @create(options)
          modalPane.append()
  )
  */


  Bootstrap.ModalManager = Ember.Object.create({
    add: function(name, modalInstance) {
      return this.set(name, modalInstance);
    },
    register: function(name, modalInstance) {
      this.add(name, modalInstance);
      return modalInstance.appendTo(modalInstance.get('targetObject').namespace.rootElement);
    },
    remove: function(name) {
      return this.set(name, null);
    },
    close: function(name) {
      return this.get(name).close();
    },
    hide: function(name) {
      return this.get(name).hide();
    },
    show: function(name) {
      return this.get(name).show();
    },
    toggle: function(name) {
      return this.get(name).toggle();
    },
    confirm: function(controller, title, message, confirmButtonTitle, cancelButtonTitle) {
      var body, buttons;
      if (confirmButtonTitle == null) {
        confirmButtonTitle = "Confirm";
      }
      if (cancelButtonTitle == null) {
        cancelButtonTitle = "Cancel";
      }
      body = Ember.View.extend({
        template: Ember.Handlebars.compile(message || "Are you sure you would like to perform this action?")
      });
      buttons = [
        Ember.Object.create({
          title: confirmButtonTitle,
          clicked: "modalConfirmed",
          dismiss: 'modal'
        }), Ember.Object.create({
          title: cancelButtonTitle,
          clicked: "modalCanceled",
          dismiss: 'modal'
        })
      ];
      return this.open('confirm-modal', title || 'Confirmation required!', body, buttons, controller);
    },
    openModal: function(modalView, options) {
      var instance, rootElement;
      if (options == null) {
        options = {};
      }
      rootElement = options.rootElement || '.ember-application';
      instance = modalView.create(options);
      return instance.appendTo(rootElement);
    },
    open: function(name, title, view, footerButtons, controller) {
      var cl, modalComponent, template;
      cl = controller.container.lookup('component-lookup:main');
      modalComponent = cl.lookupFactory('bs-modal', controller.get('container')).create();
      modalComponent.setProperties({
        name: name,
        title: title,
        manual: true,
        footerButtons: footerButtons,
        targetObject: controller
      });
      if (Ember.typeOf(view) === 'string') {
        template = controller.container.lookup("template:" + view);
        Ember.assert("Template " + view + " was specified for Modal but template could not be found.", template);
        if (template) {
          modalComponent.setProperties({
            body: Ember.View.extend({
              template: template,
              controller: controller
            })
          });
        }
      } else if (Ember.typeOf(view) === 'class') {
        modalComponent.setProperties({
          body: view,
          controller: controller
        });
      }
      return modalComponent.appendTo(controller.namespace.rootElement);
    }
  });

  Ember.Application.initializer({
    name: 'bs-modal',
    initialize: function(container, application) {
      container.register('component:bs-modal', Bootstrap.BsModalComponent);
      return container.register('component:bu-modal', Bootstrap.BsModalComponent);
    }
  });

}).call(this);

this["Ember"] = this["Ember"] || {};
this["Ember"]["TEMPLATES"] = this["Ember"]["TEMPLATES"] || {};

this["Ember"]["TEMPLATES"]["components/bs-modal"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n                    <i ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("titleIconClasses")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("></i>\n                ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n                ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.body", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n                ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            ");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n                ");
  hashContexts = {'content': depth0,'targetObjectBinding': depth0};
  hashTypes = {'content': "ID",'targetObjectBinding': "STRING"};
  options = {hash:{
    'content': (""),
    'targetObjectBinding': ("view.targetObject")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bs-button'] || depth0['bs-button']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bs-button", options))));
  data.buffer.push("\n            ");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n                ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            ");
  return buffer;
  }

  data.buffer.push("<div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n        <div class=\"modal-header\">\n            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n            <h4 class=\"modal-title\">\n                ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "titleIconClasses", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  hashContexts = {'unescaped': depth0};
  hashTypes = {'unescaped': "STRING"};
  stack1 = helpers._triageMustache.call(depth0, "title", {hash:{
    'unescaped': ("true")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </h4>\n        </div>\n        <div class=\"modal-body\">\n            ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "body", {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n        <div class=\"modal-footer\">\n            ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "footerButtons", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "footerViews", {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n    </div>\n</div>");
  return buffer;
  
});
(function() {
  Bootstrap.ItemsActionBar = Ember.CollectionView.extend({
    classNames: 'btn-toolbar',
    classNameBindings: 'rtl:pull-right',
    role: 'toolbar',
    selectedItems: [],
    rtl: false,
    selection: (function() {
      var items;
      items = this.get('selectedItems');
      if (items == null) {
        return [];
      }
      if (Array.isArray(items)) {
        return items;
      } else {
        return [items];
      }
    }).property('selectedItems'),
    itemViewClass: Ember.CollectionView.extend({
      tagName: ['div'],
      classNames: ['btn-group'],
      itemViewClass: Ember.View.extend({
        tagName: 'button',
        classNames: ['btn', 'btn-default'],
        attributeBindings: ['disabled'],
        template: Ember.Handlebars.compile("                {{#if view.content.transitionTo}}                    {{link-to view.content.title view.content.transitionTo tagName='div'}}                {{else}}                    {{view.content.title}}                {{/if}}            "),
        disabled: (function() {
          var _base;
          return typeof (_base = this.get('content.disabled')) === "function" ? _base(this.get('parentView.parentView.selection')) : void 0;
        }).property('parentView.parentView.selection.@each', 'parentView.parentView.selection'),
        click: function() {
          if (this.get('content.clickActionName') != null) {
            return this.get('controller').send(this.get('content.clickActionName'), this.get('parentView.parentView.selection'));
          } else if (this.get('content.click')) {
            return this.get('content.click')(this.get('parentView.parentView.selection'));
          }
        }
      })
    })
  });

  Ember.Handlebars.helper('bs-items-action-bar', Bootstrap.ItemsActionBar);

}).call(this);

(function() {
  Bootstrap.BsWizardStep = Bootstrap.ItemView.extend(Bootstrap.ItemSelection, Bootstrap.NavItem, {
    classNames: ['wizard-step'],
    classNameBindings: ['completed'],
    completed: false,
    template: Ember.Handlebars.compile(['{{view view.stepAsLink}}'].join("\n")),
    stepAsLink: Ember.View.extend({
      tagName: 'a',
      template: Ember.Handlebars.compile('{{view.parentView.title}}'),
      attributeBindings: ['href'],
      href: "#"
    })
  });

  Bootstrap.BsWizardSteps = Bootstrap.ItemsView.extend(Bootstrap.Nav, {
    navType: 'pills',
    classNames: ['wizard-steps'],
    itemViewClass: Bootstrap.BsWizardStep,
    currentItemIdx: (function() {
      var i, selected, selectedItem, view, _i, _len, _ref;
      selected = this.get('selected');
      i = 0;
      _ref = this._childViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.get('content') === selected) {
          selectedItem = view;
          break;
        }
        i++;
      }
      if (selectedItem) {
        return i;
      } else {
        return null;
      }
    }).property('selected')
  });

  Bootstrap.BsWizardStepPane = Bootstrap.ItemPaneView.extend();

  Bootstrap.BsWizardStepsPanes = Bootstrap.ItemsPanesView.extend({
    classNames: ['wizard-panes'],
    itemViewClass: Bootstrap.BsWizardStepPane
  });

  Bootstrap.BsWizardComponent = Ember.ContainerView.extend(Ember.TargetActionSupport, {
    classNames: ['wizard'],
    childViews: ['steps', 'panes', 'controls'],
    prevAllowed: true,
    items: (function() {
      var _ref;
      return (_ref = this._childViews) != null ? _ref[0] : void 0;
    }).property('content'),
    panes: (function() {
      return this._childViews[1];
    }).property('content'),
    steps: Bootstrap.BsWizardSteps.extend({
      contentBinding: 'parentView.content',
      selectedBinding: 'parentView.selected'
    }),
    panes: Bootstrap.BsWizardStepsPanes.extend({
      contentBinding: 'parentView.content'
    }),
    controls: Ember.ContainerView.extend({
      childViews: ['prev', 'next', 'finish'],
      prev: Bootstrap.BsButtonComponent.extend({
        layoutName: 'components/bs-button',
        title: 'Prev',
        size: 'xs',
        "data-rel": 'PREV',
        isVisible: (function() {
          return this.get('parentView').get('parentView').get('hasPrev');
        }).property('parentView.parentView.items.selected')
      }),
      next: Bootstrap.BsButtonComponent.extend({
        layoutName: 'components/bs-button',
        title: 'Next',
        size: 'xs',
        "data-rel": 'NEXT',
        isVisible: (function() {
          return this.get('parentView').get('parentView').get('hasNext');
        }).property('parentView.parentView.items.selected')
      }),
      finish: Bootstrap.BsButtonComponent.extend({
        layoutName: 'components/bs-button',
        title: 'Finish',
        size: 'xs',
        "data-rel": 'FINISH',
        isVisible: (function() {
          return this.get('parentView').get('parentView').get('isLast');
        }).property('parentView.parentView.items.selected')
      })
    }),
    currentStepIdx: (function() {
      return this.get('items').get('currentItemIdx');
    }).property('items.selected'),
    willInsertElement: function() {
      this.get('panes').set('items-id', this.get('items').get('elementId'));
      return this.get('items').set('default', this.get('items')._childViews[0].get('content').get('title'));
    },
    click: function(event) {
      var b;
      b = event.target.getAttribute("data-rel");
      if (b === 'PREV') {
        this.prev();
      }
      if (b === 'NEXT') {
        this.next();
      }
      if (b === 'FINISH') {
        return this.close();
      }
    },
    next: function() {
      var currIdx;
      if (this.get('hasNext')) {
        this.stepCompleted(this.get('currentStepIdx'));
        currIdx = this.get('currentStepIdx') + 1;
        this.move(currIdx);
        return this.triggerAction({
          action: 'onNext',
          actionContext: this.get('targetObject')
        });
      }
    },
    prev: function() {
      var currIdx;
      if (this.get('hasPrev')) {
        currIdx = this.get('currentStepIdx') - 1;
        this.stepCompleted(currIdx, false);
        this.move(currIdx);
        return this.triggerAction({
          action: 'onPrev',
          actionContext: this.get('targetObject')
        });
      }
    },
    move: function(idx) {
      var _ref, _ref1;
      return (_ref = this._childViews[0]) != null ? _ref.set('selected', (_ref1 = this._childViews[0]._childViews[idx]) != null ? _ref1.get('content') : void 0) : void 0;
    },
    hasNext: (function() {
      return this.get('items')._childViews.length > this.get('currentStepIdx') + 1;
    }).property('currentStepIdx'),
    hasPrev: (function() {
      this.get('currentStepIdx') > 0;
      return this.get('currentStepIdx') > 0 && this.get('prevAllowed');
    }).property('currentStepIdx'),
    isLast: (function() {
      return this.get('items')._childViews.length === this.get('currentStepIdx') + 1;
    }).property('currentStepIdx'),
    close: (function() {
      this.triggerAction({
        action: 'onFinish',
        actionContext: this.get('targetObject')
      });
      return this.destroy();
    }),
    stepCompleted: function(idx, compl) {
      if (compl == null) {
        compl = true;
      }
      return this._childViews[0]._childViews[idx].set('completed', compl);
    }
  });

  Bootstrap.BsWizardComponent = Bootstrap.BsWizardComponent.reopenClass({
    build: function(options) {
      var wizard;
      if (!options) {
        options = {};
      }
      options.manual = true;
      wizard = this.create(options);
      return wizard.append();
    }
  });

  Ember.Handlebars.helper('bs-wizard', Bootstrap.BsWizardComponent);

}).call(this);

(function() {
  Bootstrap.BsListGroupComponent = Bootstrap.ItemsView.extend({
    tagName: 'ul',
    classNames: ['list-group'],
    itemViewClass: Bootstrap.ItemView.extend(Bootstrap.ItemSelection, {
      classNames: ['list-group-item'],
      template: Ember.Handlebars.compile('{{#if view.badge}}\n    {{bs-badge contentBinding="view.badge"}}\n{{/if}}\n{{#if view.sub}}\n    <h4 class="list-group-item-heading">{{view.title}}</h4>\n    <p class="list-group-item-text">{{view.sub}}</p>\n{{else}}\n    {{view.title}}\n{{/if}}'),
      badge: (function() {
        var content;
        content = this.get('content');
        if (!(Ember.typeOf(content) === 'instance' || Ember.canInvoke(content, 'get'))) {
          return null;
        }
        return content.get('badge');
      }).property('content'),
      sub: (function() {
        var content;
        content = this.get('content');
        if (!(Ember.typeOf(content) === 'instance' || Ember.canInvoke(content, 'get'))) {
          return null;
        }
        return content.get('sub');
      }).property('content')
    })
  });

  Ember.Handlebars.helper('bs-list-group', Bootstrap.BsListGroupComponent);

}).call(this);
