(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
typeof define === 'function' && define.amd ? define(factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GraphVisualization = factory());
})(this, (function () { 'use strict';

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var exponent = 3;

((function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;

  return polyIn;
}))(exponent);

((function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
}))(exponent);

((function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
}))(exponent);

// tpmt is two power minus ten times t scaled to [0,1]
function tpmt(x) {
  return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
}

var overshoot = 1.70158;

((function custom(s) {
  s = +s;

  function backIn(t) {
    return (t = +t) * t * (s * (t - 1) + t);
  }

  backIn.overshoot = custom;

  return backIn;
}))(overshoot);

((function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((t + 1) * s + t) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
}))(overshoot);

((function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
}))(overshoot);

var tau = 2 * Math.PI,
    amplitude = 1,
    period = 0.3;

((function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticIn(t) {
    return a * tpmt(-(--t)) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function(a) { return custom(a, p * tau); };
  elasticIn.period = function(p) { return custom(a, p); };

  return elasticIn;
}))(amplitude, period);

((function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticOut(t) {
    return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function(a) { return custom(a, p * tau); };
  elasticOut.period = function(p) { return custom(a, p); };

  return elasticOut;
}))(amplitude, period);

((function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0
        ? a * tpmt(-t) * Math.sin((s - t) / p)
        : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
  elasticInOut.period = function(p) { return custom(a, p); };

  return elasticInOut;
}))(amplitude, period);

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}

function selection_selectAll(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection$1(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

var find$1 = Array.prototype.find;

function childFind(match) {
  return function() {
    return find$1.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

function selection_selectChild(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : childMatcher(match)));
}

var filter = Array.prototype.filter;

function children() {
  return Array.from(this.children);
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

function selection_selectChildren(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$4(x) {
  return function() {
    return x;
  };
}

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

function selection_data(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$4(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
  return typeof data === "object" && "length" in data
    ? data // Array, TypedArray, NodeList, array-like
    : Array.from(data); // Map, Set, iterable, string, or anything else
}

function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(context) {
  var selection = context.selection ? context.selection() : context;

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection$1(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection$1(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  return Array.from(this);
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction$1(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS$1(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction$1(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove$1 : typeof value === "function"
            ? styleFunction$1
            : styleConstant$1)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction$1
          : textConstant$1)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, options) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

var root = [null];

function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection$1([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};

function d3Select(selector) {
  return typeof selector === "string"
      ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
      : new Selection$1([[selector]], root);
}

var nextId = 0;

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

var noop$1 = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

// These are typically used in conjunction with noevent to ensure that we can
// preventDefault on the event.
const nonpassive = {passive: false};
const nonpassivecapture = {capture: true, passive: false};

function nopropagation$1(event) {
  event.stopImmediatePropagation();
}

function noevent$1(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function dragDisable(view) {
  var root = view.document.documentElement,
      selection = d3Select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent$1, nonpassivecapture);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = d3Select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent$1, nonpassivecapture);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

var constant$3 = x => () => x;

function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x, y, dx, dy,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    subject: {value: subject, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    identifier: {value: identifier, enumerable: true, configurable: true},
    active: {value: active, enumerable: true, configurable: true},
    x: {value: x, enumerable: true, configurable: true},
    y: {value: y, enumerable: true, configurable: true},
    dx: {value: dx, enumerable: true, configurable: true},
    dy: {value: dy, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter$1(event) {
  return !event.ctrlKey && !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(event, d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

function defaultTouchable$1() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function d3Drag() {
  var filter = defaultFilter$1,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable$1,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved, nonpassive)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned(event, d) {
    if (touchending || !filter.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    d3Select(event.view)
      .on("mousemove.drag", mousemoved, nonpassivecapture)
      .on("mouseup.drag", mouseupped, nonpassivecapture);
    dragDisable(event.view);
    nopropagation$1(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }

  function mousemoved(event) {
    noevent$1(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }

  function mouseupped(event) {
    d3Select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent$1(event);
    gestures.mouse("end", event);
  }

  function touchstarted(event, d) {
    if (!filter.call(this, event, d)) return;
    var touches = event.changedTouches,
        c = container.call(this, event, d),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation$1(event);
        gesture("start", event, touches[i]);
      }
    }
  }

  function touchmoved(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent$1(event);
        gesture("drag", event, touches[i]);
      }
    }
  }

  function touchended(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation$1(event);
        gesture("end", event, touches[i]);
      }
    }
  }

  function beforestart(that, container, event, d, identifier, touch) {
    var dispatch = listeners.copy(),
        p = pointer(touch || event, container), dx, dy,
        s;

    if ((s = subject.call(that, new DragEvent("beforestart", {
        sourceEvent: event,
        target: drag,
        identifier,
        active,
        x: p[0],
        y: p[1],
        dx: 0,
        dy: 0,
        dispatch
      }), d)) == null) return;

    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;

    return function gesture(type, event, touch) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[identifier] = gesture, n = active++; break;
        case "end": delete gestures[identifier], --active; // falls through
        case "drag": p = pointer(touch || event, container), n = active; break;
      }
      dispatch.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch
        }),
        d
      );
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$3(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$3(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$3(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$3(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
    reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
    reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
    reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
    reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
    reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHex8() {
  return this.rgb().formatHex8();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}

function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}

function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}

function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}

function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}

function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));

function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}

function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

const radians = Math.PI / 180;
const degrees$1 = 180 / Math.PI;

// https://observablehq.com/@mbostock/lab-and-rgb
const K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) return hcl2lab(o);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b) x = z = y; else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab, extend(Color, {
  brighter(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(
      lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
      lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * degrees$1;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

function hcl2lab(o) {
  if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * radians;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}

define(Hcl, hcl, extend(Color, {
  brighter(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * degrees$1 - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix$1(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix$1, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh)),
      this.opacity
    );
  }
}));

var constant$2 = x => () => x;

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$2(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$2(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

var degrees = 180 / Math.PI;

var identity$1 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var svgNode;

/* eslint-disable no-undef */
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}

function parseSvg(value) {
  if (value == null) return identity$1;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

var interpolateZoom = (function zoomRho(rho, rho2, rho4) {

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }

    i.duration = S * 1000 * rho / Math.SQRT2;

    return i;
  }

  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };

  return zoom;
})(Math.SQRT2, 2, 4);

function cubehelix(hue) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = cubehelix$1(start)).h, (end = cubehelix$1(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;

    return cubehelix;
  })(1);
}

cubehelix(hue);
cubehelix(nogamma);

var frame = 0, // is an animation frame pending?
    timeout$1 = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(elapsed => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get(this.node(), id).ease;
}

function easeVarying(id, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error;
    set(this, id).ease = v;
  };
}

function transition_easeVarying(value) {
  if (typeof value !== "function") throw new Error;
  return this.each(easeVarying(this._id, value));
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection = selection.prototype.constructor;

function transition_selection() {
  return new Selection(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction(tweenValue(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });

    // The selection was empty, resolve end immediately
    if (size === 0) resolve();
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id} not found`);
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var constant$1 = x => () => x;

function ZoomEvent(type, {
  sourceEvent,
  target,
  transform,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    transform: {value: transform, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

var identity = new Transform(1, 0, 0);

Transform.prototype;

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}

function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || identity;
}

function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

function d3Zoom() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = interpolateZoom,
      listeners = dispatch("start", "zoom", "end"),
      touchstarting,
      touchfirst,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0,
      tapDistance = 10;

  function zoom(selection) {
    selection
        .property("__zoom", defaultTransform)
        .on("wheel.zoom", wheeled, {passive: false})
        .on("mousedown.zoom", mousedowned)
        .on("dblclick.zoom", dblclicked)
      .filter(touchable)
        .on("touchstart.zoom", touchstarted)
        .on("touchmove.zoom", touchmoved)
        .on("touchend.zoom touchcancel.zoom", touchended)
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments)
          .event(event)
          .start()
          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
          .end();
      });
    }
  };

  zoom.scaleBy = function(selection, k, p, event) {
    zoom.scaleTo(selection, function() {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };

  zoom.scaleTo = function(selection, k, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };

  zoom.translateBy = function(selection, x, y, event) {
    zoom.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };

  zoom.translateTo = function(selection, x, y, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point, event) {
    transition
        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
        .tween("zoom", function() {
          var that = this,
              args = arguments,
              g = gesture(that, args).event(event),
              e = extent.apply(that, args),
              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
              a = that.__zoom,
              b = typeof transform === "function" ? transform.apply(that, args) : transform,
              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
          return function(t) {
            if (t === 1) t = b; // Avoid rounding error on end.
            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
            g.zoom(null, t);
          };
        });
  }

  function gesture(that, args, clean) {
    return (!clean && that.__zooming) || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = d3Select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };

  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = pointer(event);

    // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    }

    // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return;

    // Otherwise, capture the mouse point and location at the start.
    else {
      g.mouse = [p, t.invert(p)];
      interrupt(this);
      g.start();
    }

    noevent(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var currentTarget = event.currentTarget,
        g = gesture(this, args, true).event(event),
        v = d3Select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = pointer(event, currentTarget),
        x0 = event.clientX,
        y0 = event.clientY;

    dragDisable(event.view);
    nopropagation(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();

    function mousemoved(event) {
      noevent(event);
      if (!g.moved) {
        var dx = event.clientX - x0, dy = event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event)
       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped(event) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event.view, g.moved);
      noevent(event);
      g.event(event).end();
    }
  }

  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

    noevent(event);
    if (duration > 0) d3Select(this).transition().duration(duration).call(schedule, t1, p0, event);
    else d3Select(this).call(zoom.transform, t1, p0, event);
  }

  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches,
        n = touches.length,
        g = gesture(this, args, event.changedTouches.length === n).event(event),
        started, i, t, p;

    nopropagation(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
      interrupt(this);
      g.start();
    }
  }

  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t, p, l;

    noevent(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1],
          p1 = g.touch1[0], l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    }
    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t;

    nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (g.taps === 2) {
        t = pointer(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = d3Select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }

  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$1(+_), zoom) : wheelDelta;
  };

  zoom.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), zoom) : filter;
  };

  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$1(!!_), zoom) : touchable;
  };

  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$1([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };

  return zoom;
}

const MAX_PRECOMPUTED_TICKS = 300;
const EXTRA_TICKS_PER_RENDER = 10;
// Friction.
const VELOCITY_DECAY = 0.4;
// Temperature of the simulation. It's a value in the range [0,1] and it
// decreases over time. Can be seen as the probability that a node will move.
const DEFAULT_ALPHA = 1;
// Temperature the simulation tries to converge to.
const DEFAULT_ALPHA_TARGET = 0;
// Temperature at which the simulation is stopped.
const DEFAULT_ALPHA_MIN = 0.05;
// The lower this value, the lower the movement of nodes that aren't being
// dragged. This also affects the perceived elasticity of relationships, a lower
// value will cause neighboring nodes to take more time to follow the node that
// is being dragged.
const DRAGGING_ALPHA = 0.8;
// When dragging we set alphaTarget to a value greater than alphaMin to prevent
// the simulation from stopping.
const DRAGGING_ALPHA_TARGET = 0.09;
const LINK_DISTANCE = 45;
const FORCE_LINK_DISTANCE = (relationship) => relationship.source.radius + relationship.target.radius + LINK_DISTANCE * 2;
const FORCE_COLLIDE_RADIUS = (node) => node.radius + 25;
const FORCE_CHARGE = -400;
const FORCE_CENTER_X = 0.03;
const FORCE_CENTER_Y = 0.03;
const ZOOM_MIN_SCALE = 0.1;
const ZOOM_MAX_SCALE = 2;
const ZOOM_FIT_PADDING_PERCENT = 0.05;

class GraphModel {
    constructor() {
        this.addNodes = this.addNodes.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.updateNode = this.updateNode.bind(this);
        this.removeConnectedRelationships =
            this.removeConnectedRelationships.bind(this);
        this.addRelationships = this.addRelationships.bind(this);
        this.addInternalRelationships = this.addInternalRelationships.bind(this);
        this.pruneInternalRelationships =
            this.pruneInternalRelationships.bind(this);
        this.findNode = this.findNode.bind(this);
        this.findNodeNeighbourIds = this.findNodeNeighbourIds.bind(this);
        this.findRelationship = this.findRelationship.bind(this);
        this.findAllRelationshipToNode = this.findAllRelationshipToNode.bind(this);
        this.nodeMap = {};
        this._nodes = [];
        this.relationshipMap = {};
        this._relationships = [];
    }
    nodes() {
        return this._nodes;
    }
    relationships() {
        return this._relationships;
    }
    groupedRelationships() {
        const groups = {};
        for (const relationship of this._relationships) {
            let nodePair = new NodePair(relationship.source, relationship.target);
            nodePair =
                groups[nodePair.toString()] != null
                    ? groups[nodePair.toString()]
                    : nodePair;
            nodePair.relationships.push(relationship);
            groups[nodePair.toString()] = nodePair;
        }
        return Object.values(groups);
    }
    addNodes(nodes) {
        for (const node of nodes) {
            if (this.findNode(node.id) == null) {
                this.nodeMap[node.id] = node;
                this._nodes.push(node);
            }
        }
    }
    removeNode(node) {
        if (this.findNode(node.id) != null) {
            delete this.nodeMap[node.id];
            this._nodes.splice(this._nodes.indexOf(node), 1);
        }
    }
    updateNode(node) {
        if (this.findNode(node.id) != null) {
            this.removeNode(node);
            this.addNodes([node]);
        }
    }
    removeConnectedRelationships(node) {
        for (const r of Array.from(this.findAllRelationshipToNode(node))) {
            this.updateNode(r.source);
            this.updateNode(r.target);
            this._relationships.splice(this._relationships.indexOf(r), 1);
            delete this.relationshipMap[r.id];
        }
    }
    addRelationships(relationships) {
        for (const relationship of Array.from(relationships)) {
            const existingRelationship = this.findRelationship(relationship.id);
            if (existingRelationship != null) {
                existingRelationship.internal = false;
            }
            else {
                relationship.internal = false;
                this.relationshipMap[relationship.id] = relationship;
                this._relationships.push(relationship);
            }
        }
    }
    addInternalRelationships(relationships) {
        for (const relationship of Array.from(relationships)) {
            relationship.internal = true;
            if (this.findRelationship(relationship.id) == null) {
                this.relationshipMap[relationship.id] = relationship;
                this._relationships.push(relationship);
            }
        }
    }
    pruneInternalRelationships() {
        const relationships = this._relationships.filter((relationship) => !relationship.internal);
        this.relationshipMap = {};
        this._relationships = [];
        this.addRelationships(relationships);
    }
    findNode(id) {
        return this.nodeMap[id];
    }
    findNodeNeighbourIds(id) {
        return this._relationships
            .filter((relationship) => relationship.source.id === id || relationship.target.id === id)
            .map((relationship) => {
            if (relationship.target.id === id) {
                return relationship.source.id;
            }
            return relationship.target.id;
        });
    }
    findRelationship(id) {
        return this.relationshipMap[id];
    }
    findAllRelationshipToNode(node) {
        return this._relationships.filter((relationship) => relationship.source.id === node.id ||
            relationship.target.id === node.id);
    }
    getSelectedNode() {
        return this._nodes.filter((item) => item.selected);
    }
    getSelectedRelationship() {
        return this._relationships.filter((item) => item.selected);
    }
    resetGraph() {
        this.nodeMap = {};
        this._nodes = [];
        this.relationshipMap = {};
        this._relationships = [];
    }
}
class NodePair {
    constructor(node1, node2) {
        this.relationships = [];
        if (node1.id < node2.id) {
            this.nodeA = node1;
            this.nodeB = node2;
        }
        else {
            this.nodeA = node2;
            this.nodeB = node1;
        }
    }
    isLoop() {
        return this.nodeA === this.nodeB;
    }
    toString() {
        return `${this.nodeA.id}:${this.nodeB.id}`;
    }
}

class NodeModel {
    constructor(id, labels, properties, propertyTypes) {
        this.isNode = true;
        this.isRelationship = false;
        this.fx = null;
        this.fy = null;
        this.id = id;
        this.labels = labels;
        this.propertyMap = properties;
        this.propertyList = Object.keys(properties).map((key) => ({
            key,
            type: propertyTypes[key],
            value: properties[key],
        }));
        // Initialise visualisation items
        this.radius = 0;
        this.caption = [];
        this.selected = false;
        this.x = 0;
        this.y = 0;
        this.hoverFixed = false;
        this.initialPositionCalculated = false;
        this.degree = 0;
        this.class = [];
    }
    toJSON() {
        return this.propertyMap;
    }
    relationshipCount(graph) {
        return graph
            .relationships()
            .filter((rel) => rel.source === this || rel.target === this).length;
    }
    hasRelationships(graph) {
        return graph
            .relationships()
            .some((rel) => rel.source === this || rel.target === this);
    }
}

class RelationshipModel {
    constructor(id, source, target, type, properties, propertyTypes) {
        this.isNode = false;
        this.isRelationship = true;
        this.id = id;
        this.source = source;
        this.target = target;
        this.type = type;
        this.propertyMap = properties;
        this.propertyList = Object.keys(this.propertyMap || {}).reduce((acc, key) => acc.concat([{ key, type: propertyTypes[key], value: properties[key] }]), []);
        this.selected = false;
        // These values are overriden as part of the initial layouting of the graph
        this.naturalAngle = 0;
        this.caption = '';
        this.captionLength = 0;
        this.captionHeight = 0;
        this.captionLayout = 'internal';
        this.centreDistance = 0;
    }
    toJSON() {
        return this.propertyMap;
    }
    isLoop() {
        return this.source === this.target;
    }
}

const isObject = (val) => val !== null && typeof val === 'object';

const isArray = Array.isArray;
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (val) => typeof val === 'function';
const isNumber = (val) => typeof val === 'number';
const isNaN$1 = (num) => Number.isNaN(Number(num));
const isString = (val) => typeof val === 'string';
function isNullish(x) {
    return x === null || x === undefined;
}
function optionalToString(value) {
    return !isNullish(value) && typeof (value === null || value === void 0 ? void 0 : value.toString) === 'function'
        ? value.toString()
        : value;
}
const selectorStringToArray = (selector) => {
    // Negative lookbehind simulation since js support is very limited.
    // We want to match all . that are not preceded by \\
    // Instead we reverse and look
    // for . that are not followed by \\ (negative lookahead)
    const reverseSelector = selector.split('').reverse().join('');
    const re = /(.+?)(?!\.\\)(?:\.|$)/g;
    const out = [];
    let m;
    while ((m = re.exec(reverseSelector)) !== null) {
        const res = m[1].split('').reverse().join('');
        out.push(res);
    }
    return out
        .filter((r) => r)
        .reverse()
        .map((r) => r.replace(/\\./g, '.'));
};
const selectorArrayToString = (selectors) => {
    const escaped = selectors.map((r) => r.replace(/\./g, '\\.'));
    return escaped.join('.');
};
const getFuncByUnknownType = (defaultValue, value, resultIsNumber = true) => {
    if (!value && value !== 0) {
        return (d) => {
            if (d.size) {
                if (Array.isArray(d.size))
                    return d.size[0] > d.size[1] ? d.size[0] : d.size[1];
                if (isObject(d.size))
                    return d.size.width > d.size.height ? d.size.width : d.size.height;
                return d.size;
            }
            return defaultValue;
        };
    }
    if (isFunction(value)) {
        return value;
    }
    if (isNumber(value)) {
        return () => value;
    }
    if (Array.isArray(value)) {
        return () => {
            if (resultIsNumber) {
                const max = Math.max(...value);
                return isNaN$1(max) ? defaultValue : max;
            }
            return value;
        };
    }
    if (isObject(value)) {
        return () => {
            if (resultIsNumber) {
                const max = Math.max(value.width, value.height);
                return isNaN$1(max) ? defaultValue : max;
            }
            return [value.width, value.height];
        };
    }
    return () => defaultValue;
};
// 获取节点的度
const getDegree = (n, nodeIdxMap, edges) => {
    const degrees = [];
    for (let i = 0; i < n; i++) {
        degrees[i] = {
            in: 0,
            out: 0,
            all: 0,
        };
    }
    if (!edges)
        return degrees;
    edges.forEach((e) => {
        const source = getEdgeTerminal(e, 'source');
        const target = getEdgeTerminal(e, 'target');
        if (source && degrees[nodeIdxMap[source]]) {
            degrees[nodeIdxMap[source]].out += 1;
            degrees[nodeIdxMap[source]].all += 1;
        }
        if (target && degrees[nodeIdxMap[target]]) {
            degrees[nodeIdxMap[target]].in += 1;
            degrees[nodeIdxMap[target]].all += 1;
        }
    });
    return degrees;
};
// 获取边开始节点 结束节点的ID
const getEdgeTerminal = (RelationshipModel, type) => {
    const terminal = RelationshipModel[type];
    return terminal === null || terminal === void 0 ? void 0 : terminal.id;
};

// map graph data
const stringifyValues = (obj) => Object.keys(obj).map((k) => ({
    [k]: obj[k] === null ? 'null' : optionalToString(obj[k]),
}));
const mapProperties = (_) => Object.assign({}, ...stringifyValues(_));
function createGraph(nodes, relationships) {
    const graph = new GraphModel();
    graph.addNodes(mapNodes(nodes));
    graph.addRelationships(mapRelationships(relationships, graph));
    return graph;
}
function mapNodes(nodes) {
    return nodes.map((node) => new NodeModel(node.id, node.labels, mapProperties(node.properties), node.propertyTypes));
}
function mapRelationships(relationships, graph) {
    return relationships.map((rel) => {
        const source = graph.findNode(rel.startNodeId);
        const target = graph.findNode(rel.endNodeId);
        return new RelationshipModel(rel.id, source, target, rel.type, mapProperties(rel.properties), rel.propertyTypes);
    });
}

const square = (l) => l * l;
const intersectWithOtherCircle = function (fixedPoint, radius, xCenter, polarity, homotheticCenter) {
    const gradient = fixedPoint.y / (fixedPoint.x - homotheticCenter);
    const hc = fixedPoint.y - gradient * fixedPoint.x;
    const A = 1 + square(gradient);
    const B = 2 * (gradient * hc - xCenter);
    const C = square(hc) + square(xCenter) - square(radius);
    const x = (-B + polarity * Math.sqrt(square(B) - 4 * A * C)) / (2 * A);
    const intersection = {
        x,
        y: (x - homotheticCenter) * gradient,
    };
    return intersection;
};
class ArcArrow {
    constructor(startRadius, endRadius, endCentre, deflection, arrowWidth, headWidth, headLength, captionLayout) {
        this.deflection = deflection;
        const deflectionRadians = (this.deflection * Math.PI) / 180;
        const startAttach = {
            x: Math.cos(deflectionRadians) * startRadius,
            y: Math.sin(deflectionRadians) * startRadius,
        };
        const radiusRatio = startRadius / (endRadius + headLength);
        const homotheticCenter = (-endCentre * radiusRatio) / (1 - radiusRatio);
        const endAttach = intersectWithOtherCircle(startAttach, endRadius + headLength, endCentre, -1, homotheticCenter);
        const g1 = -startAttach.x / startAttach.y;
        const c1 = startAttach.y + square(startAttach.x) / startAttach.y;
        const g2 = -(endAttach.x - endCentre) / endAttach.y;
        const c2 = endAttach.y + ((endAttach.x - endCentre) * endAttach.x) / endAttach.y;
        const cx = (c1 - c2) / (g2 - g1);
        const cy = g1 * cx + c1;
        const arcRadius = Math.sqrt(square(cx - startAttach.x) + square(cy - startAttach.y));
        const startAngle = Math.atan2(startAttach.x - cx, cy - startAttach.y);
        const endAngle = Math.atan2(endAttach.x - cx, cy - endAttach.y);
        let sweepAngle = endAngle - startAngle;
        if (this.deflection > 0) {
            sweepAngle = 2 * Math.PI - sweepAngle;
        }
        this.shaftLength = sweepAngle * arcRadius;
        if (startAngle > endAngle) {
            this.shaftLength = 0;
        }
        let midShaftAngle = (startAngle + endAngle) / 2;
        if (this.deflection > 0) {
            midShaftAngle += Math.PI;
        }
        this.midShaftPoint = {
            x: cx + arcRadius * Math.sin(midShaftAngle),
            y: cy - arcRadius * Math.cos(midShaftAngle),
        };
        const startTangent = function (dr) {
            const dx = (dr < 0 ? 1 : -1) * Math.sqrt(square(dr) / (1 + square(g1)));
            const dy = g1 * dx;
            return {
                x: startAttach.x + dx,
                y: startAttach.y + dy,
            };
        };
        const endTangent = function (dr) {
            const dx = (dr < 0 ? -1 : 1) * Math.sqrt(square(dr) / (1 + square(g2)));
            const dy = g2 * dx;
            return {
                x: endAttach.x + dx,
                y: endAttach.y + dy,
            };
        };
        const angleTangent = (angle, dr) => ({
            x: cx + (arcRadius + dr) * Math.sin(angle),
            y: cy - (arcRadius + dr) * Math.cos(angle),
        });
        const endNormal = function (dc) {
            const dx = (dc < 0 ? -1 : 1) * Math.sqrt(square(dc) / (1 + square(1 / g2)));
            const dy = dx / g2;
            return {
                x: endAttach.x + dx,
                y: endAttach.y - dy,
            };
        };
        const endOverlayCorner = function (dr, dc) {
            const shoulder = endTangent(dr);
            const arrowTip = endNormal(dc);
            return {
                x: shoulder.x + arrowTip.x - endAttach.x,
                y: shoulder.y + arrowTip.y - endAttach.y,
            };
        };
        const coord = (point) => `${point.x},${point.y}`;
        const shaftRadius = arrowWidth / 2;
        const headRadius = headWidth / 2;
        const positiveSweep = startAttach.y > 0 ? 0 : 1;
        const negativeSweep = startAttach.y < 0 ? 0 : 1;
        this.outline = function (shortCaptionLength) {
            if (startAngle > endAngle) {
                return [
                    'M',
                    coord(endTangent(-headRadius)),
                    'L',
                    coord(endNormal(headLength)),
                    'L',
                    coord(endTangent(headRadius)),
                    'Z',
                ].join(' ');
            }
            if (captionLayout === 'external') {
                let captionSweep = shortCaptionLength / arcRadius;
                if (this.deflection > 0) {
                    captionSweep *= -1;
                }
                const startBreak = midShaftAngle - captionSweep / 2;
                const endBreak = midShaftAngle + captionSweep / 2;
                return [
                    'M',
                    coord(startTangent(shaftRadius)),
                    'L',
                    coord(startTangent(-shaftRadius)),
                    'A',
                    arcRadius - shaftRadius,
                    arcRadius - shaftRadius,
                    0,
                    0,
                    positiveSweep,
                    coord(angleTangent(startBreak, -shaftRadius)),
                    'L',
                    coord(angleTangent(startBreak, shaftRadius)),
                    'A',
                    arcRadius + shaftRadius,
                    arcRadius + shaftRadius,
                    0,
                    0,
                    negativeSweep,
                    coord(startTangent(shaftRadius)),
                    'Z',
                    'M',
                    coord(angleTangent(endBreak, shaftRadius)),
                    'L',
                    coord(angleTangent(endBreak, -shaftRadius)),
                    'A',
                    arcRadius - shaftRadius,
                    arcRadius - shaftRadius,
                    0,
                    0,
                    positiveSweep,
                    coord(endTangent(-shaftRadius)),
                    'L',
                    coord(endTangent(-headRadius)),
                    'L',
                    coord(endNormal(headLength)),
                    'L',
                    coord(endTangent(headRadius)),
                    'L',
                    coord(endTangent(shaftRadius)),
                    'A',
                    arcRadius + shaftRadius,
                    arcRadius + shaftRadius,
                    0,
                    0,
                    negativeSweep,
                    coord(angleTangent(endBreak, shaftRadius)),
                ].join(' ');
            }
            else {
                return [
                    'M',
                    coord(startTangent(shaftRadius)),
                    'L',
                    coord(startTangent(-shaftRadius)),
                    'A',
                    arcRadius - shaftRadius,
                    arcRadius - shaftRadius,
                    0,
                    0,
                    positiveSweep,
                    coord(endTangent(-shaftRadius)),
                    'L',
                    coord(endTangent(-headRadius)),
                    'L',
                    coord(endNormal(headLength)),
                    'L',
                    coord(endTangent(headRadius)),
                    'L',
                    coord(endTangent(shaftRadius)),
                    'A',
                    arcRadius + shaftRadius,
                    arcRadius + shaftRadius,
                    0,
                    0,
                    negativeSweep,
                    coord(startTangent(shaftRadius)),
                ].join(' ');
            }
        };
        this.overlay = function (minWidth) {
            const radius = Math.max(minWidth / 2, shaftRadius);
            return [
                'M',
                coord(startTangent(radius)),
                'L',
                coord(startTangent(-radius)),
                'A',
                arcRadius - radius,
                arcRadius - radius,
                0,
                0,
                positiveSweep,
                coord(endTangent(-radius)),
                'L',
                coord(endOverlayCorner(-radius, headLength)),
                'L',
                coord(endOverlayCorner(radius, headLength)),
                'L',
                coord(endTangent(radius)),
                'A',
                arcRadius + radius,
                arcRadius + radius,
                0,
                0,
                negativeSweep,
                coord(startTangent(radius)),
            ].join(' ');
        };
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `${this.x} ${this.y}`;
    }
}
class LoopArrow {
    constructor(nodeRadius, straightLength, spreadDegrees, shaftWidth, headWidth, headLength, captionHeight) {
        const spread = (spreadDegrees * Math.PI) / 180;
        const r1 = nodeRadius;
        const r2 = nodeRadius + headLength;
        const r3 = nodeRadius + straightLength;
        const loopRadius = r3 * Math.tan(spread / 2);
        const shaftRadius = shaftWidth / 2;
        this.shaftLength = loopRadius * 3 + shaftWidth;
        const normalPoint = function (sweep, radius, displacement) {
            const localLoopRadius = radius * Math.tan(spread / 2);
            const cy = radius / Math.cos(spread / 2);
            return new Point((localLoopRadius + displacement) * Math.sin(sweep), cy + (localLoopRadius + displacement) * Math.cos(sweep));
        };
        this.midShaftPoint = normalPoint(0, r3, shaftRadius + captionHeight / 2 + 2);
        const startPoint = (radius, displacement) => normalPoint((Math.PI + spread) / 2, radius, displacement);
        const endPoint = (radius, displacement) => normalPoint(-(Math.PI + spread) / 2, radius, displacement);
        this.outline = function () {
            const inner = loopRadius - shaftRadius;
            const outer = loopRadius + shaftRadius;
            return [
                'M',
                startPoint(r1, shaftRadius),
                'L',
                startPoint(r3, shaftRadius),
                'A',
                outer,
                outer,
                0,
                1,
                1,
                endPoint(r3, shaftRadius),
                'L',
                endPoint(r2, shaftRadius),
                'L',
                endPoint(r2, -headWidth / 2),
                'L',
                endPoint(r1, 0),
                'L',
                endPoint(r2, headWidth / 2),
                'L',
                endPoint(r2, -shaftRadius),
                'L',
                endPoint(r3, -shaftRadius),
                'A',
                inner,
                inner,
                0,
                1,
                0,
                startPoint(r3, -shaftRadius),
                'L',
                startPoint(r1, -shaftRadius),
                'Z',
            ].join(' ');
        };
        this.overlay = function (minWidth) {
            const displacement = Math.max(minWidth / 2, shaftRadius);
            const inner = loopRadius - displacement;
            const outer = loopRadius + displacement;
            return [
                'M',
                startPoint(r1, displacement),
                'L',
                startPoint(r3, displacement),
                'A',
                outer,
                outer,
                0,
                1,
                1,
                endPoint(r3, displacement),
                'L',
                endPoint(r2, displacement),
                'L',
                endPoint(r2, -displacement),
                'L',
                endPoint(r3, -displacement),
                'A',
                inner,
                inner,
                0,
                1,
                0,
                startPoint(r3, -displacement),
                'L',
                startPoint(r1, -displacement),
                'Z',
            ].join(' ');
        };
    }
}

class StraightArrow {
    constructor(startRadius, endRadius, centreDistance, shaftWidth, headWidth, headHeight, captionLayout) {
        this.deflection = 0;
        this.length = centreDistance - (startRadius + endRadius);
        this.shaftLength = this.length - headHeight;
        const startArrow = startRadius;
        const endShaft = startArrow + this.shaftLength;
        const endArrow = startArrow + this.length;
        const shaftRadius = shaftWidth / 2;
        const headRadius = headWidth / 2;
        this.midShaftPoint = {
            x: startArrow + this.shaftLength / 2,
            y: 0,
        };
        this.outline = function (shortCaptionLength) {
            if (captionLayout === 'external') {
                const startBreak = startArrow + (this.shaftLength - shortCaptionLength) / 2;
                const endBreak = endShaft - (this.shaftLength - shortCaptionLength) / 2;
                return [
                    'M',
                    startArrow,
                    shaftRadius,
                    'L',
                    startBreak,
                    shaftRadius,
                    'L',
                    startBreak,
                    -shaftRadius,
                    'L',
                    startArrow,
                    -shaftRadius,
                    'Z',
                    'M',
                    endBreak,
                    shaftRadius,
                    'L',
                    endShaft,
                    shaftRadius,
                    'L',
                    endShaft,
                    headRadius,
                    'L',
                    endArrow,
                    0,
                    'L',
                    endShaft,
                    -headRadius,
                    'L',
                    endShaft,
                    -shaftRadius,
                    'L',
                    endBreak,
                    -shaftRadius,
                    'Z',
                ].join(' ');
            }
            else {
                return [
                    'M',
                    startArrow,
                    shaftRadius,
                    'L',
                    endShaft,
                    shaftRadius,
                    'L',
                    endShaft,
                    headRadius,
                    'L',
                    endArrow,
                    0,
                    'L',
                    endShaft,
                    -headRadius,
                    'L',
                    endShaft,
                    -shaftRadius,
                    'L',
                    startArrow,
                    -shaftRadius,
                    'Z',
                ].join(' ');
            }
        };
        this.overlay = function (minWidth) {
            const radius = Math.max(minWidth / 2, shaftRadius);
            return [
                'M',
                startArrow,
                radius,
                'L',
                endArrow,
                radius,
                'L',
                endArrow,
                -radius,
                'L',
                startArrow,
                -radius,
                'Z',
            ].join(' ');
        };
    }
}

const measureTextWidthByCanvas = (text, font, context) => {
    context.font = font;
    return context.measureText(text).width;
};
const cacheTextWidth = function () {
    const CATCH_SIZE = 100000;
    const textMeasureMap = {};
    const lruKeyList = [];
    return (key, calculate) => {
        const cached = textMeasureMap[key];
        if (cached) {
            return cached;
        }
        else {
            const result = calculate();
            if (lruKeyList.length > CATCH_SIZE) {
                delete textMeasureMap[lruKeyList.splice(0, 1).toString()];
                lruKeyList.push(key);
            }
            return (textMeasureMap[key] = result);
        }
    };
};
function measureText(text, fontFamily, fontSize, canvas2DContext) {
    const font = `normal normal normal ${fontSize}px/normal ${fontFamily}`;
    return cacheTextWidth()(`[${font}][${text}]`, () => measureTextWidthByCanvas(text, font, canvas2DContext));
}

class PairwiseArcsRelationshipRouting {
    constructor(style) {
        this.style = style;
        this.canvas = document.createElement('canvas');
    }
    measureRelationshipCaption(relationship, caption) {
        const fontFamily = 'sans-serif';
        const padding = parseFloat(this.style.forRelationship(relationship).get('padding'));
        const canvas2DContext = this.canvas.getContext('2d');
        return (measureText(caption, fontFamily, relationship.captionHeight, canvas2DContext) +
            padding * 2);
    }
    captionFitsInsideArrowShaftWidth(relationship) {
        return (parseFloat(this.style.forRelationship(relationship).get('shaft-width')) >
            relationship.captionHeight);
    }
    measureRelationshipCaptions(relationships) {
        relationships.forEach((relationship) => {
            relationship.captionHeight = parseFloat(this.style.forRelationship(relationship).get('font-size'));
            relationship.captionLength = this.measureRelationshipCaption(relationship, relationship.caption);
            relationship.captionLayout =
                this.captionFitsInsideArrowShaftWidth(relationship) &&
                    !relationship.isLoop()
                    ? 'internal'
                    : 'external';
        });
    }
    shortenCaption(relationship, caption, targetWidth) {
        let shortCaption = caption || 'caption';
        while (true) {
            if (shortCaption.length <= 2) {
                return ['', 0];
            }
            shortCaption = `${shortCaption.substr(0, shortCaption.length - 2)}\u2026`;
            const width = this.measureRelationshipCaption(relationship, shortCaption);
            if (width < targetWidth) {
                return [shortCaption, width];
            }
        }
    }
    computeGeometryForNonLoopArrows(nodePairs) {
        const square = (distance) => distance * distance;
        nodePairs.forEach((nodePair) => {
            if (!nodePair.isLoop()) {
                const dx = nodePair.nodeA.x - nodePair.nodeB.x;
                const dy = nodePair.nodeA.y - nodePair.nodeB.y;
                const angle = ((Math.atan2(dy, dx) / Math.PI) * 180 + 360) % 360;
                const centreDistance = Math.sqrt(square(dx) + square(dy));
                nodePair.relationships.forEach((relationship) => {
                    relationship.naturalAngle =
                        relationship.target === nodePair.nodeA
                            ? (angle + 180) % 360
                            : angle;
                    relationship.centreDistance = centreDistance;
                });
            }
        });
    }
    distributeAnglesForLoopArrows(nodePairs, relationships) {
        for (const nodePair of nodePairs) {
            if (nodePair.isLoop()) {
                let angles = [];
                const node = nodePair.nodeA;
                for (const relationship of Array.from(relationships)) {
                    if (!relationship.isLoop()) {
                        if (relationship.source === node) {
                            angles.push(relationship.naturalAngle);
                        }
                        if (relationship.target === node) {
                            angles.push(relationship.naturalAngle + 180);
                        }
                    }
                }
                angles = angles.map((a) => (a + 360) % 360).sort((a, b) => a - b);
                if (angles.length > 0) {
                    let end, start;
                    const biggestGap = {
                        start: 0,
                        end: 0,
                    };
                    for (let i = 0; i < angles.length; i++) {
                        const angle = angles[i];
                        start = angle;
                        end = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1];
                        if (end - start > biggestGap.end - biggestGap.start) {
                            biggestGap.start = start;
                            biggestGap.end = end;
                        }
                    }
                    const separation = (biggestGap.end - biggestGap.start) /
                        (nodePair.relationships.length + 1);
                    for (let i = 0; i < nodePair.relationships.length; i++) {
                        const relationship = nodePair.relationships[i];
                        relationship.naturalAngle =
                            (biggestGap.start + (i + 1) * separation - 90) % 360;
                    }
                }
                else {
                    const separation = 360 / nodePair.relationships.length;
                    for (let i = 0; i < nodePair.relationships.length; i++) {
                        const relationship = nodePair.relationships[i];
                        relationship.naturalAngle = i * separation;
                    }
                }
            }
        }
    }
    layoutRelationships(graph) {
        const nodePairs = graph.groupedRelationships();
        this.computeGeometryForNonLoopArrows(nodePairs);
        this.distributeAnglesForLoopArrows(nodePairs, graph.relationships());
        for (const nodePair of nodePairs) {
            for (const relationship of nodePair.relationships) {
                delete relationship.arrow;
            }
            const middleRelationshipIndex = (nodePair.relationships.length - 1) / 2;
            const defaultDeflectionStep = 30;
            const maximumTotalDeflection = 150;
            const numberOfSteps = nodePair.relationships.length - 1;
            const totalDeflection = defaultDeflectionStep * numberOfSteps;
            const deflectionStep = totalDeflection > maximumTotalDeflection
                ? maximumTotalDeflection / numberOfSteps
                : defaultDeflectionStep;
            for (let i = 0; i < nodePair.relationships.length; i++) {
                const relationship = nodePair.relationships[i];
                const shaftWidth = parseFloat(this.style.forRelationship(relationship).get('shaft-width')) || 2;
                const headWidth = shaftWidth + 6;
                const headHeight = headWidth;
                if (nodePair.isLoop()) {
                    relationship.arrow = new LoopArrow(relationship.source.radius, 40, defaultDeflectionStep, shaftWidth, headWidth, headHeight, relationship.captionHeight);
                }
                else {
                    if (i === middleRelationshipIndex) {
                        relationship.arrow = new StraightArrow(relationship.source.radius, relationship.target.radius, relationship.centreDistance, shaftWidth, headWidth, headHeight, relationship.captionLayout);
                    }
                    else {
                        let deflection = deflectionStep * (i - middleRelationshipIndex);
                        if (nodePair.nodeA !== relationship.source) {
                            deflection *= -1;
                        }
                        relationship.arrow = new ArcArrow(relationship.source.radius, relationship.target.radius, relationship.centreDistance, deflection, shaftWidth, headWidth, headHeight, relationship.captionLayout);
                    }
                }
                [relationship.shortCaption, relationship.shortCaptionLength] =
                    relationship.arrow.shaftLength > relationship.captionLength
                        ? [relationship.caption, relationship.captionLength]
                        : this.shortenCaption(relationship, relationship.caption, relationship.arrow.shaftLength);
            }
        }
    }
}

class GraphGeometryModel {
    constructor(style) {
        this.style = style;
        this.relationshipRouting = new PairwiseArcsRelationshipRouting(this.style);
        this.canvas = document.createElement('canvas');
    }
    formatNodeCaptions(nodes) {
        const canvas2DContext = this.canvas.getContext('2d');
        if (canvas2DContext) {
            nodes.forEach((node) => (node.caption = fitCaptionIntoCircle(node, this.style, canvas2DContext)));
        }
    }
    formatRelationshipCaptions(relationships) {
        relationships.forEach((relationship) => {
            // 会设置当前边的样式
            const template = this.style.forRelationship(relationship).get('caption');
            relationship.caption = this.style.interpolate(template, relationship);
        });
    }
    setNodeRadii(nodes) {
        nodes.forEach((node) => {
            // 会设置当前节点的样式
            if (node.degree) {
                node.radius =
                    (parseFloat(this.style.forNode(node).get('diameter')) / 2) *
                        node.degree;
            }
            else {
                node.radius = parseFloat(this.style.forNode(node).get('diameter')) / 2;
            }
        });
    }
    onGraphChange(graph, options = { updateNodes: true, updateRelationships: true }) {
        if (!!options.updateNodes) {
            this.setNodeRadii(graph.nodes());
            this.formatNodeCaptions(graph.nodes());
        }
        if (!!options.updateRelationships) {
            this.formatRelationshipCaptions(graph.relationships());
            this.relationshipRouting.measureRelationshipCaptions(graph.relationships());
        }
    }
    onTick(graph) {
        this.relationshipRouting.layoutRelationships(graph);
    }
}
const fitCaptionIntoCircle = (node, style, canvas2DContext) => {
    const fontFamily = 'sans-serif';
    const fontSize = parseFloat(style.forNode(node).get('font-size'));
    // Roughly calculate max text length the circle can fit by radius and font size
    const maxCaptionTextLength = Math.floor((Math.pow(node.radius, 2) * Math.PI) / Math.pow(fontSize, 2));
    const template = style.forNode(node).get('caption');
    const nodeText = style.interpolate(template, node);
    const captionText = nodeText.length > maxCaptionTextLength
        ? nodeText.substring(0, maxCaptionTextLength)
        : nodeText;
    const measure = (text) => measureText(text, fontFamily, fontSize, canvas2DContext);
    const whiteSpaceMeasureWidth = measure(' ');
    const words = captionText.split(' ');
    const emptyLine = (lineCount, lineIndex) => {
        // Calculate baseline of the text
        const baseline = (1 + lineIndex - lineCount / 2) * fontSize;
        // The furthest distance between chord (top or bottom of the line) and circle centre
        const chordCentreDistance = lineIndex < lineCount / 2
            ? baseline - fontSize / 2
            : baseline + fontSize / 2;
        const maxLineWidth = Math.sqrt(Math.pow(node.radius, 2) - Math.pow(chordCentreDistance, 2)) *
            2;
        return {
            node,
            text: '',
            baseline,
            remainingWidth: maxLineWidth,
        };
    };
    const addShortenedNextWord = (line, word) => {
        while (word.length > 2) {
            const newWord = `${word.substring(0, word.length - 2)}\u2026`;
            if (measure(newWord) < line.remainingWidth) {
                return `${line.text.split(' ').slice(0, -1).join(' ')} ${newWord}`;
            }
            word = word.substring(0, word.length - 1);
        }
        return `${word}\u2026`;
    };
    const fitOnFixedNumberOfLines = function (lineCount) {
        const lines = [];
        const wordMeasureWidthList = words.map((word) => measure(`${word}`));
        let wordIndex = 0;
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const line = emptyLine(lineCount, lineIndex);
            while (wordIndex < words.length &&
                wordMeasureWidthList[wordIndex] <
                    line.remainingWidth - whiteSpaceMeasureWidth) {
                line.text = `${line.text} ${words[wordIndex]}`;
                line.remainingWidth -=
                    wordMeasureWidthList[wordIndex] + whiteSpaceMeasureWidth;
                wordIndex++;
            }
            lines.push(line);
        }
        if (wordIndex < words.length) {
            lines[lineCount - 1].text = addShortenedNextWord(lines[lineCount - 1], words[wordIndex]);
        }
        return [lines, wordIndex];
    };
    let consumedWords = 0;
    const maxLines = (node.radius * 2) / fontSize;
    let lines = [emptyLine(1, 0)];
    // Typesetting for finding suitable lines to fit words
    for (let lineCount = 1; lineCount <= maxLines; lineCount++) {
        const [candidateLines, candidateWords] = fitOnFixedNumberOfLines(lineCount);
        // If the lines don't have empty line(s), they're probably good fit for the typesetting
        if (!candidateLines.some((line) => !line.text)) {
            lines = candidateLines;
            consumedWords = candidateWords;
        }
        if (consumedWords >= words.length) {
            return lines;
        }
    }
    return lines;
};

// import { shadeColor } from '../utils/wordColorCalculator';
// import { RelationshipModel } from './Relationship';
// 节点 边选择器
class Selector {
    constructor(tag, classes) {
        this.tag = '';
        this.classes = [];
        this.toString = () => {
            return selectorArrayToString([this.tag].concat(this.classes));
        };
        this.tag = tag;
        this.classes = classes !== null && classes !== void 0 ? classes : [];
    }
}
class StyleElement {
    constructor(selector) {
        /**
         * 从当前样式规则里找到对应的选择集样式
         * @param rules
         * @returns
         */
        this.applyRules = (rules) => {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule.matches(this.selector)) {
                    this.props = Object.assign(Object.assign({}, this.props), rule.props);
                    this.props.caption = this.props.caption || this.props.defaultCaption;
                }
            }
            return this;
        };
        this.get = (attr) => {
            return this.props[attr] || '';
        };
        this.selector = selector;
        this.props = {};
    }
}
class StyleRule {
    constructor(selector1, props1) {
        this.matches = (selector) => {
            if (this.selector.tag !== selector.tag) {
                return false;
            }
            for (let i = 0; i < this.selector.classes.length; i++) {
                const selectorClass = this.selector.classes[i];
                if (selectorClass != null &&
                    selector.classes.indexOf(selectorClass) === -1) {
                    return false;
                }
            }
            return true;
        };
        this.matchesExact = (selector) => {
            return (this.matches(selector) &&
                this.selector.classes.length === selector.classes.length);
        };
        this.selector = selector1;
        this.props = props1;
    }
}
// 默认样式
const DEFAULT_STYLE = {
    node: {
        diameter: '50px',
        color: '#A5ABB6',
        'border-color': '#9AA1AC',
        'border-width': '2px',
        'text-color-internal': '#FFFFFF',
        'font-size': '10px',
    },
    relationship: {
        color: '#A5ABB6',
        'shaft-width': '1px',
        'font-size': '8px',
        padding: '3px',
        'text-color-external': '#000000',
        'text-color-internal': '#FFFFFF',
        caption: '<type>',
    },
};
// 默认样式 每个节点不同label不同样式
const DEFAULT_COLORS = [
    {
        color: '#604A0E',
        'border-color': '#423204',
        'text-color-internal': '#FFFFFF',
    },
    {
        color: '#C990C0',
        'border-color': '#b261a5',
        'text-color-internal': '#FFFFFF',
    },
    {
        color: '#F79767',
        'border-color': '#f36924',
        'text-color-internal': '#FFFFFF',
    },
    {
        color: '#57C7E3',
        'border-color': '#23b3d7',
        'text-color-internal': '#2A2C34',
    },
    {
        color: '#F16667',
        'border-color': '#eb2728',
        'text-color-internal': '#FFFFFF',
    },
    {
        color: '#D9C8AE',
        'border-color': '#c0a378',
        'text-color-internal': '#2A2C34',
    },
    {
        color: '#8DCC93',
        'border-color': '#5db665',
        'text-color-internal': '#2A2C34',
    },
    {
        color: '#ECB5C9',
        'border-color': '#da7298',
        'text-color-internal': '#2A2C34',
    },
    {
        color: '#4C8EDA',
        'border-color': '#2870c2',
        'text-color-internal': '#FFFFFF',
    },
    {
        color: '#FFC454',
        'border-color': '#d7a013',
        'text-color-internal': '#2A2C34',
    },
    {
        color: '#DA7194',
        'border-color': '#cc3c6c',
        'text-color-internal': '#FFFFFF',
    },
    {
        color: '#569480',
        'border-color': '#447666',
        'text-color-internal': '#FFFFFF',
    },
];
class GraphStyleModel {
    constructor() {
        this.parseSelector = function (key) {
            const tokens = selectorStringToArray(key);
            return new Selector(tokens[0], tokens.slice(1));
        };
        /**
         *
         * @param node 节点
         * @returns 节点的选择{ tag: node, class: [lables]}
         */
        this.nodeSelector = function (node = {
            labels: null,
            class: [],
        }) {
            const classes = node.labels != null ? [...node.labels, ...node.class] : [...node.class];
            return new Selector('node', classes);
        };
        /**
         * 关系选择其
         * @param rel 关系
         * @returns
         */
        this.relationshipSelector = function (rel = { type: null }) {
            const classes = rel.type != null ? [rel.type] : [];
            return new Selector('relationship', classes);
        };
        /**
         * 根据selector寻找对应的规则 没有返回undefined
         * @param selector
         * @param rules
         * @returns
         */
        this.findRule = function (selector, rules) {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule.matchesExact(selector)) {
                    return rule;
                }
            }
            return undefined;
        };
        /**
         * 根据规则找到可以使用的颜色
         * @param rules
         * @returns
         */
        this.findAvailableDefaultColor = function (rules) {
            const usedColors = rules
                .filter((rule) => {
                return rule.props.color != null;
            })
                .map((rule) => {
                return rule.props.color;
            });
            const index = 
            // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types 'number' a... Remove this comment to see the full error message
            usedColors.length - 1 > DEFAULT_COLORS ? 0 : usedColors.length - 1;
            return DEFAULT_COLORS[index];
        };
        /**
         * 设置默认的节点名称
         * @param item
         * @returns
         */
        this.getDefaultNodeCaption = function (item) {
            if (!item ||
                // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
                !(item.propertyList != null ? item.propertyList.length : 0) > 0) {
                return {
                    defaultCaption: '<id>',
                };
            }
            const captionPrioOrder = [
                /^name$/i,
                /^title$/i,
                /^label$/i,
                /name$/i,
                /description$/i,
                /^.+/,
            ];
            let defaultCaption = captionPrioOrder.reduceRight((leading, current) => {
                const hits = item.propertyList.filter((prop) => current.test(prop.key));
                if (hits.length) {
                    return `{${hits[0].key}}`;
                }
                else {
                    return leading;
                }
            }, '');
            defaultCaption || (defaultCaption = '<id>');
            return {
                caption: defaultCaption,
            };
        };
        /**
         * 计算对应的样式
         * @param selector 选择器
         * @returns
         */
        this.calculateStyle = (selector) => {
            return new StyleElement(selector).applyRules(this.rules);
        };
        /**
         * 设置节点默认样式
         * @param selector 选择器
         * @param item 节点
         */
        this.setDefaultNodeStyle = (selector, item) => {
            let defaultColor = true;
            let defaultCaption = true;
            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];
                if (rule.selector.classes.length > 0 && rule.matches(selector)) {
                    if (rule.props.hasOwnProperty('color')) {
                        defaultColor = false;
                    }
                    if (rule.props.hasOwnProperty('caption')) {
                        defaultCaption = false;
                    }
                }
            }
            const minimalSelector = new Selector(selector.tag, selector.classes.sort().slice(0, 1));
            if (defaultColor) {
                this.changeForSelector(minimalSelector, this.findAvailableDefaultColor(this.rules));
            }
            if (defaultCaption) {
                this.changeForSelector(minimalSelector, this.getDefaultNodeCaption(item));
            }
        };
        /**
         * 根据传入的selector 和 prop样式 为this.rules添加新的规则
         * @param selector 选择器
         * @param props 样式
         * @returns stylerRules新的规则
         */
        this.changeForSelector = (selector, props) => {
            let rule = this.findRule(selector, this.rules);
            if (rule == null) {
                rule = new StyleRule(selector, props);
                this.rules.push(rule);
            }
            rule.props = Object.assign(Object.assign({}, rule.props), props);
            return rule;
        };
        this.changeForSelectorWithNodeClass = (node, props) => {
            const classes = node.labels != null ? [...node.labels] : [];
            const oldSelector = new Selector('node', classes);
            const newSelector = this.nodeSelector(node);
            let rule = this.findRule(oldSelector, this.rules);
            const oldStyle = rule ? rule.props : {};
            rule = new StyleRule(newSelector, Object.assign(Object.assign({}, oldStyle), props));
            this.rules.push(rule);
            rule.props = Object.assign(Object.assign({}, rule.props), props);
            return rule;
        };
        this.changeForSelectorWithRelationClass = (props) => {
            const selector = new Selector('relationship', []);
            const rule = this.findRule(selector, this.rules);
            rule &&
                (rule.props = Object.assign(Object.assign({}, rule === null || rule === void 0 ? void 0 : rule.props), props));
            return rule;
        };
        /**
         * 删除对应的规则
         * @param rule
         */
        this.destroyRule = (rule) => {
            const idx = this.rules.indexOf(rule);
            if (idx != null) {
                this.rules.splice(idx, 1);
            }
        };
        this.importGrass = (string) => {
            try {
                const rules = this.parse(string);
                this.loadRules(rules);
            }
            catch (_error) {
                // e = _error
            }
        };
        this.parse = function (string) {
            const chars = string.split('');
            let insideString = false;
            let insideProps = false;
            let keyword = '';
            let props = '';
            const rules = {};
            for (let i = 0; i < chars.length; i++) {
                const c = chars[i];
                let skipThis = true;
                switch (c) {
                    case '{':
                        if (!insideString) {
                            insideProps = true;
                        }
                        else {
                            skipThis = false;
                        }
                        break;
                    case '}':
                        if (!insideString) {
                            insideProps = false;
                            rules[keyword] = props;
                            keyword = '';
                            props = '';
                        }
                        else {
                            skipThis = false;
                        }
                        break;
                    case "'":
                        // @ts-expect-error ts-migrate(2447) FIXME: The '^=' operator is not allowed for boolean types... Remove this comment to see the full error message
                        insideString ^= true;
                        break;
                    default:
                        skipThis = false;
                }
                if (skipThis) {
                    continue;
                }
                if (insideProps) {
                    props += c;
                }
                else {
                    if (!c.match(/[\s\n]/)) {
                        keyword += c;
                    }
                }
            }
            for (const k in rules) {
                const v = rules[k];
                rules[k] = {};
                v.split(';').forEach((prop) => {
                    const [key, val] = prop.split(':');
                    if (key && val) {
                        rules[k][key.trim()] = val.trim();
                    }
                });
            }
            return rules;
        };
        this.resetToDefault = () => {
            this.loadRules();
        };
        this.toSheet = () => {
            const sheet = {};
            this.rules.forEach((rule) => {
                sheet[rule.selector.toString()] = rule.props;
            });
            return sheet;
        };
        this.toString = () => {
            let str = '';
            this.rules.forEach((r) => {
                str += `${r.selector.toString()} {\n`;
                for (const k in r.props) {
                    let v = r.props[k];
                    if (k === 'caption') {
                        v = `'${v}'`;
                    }
                    str += `  ${k}: ${v};\n`;
                }
                str += '}\n\n';
            });
            return str;
        };
        /**
         * 加载样式 可以外部传入
         * @param data 样式
         */
        this.loadRules = (data) => {
            const localData = typeof data === 'object' ? data : DEFAULT_STYLE;
            this.rules = [];
            for (const key in localData) {
                const props = localData[key];
                this.rules.push(new StyleRule(this.parseSelector(key), props));
            }
        };
        this.defaultColors = function () {
            return DEFAULT_COLORS;
        };
        this.interpolate = (str, item) => {
            let ips = str.replace(/\{([^{}]*)\}/g, (_a, b) => {
                const r = item.propertyMap[b];
                if (typeof r === 'object') {
                    return r.join(', ');
                }
                if (typeof r === 'string' || typeof r === 'number') {
                    return r;
                }
                return '';
            });
            if (ips.length < 1 && str === '{type}' && item.isRelationship) {
                ips = '<type>';
            }
            if (ips.length < 1 && str === '{id}' && item.isNode) {
                ips = '<id>';
            }
            return ips.replace(/^<(id|type)>$/, (_a, b) => {
                const r = item[b];
                if (typeof r === 'string' || typeof r === 'number') {
                    return r;
                }
                return '';
            });
        };
        /**
         * 传入node为节点 返回对应的样式
         * @param node 节点
         * @returns 节点的样式信息
         */
        this.forNode = (node = {}) => {
            const selector = this.nodeSelector(node);
            if ((node.labels != null ? node.labels.length : 0) > 0) {
                this.setDefaultNodeStyle(selector, node);
            }
            return this.calculateStyle(selector);
        };
        /**
         * 传入节点 返回对应的样式
         * @param rel
         * @returns
         */
        this.forRelationship = (rel) => {
            const selector = this.relationshipSelector(rel);
            return this.calculateStyle(selector);
        };
        this.rules = [];
        try {
            this.loadRules();
        }
        catch (_error) {
            // e = _error
        }
    }
}

function tree_add(d) {
  const x = +this._x.call(null, d),
      y = +this._y.call(null, d);
  return add(this.cover(x, y), x, y, d);
}

function add(tree, x, y, d) {
  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

  var parent,
      node = tree._root,
      leaf = {data: d},
      x0 = tree._x0,
      y0 = tree._y0,
      x1 = tree._x1,
      y1 = tree._y1,
      xm,
      ym,
      xp,
      yp,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return tree._root = leaf, tree;

  // Find the existing leaf for the new point, or add it.
  while (node.length) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }

  // Is the new point is exactly coincident with the existing point?
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

  // Otherwise, split the leaf node until the old and new point are separated.
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
  return parent[j] = node, parent[i] = leaf, tree;
}

function addAll(data) {
  var d, i, n = data.length,
      x,
      y,
      xz = new Array(n),
      yz = new Array(n),
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;

  // Compute the points and their extent.
  for (i = 0; i < n; ++i) {
    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
    xz[i] = x;
    yz[i] = y;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  // If there were no (valid) points, abort.
  if (x0 > x1 || y0 > y1) return this;

  // Expand the tree to cover the new points.
  this.cover(x0, y0).cover(x1, y1);

  // Add the new points.
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }

  return this;
}

function tree_cover(x, y) {
  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

  var x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1;

  // If the quadtree has no extent, initialize them.
  // Integer extent are necessary so that if we later double the extent,
  // the existing quadrant boundaries don’t change due to floating point error!
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x)) + 1;
    y1 = (y0 = Math.floor(y)) + 1;
  }

  // Otherwise, double repeatedly to cover.
  else {
    var z = x1 - x0 || 1,
        node = this._root,
        parent,
        i;

    while (x0 > x || x >= x1 || y0 > y || y >= y1) {
      i = (y < y0) << 1 | (x < x0);
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0: x1 = x0 + z, y1 = y0 + z; break;
        case 1: x0 = x1 - z, y1 = y0 + z; break;
        case 2: x1 = x0 + z, y0 = y1 - z; break;
        case 3: x0 = x1 - z, y0 = y1 - z; break;
      }
    }

    if (this._root && this._root.length) this._root = node;
  }

  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

function tree_data() {
  var data = [];
  this.visit(function(node) {
    if (!node.length) do data.push(node.data); while (node = node.next)
  });
  return data;
}

function tree_extent(_) {
  return arguments.length
      ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
      : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
}

function Quad(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

function tree_find(x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;

  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;
  else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {

    // Stop searching if this quadrant can’t contain a closer node.
    if (!(node = q.node)
        || (x1 = q.x0) > x3
        || (y1 = q.y0) > y3
        || (x2 = q.x1) < x0
        || (y2 = q.y1) < y0) continue;

    // Bisect the current quadrant.
    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;

      quads.push(
        new Quad(node[3], xm, ym, x2, y2),
        new Quad(node[2], x1, ym, xm, y2),
        new Quad(node[1], xm, y1, x2, ym),
        new Quad(node[0], x1, y1, xm, ym)
      );

      // Visit the closest quadrant first.
      if (i = (y >= ym) << 1 | (x >= xm)) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    }

    // Visit this point. (Visiting coincident points isn’t necessary!)
    else {
      var dx = x - +this._x.call(null, node.data),
          dy = y - +this._y.call(null, node.data),
          d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x - d, y0 = y - d;
        x3 = x + d, y3 = y + d;
        data = node.data;
      }
    }
  }

  return data;
}

function tree_remove(d) {
  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

  var parent,
      node = this._root,
      retainer,
      previous,
      next,
      x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1,
      x,
      y,
      xm,
      ym,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return this;

  // Find the leaf node for the point.
  // While descending, also retain the deepest parent with a non-removed sibling.
  if (node.length) while (true) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
  }

  // Find the point to remove.
  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
  if (next = node.next) delete node.next;

  // If there are multiple coincident points, remove just the point.
  if (previous) return (next ? previous.next = next : delete previous.next), this;

  // If this is the root point, remove it.
  if (!parent) return this._root = next, this;

  // Remove this leaf.
  next ? parent[i] = next : delete parent[i];

  // If the parent now contains exactly one leaf, collapse superfluous parents.
  if ((node = parent[0] || parent[1] || parent[2] || parent[3])
      && node === (parent[3] || parent[2] || parent[1] || parent[0])
      && !node.length) {
    if (retainer) retainer[j] = node;
    else this._root = node;
  }

  return this;
}

function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}

function tree_root() {
  return this._root;
}

function tree_size() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length) do ++size; while (node = node.next)
  });
  return size;
}

function tree_visit(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}

function tree_visitAfter(callback) {
  var quads = [], next = [], q;
  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}

function defaultX(d) {
  return d[0];
}

function tree_x(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

function defaultY(d) {
  return d[1];
}

function tree_y(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy(leaf) {
  var copy = {data: leaf.data}, next = copy;
  while (leaf = leaf.next) next = next.next = {data: leaf.data};
  return copy;
}

var treeProto = quadtree.prototype = Quadtree.prototype;

treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;

  if (!node) return copy;

  if (!node.length) return copy._root = leaf_copy(node), copy;

  nodes = [{source: node, target: copy._root = new Array(4)}];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
        else node.target[i] = leaf_copy(child);
      }
    }
  }

  return copy;
};

treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;

function constant(x) {
  return function() {
    return x;
  };
}

function jiggle(random) {
  return (random() - 0.5) * 1e-6;
}

function x$1(d) {
  return d.x + d.vx;
}

function y$1(d) {
  return d.y + d.vy;
}

function forceCollide(radius) {
  var nodes,
      radii,
      random,
      strength = 1,
      iterations = 1;

  if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

  function force() {
    var i, n = nodes.length,
        tree,
        node,
        xi,
        yi,
        ri,
        ri2;

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x$1, y$1).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r, r = ri + rj;
      if (data) {
        if (data.index > node.index) {
          var x = xi - data.x - data.vx,
              y = yi - data.y - data.vy,
              l = x * x + y * y;
          if (l < r * r) {
            if (x === 0) x = jiggle(random), l += x * x;
            if (y === 0) y = jiggle(random), l += y * y;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y *= l) * r;
            data.vx -= x * (r = 1 - r);
            data.vy -= y * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }

  function prepare(quad) {
    if (quad.data) return quad.r = radii[quad.data.index];
    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }

  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
  };

  return force;
}

function index(d) {
  return d.index;
}

function find(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("node not found: " + nodeId);
  return node;
}

function forceLink(links) {
  var id = index,
      strength = defaultStrength,
      strengths,
      distance = constant(30),
      distances,
      nodes,
      count,
      bias,
      random,
      iterations = 1;

  if (links == null) links = [];

  function defaultStrength(link) {
    return 1 / Math.min(count[link.source.index], count[link.target.index]);
  }

  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
        link = links[i], source = link.source, target = link.target;
        x = target.x + target.vx - source.x - source.vx || jiggle(random);
        y = target.y + target.vy - source.y - source.vy || jiggle(random);
        l = Math.sqrt(x * x + y * y);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x *= l, y *= l;
        target.vx -= x * (b = bias[i]);
        target.vy -= y * b;
        source.vx += x * (b = 1 - b);
        source.vy += y * b;
      }
    }
  }

  function initialize() {
    if (!nodes) return;

    var i,
        n = nodes.length,
        m = links.length,
        nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d])),
        link;

    for (i = 0, count = new Array(n); i < m; ++i) {
      link = links[i], link.index = i;
      if (typeof link.source !== "object") link.source = find(nodeById, link.source);
      if (typeof link.target !== "object") link.target = find(nodeById, link.target);
      count[link.source.index] = (count[link.source.index] || 0) + 1;
      count[link.target.index] = (count[link.target.index] || 0) + 1;
    }

    for (i = 0, bias = new Array(m); i < m; ++i) {
      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
    }

    strengths = new Array(m), initializeStrength();
    distances = new Array(m), initializeDistance();
  }

  function initializeStrength() {
    if (!nodes) return;

    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }

  function initializeDistance() {
    if (!nodes) return;

    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }

  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };

  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };

  force.id = function(_) {
    return arguments.length ? (id = _, force) : id;
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
  };

  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), initializeDistance(), force) : distance;
  };

  return force;
}

// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const a = 1664525;
const c = 1013904223;
const m = 4294967296; // 2^32

function lcg() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}

function x(d) {
  return d.x;
}

function y(d) {
  return d.y;
}

var initialRadius = 10,
    initialAngle = Math.PI * (3 - Math.sqrt(5));

function forceSimulation(nodes) {
  var simulation,
      alpha = 1,
      alphaMin = 0.001,
      alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
      alphaTarget = 0,
      velocityDecay = 0.6,
      forces = new Map(),
      stepper = timer(step),
      event = dispatch("tick", "end"),
      random = lcg();

  if (nodes == null) nodes = [];

  function step() {
    tick();
    event.call("tick", simulation);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation);
    }
  }

  function tick(iterations) {
    var i, n = nodes.length, node;

    if (iterations === undefined) iterations = 1;

    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;

      forces.forEach(function(force) {
        force(alpha);
      });

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null) node.x += node.vx *= velocityDecay;
        else node.x = node.fx, node.vx = 0;
        if (node.fy == null) node.y += node.vy *= velocityDecay;
        else node.y = node.fy, node.vy = 0;
      }
    }

    return simulation;
  }

  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null) node.x = node.fx;
      if (node.fy != null) node.y = node.fy;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }

  function initializeForce(force) {
    if (force.initialize) force.initialize(nodes, random);
    return force;
  }

  initializeNodes();

  return simulation = {
    tick: tick,

    restart: function() {
      return stepper.restart(step), simulation;
    },

    stop: function() {
      return stepper.stop(), simulation;
    },

    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
    },

    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },

    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },

    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },

    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },

    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },

    randomSource: function(_) {
      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
    },

    force: function(name, _) {
      return arguments.length > 1 ? ((_ == null ? forces.delete(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
    },

    find: function(x, y, radius) {
      var i = 0,
          n = nodes.length,
          dx,
          dy,
          d2,
          node,
          closest;

      if (radius == null) radius = Infinity;
      else radius *= radius;

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x - node.x;
        dy = y - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius) closest = node, radius = d2;
      }

      return closest;
    },

    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}

function forceManyBody() {
  var nodes,
      node,
      random,
      alpha,
      strength = constant(-30),
      strengths,
      distanceMin2 = 1,
      distanceMax2 = Infinity,
      theta2 = 0.81;

  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate);
    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
  }

  function accumulate(quad) {
    var strength = 0, q, c, weight = 0, x, y, i;

    // For internal nodes, accumulate forces from child quadrants.
    if (quad.length) {
      for (x = y = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c = Math.abs(q.value))) {
          strength += q.value, weight += c, x += c * q.x, y += c * q.y;
        }
      }
      quad.x = x / weight;
      quad.y = y / weight;
    }

    // For leaf nodes, accumulate forces from coincident quadrants.
    else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do strength += strengths[q.data.index];
      while (q = q.next);
    }

    quad.value = strength;
  }

  function apply(quad, x1, _, x2) {
    if (!quad.value) return true;

    var x = quad.x - node.x,
        y = quad.y - node.y,
        w = x2 - x1,
        l = x * x + y * y;

    // Apply the Barnes-Hut approximation if possible.
    // Limit forces for very close nodes; randomize direction if coincident.
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x === 0) x = jiggle(random), l += x * x;
        if (y === 0) y = jiggle(random), l += y * y;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x * quad.value * alpha / l;
        node.vy += y * quad.value * alpha / l;
      }
      return true;
    }

    // Otherwise, process points directly.
    else if (quad.length || l >= distanceMax2) return;

    // Limit forces for very close nodes; randomize direction if coincident.
    if (quad.data !== node || quad.next) {
      if (x === 0) x = jiggle(random), l += x * x;
      if (y === 0) y = jiggle(random), l += y * y;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }

    do if (quad.data !== node) {
      w = strengths[quad.data.index] * alpha / l;
      node.vx += x * w;
      node.vy += y * w;
    } while (quad = quad.next);
  }

  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };

  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };

  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };

  return force;
}

function forceX(x) {
  var strength = constant(0.1),
      nodes,
      strengths,
      xz;

  if (typeof x !== "function") x = constant(x == null ? 0 : +x);

  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    xz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
  };

  return force;
}

function forceY(y) {
  var strength = constant(0.1),
      nodes,
      strengths,
      yz;

  if (typeof y !== "function") y = constant(y == null ? 0 : +y);

  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    yz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
  };

  return force;
}

function circular(nodes, center, radius) {
    const unlocatedNodes = nodes.filter((node) => !node.initialPositionCalculated);
    unlocatedNodes.forEach((node, i) => {
        node.x =
            center.x + radius * Math.sin((2 * Math.PI * i) / unlocatedNodes.length);
        node.y =
            center.y + radius * Math.cos((2 * Math.PI * i) / unlocatedNodes.length);
        node.initialPositionCalculated = true;
    });
}

const oneRelationshipPerPairOfNodes = (graph) => Array.from(graph.groupedRelationships()).map((pair) => pair.relationships[0]);
class ForceSimulation {
    constructor(render) {
        this.simulationTimeout = null;
        this.simulation = forceSimulation()
            .velocityDecay(VELOCITY_DECAY)
            .force('charge', forceManyBody().strength(FORCE_CHARGE))
            .force('centerX', forceX(0).strength(FORCE_CENTER_X))
            .force('centerY', forceY(0).strength(FORCE_CENTER_Y))
            .alphaMin(DEFAULT_ALPHA_MIN)
            .on('tick', () => {
            this.simulation.tick(EXTRA_TICKS_PER_RENDER);
            render();
        })
            .stop();
    }
    updateNodes(graph) {
        const nodes = graph.nodes();
        const radius = (nodes.length * LINK_DISTANCE) / (Math.PI * 2);
        const center = {
            x: 0,
            y: 0,
        };
        circular(nodes, center, radius);
        this.simulation
            .nodes(nodes)
            .force('collide', forceCollide().radius(FORCE_COLLIDE_RADIUS));
    }
    updateRelationships(graph) {
        const relationships = oneRelationshipPerPairOfNodes(graph);
        this.simulation.force('link', forceLink(relationships)
            .id((node) => node.id)
            .distance(FORCE_LINK_DISTANCE));
    }
    precomputeAndStart(onEnd = () => undefined) {
        this.simulation.stop();
        let precomputeTicks = 0;
        const start = performance.now();
        while (performance.now() - start < 250 &&
            precomputeTicks < MAX_PRECOMPUTED_TICKS) {
            this.simulation.tick(1);
            precomputeTicks += 1;
            if (this.simulation.alpha() <= this.simulation.alphaMin()) {
                break;
            }
        }
        this.simulation.restart().on('end', () => {
            onEnd();
            this.simulation.on('end', null);
        });
    }
    restart() {
        this.simulation.alpha(DEFAULT_ALPHA).restart();
    }
    stop() {
        this.simulation.stop();
    }
}

const nodeEventHandlers = (selection, trigger) => {
    const onNodeClick = (_event, node) => {
        trigger('nodeClicked', node, _event);
    };
    const onNodeDblClick = (_event, node) => {
        trigger('nodeDblClicked', node, _event);
    };
    const onNodeMouseOver = (_event, node) => {
        if (!node.fx && !node.fy) {
            node.hoverFixed = true;
            node.fx = node.x;
            node.fy = node.y;
        }
        trigger('nodeMouseOver', node, _event);
    };
    const onNodeMouseOut = (_event, node) => {
        if (node.hoverFixed) {
            node.hoverFixed = false;
            node.fx = null;
            node.fy = null;
        }
        trigger('nodeMouseOut', node, _event);
    };
    return selection
        .on('mouseover', onNodeMouseOver)
        .on('mouseout', onNodeMouseOut)
        .on('click', onNodeClick)
        .on('dblclick', onNodeDblClick);
};
// 力模型的拖拽事件
const nodeForceDragEventHandlers = (selection, simulation) => {
    let initialDragPosition;
    let restartedSimulation = false;
    const tolerance = 25;
    const dragstarted = (event) => {
        initialDragPosition = [event.x, event.y];
        restartedSimulation = false;
    };
    const dragged = (event, node) => {
        // Math.sqrt was removed to avoid unnecessary computation, since this
        // function is called very often when dragging.
        const dist = Math.pow(initialDragPosition[0] - event.x, 2) +
            Math.pow(initialDragPosition[1] - event.y, 2);
        // This is to prevent clicks/double clicks from restarting the simulation
        if (dist > tolerance && !restartedSimulation && simulation) {
            // Set alphaTarget to a value higher than alphaMin so the simulation
            // isn't stopped while nodes are being dragged.
            simulation
                .alphaTarget(DRAGGING_ALPHA_TARGET)
                .alpha(DRAGGING_ALPHA)
                .restart();
            restartedSimulation = true;
        }
        node.hoverFixed = false;
        node.fx = event.x;
        node.fy = event.y;
    };
    const dragended = (_event) => {
        if (restartedSimulation && simulation) {
            // Reset alphaTarget so the simulation cools down and stops.
            simulation.alphaTarget(DEFAULT_ALPHA_TARGET);
        }
    };
    return selection.call(d3Drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
};
const nodeDragEventHandlers = (selection) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const dragstarted = () => { };
    const dragged = (event, node) => {
        node.x = event.x;
        node.y = event.y;
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const dragended = () => { };
    return selection.call(d3Drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
};
const relationshipEventHandlers = (selection, trigger) => {
    const onRelationshipClick = (event, rel) => {
        event.stopPropagation();
        trigger('relationshipClicked', rel, event);
    };
    const onRelMouseOver = (_event, rel) => {
        trigger('relMouseOver', rel, _event);
    };
    const onRelMouseOut = (_event, rel) => {
        trigger('relMouseOut', rel, _event);
    };
    return selection
        .on('mousedown', onRelationshipClick)
        .on('mouseover', onRelMouseOver)
        .on('mouseout', onRelMouseOut);
};

const noOp = () => undefined;
class Renderer {
    constructor({ onGraphChange = noOp, onTick = noOp, name, }) {
        this.onGraphChange = onGraphChange;
        this.onTick = onTick;
        this.name = name;
    }
}

const noop = () => undefined;
const nodeRingStrokeSize = 8;
// 节点
const nodeOutline = new Renderer({
    name: 'nodeOutline',
    onGraphChange(selection, viz) {
        return selection
            .selectAll('circle.b-outline')
            .data((node) => [node])
            .join('circle')
            .classed('b-outline', true)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', (node) => {
            return node.radius;
        })
            .attr('fill', (node) => {
            return viz.style.forNode(node).get('color');
        })
            .attr('stroke', (node) => {
            return viz.style.forNode(node).get('border-color');
        })
            .attr('stroke-width', (node) => {
            return viz.style.forNode(node).get('border-width');
        });
    },
    onTick: noop,
});
// 节点名称
const nodeCaption = new Renderer({
    name: 'nodeCaption',
    onGraphChange(selection, viz) {
        return (selection
            .selectAll('text.caption')
            .data((node) => node.caption)
            .join('text')
            // Classed element ensures duplicated data will be removed before adding
            .classed('caption', true)
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .attr('x', 0)
            .attr('y', (line) => line.baseline)
            .attr('font-size', (line) => viz.style.forNode(line.node).get('font-size'))
            .attr('fill', (line) => viz.style.forNode(line.node).get('text-color-internal'))
            .text((line) => line.text));
    },
    onTick: noop,
});
// 节点环 轮廓
const nodeRing = new Renderer({
    name: 'nodeRing',
    onGraphChange(selection) {
        const circles = selection
            .selectAll('circle.ring')
            .data((node) => [node]);
        circles
            .enter()
            .insert('circle', '.b-outline')
            .classed('ring', true)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('stroke-width', `${nodeRingStrokeSize}px`)
            .attr('r', (node) => node.radius + 4);
        return circles.exit().remove();
    },
    onTick: noop,
});
const arrowPath = new Renderer({
    name: 'arrowPath',
    onGraphChange(selection, viz) {
        return selection
            .selectAll('path.b-outline')
            .data((rel) => [rel])
            .join('path')
            .classed('b-outline', true)
            .attr('fill', (rel) => viz.style.forRelationship(rel).get('color'))
            .attr('stroke', 'none');
    },
    onTick(selection) {
        return selection
            .selectAll('path')
            .attr('d', (d) => { var _a; return d.arrow.outline((_a = d.shortCaptionLength) !== null && _a !== void 0 ? _a : 0); });
    },
});
const relationshipType = new Renderer({
    name: 'relationshipType',
    onGraphChange(selection, viz) {
        return selection
            .selectAll('text')
            .data((rel) => [rel])
            .join('text')
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .attr('font-size', (rel) => viz.style.forRelationship(rel).get('font-size'))
            .attr('fill', (rel) => viz.style.forRelationship(rel).get(`text-color-${rel.captionLayout}`));
    },
    onTick(selection, viz) {
        return selection
            .selectAll('text')
            .attr('x', (rel) => { var _a, _b, _c; return (_c = (_b = (_a = rel === null || rel === void 0 ? void 0 : rel.arrow) === null || _a === void 0 ? void 0 : _a.midShaftPoint) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0; })
            .attr('y', (rel) => {
            var _a, _b, _c;
            return ((_c = (_b = (_a = rel === null || rel === void 0 ? void 0 : rel.arrow) === null || _a === void 0 ? void 0 : _a.midShaftPoint) === null || _b === void 0 ? void 0 : _b.y) !== null && _c !== void 0 ? _c : 0) +
                parseFloat(viz.style.forRelationship(rel).get('font-size')) / 2 -
                1;
        })
            .attr('transform', (rel) => {
            var _a, _b, _c, _d, _e, _f;
            if (rel.naturalAngle < 90 || rel.naturalAngle > 270) {
                return `rotate(180 ${(_c = (_b = (_a = rel === null || rel === void 0 ? void 0 : rel.arrow) === null || _a === void 0 ? void 0 : _a.midShaftPoint) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0} ${(_f = (_e = (_d = rel === null || rel === void 0 ? void 0 : rel.arrow) === null || _d === void 0 ? void 0 : _d.midShaftPoint) === null || _e === void 0 ? void 0 : _e.y) !== null && _f !== void 0 ? _f : 0})`;
            }
            else {
                return null;
            }
        })
            .text((rel) => { var _a; return (_a = rel.shortCaption) !== null && _a !== void 0 ? _a : ''; });
    },
});
const relationshipOverlay = new Renderer({
    name: 'relationshipOverlay',
    onGraphChange(selection) {
        return selection
            .selectAll('path.overlay')
            .data((rel) => [rel])
            .join('path')
            .classed('overlay', true);
    },
    onTick(selection) {
        const band = 16;
        return selection
            .selectAll('path.overlay')
            .attr('d', (d) => d.arrow.overlay(band));
    },
});
const node = [nodeOutline, nodeCaption, nodeRing];
const relationship = [arrowPath, relationshipType, relationshipOverlay];

var ZoomType;
(function (ZoomType) {
    ZoomType["IN"] = "in";
    ZoomType["OUT"] = "out";
    ZoomType["FIT"] = "fit";
})(ZoomType || (ZoomType = {}));

function getGraphStats(graph) {
    const labelStats = {};
    const relTypeStats = {};
    graph.nodes().forEach((node) => {
        node.labels.forEach((label) => {
            if (labelStats['*']) {
                labelStats['*'].count = labelStats['*'].count + 1;
            }
            else {
                labelStats['*'] = {
                    count: 1,
                    properties: {},
                };
            }
            if (labelStats[label]) {
                labelStats[label].count = labelStats[label].count + 1;
                labelStats[label].properties = Object.assign(Object.assign({}, labelStats[label].properties), node.propertyMap);
            }
            else {
                labelStats[label] = {
                    count: 1,
                    properties: node.propertyMap,
                };
            }
        });
    });
    graph.relationships().forEach((rel) => {
        if (relTypeStats['*']) {
            relTypeStats['*'].count = relTypeStats['*'].count + 1;
        }
        else {
            relTypeStats['*'] = {
                count: 1,
                properties: {},
            };
        }
        if (relTypeStats[rel.type]) {
            relTypeStats[rel.type].count = relTypeStats[rel.type].count + 1;
            relTypeStats[rel.type].properties = Object.assign(Object.assign({}, relTypeStats[rel.type].properties), rel.propertyMap);
        }
        else {
            relTypeStats[rel.type] = {
                count: 1,
                properties: rel.propertyMap,
            };
        }
    });
    return { labels: labelStats, relTypes: relTypeStats };
}

class GraphEventHandlerModel {
    constructor(graph, visualization, getNodeNeighbours, onItemMouseOver, onItemSelected, onGraphModelChange, onGraphInteraction) {
        this.graph = graph;
        this.visualization = visualization;
        this.getNodeNeighbours = getNodeNeighbours;
        this.selectedItem = null;
        this.onItemMouseOver = onItemMouseOver;
        this.onItemSelected = onItemSelected;
        this.onGraphInteraction = onGraphInteraction;
        this.onGraphModelChange = onGraphModelChange;
    }
    graphModelChanged() {
        this.onGraphModelChange(getGraphStats(this.graph));
    }
    selectItem(item) {
        // 可以选择多个
        if (this.selectedItem) {
            this.selectedItem.selected = false;
        }
        this.selectedItem = item;
        item.selected = true;
        this.visualization.update({
            updateNodes: this.selectedItem.isNode,
            updateRelationships: this.selectedItem.isRelationship,
            restartSimulation: false,
        });
    }
    deselectItem(event) {
        if (this.selectedItem) {
            this.selectedItem.selected = false;
            this.visualization.update({
                updateNodes: this.selectedItem.isNode,
                updateRelationships: this.selectedItem.isRelationship,
                restartSimulation: false,
            });
            this.selectedItem = null;
        }
        this.onItemSelected({
            type: 'canvas',
            item: {
                nodeCount: this.graph.nodes().length,
                relationshipCount: this.graph.relationships().length,
            },
        }, event);
    }
    nodeClicked(node, event) {
        if (!node) {
            return;
        }
        node.hoverFixed = false;
        node.fx = node.x;
        node.fy = node.y;
        if (!node.selected) {
            this.selectItem(node);
            this.onItemSelected({
                type: 'node',
                item: node,
            }, event);
        }
        else {
            this.deselectItem(event);
        }
    }
    // 节点双击 触发
    nodeDblClicked(d, event) {
        // const graph = this.graph;
        // const visualization = this.visualization;
        // const graphModelChanged = this.graphModelChanged.bind(this);
        // this.getNodeNeighbours(
        //   d,
        //   this.graph.findNodeNeighbourIds(d.id),
        //   ({ nodes, relationships }) => {
        //     graph.addExpandedNodes(d, mapNodes(nodes));
        //     graph.addRelationships(mapRelationships(relationships, graph));
        //     visualization.update({ updateNodes: true, updateRelationships: true });
        //     graphModelChanged();
        //   },
        // );
        this.onGraphInteraction({
            type: 'node',
            item: d,
        }, event);
    }
    onNodeMouseOver(node, event) {
        if (!node.contextMenu) {
            this.onItemMouseOver({
                type: 'node',
                item: node,
            }, event);
        }
    }
    onMenuMouseOver(itemWithMenu, event) {
        if (!itemWithMenu.contextMenu) {
            throw new Error('menuMouseOver triggered without menu');
        }
        this.onItemMouseOver({
            type: 'context-menu-item',
            item: {
                label: itemWithMenu.contextMenu.label,
                content: itemWithMenu.contextMenu.menuContent,
                selection: itemWithMenu.contextMenu.menuSelection,
            },
        }, event);
    }
    onRelationshipMouseOver(relationship, event) {
        this.onItemMouseOver({
            type: 'relationship',
            item: relationship,
        }, event);
    }
    onRelationshipClicked(relationship, event) {
        if (!relationship.selected) {
            this.selectItem(relationship);
            this.onItemSelected({
                type: 'relationship',
                item: relationship,
            }, event);
        }
        else {
            this.deselectItem(event);
        }
    }
    onCanvasClicked() {
        this.deselectItem();
    }
    onItemMouseOut() {
        this.onItemMouseOver({
            type: 'canvas',
            item: {
                nodeCount: this.graph.nodes().length,
                relationshipCount: this.graph.relationships().length,
            },
        });
    }
    bindEventHandlers() {
        this.visualization
            .on('nodeMouseOver', this.onNodeMouseOver.bind(this))
            .on('nodeMouseOut', this.onItemMouseOut.bind(this))
            .on('menuMouseOver', this.onMenuMouseOver.bind(this))
            .on('menuMouseOut', this.onItemMouseOut.bind(this))
            .on('relMouseOver', this.onRelationshipMouseOver.bind(this))
            .on('relMouseOut', this.onItemMouseOut.bind(this))
            .on('relationshipClicked', this.onRelationshipClicked.bind(this))
            .on('canvasClicked', this.onCanvasClicked.bind(this))
            .on('nodeClicked', this.nodeClicked.bind(this))
            .on('nodeDblClicked', this.nodeDblClicked.bind(this));
        this.onItemMouseOut();
    }
}

// function initHierarchy(
//   nodes: NodeModel[],
//   edges: RelationshipModel[],
//   nodeMap: IndexMap,
//   directed: boolean,
// ) {
//   nodes.forEach((_, i: number) => {
//     nodes[i].children = [];
//     nodes[i].parent = [];
//   });
//   if (directed) {
//     edges.forEach((e) => {
//       const source = getEdgeTerminal(e, 'source');
//       const target = getEdgeTerminal(e, 'target');
//       let sourceIdx = 0;
//       if (source) {
//         sourceIdx = nodeMap[source];
//       }
//       let targetIdx = 0;
//       if (target) {
//         targetIdx = nodeMap[target];
//       }
//       const child = nodes[sourceIdx].children!;
//       const parent = nodes[targetIdx].parent!;
//       child.push(nodes[targetIdx].id);
//       parent.push(nodes[sourceIdx].id);
//     });
//   } else {
//     edges.forEach((e) => {
//       const source = getEdgeTerminal(e, 'source');
//       const target = getEdgeTerminal(e, 'target');
//       let sourceIdx = 0;
//       if (source) {
//         sourceIdx = nodeMap[source];
//       }
//       let targetIdx = 0;
//       if (target) {
//         targetIdx = nodeMap[target];
//       }
//       const sourceChildren = nodes[sourceIdx].children!;
//       const targetChildren = nodes[targetIdx].children!;
//       sourceChildren.push(nodes[targetIdx].id);
//       targetChildren.push(nodes[sourceIdx].id);
//     });
//   }
// }
// function connect(a: NodeModel, b: NodeModel, edges: RelationshipModel[]) {
//   const m = edges.length;
//   for (let i = 0; i < m; i++) {
//     const source = getEdgeTerminal(edges[i], 'source');
//     const target = getEdgeTerminal(edges[i], 'target');
//     if (
//       (a.id === source && b.id === target) ||
//       (b.id === source && a.id === target)
//     ) {
//       return true;
//     }
//   }
//   return false;
// }
function compareDegree(a, b) {
    const aDegree = a.degree;
    const bDegree = b.degree;
    if (aDegree < bDegree) {
        return -1;
    }
    if (aDegree > bDegree) {
        return 1;
    }
    return 0;
}
class CircularLayout {
    constructor(options) {
        /** 固定半径，若设置了 radius，则 startRadius 与 endRadius 不起效 */
        this.radius = null;
        /** 节点大小，配合 nodeSpacing，一起用于计算 radius。若不配置，节点大小默认为 30 */
        this.nodeSize = undefined;
        /** 起始半径 */
        this.startRadius = null;
        /** 终止半径 */
        this.endRadius = null;
        /** 起始角度 */
        this.startAngle = 0;
        /** 终止角度 */
        this.endAngle = 2 * Math.PI;
        /** 是否顺时针 */
        this.clockwise = true;
        /** 节点在环上分成段数（几个段将均匀分布），在 endRadius - startRadius != 0 时生效 */
        this.divisions = 1;
        /** 节点在环上排序的依据，可选: 'topology', 'degree', 'null' */
        this.ordering = null;
        /** how many 2*pi from first to last nodes */
        this.angleRatio = 1;
        this.nodes = [];
        this.edges = [];
        // private nodeMap: IndexMap = {};
        this.degrees = [];
        this.width = 300;
        this.height = 300;
        this.updateConfig(options);
    }
    updateConfig(cfg) {
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    getDefaultConfig() {
        return {
            radius: null,
            startRadius: null,
            endRadius: null,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            clockwise: true,
            divisions: 1,
            ordering: null,
            angleRatio: 1,
        };
    }
    /**
     * 执行布局
     */
    execute() {
        var _a;
        const self = this;
        const nodes = self.nodes;
        const edges = self.edges;
        const n = nodes.length;
        if (n === 0) {
            if (self.onLayoutEnd)
                self.onLayoutEnd();
            return;
        }
        if (!self.width && typeof window !== 'undefined') {
            self.width = window.innerWidth;
        }
        if (!self.height && typeof window !== 'undefined') {
            self.height = window.innerHeight;
        }
        if (!self.center) {
            self.center = [self.width / 2, self.height / 2];
        }
        const center = self.center;
        if (n === 1) {
            nodes[0].x = center[0];
            nodes[0].y = center[1];
            if (self.onLayoutEnd)
                self.onLayoutEnd();
            return;
        }
        let { radius, startRadius, endRadius } = self;
        const { divisions, startAngle, endAngle, angleRatio, ordering, clockwise, nodeSpacing: paramNodeSpacing, nodeSize: paramNodeSize, } = self;
        const angleStep = (endAngle - startAngle) / n;
        // layout
        const nodeMap = {};
        nodes.forEach((node, i) => {
            nodeMap[node.id] = i;
        });
        // self.nodeMap = nodeMap;
        const degrees = getDegree(nodes.length, nodeMap, edges);
        self.degrees = degrees;
        // 设置了节点的间距
        if (paramNodeSpacing) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const nodeSpacing = getFuncByUnknownType(10, paramNodeSpacing);
            // eslint-disable-next-line @typescript-eslint/ban-types
            const nodeSize = getFuncByUnknownType(10, paramNodeSize);
            let maxNodeSize = -Infinity;
            nodes.forEach((node) => {
                const nSize = nodeSize(node);
                if (maxNodeSize < nSize)
                    maxNodeSize = nSize;
            });
            let length = 0;
            nodes.forEach((node, i) => {
                if (i === 0)
                    length += maxNodeSize || 10;
                else
                    length += (nodeSpacing(node) || 0) + (maxNodeSize || 10);
            });
            radius = length / (2 * Math.PI);
            // 未设置了半径 开始角度 结束角度
        }
        else if (!radius && !startRadius && !endRadius) {
            radius = self.height > self.width ? self.width / 2 : self.height / 2;
        }
        else if (!startRadius && endRadius) {
            startRadius = endRadius;
        }
        else if (startRadius && !endRadius) {
            endRadius = startRadius;
        }
        const astep = angleStep * angleRatio;
        // 节点布局顺序
        let layoutNodes = [];
        // if (ordering === 'topology') {
        //   // layout according to the topology
        //   layoutNodes = self.topologyOrdering();
        // } else if (ordering === 'topology-directed') {
        //   // layout according to the topology
        //   layoutNodes = self.topologyOrdering(true);
        // } else
        if (ordering === 'degree') {
            // layout according to the descent order of degrees
            layoutNodes = self.degreeOrdering();
        }
        else {
            // layout according to the original order in the data.nodes
            layoutNodes = nodes;
        }
        const divN = Math.ceil(n / divisions); // node number in each division
        for (let i = 0; i < n; ++i) {
            let r = radius;
            if (!r && startRadius !== null && endRadius !== null) {
                r = startRadius + (i * (endRadius - startRadius)) / (n - 1);
            }
            if (!r) {
                r = 10 + (i * 100) / (n - 1);
            }
            let angle = startAngle +
                (i % divN) * astep +
                ((2 * Math.PI) / divisions) * Math.floor(i / divN);
            if (!clockwise) {
                angle =
                    endAngle -
                        (i % divN) * astep -
                        ((2 * Math.PI) / divisions) * Math.floor(i / divN);
            }
            layoutNodes[i].x = center[0] + Math.cos(angle) * r;
            layoutNodes[i].y = center[1] + Math.sin(angle) * r;
            layoutNodes[i].degree = degrees[i].all;
        }
        (_a = self.onLayoutEnd) === null || _a === void 0 ? void 0 : _a.call(self);
        return {
            nodes: layoutNodes,
            edges: this.edges,
        };
    }
    /**
     * 根据节点的拓扑结构排序
     * @return {array} orderedNodes 排序后的结果
     */
    // public topologyOrdering(directed = false) {
    // const self = this;
    // const degrees = self.degrees;
    // const edges = self.edges;
    // const nodes = self.nodes;
    // const cnodes = clone(nodes);
    // const nodeMap = self.nodeMap;
    // const orderedCNodes = [cnodes[0]];
    // const resNodes = [nodes[0]];
    // const pickFlags: boolean[] = [];
    // const n = nodes.length;
    // pickFlags[0] = true;
    // initHierarchy(cnodes, edges, nodeMap, directed);
    // let k = 0;
    // cnodes.forEach((cnode, i) => {
    //   if (i !== 0) {
    //     if (
    //       (i === n - 1 ||
    //         degrees[i].all !== degrees[i + 1].all ||
    //         connect(orderedCNodes[k], cnode, edges)) &&
    //       !pickFlags[i]
    //     ) {
    //       orderedCNodes.push(cnode);
    //       resNodes.push(nodes[nodeMap[cnode.id]]);
    //       pickFlags[i] = true;
    //       k++;
    //     } else {
    //       const children = orderedCNodes[k].children!;
    //       let foundChild = false;
    //       for (let j = 0; j < children.length; j++) {
    //         const childIdx = nodeMap[children[j]];
    //         if (
    //           degrees[childIdx].all === degrees[i].all &&
    //           !pickFlags[childIdx]
    //         ) {
    //           orderedCNodes.push(cnodes[childIdx]);
    //           resNodes.push(nodes[nodeMap[cnodes[childIdx].id]]);
    //           pickFlags[childIdx] = true;
    //           foundChild = true;
    //           break;
    //         }
    //       }
    //       let ii = 0;
    //       while (!foundChild) {
    //         if (!pickFlags[ii]) {
    //           orderedCNodes.push(cnodes[ii]);
    //           resNodes.push(nodes[nodeMap[cnodes[ii].id]]);
    //           pickFlags[ii] = true;
    //           foundChild = true;
    //         }
    //         ii++;
    //         if (ii === n) {
    //           break;
    //         }
    //       }
    //     }
    //   }
    // });
    // return resNodes;
    // }
    /**
     * 根据节点度数大小排序
     * @return {array} orderedNodes 排序后的结果
     */
    degreeOrdering() {
        const self = this;
        const nodes = self.nodes;
        const orderedNodes = [];
        const degrees = self.degrees;
        nodes.forEach((node, i) => {
            node.degree = degrees[i].all;
            orderedNodes.push(node);
        });
        orderedNodes.sort(compareDegree);
        return orderedNodes;
    }
    getType() {
        return 'circular';
    }
}

/**
 * 网格布局
 */
class GridLayout {
    constructor(options) {
        /** 布局起始点 */
        this.begin = [0, 0];
        /** prevents node overlap(重叠), may overflow boundingBox if not enough space */
        this.preventOverlap = true;
        /** extra spacing around nodes when preventOverlap: true */
        this.preventOverlapPadding = 10;
        /** uses all available space on false, uses minimal space on true */
        this.condense = false;
        /** a sorting function to order the nodes; e.g. function(a, b){ return a.datapublic ('weight') - b.data('weight') } */
        this.sortBy = 'degree';
        this.nodes = [];
        this.edges = [];
        this.width = 300;
        this.height = 300;
        this.row = 0;
        this.col = 0;
        this.cellWidth = 0;
        this.cellHeight = 0;
        this.cellUsed = {};
        this.id2manPos = {};
        this.updateConfig(options);
    }
    updateConfig(cfg) {
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    getDefaultCfg() {
        return {
            begin: [0, 0],
            preventOverlap: true,
            preventOverlapPadding: 10,
            condense: false,
            rows: undefined,
            cols: undefined,
            position: undefined,
            sortBy: 'degree',
            nodeSize: 30,
        };
    }
    /**
     * 执行布局
     */
    execute() {
        const self = this;
        const { nodes, edges, begin } = self;
        const n = nodes.length;
        if (n === 0) {
            if (self.onLayoutEnd)
                self.onLayoutEnd();
            return {
                nodes,
                edges,
            };
        }
        if (n === 1) {
            nodes[0].x = begin[0];
            nodes[0].y = begin[1];
            if (self.onLayoutEnd)
                self.onLayoutEnd();
            return {
                nodes,
                edges,
            };
        }
        let { sortBy, width, height } = self;
        const { condense, preventOverlapPadding, preventOverlap, nodeSpacing: paramNodeSpacing, nodeSize: paramNodeSize, } = self;
        const layoutNodes = [];
        nodes.forEach((node) => {
            layoutNodes.push(node);
        });
        const nodeIdxMap = {};
        layoutNodes.forEach((node, i) => {
            nodeIdxMap[node.id] = i;
        });
        if (sortBy === 'degree' ||
            !isString(sortBy) ||
            layoutNodes[0][sortBy] === undefined) {
            sortBy = 'degree';
            if (isNaN$1(nodes[0].degree)) {
                const values = getDegree(layoutNodes.length, nodeIdxMap, edges);
                layoutNodes.forEach((node, i) => {
                    node.degree = values[i].all;
                });
            }
        }
        // sort nodes by value
        layoutNodes.sort((n1, n2) => n2[sortBy] - n1[sortBy]);
        if (!width && typeof window !== 'undefined') {
            width = window.innerWidth;
        }
        if (!height && typeof window !== 'undefined') {
            height = window.innerHeight;
        }
        const oRows = self.rows;
        const oCols = self.cols != null ? self.cols : self.columns;
        self.cells = n;
        // if rows or columns were set in self, use those values
        if (oRows != null && oCols != null) {
            self.rows = oRows;
            self.cols = oCols;
        }
        else if (oRows != null && oCols == null) {
            self.rows = oRows;
            self.cols = Math.ceil(self.cells / self.rows);
        }
        else if (oRows == null && oCols != null) {
            self.cols = oCols;
            self.rows = Math.ceil(self.cells / self.cols);
        }
        else {
            // otherwise use the automatic values and adjust accordingly	      // otherwise use the automatic values and adjust accordingly
            // width/height * splits^2 = cells where splits is number of times to split width
            self.splits = Math.sqrt((self.cells * self.height) / self.width);
            self.rows = Math.round(self.splits);
            self.cols = Math.round((self.width / self.height) * self.splits);
        }
        self.rows = Math.max(self.rows, 1);
        self.cols = Math.max(self.cols, 1);
        if (self.cols * self.rows > self.cells) {
            // otherwise use the automatic values and adjust accordingly
            // if rounding was up, see if we can reduce rows or columns
            const sm = self.small();
            const lg = self.large();
            // reducing the small side takes away the most cells, so try it first
            if ((sm - 1) * lg >= self.cells) {
                self.small(sm - 1);
            }
            else if ((lg - 1) * sm >= self.cells) {
                self.large(lg - 1);
            }
        }
        else {
            // if rounding was too low, add rows or columns
            while (self.cols * self.rows < self.cells) {
                const sm = self.small();
                const lg = self.large();
                // try to add to larger side first (adds less in multiplication)
                if ((lg + 1) * sm >= self.cells) {
                    self.large(lg + 1);
                }
                else {
                    self.small(sm + 1);
                }
            }
        }
        self.cellWidth = width / self.cols;
        self.cellHeight = height / self.rows;
        if (condense) {
            self.cellWidth = 0;
            self.cellHeight = 0;
        }
        if (preventOverlap || paramNodeSpacing) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const nodeSpacing = getFuncByUnknownType(10, paramNodeSpacing);
            // eslint-disable-next-line @typescript-eslint/ban-types
            const nodeSize = getFuncByUnknownType(30, paramNodeSize, false);
            layoutNodes.forEach((node) => {
                if (!node.x || !node.y) {
                    // for bb
                    node.x = 0;
                    node.y = 0;
                }
                const res = nodeSize(node) || 30;
                let nodeW;
                let nodeH;
                if (isArray(res)) {
                    nodeW = res[0];
                    nodeH = res[1];
                }
                else {
                    nodeW = res;
                    nodeH = res;
                }
                const p = nodeSpacing !== undefined ? nodeSpacing(node) : preventOverlapPadding;
                const w = nodeW + p;
                const h = nodeH + p;
                self.cellWidth = Math.max(self.cellWidth, w);
                self.cellHeight = Math.max(self.cellHeight, h);
            });
        }
        self.cellUsed = {}; // e.g. 'c-0-2' => true
        // to keep track of current cell position
        self.row = 0;
        self.col = 0;
        // get a cache of all the manual positions
        self.id2manPos = {};
        for (let i = 0; i < layoutNodes.length; i++) {
            const node = layoutNodes[i];
            let rcPos;
            if (self.position) {
                rcPos = self.position(node);
            }
            if (rcPos && (rcPos.row !== undefined || rcPos.col !== undefined)) {
                // must have at least row or col def'd
                const pos = {
                    row: rcPos.row,
                    col: rcPos.col,
                };
                if (pos.col === undefined) {
                    // find unused col
                    pos.col = 0;
                    while (self.used(pos.row, pos.col)) {
                        pos.col++;
                    }
                }
                else if (pos.row === undefined) {
                    // find unused row
                    pos.row = 0;
                    while (self.used(pos.row, pos.col)) {
                        pos.row++;
                    }
                }
                self.id2manPos[node.id] = pos;
                self.use(pos.row, pos.col);
            }
            self.getPos(node);
        }
        if (self.onLayoutEnd)
            self.onLayoutEnd();
        return {
            edges,
            nodes: layoutNodes,
        };
    }
    small(val) {
        const self = this;
        let res;
        const rows = self.rows || 5;
        const cols = self.cols || 5;
        if (val == null) {
            res = Math.min(rows, cols);
        }
        else {
            const min = Math.min(rows, cols);
            if (min === self.rows) {
                self.rows = val;
            }
            else {
                self.cols = val;
            }
        }
        return res;
    }
    large(val) {
        const self = this;
        let res;
        const rows = self.rows || 5;
        const cols = self.cols || 5;
        if (val == null) {
            res = Math.max(rows, cols);
        }
        else {
            const max = Math.max(rows, cols);
            if (max === self.rows) {
                self.rows = val;
            }
            else {
                self.cols = val;
            }
        }
        return res;
    }
    used(row, col) {
        const self = this;
        return self.cellUsed[`c-${row}-${col}`] || false;
    }
    use(row, col) {
        const self = this;
        self.cellUsed[`c-${row}-${col}`] = true;
    }
    moveToNextCell() {
        const self = this;
        const cols = self.cols || 5;
        self.col++;
        if (self.col >= cols) {
            self.col = 0;
            self.row++;
        }
    }
    getPos(node) {
        const self = this;
        const { begin, cellWidth, cellHeight } = self;
        let x;
        let y;
        // see if we have a manual position set
        const rcPos = self.id2manPos[node.id];
        if (rcPos) {
            x = rcPos.col * cellWidth + cellWidth / 2 + begin[0];
            y = rcPos.row * cellHeight + cellHeight / 2 + begin[1];
        }
        else {
            // otherwise set automatically
            while (self.used(self.row, self.col)) {
                self.moveToNextCell();
            }
            x = self.col * cellWidth + cellWidth / 2 + begin[0];
            y = self.row * cellHeight + cellHeight / 2 + begin[1];
            self.use(self.row, self.col);
            self.moveToNextCell();
        }
        node.x = x;
        node.y = y;
    }
    getType() {
        return 'grid';
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function inlineStyles(source, target) {
    // inline style from source element to the target (detached) one
    const computed = window.getComputedStyle(source);
    for (const styleKey of Array.prototype.slice.call(computed)) {
        target.style[styleKey] = computed[styleKey];
    }
    // recursively call inlineStyles for the element children
    for (let i = 0; i < source.children.length; i++) {
        inlineStyles(source.children[i], target.children[i]);
    }
}
function copyToCanvas(source, target, scale, format, quality) {
    const svgData = new XMLSerializer().serializeToString(target);
    const canvas = document.createElement('canvas');
    const svgSize = source.getBoundingClientRect();
    //Resize can break shadows
    canvas.width = svgSize.width * scale;
    canvas.height = svgSize.height * scale;
    canvas.style.width = `${svgSize.width}`;
    canvas.style.height = `${svgSize.height}`;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    const img = document.createElement('img');
    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData))));
    return new Promise((resolve) => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL(format, quality));
        };
    });
}
function downloadImage(file, name, format) {
    const a = document.createElement('a');
    a.download = `${name}.${format.split('/')[1]}`;
    a.href = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function updateConfig(options) {
    return Object.assign(options || {}, {
        scale: 1,
        format: 'image/png',
        quality: 0.92,
        download: true,
        ignore: null,
        cssinline: 1,
        background: null,
    });
}
function svgToImageDownload(sourceDom, fileName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { scale, format, quality, download, ignore, cssinline, background } = updateConfig(options);
        // Accept a selector or directly a DOM Element
        const source = (sourceDom instanceof Element
            ? sourceDom
            : document.querySelector(sourceDom));
        // Create a new SVG element similar to the source one to avoid modifying the
        // source element.
        const target = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        target.innerHTML = source.innerHTML;
        for (const attr of Array.prototype.slice.call(source.attributes)) {
            target.setAttribute(attr.name, attr.value);
        }
        // Set all the css styles inline on the target element based on the styles
        // of the source element
        if (cssinline === 1) {
            inlineStyles(source, target);
        }
        if (background) {
            target.style.background = background;
        }
        //Remove unwanted elements
        if (ignore !== null) {
            const elt = target.querySelector(ignore);
            elt.parentNode.removeChild(elt);
        }
        //Copy all html to a new canvas
        const file = yield copyToCanvas(source, target, scale, format, quality);
        if (download) {
            downloadImage(file, fileName || 'graph', format);
        }
        return file;
    });
}

class GraphVisualization {
    constructor(element, measureSize, graphData, 
    // public style: GraphStyleModel,
    isFullscreen, layout, onZoomEvent, onDisplayZoomWheelInfoMessage, wheelZoomRequiresModKey, initialZoomToFit) {
        this.measureSize = measureSize;
        this.graphData = graphData;
        this.isFullscreen = isFullscreen;
        this.layout = layout;
        this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
        this.initialZoomToFit = initialZoomToFit;
        // 最小缩放
        this.zoomMinScaleExtent = ZOOM_MIN_SCALE;
        this.callbacks = {};
        // This flags that a panning is ongoing and won't trigger
        // 'canvasClick' event when panning(平移) ends.
        this.draw = false;
        this.isZoomClick = false;
        this.zoomByType = (zoomType) => {
            this.draw = true;
            this.isZoomClick = true;
            if (zoomType === ZoomType.IN) {
                this.zoomBehavior.scaleBy(this.root, 1.3);
            }
            else if (zoomType === ZoomType.OUT) {
                this.zoomBehavior.scaleBy(this.root, 0.7);
            }
            else if (zoomType === ZoomType.FIT) {
                this.zoomToFitViewport();
                this.adjustZoomMinScaleExtentToFitGraph(1);
            }
        };
        this.zoomToFitViewport = () => {
            const scaleAndOffset = this.getZoomScaleFactorToFitWholeGraph();
            if (scaleAndOffset) {
                const { scale, centerPointOffset } = scaleAndOffset;
                // Do not zoom in more than zoom max scale for really small graphs
                this.zoomBehavior.transform(this.root, identity
                    .scale(Math.min(scale, ZOOM_MAX_SCALE))
                    .translate(centerPointOffset.x, centerPointOffset.y));
            }
        };
        // 获取适配整个图谱的缩放大小 以及平移大小
        this.getZoomScaleFactorToFitWholeGraph = () => {
            var _a, _b, _c, _d;
            const graphSize = 
            // this.container.node()返回当前选择集的第一个元素
            ((_a = this.container.node()) === null || _a === void 0 ? void 0 : _a.getBBox) && ((_b = this.container.node()) === null || _b === void 0 ? void 0 : _b.getBBox());
            const availableWidth = (_c = this.root.node()) === null || _c === void 0 ? void 0 : _c.clientWidth;
            const availableHeight = (_d = this.root.node()) === null || _d === void 0 ? void 0 : _d.clientHeight;
            if (graphSize && availableWidth && availableHeight) {
                const graphWidth = graphSize.width;
                const graphHeight = graphSize.height;
                const graphCenterX = graphSize.x + graphWidth / 2;
                const graphCenterY = graphSize.y + graphHeight / 2;
                if (graphWidth === 0 || graphHeight === 0)
                    return;
                const scale = (1 - ZOOM_FIT_PADDING_PERCENT) /
                    Math.max(graphWidth / availableWidth, graphHeight / availableHeight);
                const centerPointOffset = { x: -graphCenterX, y: -graphCenterY };
                return { scale: scale, centerPointOffset: centerPointOffset };
            }
            return;
        };
        this.adjustZoomMinScaleExtentToFitGraph = (padding_factor = 0.75) => {
            const scaleAndOffset = this.getZoomScaleFactorToFitWholeGraph();
            const scaleToFitGraphWithPadding = scaleAndOffset
                ? scaleAndOffset.scale * padding_factor
                : this.zoomMinScaleExtent;
            if (scaleToFitGraphWithPadding <= this.zoomMinScaleExtent) {
                this.zoomMinScaleExtent = scaleToFitGraphWithPadding;
                this.zoomBehavior.scaleExtent([
                    scaleToFitGraphWithPadding,
                    ZOOM_MAX_SCALE,
                ]);
            }
        };
        this.on = (event, callback) => {
            var _a;
            if (isNullish(this.callbacks[event])) {
                this.callbacks[event] = [];
            }
            (_a = this.callbacks[event]) === null || _a === void 0 ? void 0 : _a.push(callback);
            return this;
        };
        this.trigger = (event, ...args) => {
            var _a;
            const callbacksForEvent = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
            // eslint-disable-next-line prefer-spread
            callbacksForEvent.forEach((callback) => callback.apply(null, args));
        };
        this.root = d3Select(element);
        // 初始化配置
        this.initConfig(isFullscreen, layout, wheelZoomRequiresModKey, initialZoomToFit);
        // 初始化图谱数据
        this.initGraphData(graphData);
        // 初始化样式
        this.initStyle();
        // 初始化容器
        this.innitContainer(measureSize);
        // 设置svg的viebox 当画布尺寸变化时 可以调用此函数
        this.resize(this.isFullscreen, this.wheelZoomRequiresModKey);
        // 容器缩放事件
        this.containerZoomEvent(onZoomEvent, onDisplayZoomWheelInfoMessage);
        // 初始化所有节点 边
        this.initNodeAndRelationship();
        // 初始化缩放比例
        this.setInitialZoom();
        // 初始化布局控制逻辑
        this.execLayoutController();
    }
    // 初始化配置
    initConfig(isFullscreen, layout, wheelZoomRequiresModKey, initialZoomToFit) {
        this.layout = layout;
        this.isFullscreen = isFullscreen;
        this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
        this.initialZoomToFit = initialZoomToFit;
    }
    // 初始化图谱数据
    initGraphData(graphData) {
        // init graph data
        this.graph = createGraph(graphData.nodes, graphData.relationships);
    }
    // 初始化样式
    initStyle() {
        // init graph style
        this.style = new GraphStyleModel();
        this.geometry = new GraphGeometryModel(this.style);
    }
    // 初始化容器
    innitContainer(measureSize) {
        // Remove the base group element when re-creating the visualization
        this.root.selectAll('g').remove();
        this.baseGroup = this.root.append('g').attr('transform', 'translate(0,0)');
        this.rect = this.baseGroup
            .append('rect')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            // Make the rect cover the whole surface, center of the svg viewbox is in (0,0)
            .attr('x', () => -Math.floor(measureSize().width / 2))
            .attr('y', () => -Math.floor(measureSize().height / 2))
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('transform', 'scale(1)')
            // Background click event
            // Check if panning is ongoing
            .on('click', () => {
            if (!this.draw) {
                return this.trigger('canvasClicked');
            }
        });
        // node relation container
        this.container = this.baseGroup.append('g');
        this.container.classed('container-layer');
        this.container
            .selectAll('g.layer')
            .data(['relationships', 'nodes'])
            .join('g')
            .attr('class', (d) => `layer ${d}`);
    }
    // 容器缩放事件
    containerZoomEvent(onZoomEvent, onDisplayZoomWheelInfoMessage) {
        this.zoomBehavior = d3Zoom()
            // 设置缩放的范围
            .scaleExtent([this.zoomMinScaleExtent, ZOOM_MAX_SCALE])
            .on('zoom', (e) => {
            const isZoomClick = this.isZoomClick;
            this.draw = true;
            this.isZoomClick = false;
            const currentZoomScale = e.transform.k;
            const limitsReached = {
                zoomInLimitReached: currentZoomScale >= ZOOM_MAX_SCALE,
                zoomOutLimitReached: currentZoomScale <= this.zoomMinScaleExtent,
            };
            onZoomEvent && onZoomEvent(limitsReached);
            return this.container
                .transition()
                .duration(isZoomClick ? 400 : 20)
                .call((sel) => (isZoomClick ? sel.ease(cubicInOut) : sel))
                .attr('transform', String(e.transform));
        })
            // This is the default implementation of wheelDelta function in d3-zoom v3.0.0
            // For some reasons typescript complains when trying to get it by calling zoomBehaviour.wheelDelta() instead
            // but it should be the same (and indeed it works at runtime).
            // https://github.com/d3/d3-zoom/blob/1bccd3fd56ea24e9658bd7e7c24e9b89410c8967/README.md#zoom_wheelDelta
            // Keps the zoom behavior constant for metam ctrl and shift key. Otherwise scrolling is faster with ctrl key.
            .wheelDelta((e) => -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002))
            .filter((e) => {
            if (e.type === 'wheel') {
                const modKeySelected = e.metaKey || e.ctrlKey || e.shiftKey;
                if (this.wheelZoomRequiresModKey && !modKeySelected) {
                    onDisplayZoomWheelInfoMessage && onDisplayZoomWheelInfoMessage();
                    return false;
                }
            }
            return true;
        });
        this.root
            .call(this.zoomBehavior)
            // Single click is not panning
            .on('click.zoom', () => (this.draw = false))
            .on('dblclick.zoom', null);
    }
    // 初始化节点 边以及缩放比例
    initNodeAndRelationship() {
        this.updateNodes();
        this.updateRelationships();
    }
    // 初始化布局
    execLayoutController() {
        switch (this.layout) {
            case 'force':
                this.forceSimulationHandler();
                break;
            case 'circular':
                this.cricularLayoutHandler();
                break;
            case 'grid':
                this.gridLayoutHandler();
                break;
        }
    }
    update(options) {
        var _a;
        if (options.updateNodes) {
            this.updateNodes();
            this.forceSimulation.updateNodes(this.graph);
            this.forceSimulation.updateRelationships(this.graph);
        }
        if (options.updateRelationships) {
            this.updateRelationships();
            this.forceSimulation.updateRelationships(this.graph);
        }
        if ((_a = options.restartSimulation) !== null && _a !== void 0 ? _a : true) {
            this.forceSimulation.restart();
        }
        this.trigger('updated');
    }
    updateNodes() {
        const nodes = this.graph.nodes();
        this.geometry.onGraphChange(this.graph, {
            updateNodes: true,
            updateRelationships: false,
        });
        const nodeGroups = this.container
            .select('g.layer.nodes')
            .selectAll('g.node')
            .data(nodes, (d) => d.id)
            .join('g')
            .attr('class', 'node')
            .attr('aria-label', (d) => `graph-node${d.id}`)
            .call(nodeEventHandlers, this.trigger)
            // 如果被选中 那么添加对应的选择样式
            .classed('selected', (node) => node.selected);
        if (this.layout !== 'force') {
            // drag事件
            this.container
                .select('g.layer.nodes')
                .selectAll('g.node')
                .call(nodeDragEventHandlers);
        }
        node.forEach((renderer) => nodeGroups.call(renderer.onGraphChange, this));
    }
    updateRelationships() {
        const relationships = this.graph.relationships();
        this.geometry.onGraphChange(this.graph, {
            updateNodes: false,
            updateRelationships: true,
        });
        const relationshipGroups = this.container
            .select('g.layer.relationships')
            .selectAll('g.relationship')
            .data(relationships, (d) => d.id)
            .join('g')
            .attr('class', 'relationship')
            .call(relationshipEventHandlers, this.trigger)
            .classed('selected', (relationship) => relationship.selected);
        relationship.forEach((renderer) => relationshipGroups.call(renderer.onGraphChange, this));
    }
    // 更新节点样式
    updateNodesStyle(node, style) {
        const { color, size } = style;
        color && node.class.push(color);
        size && node.class.push(`${size}`);
        const colorStyle = color ? { color } : {};
        const sizeStyle = size ? { diameter: `${50 * size}px` } : {};
        this.style.changeForSelectorWithNodeClass(node, Object.assign(Object.assign({}, colorStyle), sizeStyle));
        this.updateNodes();
    }
    updateRelationShipsStyle(style) {
        const { color } = style;
        const colorStyle = color ? { color } : {};
        this.style.changeForSelectorWithRelationClass(Object.assign({}, colorStyle));
        this.updateRelationships();
    }
    render() {
        this.geometry.onTick(this.graph);
        const nodeGroups = this.container
            .selectAll('g.node')
            .attr('transform', (d) => `translate(${d.x},${d.y})`);
        node.forEach((renderer) => nodeGroups.call(renderer.onTick, this));
        const relationshipGroups = this.container
            .selectAll('g.relationship')
            .attr('transform', (d) => `translate(${d.source.x} ${d.source.y}) rotate(${d.naturalAngle + 180})`);
        relationship.forEach((renderer) => relationshipGroups.call(renderer.onTick, this));
    }
    setInitialZoom() {
        const count = this.graph.nodes().length;
        // chosen by *feel* (graph fitting guesstimate)
        const scale = -0.02364554 + 1.913 / (1 + Math.pow((count / 12.7211), 0.8156444));
        this.zoomBehavior.scaleBy(this.root, Math.max(0, scale));
    }
    precomputeAndStart() {
        this.forceSimulation.precomputeAndStart(() => this.initialZoomToFit && this.zoomByType(ZoomType.FIT));
    }
    resize(isFullscreen, wheelZoomRequiresModKey) {
        const size = this.measureSize();
        this.isFullscreen = isFullscreen || this.isFullscreen;
        this.wheelZoomRequiresModKey =
            wheelZoomRequiresModKey || this.wheelZoomRequiresModKey;
        this.rect
            .attr('x', () => -Math.floor(size.width / 2))
            .attr('y', () => -Math.floor(size.height / 2));
        this.root.attr('viewBox', [
            -Math.floor(size.width / 2),
            -Math.floor(size.height / 2),
            size.width,
            size.height,
        ].join(' '));
    }
    boundingBox() {
        var _a;
        return (_a = this.container.node()) === null || _a === void 0 ? void 0 : _a.getBBox();
    }
    // init graph bind event
    initEventHandler(getNodeNeighbours, onItemMouseOver, onItemSelect, onGraphModelChange, onGraphInteraction) {
        const graphEventHandler = new GraphEventHandlerModel(this.graph, this, getNodeNeighbours, onItemMouseOver, onItemSelect, onGraphModelChange, onGraphInteraction);
        graphEventHandler.bindEventHandlers();
        return graphEventHandler;
    }
    // 环形布局
    cricularLayoutHandler() {
        // 关闭力模型布局
        this.forceSimulation && this.forceSimulation.stop();
        const size = this.measureSize();
        const padding_margin = 100;
        this.circularlayout = new CircularLayout({
            type: 'circular',
            center: [0, 0],
            width: size.width - padding_margin,
            height: size.height - padding_margin,
            startRadius: null,
            endRadius: null,
            clockwise: true,
            ordering: 'degree',
            // nodeSpacing: 20,
            // nodeSize: 25,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            nodes: this.graph.nodes(),
            edges: this.graph.relationships(),
        });
        this.circularlayout.execute();
        this.render();
    }
    // 力模型布局
    forceSimulationHandler() {
        this.adjustZoomMinScaleExtentToFitGraph();
        this.forceSimulation = new ForceSimulation(this.render.bind(this));
        // drag事件
        this.container
            .select('g.layer.nodes')
            .selectAll('g.node')
            .call(nodeForceDragEventHandlers, this.forceSimulation.simulation);
        this.forceSimulation.updateNodes(this.graph);
        this.forceSimulation.updateRelationships(this.graph);
        this.precomputeAndStart();
    }
    // 网格布局
    gridLayoutHandler() {
        // 关闭力模型布局
        this.forceSimulation && this.forceSimulation.stop();
        const size = this.measureSize();
        const padding_margin = 100;
        this.gridLayout = new GridLayout({
            type: 'grid',
            width: size.width - padding_margin,
            height: size.height - padding_margin,
            begin: [0, 0],
            nodes: this.graph.nodes(),
            edges: this.graph.relationships(),
        });
        this.gridLayout.execute();
        this.render();
    }
    // 下载图片
    downloadImage(dom, fileName, options) {
        svgToImageDownload(dom, fileName, options);
    }
    // 根据出入度更新图谱
    updateGraphWithDegree() {
        const nodes = this.graph.nodes();
        nodes.forEach((item) => {
            item.degree = item.relationshipCount(this.graph);
        });
        this.updateNodes();
        this.updateRelationships();
        this.execLayoutController();
    }
    // 重置出入度更新图谱
    updateGraphWithResetDegree() {
        const nodes = this.graph.nodes();
        nodes.forEach((item) => {
            item.degree = 0;
        });
        this.updateNodes();
        this.updateRelationships();
        this.execLayoutController();
    }
    // 销毁画布
    destroy() {
        this.root.selectChildren().remove();
    }
}

return GraphVisualization;

}));
