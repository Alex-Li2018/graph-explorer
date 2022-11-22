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

function uniq(list) {
    return [...new Set(list)];
}
class GraphModel {
    _nodes;
    _relationships;
    expandedNodeMap;
    nodeMap;
    relationshipMap;
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
        this.expandedNodeMap = {};
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
    addExpandedNodes = (node, nodes) => {
        for (const eNode of Array.from(nodes)) {
            if (this.findNode(eNode.id) == null) {
                this.nodeMap[eNode.id] = eNode;
                this._nodes.push(eNode);
                this.expandedNodeMap[node.id] = this.expandedNodeMap[node.id]
                    ? uniq(this.expandedNodeMap[node.id].concat([eNode.id]))
                    : [eNode.id];
            }
        }
    };
    removeNode(node) {
        if (this.findNode(node.id) != null) {
            delete this.nodeMap[node.id];
            this._nodes.splice(this._nodes.indexOf(node), 1);
        }
    }
    collapseNode = (node) => {
        if (!this.expandedNodeMap[node.id]) {
            return;
        }
        this.expandedNodeMap[node.id].forEach((id) => {
            const eNode = this.nodeMap[id];
            this.collapseNode(eNode);
            this.removeConnectedRelationships(eNode);
            this.removeNode(eNode);
        });
        this.expandedNodeMap[node.id] = [];
    };
    updateNode(node) {
        if (this.findNode(node.id) != null) {
            this.removeNode(node);
            node.expanded = false;
            node.minified = true;
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
    resetGraph() {
        this.nodeMap = {};
        this._nodes = [];
        this.relationshipMap = {};
        this._relationships = [];
    }
}
class NodePair {
    nodeA;
    nodeB;
    relationships;
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
    id;
    labels;
    propertyList;
    propertyMap;
    isNode = true;
    isRelationship = false;
    // Visualisation properties
    radius;
    caption;
    selected;
    expanded;
    minified;
    contextMenu;
    x;
    y;
    fx = null;
    fy = null;
    hoverFixed;
    initialPositionCalculated;
    // 节点的度
    degree;
    constructor(id, labels, properties, propertyTypes) {
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
        this.expanded = false;
        this.minified = false;
        this.x = 0;
        this.y = 0;
        this.hoverFixed = false;
        this.initialPositionCalculated = false;
        this.degree = 0;
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
    id;
    propertyList;
    propertyMap;
    source;
    target;
    type;
    isNode = false;
    isRelationship = true;
    naturalAngle;
    caption;
    captionLength;
    captionHeight;
    captionLayout;
    shortCaption;
    shortCaptionLength;
    selected;
    centreDistance;
    internal;
    arrow;
    constructor(id, source, target, type, properties, propertyTypes) {
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

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (val) => typeof val === 'function';
const isNumber = (val) => typeof val === 'number';
function isNullish(x) {
    return x === null || x === undefined;
}
function optionalToString(value) {
    return !isNullish(value) && typeof value?.toString === 'function'
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
    return terminal?.id;
};

// map graph data
const stringifyValues$1 = (obj) => Object.keys(obj).map((k) => ({
    [k]: obj[k] === null ? 'null' : optionalToString(obj[k]),
}));
const mapProperties$1 = (_) => Object.assign({}, ...stringifyValues$1(_));
function createGraph(nodes, relationships) {
    const graph = new GraphModel();
    graph.addNodes(mapNodes$1(nodes));
    graph.addRelationships(mapRelationships$1(relationships, graph));
    return graph;
}
function mapNodes$1(nodes) {
    return nodes.map((node) => new NodeModel(node.id, node.labels, mapProperties$1(node.properties), node.propertyTypes));
}
function mapRelationships$1(relationships, graph) {
    return relationships.map((rel) => {
        const source = graph.findNode(rel.startNodeId);
        const target = graph.findNode(rel.endNodeId);
        return new RelationshipModel(rel.id, source, target, rel.type, mapProperties$1(rel.properties), rel.propertyTypes);
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
    deflection;
    midShaftPoint;
    outline;
    overlay;
    shaftLength;
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
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `${this.x} ${this.y}`;
    }
}
class LoopArrow {
    midShaftPoint;
    outline;
    overlay;
    shaftLength;
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
    length;
    midShaftPoint;
    outline;
    overlay;
    shaftLength;
    deflection = 0;
    constructor(startRadius, endRadius, centreDistance, shaftWidth, headWidth, headHeight, captionLayout) {
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
    style;
    canvas;
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
    relationshipRouting;
    style;
    canvas;
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
            const template = this.style.forRelationship(relationship).get('caption');
            relationship.caption = this.style.interpolate(template, relationship);
        });
    }
    setNodeRadii(nodes) {
        nodes.forEach((node) => {
            node.radius = parseFloat(this.style.forNode(node).get('diameter')) / 2;
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

var chroma$1 = {exports: {}};

/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory() ;
	})(window, (function () {
	    var limit$2 = function (x, min, max) {
	        if ( min === void 0 ) min=0;
	        if ( max === void 0 ) max=1;

	        return x < min ? min : x > max ? max : x;
	    };

	    var limit$1 = limit$2;

	    var clip_rgb$3 = function (rgb) {
	        rgb._clipped = false;
	        rgb._unclipped = rgb.slice(0);
	        for (var i=0; i<=3; i++) {
	            if (i < 3) {
	                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
	                rgb[i] = limit$1(rgb[i], 0, 255);
	            } else if (i === 3) {
	                rgb[i] = limit$1(rgb[i], 0, 1);
	            }
	        }
	        return rgb;
	    };

	    // ported from jQuery's $.type
	    var classToType = {};
	    for (var i$1 = 0, list$1 = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i$1 < list$1.length; i$1 += 1) {
	        var name = list$1[i$1];

	        classToType[("[object " + name + "]")] = name.toLowerCase();
	    }
	    var type$p = function(obj) {
	        return classToType[Object.prototype.toString.call(obj)] || "object";
	    };

	    var type$o = type$p;

	    var unpack$B = function (args, keyOrder) {
	        if ( keyOrder === void 0 ) keyOrder=null;

	    	// if called with more than 3 arguments, we return the arguments
	        if (args.length >= 3) { return Array.prototype.slice.call(args); }
	        // with less than 3 args we check if first arg is object
	        // and use the keyOrder string to extract and sort properties
	    	if (type$o(args[0]) == 'object' && keyOrder) {
	    		return keyOrder.split('')
	    			.filter(function (k) { return args[0][k] !== undefined; })
	    			.map(function (k) { return args[0][k]; });
	    	}
	    	// otherwise we just return the first argument
	    	// (which we suppose is an array of args)
	        return args[0];
	    };

	    var type$n = type$p;

	    var last$4 = function (args) {
	        if (args.length < 2) { return null; }
	        var l = args.length-1;
	        if (type$n(args[l]) == 'string') { return args[l].toLowerCase(); }
	        return null;
	    };

	    var PI$2 = Math.PI;

	    var utils = {
	    	clip_rgb: clip_rgb$3,
	    	limit: limit$2,
	    	type: type$p,
	    	unpack: unpack$B,
	    	last: last$4,
	    	PI: PI$2,
	    	TWOPI: PI$2*2,
	    	PITHIRD: PI$2/3,
	    	DEG2RAD: PI$2 / 180,
	    	RAD2DEG: 180 / PI$2
	    };

	    var input$h = {
	    	format: {},
	    	autodetect: []
	    };

	    var last$3 = utils.last;
	    var clip_rgb$2 = utils.clip_rgb;
	    var type$m = utils.type;
	    var _input = input$h;

	    var Color$D = function Color() {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var me = this;
	        if (type$m(args[0]) === 'object' &&
	            args[0].constructor &&
	            args[0].constructor === this.constructor) {
	            // the argument is already a Color instance
	            return args[0];
	        }

	        // last argument could be the mode
	        var mode = last$3(args);
	        var autodetect = false;

	        if (!mode) {
	            autodetect = true;
	            if (!_input.sorted) {
	                _input.autodetect = _input.autodetect.sort(function (a,b) { return b.p - a.p; });
	                _input.sorted = true;
	            }
	            // auto-detect format
	            for (var i = 0, list = _input.autodetect; i < list.length; i += 1) {
	                var chk = list[i];

	                mode = chk.test.apply(chk, args);
	                if (mode) { break; }
	            }
	        }

	        if (_input.format[mode]) {
	            var rgb = _input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
	            me._rgb = clip_rgb$2(rgb);
	        } else {
	            throw new Error('unknown format: '+args);
	        }

	        // add alpha channel
	        if (me._rgb.length === 3) { me._rgb.push(1); }
	    };

	    Color$D.prototype.toString = function toString () {
	        if (type$m(this.hex) == 'function') { return this.hex(); }
	        return ("[" + (this._rgb.join(',')) + "]");
	    };

	    var Color_1 = Color$D;

	    var chroma$k = function () {
	    	var args = [], len = arguments.length;
	    	while ( len-- ) args[ len ] = arguments[ len ];

	    	return new (Function.prototype.bind.apply( chroma$k.Color, [ null ].concat( args) ));
	    };

	    chroma$k.Color = Color_1;
	    chroma$k.version = '2.4.2';

	    var chroma_1 = chroma$k;

	    var unpack$A = utils.unpack;
	    var max$2 = Math.max;

	    var rgb2cmyk$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$A(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        r = r / 255;
	        g = g / 255;
	        b = b / 255;
	        var k = 1 - max$2(r,max$2(g,b));
	        var f = k < 1 ? 1 / (1-k) : 0;
	        var c = (1-r-k) * f;
	        var m = (1-g-k) * f;
	        var y = (1-b-k) * f;
	        return [c,m,y,k];
	    };

	    var rgb2cmyk_1 = rgb2cmyk$1;

	    var unpack$z = utils.unpack;

	    var cmyk2rgb = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$z(args, 'cmyk');
	        var c = args[0];
	        var m = args[1];
	        var y = args[2];
	        var k = args[3];
	        var alpha = args.length > 4 ? args[4] : 1;
	        if (k === 1) { return [0,0,0,alpha]; }
	        return [
	            c >= 1 ? 0 : 255 * (1-c) * (1-k), // r
	            m >= 1 ? 0 : 255 * (1-m) * (1-k), // g
	            y >= 1 ? 0 : 255 * (1-y) * (1-k), // b
	            alpha
	        ];
	    };

	    var cmyk2rgb_1 = cmyk2rgb;

	    var chroma$j = chroma_1;
	    var Color$C = Color_1;
	    var input$g = input$h;
	    var unpack$y = utils.unpack;
	    var type$l = utils.type;

	    var rgb2cmyk = rgb2cmyk_1;

	    Color$C.prototype.cmyk = function() {
	        return rgb2cmyk(this._rgb);
	    };

	    chroma$j.cmyk = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$C, [ null ].concat( args, ['cmyk']) ));
	    };

	    input$g.format.cmyk = cmyk2rgb_1;

	    input$g.autodetect.push({
	        p: 2,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$y(args, 'cmyk');
	            if (type$l(args) === 'array' && args.length === 4) {
	                return 'cmyk';
	            }
	        }
	    });

	    var unpack$x = utils.unpack;
	    var last$2 = utils.last;
	    var rnd = function (a) { return Math.round(a*100)/100; };

	    /*
	     * supported arguments:
	     * - hsl2css(h,s,l)
	     * - hsl2css(h,s,l,a)
	     * - hsl2css([h,s,l], mode)
	     * - hsl2css([h,s,l,a], mode)
	     * - hsl2css({h,s,l,a}, mode)
	     */
	    var hsl2css$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var hsla = unpack$x(args, 'hsla');
	        var mode = last$2(args) || 'lsa';
	        hsla[0] = rnd(hsla[0] || 0);
	        hsla[1] = rnd(hsla[1]*100) + '%';
	        hsla[2] = rnd(hsla[2]*100) + '%';
	        if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
	            hsla[3] = hsla.length > 3 ? hsla[3] : 1;
	            mode = 'hsla';
	        } else {
	            hsla.length = 3;
	        }
	        return (mode + "(" + (hsla.join(',')) + ")");
	    };

	    var hsl2css_1 = hsl2css$1;

	    var unpack$w = utils.unpack;

	    /*
	     * supported arguments:
	     * - rgb2hsl(r,g,b)
	     * - rgb2hsl(r,g,b,a)
	     * - rgb2hsl([r,g,b])
	     * - rgb2hsl([r,g,b,a])
	     * - rgb2hsl({r,g,b,a})
	     */
	    var rgb2hsl$3 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$w(args, 'rgba');
	        var r = args[0];
	        var g = args[1];
	        var b = args[2];

	        r /= 255;
	        g /= 255;
	        b /= 255;

	        var min = Math.min(r, g, b);
	        var max = Math.max(r, g, b);

	        var l = (max + min) / 2;
	        var s, h;

	        if (max === min){
	            s = 0;
	            h = Number.NaN;
	        } else {
	            s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
	        }

	        if (r == max) { h = (g - b) / (max - min); }
	        else if (g == max) { h = 2 + (b - r) / (max - min); }
	        else if (b == max) { h = 4 + (r - g) / (max - min); }

	        h *= 60;
	        if (h < 0) { h += 360; }
	        if (args.length>3 && args[3]!==undefined) { return [h,s,l,args[3]]; }
	        return [h,s,l];
	    };

	    var rgb2hsl_1 = rgb2hsl$3;

	    var unpack$v = utils.unpack;
	    var last$1 = utils.last;
	    var hsl2css = hsl2css_1;
	    var rgb2hsl$2 = rgb2hsl_1;
	    var round$6 = Math.round;

	    /*
	     * supported arguments:
	     * - rgb2css(r,g,b)
	     * - rgb2css(r,g,b,a)
	     * - rgb2css([r,g,b], mode)
	     * - rgb2css([r,g,b,a], mode)
	     * - rgb2css({r,g,b,a}, mode)
	     */
	    var rgb2css$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var rgba = unpack$v(args, 'rgba');
	        var mode = last$1(args) || 'rgb';
	        if (mode.substr(0,3) == 'hsl') {
	            return hsl2css(rgb2hsl$2(rgba), mode);
	        }
	        rgba[0] = round$6(rgba[0]);
	        rgba[1] = round$6(rgba[1]);
	        rgba[2] = round$6(rgba[2]);
	        if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
	            rgba[3] = rgba.length > 3 ? rgba[3] : 1;
	            mode = 'rgba';
	        }
	        return (mode + "(" + (rgba.slice(0,mode==='rgb'?3:4).join(',')) + ")");
	    };

	    var rgb2css_1 = rgb2css$1;

	    var unpack$u = utils.unpack;
	    var round$5 = Math.round;

	    var hsl2rgb$1 = function () {
	        var assign;

	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];
	        args = unpack$u(args, 'hsl');
	        var h = args[0];
	        var s = args[1];
	        var l = args[2];
	        var r,g,b;
	        if (s === 0) {
	            r = g = b = l*255;
	        } else {
	            var t3 = [0,0,0];
	            var c = [0,0,0];
	            var t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
	            var t1 = 2 * l - t2;
	            var h_ = h / 360;
	            t3[0] = h_ + 1/3;
	            t3[1] = h_;
	            t3[2] = h_ - 1/3;
	            for (var i=0; i<3; i++) {
	                if (t3[i] < 0) { t3[i] += 1; }
	                if (t3[i] > 1) { t3[i] -= 1; }
	                if (6 * t3[i] < 1)
	                    { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
	                else if (2 * t3[i] < 1)
	                    { c[i] = t2; }
	                else if (3 * t3[i] < 2)
	                    { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
	                else
	                    { c[i] = t1; }
	            }
	            (assign = [round$5(c[0]*255),round$5(c[1]*255),round$5(c[2]*255)], r = assign[0], g = assign[1], b = assign[2]);
	        }
	        if (args.length > 3) {
	            // keep alpha channel
	            return [r,g,b,args[3]];
	        }
	        return [r,g,b,1];
	    };

	    var hsl2rgb_1 = hsl2rgb$1;

	    var hsl2rgb = hsl2rgb_1;
	    var input$f = input$h;

	    var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
	    var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
	    var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
	    var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
	    var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
	    var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

	    var round$4 = Math.round;

	    var css2rgb$1 = function (css) {
	        css = css.toLowerCase().trim();
	        var m;

	        if (input$f.format.named) {
	            try {
	                return input$f.format.named(css);
	            } catch (e) {
	                // eslint-disable-next-line
	            }
	        }

	        // rgb(250,20,0)
	        if ((m = css.match(RE_RGB))) {
	            var rgb = m.slice(1,4);
	            for (var i=0; i<3; i++) {
	                rgb[i] = +rgb[i];
	            }
	            rgb[3] = 1;  // default alpha
	            return rgb;
	        }

	        // rgba(250,20,0,0.4)
	        if ((m = css.match(RE_RGBA))) {
	            var rgb$1 = m.slice(1,5);
	            for (var i$1=0; i$1<4; i$1++) {
	                rgb$1[i$1] = +rgb$1[i$1];
	            }
	            return rgb$1;
	        }

	        // rgb(100%,0%,0%)
	        if ((m = css.match(RE_RGB_PCT))) {
	            var rgb$2 = m.slice(1,4);
	            for (var i$2=0; i$2<3; i$2++) {
	                rgb$2[i$2] = round$4(rgb$2[i$2] * 2.55);
	            }
	            rgb$2[3] = 1;  // default alpha
	            return rgb$2;
	        }

	        // rgba(100%,0%,0%,0.4)
	        if ((m = css.match(RE_RGBA_PCT))) {
	            var rgb$3 = m.slice(1,5);
	            for (var i$3=0; i$3<3; i$3++) {
	                rgb$3[i$3] = round$4(rgb$3[i$3] * 2.55);
	            }
	            rgb$3[3] = +rgb$3[3];
	            return rgb$3;
	        }

	        // hsl(0,100%,50%)
	        if ((m = css.match(RE_HSL))) {
	            var hsl = m.slice(1,4);
	            hsl[1] *= 0.01;
	            hsl[2] *= 0.01;
	            var rgb$4 = hsl2rgb(hsl);
	            rgb$4[3] = 1;
	            return rgb$4;
	        }

	        // hsla(0,100%,50%,0.5)
	        if ((m = css.match(RE_HSLA))) {
	            var hsl$1 = m.slice(1,4);
	            hsl$1[1] *= 0.01;
	            hsl$1[2] *= 0.01;
	            var rgb$5 = hsl2rgb(hsl$1);
	            rgb$5[3] = +m[4];  // default alpha = 1
	            return rgb$5;
	        }
	    };

	    css2rgb$1.test = function (s) {
	        return RE_RGB.test(s) ||
	            RE_RGBA.test(s) ||
	            RE_RGB_PCT.test(s) ||
	            RE_RGBA_PCT.test(s) ||
	            RE_HSL.test(s) ||
	            RE_HSLA.test(s);
	    };

	    var css2rgb_1 = css2rgb$1;

	    var chroma$i = chroma_1;
	    var Color$B = Color_1;
	    var input$e = input$h;
	    var type$k = utils.type;

	    var rgb2css = rgb2css_1;
	    var css2rgb = css2rgb_1;

	    Color$B.prototype.css = function(mode) {
	        return rgb2css(this._rgb, mode);
	    };

	    chroma$i.css = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$B, [ null ].concat( args, ['css']) ));
	    };

	    input$e.format.css = css2rgb;

	    input$e.autodetect.push({
	        p: 5,
	        test: function (h) {
	            var rest = [], len = arguments.length - 1;
	            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

	            if (!rest.length && type$k(h) === 'string' && css2rgb.test(h)) {
	                return 'css';
	            }
	        }
	    });

	    var Color$A = Color_1;
	    var chroma$h = chroma_1;
	    var input$d = input$h;
	    var unpack$t = utils.unpack;

	    input$d.format.gl = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var rgb = unpack$t(args, 'rgba');
	        rgb[0] *= 255;
	        rgb[1] *= 255;
	        rgb[2] *= 255;
	        return rgb;
	    };

	    chroma$h.gl = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$A, [ null ].concat( args, ['gl']) ));
	    };

	    Color$A.prototype.gl = function() {
	        var rgb = this._rgb;
	        return [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]];
	    };

	    var unpack$s = utils.unpack;

	    var rgb2hcg$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$s(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        var min = Math.min(r, g, b);
	        var max = Math.max(r, g, b);
	        var delta = max - min;
	        var c = delta * 100 / 255;
	        var _g = min / (255 - delta) * 100;
	        var h;
	        if (delta === 0) {
	            h = Number.NaN;
	        } else {
	            if (r === max) { h = (g - b) / delta; }
	            if (g === max) { h = 2+(b - r) / delta; }
	            if (b === max) { h = 4+(r - g) / delta; }
	            h *= 60;
	            if (h < 0) { h += 360; }
	        }
	        return [h, c, _g];
	    };

	    var rgb2hcg_1 = rgb2hcg$1;

	    var unpack$r = utils.unpack;
	    var floor$3 = Math.floor;

	    /*
	     * this is basically just HSV with some minor tweaks
	     *
	     * hue.. [0..360]
	     * chroma .. [0..1]
	     * grayness .. [0..1]
	     */

	    var hcg2rgb = function () {
	        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];
	        args = unpack$r(args, 'hcg');
	        var h = args[0];
	        var c = args[1];
	        var _g = args[2];
	        var r,g,b;
	        _g = _g * 255;
	        var _c = c * 255;
	        if (c === 0) {
	            r = g = b = _g;
	        } else {
	            if (h === 360) { h = 0; }
	            if (h > 360) { h -= 360; }
	            if (h < 0) { h += 360; }
	            h /= 60;
	            var i = floor$3(h);
	            var f = h - i;
	            var p = _g * (1 - c);
	            var q = p + _c * (1 - f);
	            var t = p + _c * f;
	            var v = p + _c;
	            switch (i) {
	                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
	                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
	                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
	                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
	                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
	                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
	            }
	        }
	        return [r, g, b, args.length > 3 ? args[3] : 1];
	    };

	    var hcg2rgb_1 = hcg2rgb;

	    var unpack$q = utils.unpack;
	    var type$j = utils.type;
	    var chroma$g = chroma_1;
	    var Color$z = Color_1;
	    var input$c = input$h;

	    var rgb2hcg = rgb2hcg_1;

	    Color$z.prototype.hcg = function() {
	        return rgb2hcg(this._rgb);
	    };

	    chroma$g.hcg = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$z, [ null ].concat( args, ['hcg']) ));
	    };

	    input$c.format.hcg = hcg2rgb_1;

	    input$c.autodetect.push({
	        p: 1,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$q(args, 'hcg');
	            if (type$j(args) === 'array' && args.length === 3) {
	                return 'hcg';
	            }
	        }
	    });

	    var unpack$p = utils.unpack;
	    var last = utils.last;
	    var round$3 = Math.round;

	    var rgb2hex$2 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$p(args, 'rgba');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        var a = ref[3];
	        var mode = last(args) || 'auto';
	        if (a === undefined) { a = 1; }
	        if (mode === 'auto') {
	            mode = a < 1 ? 'rgba' : 'rgb';
	        }
	        r = round$3(r);
	        g = round$3(g);
	        b = round$3(b);
	        var u = r << 16 | g << 8 | b;
	        var str = "000000" + u.toString(16); //#.toUpperCase();
	        str = str.substr(str.length - 6);
	        var hxa = '0' + round$3(a * 255).toString(16);
	        hxa = hxa.substr(hxa.length - 2);
	        switch (mode.toLowerCase()) {
	            case 'rgba': return ("#" + str + hxa);
	            case 'argb': return ("#" + hxa + str);
	            default: return ("#" + str);
	        }
	    };

	    var rgb2hex_1 = rgb2hex$2;

	    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

	    var hex2rgb$1 = function (hex) {
	        if (hex.match(RE_HEX)) {
	            // remove optional leading #
	            if (hex.length === 4 || hex.length === 7) {
	                hex = hex.substr(1);
	            }
	            // expand short-notation to full six-digit
	            if (hex.length === 3) {
	                hex = hex.split('');
	                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	            }
	            var u = parseInt(hex, 16);
	            var r = u >> 16;
	            var g = u >> 8 & 0xFF;
	            var b = u & 0xFF;
	            return [r,g,b,1];
	        }

	        // match rgba hex format, eg #FF000077
	        if (hex.match(RE_HEXA)) {
	            if (hex.length === 5 || hex.length === 9) {
	                // remove optional leading #
	                hex = hex.substr(1);
	            }
	            // expand short-notation to full eight-digit
	            if (hex.length === 4) {
	                hex = hex.split('');
	                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
	            }
	            var u$1 = parseInt(hex, 16);
	            var r$1 = u$1 >> 24 & 0xFF;
	            var g$1 = u$1 >> 16 & 0xFF;
	            var b$1 = u$1 >> 8 & 0xFF;
	            var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
	            return [r$1,g$1,b$1,a];
	        }

	        // we used to check for css colors here
	        // if _input.css? and rgb = _input.css hex
	        //     return rgb

	        throw new Error(("unknown hex color: " + hex));
	    };

	    var hex2rgb_1 = hex2rgb$1;

	    var chroma$f = chroma_1;
	    var Color$y = Color_1;
	    var type$i = utils.type;
	    var input$b = input$h;

	    var rgb2hex$1 = rgb2hex_1;

	    Color$y.prototype.hex = function(mode) {
	        return rgb2hex$1(this._rgb, mode);
	    };

	    chroma$f.hex = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$y, [ null ].concat( args, ['hex']) ));
	    };

	    input$b.format.hex = hex2rgb_1;
	    input$b.autodetect.push({
	        p: 4,
	        test: function (h) {
	            var rest = [], len = arguments.length - 1;
	            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

	            if (!rest.length && type$i(h) === 'string' && [3,4,5,6,7,8,9].indexOf(h.length) >= 0) {
	                return 'hex';
	            }
	        }
	    });

	    var unpack$o = utils.unpack;
	    var TWOPI$2 = utils.TWOPI;
	    var min$2 = Math.min;
	    var sqrt$4 = Math.sqrt;
	    var acos = Math.acos;

	    var rgb2hsi$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        /*
	        borrowed from here:
	        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
	        */
	        var ref = unpack$o(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        r /= 255;
	        g /= 255;
	        b /= 255;
	        var h;
	        var min_ = min$2(r,g,b);
	        var i = (r+g+b) / 3;
	        var s = i > 0 ? 1 - min_/i : 0;
	        if (s === 0) {
	            h = NaN;
	        } else {
	            h = ((r-g)+(r-b)) / 2;
	            h /= sqrt$4((r-g)*(r-g) + (r-b)*(g-b));
	            h = acos(h);
	            if (b > g) {
	                h = TWOPI$2 - h;
	            }
	            h /= TWOPI$2;
	        }
	        return [h*360,s,i];
	    };

	    var rgb2hsi_1 = rgb2hsi$1;

	    var unpack$n = utils.unpack;
	    var limit = utils.limit;
	    var TWOPI$1 = utils.TWOPI;
	    var PITHIRD = utils.PITHIRD;
	    var cos$4 = Math.cos;

	    /*
	     * hue [0..360]
	     * saturation [0..1]
	     * intensity [0..1]
	     */
	    var hsi2rgb = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        /*
	        borrowed from here:
	        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
	        */
	        args = unpack$n(args, 'hsi');
	        var h = args[0];
	        var s = args[1];
	        var i = args[2];
	        var r,g,b;

	        if (isNaN(h)) { h = 0; }
	        if (isNaN(s)) { s = 0; }
	        // normalize hue
	        if (h > 360) { h -= 360; }
	        if (h < 0) { h += 360; }
	        h /= 360;
	        if (h < 1/3) {
	            b = (1-s)/3;
	            r = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
	            g = 1 - (b+r);
	        } else if (h < 2/3) {
	            h -= 1/3;
	            r = (1-s)/3;
	            g = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
	            b = 1 - (r+g);
	        } else {
	            h -= 2/3;
	            g = (1-s)/3;
	            b = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
	            r = 1 - (g+b);
	        }
	        r = limit(i*r*3);
	        g = limit(i*g*3);
	        b = limit(i*b*3);
	        return [r*255, g*255, b*255, args.length > 3 ? args[3] : 1];
	    };

	    var hsi2rgb_1 = hsi2rgb;

	    var unpack$m = utils.unpack;
	    var type$h = utils.type;
	    var chroma$e = chroma_1;
	    var Color$x = Color_1;
	    var input$a = input$h;

	    var rgb2hsi = rgb2hsi_1;

	    Color$x.prototype.hsi = function() {
	        return rgb2hsi(this._rgb);
	    };

	    chroma$e.hsi = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$x, [ null ].concat( args, ['hsi']) ));
	    };

	    input$a.format.hsi = hsi2rgb_1;

	    input$a.autodetect.push({
	        p: 2,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$m(args, 'hsi');
	            if (type$h(args) === 'array' && args.length === 3) {
	                return 'hsi';
	            }
	        }
	    });

	    var unpack$l = utils.unpack;
	    var type$g = utils.type;
	    var chroma$d = chroma_1;
	    var Color$w = Color_1;
	    var input$9 = input$h;

	    var rgb2hsl$1 = rgb2hsl_1;

	    Color$w.prototype.hsl = function() {
	        return rgb2hsl$1(this._rgb);
	    };

	    chroma$d.hsl = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$w, [ null ].concat( args, ['hsl']) ));
	    };

	    input$9.format.hsl = hsl2rgb_1;

	    input$9.autodetect.push({
	        p: 2,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$l(args, 'hsl');
	            if (type$g(args) === 'array' && args.length === 3) {
	                return 'hsl';
	            }
	        }
	    });

	    var unpack$k = utils.unpack;
	    var min$1 = Math.min;
	    var max$1 = Math.max;

	    /*
	     * supported arguments:
	     * - rgb2hsv(r,g,b)
	     * - rgb2hsv([r,g,b])
	     * - rgb2hsv({r,g,b})
	     */
	    var rgb2hsl = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$k(args, 'rgb');
	        var r = args[0];
	        var g = args[1];
	        var b = args[2];
	        var min_ = min$1(r, g, b);
	        var max_ = max$1(r, g, b);
	        var delta = max_ - min_;
	        var h,s,v;
	        v = max_ / 255.0;
	        if (max_ === 0) {
	            h = Number.NaN;
	            s = 0;
	        } else {
	            s = delta / max_;
	            if (r === max_) { h = (g - b) / delta; }
	            if (g === max_) { h = 2+(b - r) / delta; }
	            if (b === max_) { h = 4+(r - g) / delta; }
	            h *= 60;
	            if (h < 0) { h += 360; }
	        }
	        return [h, s, v]
	    };

	    var rgb2hsv$1 = rgb2hsl;

	    var unpack$j = utils.unpack;
	    var floor$2 = Math.floor;

	    var hsv2rgb = function () {
	        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];
	        args = unpack$j(args, 'hsv');
	        var h = args[0];
	        var s = args[1];
	        var v = args[2];
	        var r,g,b;
	        v *= 255;
	        if (s === 0) {
	            r = g = b = v;
	        } else {
	            if (h === 360) { h = 0; }
	            if (h > 360) { h -= 360; }
	            if (h < 0) { h += 360; }
	            h /= 60;

	            var i = floor$2(h);
	            var f = h - i;
	            var p = v * (1 - s);
	            var q = v * (1 - s * f);
	            var t = v * (1 - s * (1 - f));

	            switch (i) {
	                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
	                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
	                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
	                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
	                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
	                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
	            }
	        }
	        return [r,g,b,args.length > 3?args[3]:1];
	    };

	    var hsv2rgb_1 = hsv2rgb;

	    var unpack$i = utils.unpack;
	    var type$f = utils.type;
	    var chroma$c = chroma_1;
	    var Color$v = Color_1;
	    var input$8 = input$h;

	    var rgb2hsv = rgb2hsv$1;

	    Color$v.prototype.hsv = function() {
	        return rgb2hsv(this._rgb);
	    };

	    chroma$c.hsv = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$v, [ null ].concat( args, ['hsv']) ));
	    };

	    input$8.format.hsv = hsv2rgb_1;

	    input$8.autodetect.push({
	        p: 2,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$i(args, 'hsv');
	            if (type$f(args) === 'array' && args.length === 3) {
	                return 'hsv';
	            }
	        }
	    });

	    var labConstants = {
	        // Corresponds roughly to RGB brighter/darker
	        Kn: 18,

	        // D65 standard referent
	        Xn: 0.950470,
	        Yn: 1,
	        Zn: 1.088830,

	        t0: 0.137931034,  // 4 / 29
	        t1: 0.206896552,  // 6 / 29
	        t2: 0.12841855,   // 3 * t1 * t1
	        t3: 0.008856452,  // t1 * t1 * t1
	    };

	    var LAB_CONSTANTS$3 = labConstants;
	    var unpack$h = utils.unpack;
	    var pow$a = Math.pow;

	    var rgb2lab$2 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$h(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        var ref$1 = rgb2xyz(r,g,b);
	        var x = ref$1[0];
	        var y = ref$1[1];
	        var z = ref$1[2];
	        var l = 116 * y - 16;
	        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
	    };

	    var rgb_xyz = function (r) {
	        if ((r /= 255) <= 0.04045) { return r / 12.92; }
	        return pow$a((r + 0.055) / 1.055, 2.4);
	    };

	    var xyz_lab = function (t) {
	        if (t > LAB_CONSTANTS$3.t3) { return pow$a(t, 1 / 3); }
	        return t / LAB_CONSTANTS$3.t2 + LAB_CONSTANTS$3.t0;
	    };

	    var rgb2xyz = function (r,g,b) {
	        r = rgb_xyz(r);
	        g = rgb_xyz(g);
	        b = rgb_xyz(b);
	        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS$3.Xn);
	        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS$3.Yn);
	        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS$3.Zn);
	        return [x,y,z];
	    };

	    var rgb2lab_1 = rgb2lab$2;

	    var LAB_CONSTANTS$2 = labConstants;
	    var unpack$g = utils.unpack;
	    var pow$9 = Math.pow;

	    /*
	     * L* [0..100]
	     * a [-100..100]
	     * b [-100..100]
	     */
	    var lab2rgb$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$g(args, 'lab');
	        var l = args[0];
	        var a = args[1];
	        var b = args[2];
	        var x,y,z, r,g,b_;

	        y = (l + 16) / 116;
	        x = isNaN(a) ? y : y + a / 500;
	        z = isNaN(b) ? y : y - b / 200;

	        y = LAB_CONSTANTS$2.Yn * lab_xyz(y);
	        x = LAB_CONSTANTS$2.Xn * lab_xyz(x);
	        z = LAB_CONSTANTS$2.Zn * lab_xyz(z);

	        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
	        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
	        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

	        return [r,g,b_,args.length > 3 ? args[3] : 1];
	    };

	    var xyz_rgb = function (r) {
	        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$9(r, 1 / 2.4) - 0.055)
	    };

	    var lab_xyz = function (t) {
	        return t > LAB_CONSTANTS$2.t1 ? t * t * t : LAB_CONSTANTS$2.t2 * (t - LAB_CONSTANTS$2.t0)
	    };

	    var lab2rgb_1 = lab2rgb$1;

	    var unpack$f = utils.unpack;
	    var type$e = utils.type;
	    var chroma$b = chroma_1;
	    var Color$u = Color_1;
	    var input$7 = input$h;

	    var rgb2lab$1 = rgb2lab_1;

	    Color$u.prototype.lab = function() {
	        return rgb2lab$1(this._rgb);
	    };

	    chroma$b.lab = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$u, [ null ].concat( args, ['lab']) ));
	    };

	    input$7.format.lab = lab2rgb_1;

	    input$7.autodetect.push({
	        p: 2,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$f(args, 'lab');
	            if (type$e(args) === 'array' && args.length === 3) {
	                return 'lab';
	            }
	        }
	    });

	    var unpack$e = utils.unpack;
	    var RAD2DEG = utils.RAD2DEG;
	    var sqrt$3 = Math.sqrt;
	    var atan2$2 = Math.atan2;
	    var round$2 = Math.round;

	    var lab2lch$2 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$e(args, 'lab');
	        var l = ref[0];
	        var a = ref[1];
	        var b = ref[2];
	        var c = sqrt$3(a * a + b * b);
	        var h = (atan2$2(b, a) * RAD2DEG + 360) % 360;
	        if (round$2(c*10000) === 0) { h = Number.NaN; }
	        return [l, c, h];
	    };

	    var lab2lch_1 = lab2lch$2;

	    var unpack$d = utils.unpack;
	    var rgb2lab = rgb2lab_1;
	    var lab2lch$1 = lab2lch_1;

	    var rgb2lch$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$d(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        var ref$1 = rgb2lab(r,g,b);
	        var l = ref$1[0];
	        var a = ref$1[1];
	        var b_ = ref$1[2];
	        return lab2lch$1(l,a,b_);
	    };

	    var rgb2lch_1 = rgb2lch$1;

	    var unpack$c = utils.unpack;
	    var DEG2RAD = utils.DEG2RAD;
	    var sin$3 = Math.sin;
	    var cos$3 = Math.cos;

	    var lch2lab$2 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        /*
	        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
	        These formulas were invented by David Dalrymple to obtain maximum contrast without going
	        out of gamut if the parameters are in the range 0-1.

	        A saturation multiplier was added by Gregor Aisch
	        */
	        var ref = unpack$c(args, 'lch');
	        var l = ref[0];
	        var c = ref[1];
	        var h = ref[2];
	        if (isNaN(h)) { h = 0; }
	        h = h * DEG2RAD;
	        return [l, cos$3(h) * c, sin$3(h) * c]
	    };

	    var lch2lab_1 = lch2lab$2;

	    var unpack$b = utils.unpack;
	    var lch2lab$1 = lch2lab_1;
	    var lab2rgb = lab2rgb_1;

	    var lch2rgb$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$b(args, 'lch');
	        var l = args[0];
	        var c = args[1];
	        var h = args[2];
	        var ref = lch2lab$1 (l,c,h);
	        var L = ref[0];
	        var a = ref[1];
	        var b_ = ref[2];
	        var ref$1 = lab2rgb (L,a,b_);
	        var r = ref$1[0];
	        var g = ref$1[1];
	        var b = ref$1[2];
	        return [r, g, b, args.length > 3 ? args[3] : 1];
	    };

	    var lch2rgb_1 = lch2rgb$1;

	    var unpack$a = utils.unpack;
	    var lch2rgb = lch2rgb_1;

	    var hcl2rgb = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var hcl = unpack$a(args, 'hcl').reverse();
	        return lch2rgb.apply(void 0, hcl);
	    };

	    var hcl2rgb_1 = hcl2rgb;

	    var unpack$9 = utils.unpack;
	    var type$d = utils.type;
	    var chroma$a = chroma_1;
	    var Color$t = Color_1;
	    var input$6 = input$h;

	    var rgb2lch = rgb2lch_1;

	    Color$t.prototype.lch = function() { return rgb2lch(this._rgb); };
	    Color$t.prototype.hcl = function() { return rgb2lch(this._rgb).reverse(); };

	    chroma$a.lch = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['lch']) ));
	    };
	    chroma$a.hcl = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['hcl']) ));
	    };

	    input$6.format.lch = lch2rgb_1;
	    input$6.format.hcl = hcl2rgb_1;

	    ['lch','hcl'].forEach(function (m) { return input$6.autodetect.push({
	        p: 2,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$9(args, m);
	            if (type$d(args) === 'array' && args.length === 3) {
	                return m;
	            }
	        }
	    }); });

	    /**
	    	X11 color names

	    	http://www.w3.org/TR/css3-color/#svg-color
	    */

	    var w3cx11$1 = {
	        aliceblue: '#f0f8ff',
	        antiquewhite: '#faebd7',
	        aqua: '#00ffff',
	        aquamarine: '#7fffd4',
	        azure: '#f0ffff',
	        beige: '#f5f5dc',
	        bisque: '#ffe4c4',
	        black: '#000000',
	        blanchedalmond: '#ffebcd',
	        blue: '#0000ff',
	        blueviolet: '#8a2be2',
	        brown: '#a52a2a',
	        burlywood: '#deb887',
	        cadetblue: '#5f9ea0',
	        chartreuse: '#7fff00',
	        chocolate: '#d2691e',
	        coral: '#ff7f50',
	        cornflower: '#6495ed',
	        cornflowerblue: '#6495ed',
	        cornsilk: '#fff8dc',
	        crimson: '#dc143c',
	        cyan: '#00ffff',
	        darkblue: '#00008b',
	        darkcyan: '#008b8b',
	        darkgoldenrod: '#b8860b',
	        darkgray: '#a9a9a9',
	        darkgreen: '#006400',
	        darkgrey: '#a9a9a9',
	        darkkhaki: '#bdb76b',
	        darkmagenta: '#8b008b',
	        darkolivegreen: '#556b2f',
	        darkorange: '#ff8c00',
	        darkorchid: '#9932cc',
	        darkred: '#8b0000',
	        darksalmon: '#e9967a',
	        darkseagreen: '#8fbc8f',
	        darkslateblue: '#483d8b',
	        darkslategray: '#2f4f4f',
	        darkslategrey: '#2f4f4f',
	        darkturquoise: '#00ced1',
	        darkviolet: '#9400d3',
	        deeppink: '#ff1493',
	        deepskyblue: '#00bfff',
	        dimgray: '#696969',
	        dimgrey: '#696969',
	        dodgerblue: '#1e90ff',
	        firebrick: '#b22222',
	        floralwhite: '#fffaf0',
	        forestgreen: '#228b22',
	        fuchsia: '#ff00ff',
	        gainsboro: '#dcdcdc',
	        ghostwhite: '#f8f8ff',
	        gold: '#ffd700',
	        goldenrod: '#daa520',
	        gray: '#808080',
	        green: '#008000',
	        greenyellow: '#adff2f',
	        grey: '#808080',
	        honeydew: '#f0fff0',
	        hotpink: '#ff69b4',
	        indianred: '#cd5c5c',
	        indigo: '#4b0082',
	        ivory: '#fffff0',
	        khaki: '#f0e68c',
	        laserlemon: '#ffff54',
	        lavender: '#e6e6fa',
	        lavenderblush: '#fff0f5',
	        lawngreen: '#7cfc00',
	        lemonchiffon: '#fffacd',
	        lightblue: '#add8e6',
	        lightcoral: '#f08080',
	        lightcyan: '#e0ffff',
	        lightgoldenrod: '#fafad2',
	        lightgoldenrodyellow: '#fafad2',
	        lightgray: '#d3d3d3',
	        lightgreen: '#90ee90',
	        lightgrey: '#d3d3d3',
	        lightpink: '#ffb6c1',
	        lightsalmon: '#ffa07a',
	        lightseagreen: '#20b2aa',
	        lightskyblue: '#87cefa',
	        lightslategray: '#778899',
	        lightslategrey: '#778899',
	        lightsteelblue: '#b0c4de',
	        lightyellow: '#ffffe0',
	        lime: '#00ff00',
	        limegreen: '#32cd32',
	        linen: '#faf0e6',
	        magenta: '#ff00ff',
	        maroon: '#800000',
	        maroon2: '#7f0000',
	        maroon3: '#b03060',
	        mediumaquamarine: '#66cdaa',
	        mediumblue: '#0000cd',
	        mediumorchid: '#ba55d3',
	        mediumpurple: '#9370db',
	        mediumseagreen: '#3cb371',
	        mediumslateblue: '#7b68ee',
	        mediumspringgreen: '#00fa9a',
	        mediumturquoise: '#48d1cc',
	        mediumvioletred: '#c71585',
	        midnightblue: '#191970',
	        mintcream: '#f5fffa',
	        mistyrose: '#ffe4e1',
	        moccasin: '#ffe4b5',
	        navajowhite: '#ffdead',
	        navy: '#000080',
	        oldlace: '#fdf5e6',
	        olive: '#808000',
	        olivedrab: '#6b8e23',
	        orange: '#ffa500',
	        orangered: '#ff4500',
	        orchid: '#da70d6',
	        palegoldenrod: '#eee8aa',
	        palegreen: '#98fb98',
	        paleturquoise: '#afeeee',
	        palevioletred: '#db7093',
	        papayawhip: '#ffefd5',
	        peachpuff: '#ffdab9',
	        peru: '#cd853f',
	        pink: '#ffc0cb',
	        plum: '#dda0dd',
	        powderblue: '#b0e0e6',
	        purple: '#800080',
	        purple2: '#7f007f',
	        purple3: '#a020f0',
	        rebeccapurple: '#663399',
	        red: '#ff0000',
	        rosybrown: '#bc8f8f',
	        royalblue: '#4169e1',
	        saddlebrown: '#8b4513',
	        salmon: '#fa8072',
	        sandybrown: '#f4a460',
	        seagreen: '#2e8b57',
	        seashell: '#fff5ee',
	        sienna: '#a0522d',
	        silver: '#c0c0c0',
	        skyblue: '#87ceeb',
	        slateblue: '#6a5acd',
	        slategray: '#708090',
	        slategrey: '#708090',
	        snow: '#fffafa',
	        springgreen: '#00ff7f',
	        steelblue: '#4682b4',
	        tan: '#d2b48c',
	        teal: '#008080',
	        thistle: '#d8bfd8',
	        tomato: '#ff6347',
	        turquoise: '#40e0d0',
	        violet: '#ee82ee',
	        wheat: '#f5deb3',
	        white: '#ffffff',
	        whitesmoke: '#f5f5f5',
	        yellow: '#ffff00',
	        yellowgreen: '#9acd32'
	    };

	    var w3cx11_1 = w3cx11$1;

	    var Color$s = Color_1;
	    var input$5 = input$h;
	    var type$c = utils.type;

	    var w3cx11 = w3cx11_1;
	    var hex2rgb = hex2rgb_1;
	    var rgb2hex = rgb2hex_1;

	    Color$s.prototype.name = function() {
	        var hex = rgb2hex(this._rgb, 'rgb');
	        for (var i = 0, list = Object.keys(w3cx11); i < list.length; i += 1) {
	            var n = list[i];

	            if (w3cx11[n] === hex) { return n.toLowerCase(); }
	        }
	        return hex;
	    };

	    input$5.format.named = function (name) {
	        name = name.toLowerCase();
	        if (w3cx11[name]) { return hex2rgb(w3cx11[name]); }
	        throw new Error('unknown color name: '+name);
	    };

	    input$5.autodetect.push({
	        p: 5,
	        test: function (h) {
	            var rest = [], len = arguments.length - 1;
	            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

	            if (!rest.length && type$c(h) === 'string' && w3cx11[h.toLowerCase()]) {
	                return 'named';
	            }
	        }
	    });

	    var unpack$8 = utils.unpack;

	    var rgb2num$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$8(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        return (r << 16) + (g << 8) + b;
	    };

	    var rgb2num_1 = rgb2num$1;

	    var type$b = utils.type;

	    var num2rgb = function (num) {
	        if (type$b(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
	            var r = num >> 16;
	            var g = (num >> 8) & 0xFF;
	            var b = num & 0xFF;
	            return [r,g,b,1];
	        }
	        throw new Error("unknown num color: "+num);
	    };

	    var num2rgb_1 = num2rgb;

	    var chroma$9 = chroma_1;
	    var Color$r = Color_1;
	    var input$4 = input$h;
	    var type$a = utils.type;

	    var rgb2num = rgb2num_1;

	    Color$r.prototype.num = function() {
	        return rgb2num(this._rgb);
	    };

	    chroma$9.num = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$r, [ null ].concat( args, ['num']) ));
	    };

	    input$4.format.num = num2rgb_1;

	    input$4.autodetect.push({
	        p: 5,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            if (args.length === 1 && type$a(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
	                return 'num';
	            }
	        }
	    });

	    var chroma$8 = chroma_1;
	    var Color$q = Color_1;
	    var input$3 = input$h;
	    var unpack$7 = utils.unpack;
	    var type$9 = utils.type;
	    var round$1 = Math.round;

	    Color$q.prototype.rgb = function(rnd) {
	        if ( rnd === void 0 ) rnd=true;

	        if (rnd === false) { return this._rgb.slice(0,3); }
	        return this._rgb.slice(0,3).map(round$1);
	    };

	    Color$q.prototype.rgba = function(rnd) {
	        if ( rnd === void 0 ) rnd=true;

	        return this._rgb.slice(0,4).map(function (v,i) {
	            return i<3 ? (rnd === false ? v : round$1(v)) : v;
	        });
	    };

	    chroma$8.rgb = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$q, [ null ].concat( args, ['rgb']) ));
	    };

	    input$3.format.rgb = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var rgba = unpack$7(args, 'rgba');
	        if (rgba[3] === undefined) { rgba[3] = 1; }
	        return rgba;
	    };

	    input$3.autodetect.push({
	        p: 3,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$7(args, 'rgba');
	            if (type$9(args) === 'array' && (args.length === 3 ||
	                args.length === 4 && type$9(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
	                return 'rgb';
	            }
	        }
	    });

	    /*
	     * Based on implementation by Neil Bartlett
	     * https://github.com/neilbartlett/color-temperature
	     */

	    var log$1 = Math.log;

	    var temperature2rgb$1 = function (kelvin) {
	        var temp = kelvin / 100;
	        var r,g,b;
	        if (temp < 66) {
	            r = 255;
	            g = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log$1(g);
	            b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log$1(b);
	        } else {
	            r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log$1(r);
	            g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log$1(g);
	            b = 255;
	        }
	        return [r,g,b,1];
	    };

	    var temperature2rgb_1 = temperature2rgb$1;

	    /*
	     * Based on implementation by Neil Bartlett
	     * https://github.com/neilbartlett/color-temperature
	     **/

	    var temperature2rgb = temperature2rgb_1;
	    var unpack$6 = utils.unpack;
	    var round = Math.round;

	    var rgb2temperature$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var rgb = unpack$6(args, 'rgb');
	        var r = rgb[0], b = rgb[2];
	        var minTemp = 1000;
	        var maxTemp = 40000;
	        var eps = 0.4;
	        var temp;
	        while (maxTemp - minTemp > eps) {
	            temp = (maxTemp + minTemp) * 0.5;
	            var rgb$1 = temperature2rgb(temp);
	            if ((rgb$1[2] / rgb$1[0]) >= (b / r)) {
	                maxTemp = temp;
	            } else {
	                minTemp = temp;
	            }
	        }
	        return round(temp);
	    };

	    var rgb2temperature_1 = rgb2temperature$1;

	    var chroma$7 = chroma_1;
	    var Color$p = Color_1;
	    var input$2 = input$h;

	    var rgb2temperature = rgb2temperature_1;

	    Color$p.prototype.temp =
	    Color$p.prototype.kelvin =
	    Color$p.prototype.temperature = function() {
	        return rgb2temperature(this._rgb);
	    };

	    chroma$7.temp =
	    chroma$7.kelvin =
	    chroma$7.temperature = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$p, [ null ].concat( args, ['temp']) ));
	    };

	    input$2.format.temp =
	    input$2.format.kelvin =
	    input$2.format.temperature = temperature2rgb_1;

	    var unpack$5 = utils.unpack;
	    var cbrt = Math.cbrt;
	    var pow$8 = Math.pow;
	    var sign$1 = Math.sign;

	    var rgb2oklab$2 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        // OKLab color space implementation taken from
	        // https://bottosson.github.io/posts/oklab/
	        var ref = unpack$5(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        var ref$1 = [rgb2lrgb(r / 255), rgb2lrgb(g / 255), rgb2lrgb(b / 255)];
	        var lr = ref$1[0];
	        var lg = ref$1[1];
	        var lb = ref$1[2];
	        var l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	        var m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	        var s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

	        return [
	            0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
	            1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
	            0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	        ];
	    };

	    var rgb2oklab_1 = rgb2oklab$2;

	    function rgb2lrgb(c) {
	        var abs = Math.abs(c);
	        if (abs < 0.04045) {
	            return c / 12.92;
	        }
	        return (sign$1(c) || 1) * pow$8((abs + 0.055) / 1.055, 2.4);
	    }

	    var unpack$4 = utils.unpack;
	    var pow$7 = Math.pow;
	    var sign = Math.sign;

	    /*
	     * L* [0..100]
	     * a [-100..100]
	     * b [-100..100]
	     */
	    var oklab2rgb$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$4(args, 'lab');
	        var L = args[0];
	        var a = args[1];
	        var b = args[2];

	        var l = pow$7(L + 0.3963377774 * a + 0.2158037573 * b, 3);
	        var m = pow$7(L - 0.1055613458 * a - 0.0638541728 * b, 3);
	        var s = pow$7(L - 0.0894841775 * a - 1.291485548 * b, 3);

	        return [
	            255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
	            255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
	            255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
	            args.length > 3 ? args[3] : 1
	        ];
	    };

	    var oklab2rgb_1 = oklab2rgb$1;

	    function lrgb2rgb(c) {
	        var abs = Math.abs(c);
	        if (abs > 0.0031308) {
	            return (sign(c) || 1) * (1.055 * pow$7(abs, 1 / 2.4) - 0.055);
	        }
	        return c * 12.92;
	    }

	    var unpack$3 = utils.unpack;
	    var type$8 = utils.type;
	    var chroma$6 = chroma_1;
	    var Color$o = Color_1;
	    var input$1 = input$h;

	    var rgb2oklab$1 = rgb2oklab_1;

	    Color$o.prototype.oklab = function () {
	        return rgb2oklab$1(this._rgb);
	    };

	    chroma$6.oklab = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$o, [ null ].concat( args, ['oklab']) ));
	    };

	    input$1.format.oklab = oklab2rgb_1;

	    input$1.autodetect.push({
	        p: 3,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack$3(args, 'oklab');
	            if (type$8(args) === 'array' && args.length === 3) {
	                return 'oklab';
	            }
	        }
	    });

	    var unpack$2 = utils.unpack;
	    var rgb2oklab = rgb2oklab_1;
	    var lab2lch = lab2lch_1;

	    var rgb2oklch$1 = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        var ref = unpack$2(args, 'rgb');
	        var r = ref[0];
	        var g = ref[1];
	        var b = ref[2];
	        var ref$1 = rgb2oklab(r, g, b);
	        var l = ref$1[0];
	        var a = ref$1[1];
	        var b_ = ref$1[2];
	        return lab2lch(l, a, b_);
	    };

	    var rgb2oklch_1 = rgb2oklch$1;

	    var unpack$1 = utils.unpack;
	    var lch2lab = lch2lab_1;
	    var oklab2rgb = oklab2rgb_1;

	    var oklch2rgb = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        args = unpack$1(args, 'lch');
	        var l = args[0];
	        var c = args[1];
	        var h = args[2];
	        var ref = lch2lab(l, c, h);
	        var L = ref[0];
	        var a = ref[1];
	        var b_ = ref[2];
	        var ref$1 = oklab2rgb(L, a, b_);
	        var r = ref$1[0];
	        var g = ref$1[1];
	        var b = ref$1[2];
	        return [r, g, b, args.length > 3 ? args[3] : 1];
	    };

	    var oklch2rgb_1 = oklch2rgb;

	    var unpack = utils.unpack;
	    var type$7 = utils.type;
	    var chroma$5 = chroma_1;
	    var Color$n = Color_1;
	    var input = input$h;

	    var rgb2oklch = rgb2oklch_1;

	    Color$n.prototype.oklch = function () {
	        return rgb2oklch(this._rgb);
	    };

	    chroma$5.oklch = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return new (Function.prototype.bind.apply( Color$n, [ null ].concat( args, ['oklch']) ));
	    };

	    input.format.oklch = oklch2rgb_1;

	    input.autodetect.push({
	        p: 3,
	        test: function () {
	            var args = [], len = arguments.length;
	            while ( len-- ) args[ len ] = arguments[ len ];

	            args = unpack(args, 'oklch');
	            if (type$7(args) === 'array' && args.length === 3) {
	                return 'oklch';
	            }
	        }
	    });

	    var Color$m = Color_1;
	    var type$6 = utils.type;

	    Color$m.prototype.alpha = function(a, mutate) {
	        if ( mutate === void 0 ) mutate=false;

	        if (a !== undefined && type$6(a) === 'number') {
	            if (mutate) {
	                this._rgb[3] = a;
	                return this;
	            }
	            return new Color$m([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
	        }
	        return this._rgb[3];
	    };

	    var Color$l = Color_1;

	    Color$l.prototype.clipped = function() {
	        return this._rgb._clipped || false;
	    };

	    var Color$k = Color_1;
	    var LAB_CONSTANTS$1 = labConstants;

	    Color$k.prototype.darken = function(amount) {
	    	if ( amount === void 0 ) amount=1;

	    	var me = this;
	    	var lab = me.lab();
	    	lab[0] -= LAB_CONSTANTS$1.Kn * amount;
	    	return new Color$k(lab, 'lab').alpha(me.alpha(), true);
	    };

	    Color$k.prototype.brighten = function(amount) {
	    	if ( amount === void 0 ) amount=1;

	    	return this.darken(-amount);
	    };

	    Color$k.prototype.darker = Color$k.prototype.darken;
	    Color$k.prototype.brighter = Color$k.prototype.brighten;

	    var Color$j = Color_1;

	    Color$j.prototype.get = function (mc) {
	        var ref = mc.split('.');
	        var mode = ref[0];
	        var channel = ref[1];
	        var src = this[mode]();
	        if (channel) {
	            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
	            if (i > -1) { return src[i]; }
	            throw new Error(("unknown channel " + channel + " in mode " + mode));
	        } else {
	            return src;
	        }
	    };

	    var Color$i = Color_1;
	    var type$5 = utils.type;
	    var pow$6 = Math.pow;

	    var EPS = 1e-7;
	    var MAX_ITER = 20;

	    Color$i.prototype.luminance = function(lum) {
	        if (lum !== undefined && type$5(lum) === 'number') {
	            if (lum === 0) {
	                // return pure black
	                return new Color$i([0,0,0,this._rgb[3]], 'rgb');
	            }
	            if (lum === 1) {
	                // return pure white
	                return new Color$i([255,255,255,this._rgb[3]], 'rgb');
	            }
	            // compute new color using...
	            var cur_lum = this.luminance();
	            var mode = 'rgb';
	            var max_iter = MAX_ITER;

	            var test = function (low, high) {
	                var mid = low.interpolate(high, 0.5, mode);
	                var lm = mid.luminance();
	                if (Math.abs(lum - lm) < EPS || !max_iter--) {
	                    // close enough
	                    return mid;
	                }
	                return lm > lum ? test(low, mid) : test(mid, high);
	            };

	            var rgb = (cur_lum > lum ? test(new Color$i([0,0,0]), this) : test(this, new Color$i([255,255,255]))).rgb();
	            return new Color$i(rgb.concat( [this._rgb[3]]));
	        }
	        return rgb2luminance.apply(void 0, (this._rgb).slice(0,3));
	    };


	    var rgb2luminance = function (r,g,b) {
	        // relative luminance
	        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	        r = luminance_x(r);
	        g = luminance_x(g);
	        b = luminance_x(b);
	        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	    };

	    var luminance_x = function (x) {
	        x /= 255;
	        return x <= 0.03928 ? x/12.92 : pow$6((x+0.055)/1.055, 2.4);
	    };

	    var interpolator$1 = {};

	    var Color$h = Color_1;
	    var type$4 = utils.type;
	    var interpolator = interpolator$1;

	    var mix$1 = function (col1, col2, f) {
	        if ( f === void 0 ) f=0.5;
	        var rest = [], len = arguments.length - 3;
	        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

	        var mode = rest[0] || 'lrgb';
	        if (!interpolator[mode] && !rest.length) {
	            // fall back to the first supported mode
	            mode = Object.keys(interpolator)[0];
	        }
	        if (!interpolator[mode]) {
	            throw new Error(("interpolation mode " + mode + " is not defined"));
	        }
	        if (type$4(col1) !== 'object') { col1 = new Color$h(col1); }
	        if (type$4(col2) !== 'object') { col2 = new Color$h(col2); }
	        return interpolator[mode](col1, col2, f)
	            .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
	    };

	    var Color$g = Color_1;
	    var mix = mix$1;

	    Color$g.prototype.mix =
	    Color$g.prototype.interpolate = function(col2, f) {
	    	if ( f === void 0 ) f=0.5;
	    	var rest = [], len = arguments.length - 2;
	    	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

	    	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
	    };

	    var Color$f = Color_1;

	    Color$f.prototype.premultiply = function(mutate) {
	    	if ( mutate === void 0 ) mutate=false;

	    	var rgb = this._rgb;
	    	var a = rgb[3];
	    	if (mutate) {
	    		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
	    		return this;
	    	} else {
	    		return new Color$f([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
	    	}
	    };

	    var Color$e = Color_1;
	    var LAB_CONSTANTS = labConstants;

	    Color$e.prototype.saturate = function(amount) {
	    	if ( amount === void 0 ) amount=1;

	    	var me = this;
	    	var lch = me.lch();
	    	lch[1] += LAB_CONSTANTS.Kn * amount;
	    	if (lch[1] < 0) { lch[1] = 0; }
	    	return new Color$e(lch, 'lch').alpha(me.alpha(), true);
	    };

	    Color$e.prototype.desaturate = function(amount) {
	    	if ( amount === void 0 ) amount=1;

	    	return this.saturate(-amount);
	    };

	    var Color$d = Color_1;
	    var type$3 = utils.type;

	    Color$d.prototype.set = function (mc, value, mutate) {
	        if ( mutate === void 0 ) mutate = false;

	        var ref = mc.split('.');
	        var mode = ref[0];
	        var channel = ref[1];
	        var src = this[mode]();
	        if (channel) {
	            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
	            if (i > -1) {
	                if (type$3(value) == 'string') {
	                    switch (value.charAt(0)) {
	                        case '+':
	                            src[i] += +value;
	                            break;
	                        case '-':
	                            src[i] += +value;
	                            break;
	                        case '*':
	                            src[i] *= +value.substr(1);
	                            break;
	                        case '/':
	                            src[i] /= +value.substr(1);
	                            break;
	                        default:
	                            src[i] = +value;
	                    }
	                } else if (type$3(value) === 'number') {
	                    src[i] = value;
	                } else {
	                    throw new Error("unsupported value for Color.set");
	                }
	                var out = new Color$d(src, mode);
	                if (mutate) {
	                    this._rgb = out._rgb;
	                    return this;
	                }
	                return out;
	            }
	            throw new Error(("unknown channel " + channel + " in mode " + mode));
	        } else {
	            return src;
	        }
	    };

	    var Color$c = Color_1;

	    var rgb = function (col1, col2, f) {
	        var xyz0 = col1._rgb;
	        var xyz1 = col2._rgb;
	        return new Color$c(
	            xyz0[0] + f * (xyz1[0]-xyz0[0]),
	            xyz0[1] + f * (xyz1[1]-xyz0[1]),
	            xyz0[2] + f * (xyz1[2]-xyz0[2]),
	            'rgb'
	        )
	    };

	    // register interpolator
	    interpolator$1.rgb = rgb;

	    var Color$b = Color_1;
	    var sqrt$2 = Math.sqrt;
	    var pow$5 = Math.pow;

	    var lrgb = function (col1, col2, f) {
	        var ref = col1._rgb;
	        var x1 = ref[0];
	        var y1 = ref[1];
	        var z1 = ref[2];
	        var ref$1 = col2._rgb;
	        var x2 = ref$1[0];
	        var y2 = ref$1[1];
	        var z2 = ref$1[2];
	        return new Color$b(
	            sqrt$2(pow$5(x1,2) * (1-f) + pow$5(x2,2) * f),
	            sqrt$2(pow$5(y1,2) * (1-f) + pow$5(y2,2) * f),
	            sqrt$2(pow$5(z1,2) * (1-f) + pow$5(z2,2) * f),
	            'rgb'
	        )
	    };

	    // register interpolator
	    interpolator$1.lrgb = lrgb;

	    var Color$a = Color_1;

	    var lab = function (col1, col2, f) {
	        var xyz0 = col1.lab();
	        var xyz1 = col2.lab();
	        return new Color$a(
	            xyz0[0] + f * (xyz1[0]-xyz0[0]),
	            xyz0[1] + f * (xyz1[1]-xyz0[1]),
	            xyz0[2] + f * (xyz1[2]-xyz0[2]),
	            'lab'
	        )
	    };

	    // register interpolator
	    interpolator$1.lab = lab;

	    var Color$9 = Color_1;

	    var _hsx = function (col1, col2, f, m) {
	        var assign, assign$1;

	        var xyz0, xyz1;
	        if (m === 'hsl') {
	            xyz0 = col1.hsl();
	            xyz1 = col2.hsl();
	        } else if (m === 'hsv') {
	            xyz0 = col1.hsv();
	            xyz1 = col2.hsv();
	        } else if (m === 'hcg') {
	            xyz0 = col1.hcg();
	            xyz1 = col2.hcg();
	        } else if (m === 'hsi') {
	            xyz0 = col1.hsi();
	            xyz1 = col2.hsi();
	        } else if (m === 'lch' || m === 'hcl') {
	            m = 'hcl';
	            xyz0 = col1.hcl();
	            xyz1 = col2.hcl();
	        } else if (m === 'oklch') {
	            xyz0 = col1.oklch().reverse();
	            xyz1 = col2.oklch().reverse();
	        }

	        var hue0, hue1, sat0, sat1, lbv0, lbv1;
	        if (m.substr(0, 1) === 'h' || m === 'oklch') {
	            (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
	            (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
	        }

	        var sat, hue, lbv, dh;

	        if (!isNaN(hue0) && !isNaN(hue1)) {
	            // both colors have hue
	            if (hue1 > hue0 && hue1 - hue0 > 180) {
	                dh = hue1 - (hue0 + 360);
	            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
	                dh = hue1 + 360 - hue0;
	            } else {
	                dh = hue1 - hue0;
	            }
	            hue = hue0 + f * dh;
	        } else if (!isNaN(hue0)) {
	            hue = hue0;
	            if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
	        } else if (!isNaN(hue1)) {
	            hue = hue1;
	            if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
	        } else {
	            hue = Number.NaN;
	        }

	        if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
	        lbv = lbv0 + f * (lbv1 - lbv0);
	        return m === 'oklch' ? new Color$9([lbv, sat, hue], m) : new Color$9([hue, sat, lbv], m);
	    };

	    var interpolate_hsx$5 = _hsx;

	    var lch = function (col1, col2, f) {
	    	return interpolate_hsx$5(col1, col2, f, 'lch');
	    };

	    // register interpolator
	    interpolator$1.lch = lch;
	    interpolator$1.hcl = lch;

	    var Color$8 = Color_1;

	    var num = function (col1, col2, f) {
	        var c1 = col1.num();
	        var c2 = col2.num();
	        return new Color$8(c1 + f * (c2-c1), 'num')
	    };

	    // register interpolator
	    interpolator$1.num = num;

	    var interpolate_hsx$4 = _hsx;

	    var hcg = function (col1, col2, f) {
	    	return interpolate_hsx$4(col1, col2, f, 'hcg');
	    };

	    // register interpolator
	    interpolator$1.hcg = hcg;

	    var interpolate_hsx$3 = _hsx;

	    var hsi = function (col1, col2, f) {
	    	return interpolate_hsx$3(col1, col2, f, 'hsi');
	    };

	    // register interpolator
	    interpolator$1.hsi = hsi;

	    var interpolate_hsx$2 = _hsx;

	    var hsl = function (col1, col2, f) {
	    	return interpolate_hsx$2(col1, col2, f, 'hsl');
	    };

	    // register interpolator
	    interpolator$1.hsl = hsl;

	    var interpolate_hsx$1 = _hsx;

	    var hsv = function (col1, col2, f) {
	    	return interpolate_hsx$1(col1, col2, f, 'hsv');
	    };

	    // register interpolator
	    interpolator$1.hsv = hsv;

	    var Color$7 = Color_1;

	    var oklab = function (col1, col2, f) {
	        var xyz0 = col1.oklab();
	        var xyz1 = col2.oklab();
	        return new Color$7(
	            xyz0[0] + f * (xyz1[0] - xyz0[0]),
	            xyz0[1] + f * (xyz1[1] - xyz0[1]),
	            xyz0[2] + f * (xyz1[2] - xyz0[2]),
	            'oklab'
	        );
	    };

	    // register interpolator
	    interpolator$1.oklab = oklab;

	    var interpolate_hsx = _hsx;

	    var oklch = function (col1, col2, f) {
	        return interpolate_hsx(col1, col2, f, 'oklch');
	    };

	    // register interpolator
	    interpolator$1.oklch = oklch;

	    var Color$6 = Color_1;
	    var clip_rgb$1 = utils.clip_rgb;
	    var pow$4 = Math.pow;
	    var sqrt$1 = Math.sqrt;
	    var PI$1 = Math.PI;
	    var cos$2 = Math.cos;
	    var sin$2 = Math.sin;
	    var atan2$1 = Math.atan2;

	    var average = function (colors, mode, weights) {
	        if ( mode === void 0 ) mode='lrgb';
	        if ( weights === void 0 ) weights=null;

	        var l = colors.length;
	        if (!weights) { weights = Array.from(new Array(l)).map(function () { return 1; }); }
	        // normalize weights
	        var k = l / weights.reduce(function(a, b) { return a + b; });
	        weights.forEach(function (w,i) { weights[i] *= k; });
	        // convert colors to Color objects
	        colors = colors.map(function (c) { return new Color$6(c); });
	        if (mode === 'lrgb') {
	            return _average_lrgb(colors, weights)
	        }
	        var first = colors.shift();
	        var xyz = first.get(mode);
	        var cnt = [];
	        var dx = 0;
	        var dy = 0;
	        // initial color
	        for (var i=0; i<xyz.length; i++) {
	            xyz[i] = (xyz[i] || 0) * weights[0];
	            cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
	            if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
	                var A = xyz[i] / 180 * PI$1;
	                dx += cos$2(A) * weights[0];
	                dy += sin$2(A) * weights[0];
	            }
	        }

	        var alpha = first.alpha() * weights[0];
	        colors.forEach(function (c,ci) {
	            var xyz2 = c.get(mode);
	            alpha += c.alpha() * weights[ci+1];
	            for (var i=0; i<xyz.length; i++) {
	                if (!isNaN(xyz2[i])) {
	                    cnt[i] += weights[ci+1];
	                    if (mode.charAt(i) === 'h') {
	                        var A = xyz2[i] / 180 * PI$1;
	                        dx += cos$2(A) * weights[ci+1];
	                        dy += sin$2(A) * weights[ci+1];
	                    } else {
	                        xyz[i] += xyz2[i] * weights[ci+1];
	                    }
	                }
	            }
	        });

	        for (var i$1=0; i$1<xyz.length; i$1++) {
	            if (mode.charAt(i$1) === 'h') {
	                var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;
	                while (A$1 < 0) { A$1 += 360; }
	                while (A$1 >= 360) { A$1 -= 360; }
	                xyz[i$1] = A$1;
	            } else {
	                xyz[i$1] = xyz[i$1]/cnt[i$1];
	            }
	        }
	        alpha /= l;
	        return (new Color$6(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true);
	    };


	    var _average_lrgb = function (colors, weights) {
	        var l = colors.length;
	        var xyz = [0,0,0,0];
	        for (var i=0; i < colors.length; i++) {
	            var col = colors[i];
	            var f = weights[i] / l;
	            var rgb = col._rgb;
	            xyz[0] += pow$4(rgb[0],2) * f;
	            xyz[1] += pow$4(rgb[1],2) * f;
	            xyz[2] += pow$4(rgb[2],2) * f;
	            xyz[3] += rgb[3] * f;
	        }
	        xyz[0] = sqrt$1(xyz[0]);
	        xyz[1] = sqrt$1(xyz[1]);
	        xyz[2] = sqrt$1(xyz[2]);
	        if (xyz[3] > 0.9999999) { xyz[3] = 1; }
	        return new Color$6(clip_rgb$1(xyz));
	    };

	    // minimal multi-purpose interface

	    // @requires utils color analyze

	    var chroma$4 = chroma_1;
	    var type$2 = utils.type;

	    var pow$3 = Math.pow;

	    var scale$2 = function(colors) {

	        // constructor
	        var _mode = 'rgb';
	        var _nacol = chroma$4('#ccc');
	        var _spread = 0;
	        // const _fixed = false;
	        var _domain = [0, 1];
	        var _pos = [];
	        var _padding = [0,0];
	        var _classes = false;
	        var _colors = [];
	        var _out = false;
	        var _min = 0;
	        var _max = 1;
	        var _correctLightness = false;
	        var _colorCache = {};
	        var _useCache = true;
	        var _gamma = 1;

	        // private methods

	        var setColors = function(colors) {
	            colors = colors || ['#fff', '#000'];
	            if (colors && type$2(colors) === 'string' && chroma$4.brewer &&
	                chroma$4.brewer[colors.toLowerCase()]) {
	                colors = chroma$4.brewer[colors.toLowerCase()];
	            }
	            if (type$2(colors) === 'array') {
	                // handle single color
	                if (colors.length === 1) {
	                    colors = [colors[0], colors[0]];
	                }
	                // make a copy of the colors
	                colors = colors.slice(0);
	                // convert to chroma classes
	                for (var c=0; c<colors.length; c++) {
	                    colors[c] = chroma$4(colors[c]);
	                }
	                // auto-fill color position
	                _pos.length = 0;
	                for (var c$1=0; c$1<colors.length; c$1++) {
	                    _pos.push(c$1/(colors.length-1));
	                }
	            }
	            resetCache();
	            return _colors = colors;
	        };

	        var getClass = function(value) {
	            if (_classes != null) {
	                var n = _classes.length-1;
	                var i = 0;
	                while (i < n && value >= _classes[i]) {
	                    i++;
	                }
	                return i-1;
	            }
	            return 0;
	        };

	        var tMapLightness = function (t) { return t; };
	        var tMapDomain = function (t) { return t; };

	        // const classifyValue = function(value) {
	        //     let val = value;
	        //     if (_classes.length > 2) {
	        //         const n = _classes.length-1;
	        //         const i = getClass(value);
	        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
	        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
	        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
	        //     }
	        //     return val;
	        // };

	        var getColor = function(val, bypassMap) {
	            var col, t;
	            if (bypassMap == null) { bypassMap = false; }
	            if (isNaN(val) || (val === null)) { return _nacol; }
	            if (!bypassMap) {
	                if (_classes && (_classes.length > 2)) {
	                    // find the class
	                    var c = getClass(val);
	                    t = c / (_classes.length-2);
	                } else if (_max !== _min) {
	                    // just interpolate between min/max
	                    t = (val - _min) / (_max - _min);
	                } else {
	                    t = 1;
	                }
	            } else {
	                t = val;
	            }

	            // domain map
	            t = tMapDomain(t);

	            if (!bypassMap) {
	                t = tMapLightness(t);  // lightness correction
	            }

	            if (_gamma !== 1) { t = pow$3(t, _gamma); }

	            t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

	            t = Math.min(1, Math.max(0, t));

	            var k = Math.floor(t * 10000);

	            if (_useCache && _colorCache[k]) {
	                col = _colorCache[k];
	            } else {
	                if (type$2(_colors) === 'array') {
	                    //for i in [0.._pos.length-1]
	                    for (var i=0; i<_pos.length; i++) {
	                        var p = _pos[i];
	                        if (t <= p) {
	                            col = _colors[i];
	                            break;
	                        }
	                        if ((t >= p) && (i === (_pos.length-1))) {
	                            col = _colors[i];
	                            break;
	                        }
	                        if (t > p && t < _pos[i+1]) {
	                            t = (t-p)/(_pos[i+1]-p);
	                            col = chroma$4.interpolate(_colors[i], _colors[i+1], t, _mode);
	                            break;
	                        }
	                    }
	                } else if (type$2(_colors) === 'function') {
	                    col = _colors(t);
	                }
	                if (_useCache) { _colorCache[k] = col; }
	            }
	            return col;
	        };

	        var resetCache = function () { return _colorCache = {}; };

	        setColors(colors);

	        // public interface

	        var f = function(v) {
	            var c = chroma$4(getColor(v));
	            if (_out && c[_out]) { return c[_out](); } else { return c; }
	        };

	        f.classes = function(classes) {
	            if (classes != null) {
	                if (type$2(classes) === 'array') {
	                    _classes = classes;
	                    _domain = [classes[0], classes[classes.length-1]];
	                } else {
	                    var d = chroma$4.analyze(_domain);
	                    if (classes === 0) {
	                        _classes = [d.min, d.max];
	                    } else {
	                        _classes = chroma$4.limits(d, 'e', classes);
	                    }
	                }
	                return f;
	            }
	            return _classes;
	        };


	        f.domain = function(domain) {
	            if (!arguments.length) {
	                return _domain;
	            }
	            _min = domain[0];
	            _max = domain[domain.length-1];
	            _pos = [];
	            var k = _colors.length;
	            if ((domain.length === k) && (_min !== _max)) {
	                // update positions
	                for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
	                    var d = list[i];

	                  _pos.push((d-_min) / (_max-_min));
	                }
	            } else {
	                for (var c=0; c<k; c++) {
	                    _pos.push(c/(k-1));
	                }
	                if (domain.length > 2) {
	                    // set domain map
	                    var tOut = domain.map(function (d,i) { return i/(domain.length-1); });
	                    var tBreaks = domain.map(function (d) { return (d - _min) / (_max - _min); });
	                    if (!tBreaks.every(function (val, i) { return tOut[i] === val; })) {
	                        tMapDomain = function (t) {
	                            if (t <= 0 || t >= 1) { return t; }
	                            var i = 0;
	                            while (t >= tBreaks[i+1]) { i++; }
	                            var f = (t - tBreaks[i]) / (tBreaks[i+1] - tBreaks[i]);
	                            var out = tOut[i] + f * (tOut[i+1] - tOut[i]);
	                            return out;
	                        };
	                    }

	                }
	            }
	            _domain = [_min, _max];
	            return f;
	        };

	        f.mode = function(_m) {
	            if (!arguments.length) {
	                return _mode;
	            }
	            _mode = _m;
	            resetCache();
	            return f;
	        };

	        f.range = function(colors, _pos) {
	            setColors(colors);
	            return f;
	        };

	        f.out = function(_o) {
	            _out = _o;
	            return f;
	        };

	        f.spread = function(val) {
	            if (!arguments.length) {
	                return _spread;
	            }
	            _spread = val;
	            return f;
	        };

	        f.correctLightness = function(v) {
	            if (v == null) { v = true; }
	            _correctLightness = v;
	            resetCache();
	            if (_correctLightness) {
	                tMapLightness = function(t) {
	                    var L0 = getColor(0, true).lab()[0];
	                    var L1 = getColor(1, true).lab()[0];
	                    var pol = L0 > L1;
	                    var L_actual = getColor(t, true).lab()[0];
	                    var L_ideal = L0 + ((L1 - L0) * t);
	                    var L_diff = L_actual - L_ideal;
	                    var t0 = 0;
	                    var t1 = 1;
	                    var max_iter = 20;
	                    while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
	                        (function() {
	                            if (pol) { L_diff *= -1; }
	                            if (L_diff < 0) {
	                                t0 = t;
	                                t += (t1 - t) * 0.5;
	                            } else {
	                                t1 = t;
	                                t += (t0 - t) * 0.5;
	                            }
	                            L_actual = getColor(t, true).lab()[0];
	                            return L_diff = L_actual - L_ideal;
	                        })();
	                    }
	                    return t;
	                };
	            } else {
	                tMapLightness = function (t) { return t; };
	            }
	            return f;
	        };

	        f.padding = function(p) {
	            if (p != null) {
	                if (type$2(p) === 'number') {
	                    p = [p,p];
	                }
	                _padding = p;
	                return f;
	            } else {
	                return _padding;
	            }
	        };

	        f.colors = function(numColors, out) {
	            // If no arguments are given, return the original colors that were provided
	            if (arguments.length < 2) { out = 'hex'; }
	            var result = [];

	            if (arguments.length === 0) {
	                result = _colors.slice(0);

	            } else if (numColors === 1) {
	                result = [f(0.5)];

	            } else if (numColors > 1) {
	                var dm = _domain[0];
	                var dd = _domain[1] - dm;
	                result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

	            } else { // returns all colors based on the defined classes
	                colors = [];
	                var samples = [];
	                if (_classes && (_classes.length > 2)) {
	                    for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	                        samples.push((_classes[i-1]+_classes[i])*0.5);
	                    }
	                } else {
	                    samples = _domain;
	                }
	                result = samples.map(function (v) { return f(v); });
	            }

	            if (chroma$4[out]) {
	                result = result.map(function (c) { return c[out](); });
	            }
	            return result;
	        };

	        f.cache = function(c) {
	            if (c != null) {
	                _useCache = c;
	                return f;
	            } else {
	                return _useCache;
	            }
	        };

	        f.gamma = function(g) {
	            if (g != null) {
	                _gamma = g;
	                return f;
	            } else {
	                return _gamma;
	            }
	        };

	        f.nodata = function(d) {
	            if (d != null) {
	                _nacol = chroma$4(d);
	                return f;
	            } else {
	                return _nacol;
	            }
	        };

	        return f;
	    };

	    function __range__(left, right, inclusive) {
	      var range = [];
	      var ascending = left < right;
	      var end = !inclusive ? right : ascending ? right + 1 : right - 1;
	      for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
	        range.push(i);
	      }
	      return range;
	    }

	    //
	    // interpolates between a set of colors uzing a bezier spline
	    //

	    // @requires utils lab
	    var Color$5 = Color_1;

	    var scale$1 = scale$2;

	    // nth row of the pascal triangle
	    var binom_row = function(n) {
	        var row = [1, 1];
	        for (var i = 1; i < n; i++) {
	            var newrow = [1];
	            for (var j = 1; j <= row.length; j++) {
	                newrow[j] = (row[j] || 0) + row[j - 1];
	            }
	            row = newrow;
	        }
	        return row;
	    };

	    var bezier = function(colors) {
	        var assign, assign$1, assign$2;

	        var I, lab0, lab1, lab2;
	        colors = colors.map(function (c) { return new Color$5(c); });
	        if (colors.length === 2) {
	            // linear interpolation
	            (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
	            I = function(t) {
	                var lab = ([0, 1, 2].map(function (i) { return lab0[i] + (t * (lab1[i] - lab0[i])); }));
	                return new Color$5(lab, 'lab');
	            };
	        } else if (colors.length === 3) {
	            // quadratic bezier interpolation
	            (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
	            I = function(t) {
	                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t) * lab0[i]) + (2 * (1-t) * t * lab1[i]) + (t * t * lab2[i]); }));
	                return new Color$5(lab, 'lab');
	            };
	        } else if (colors.length === 4) {
	            // cubic bezier interpolation
	            var lab3;
	            (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
	            I = function(t) {
	                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t)*(1-t) * lab0[i]) + (3 * (1-t) * (1-t) * t * lab1[i]) + (3 * (1-t) * t * t * lab2[i]) + (t*t*t * lab3[i]); }));
	                return new Color$5(lab, 'lab');
	            };
	        } else if (colors.length >= 5) {
	            // general case (degree n bezier)
	            var labs, row, n;
	            labs = colors.map(function (c) { return c.lab(); });
	            n = colors.length - 1;
	            row = binom_row(n);
	            I = function (t) {
	                var u = 1 - t;
	                var lab = ([0, 1, 2].map(function (i) { return labs.reduce(function (sum, el, j) { return (sum + row[j] * Math.pow( u, (n - j) ) * Math.pow( t, j ) * el[i]); }, 0); }));
	                return new Color$5(lab, 'lab');
	            };
	        } else {
	            throw new RangeError("No point in running bezier with only one color.")
	        }
	        return I;
	    };

	    var bezier_1 = function (colors) {
	        var f = bezier(colors);
	        f.scale = function () { return scale$1(f); };
	        return f;
	    };

	    /*
	     * interpolates between a set of colors uzing a bezier spline
	     * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
	     */

	    var chroma$3 = chroma_1;

	    var blend = function (bottom, top, mode) {
	        if (!blend[mode]) {
	            throw new Error('unknown blend mode ' + mode);
	        }
	        return blend[mode](bottom, top);
	    };

	    var blend_f = function (f) { return function (bottom,top) {
	            var c0 = chroma$3(top).rgb();
	            var c1 = chroma$3(bottom).rgb();
	            return chroma$3.rgb(f(c0, c1));
	        }; };

	    var each = function (f) { return function (c0, c1) {
	            var out = [];
	            out[0] = f(c0[0], c1[0]);
	            out[1] = f(c0[1], c1[1]);
	            out[2] = f(c0[2], c1[2]);
	            return out;
	        }; };

	    var normal = function (a) { return a; };
	    var multiply = function (a,b) { return a * b / 255; };
	    var darken = function (a,b) { return a > b ? b : a; };
	    var lighten = function (a,b) { return a > b ? a : b; };
	    var screen = function (a,b) { return 255 * (1 - (1-a/255) * (1-b/255)); };
	    var overlay = function (a,b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 )); };
	    var burn = function (a,b) { return 255 * (1 - (1 - b / 255) / (a/255)); };
	    var dodge = function (a,b) {
	        if (a === 255) { return 255; }
	        a = 255 * (b / 255) / (1 - a / 255);
	        return a > 255 ? 255 : a
	    };

	    // # add = (a,b) ->
	    // #     if (a + b > 255) then 255 else a + b

	    blend.normal = blend_f(each(normal));
	    blend.multiply = blend_f(each(multiply));
	    blend.screen = blend_f(each(screen));
	    blend.overlay = blend_f(each(overlay));
	    blend.darken = blend_f(each(darken));
	    blend.lighten = blend_f(each(lighten));
	    blend.dodge = blend_f(each(dodge));
	    blend.burn = blend_f(each(burn));
	    // blend.add = blend_f(each(add));

	    var blend_1 = blend;

	    // cubehelix interpolation
	    // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
	    // http://astron-soc.in/bulletin/11June/289392011.pdf

	    var type$1 = utils.type;
	    var clip_rgb = utils.clip_rgb;
	    var TWOPI = utils.TWOPI;
	    var pow$2 = Math.pow;
	    var sin$1 = Math.sin;
	    var cos$1 = Math.cos;
	    var chroma$2 = chroma_1;

	    var cubehelix = function(start, rotations, hue, gamma, lightness) {
	        if ( start === void 0 ) start=300;
	        if ( rotations === void 0 ) rotations=-1.5;
	        if ( hue === void 0 ) hue=1;
	        if ( gamma === void 0 ) gamma=1;
	        if ( lightness === void 0 ) lightness=[0,1];

	        var dh = 0, dl;
	        if (type$1(lightness) === 'array') {
	            dl = lightness[1] - lightness[0];
	        } else {
	            dl = 0;
	            lightness = [lightness, lightness];
	        }

	        var f = function(fract) {
	            var a = TWOPI * (((start+120)/360) + (rotations * fract));
	            var l = pow$2(lightness[0] + (dl * fract), gamma);
	            var h = dh !== 0 ? hue[0] + (fract * dh) : hue;
	            var amp = (h * l * (1-l)) / 2;
	            var cos_a = cos$1(a);
	            var sin_a = sin$1(a);
	            var r = l + (amp * ((-0.14861 * cos_a) + (1.78277* sin_a)));
	            var g = l + (amp * ((-0.29227 * cos_a) - (0.90649* sin_a)));
	            var b = l + (amp * (+1.97294 * cos_a));
	            return chroma$2(clip_rgb([r*255,g*255,b*255,1]));
	        };

	        f.start = function(s) {
	            if ((s == null)) { return start; }
	            start = s;
	            return f;
	        };

	        f.rotations = function(r) {
	            if ((r == null)) { return rotations; }
	            rotations = r;
	            return f;
	        };

	        f.gamma = function(g) {
	            if ((g == null)) { return gamma; }
	            gamma = g;
	            return f;
	        };

	        f.hue = function(h) {
	            if ((h == null)) { return hue; }
	            hue = h;
	            if (type$1(hue) === 'array') {
	                dh = hue[1] - hue[0];
	                if (dh === 0) { hue = hue[1]; }
	            } else {
	                dh = 0;
	            }
	            return f;
	        };

	        f.lightness = function(h) {
	            if ((h == null)) { return lightness; }
	            if (type$1(h) === 'array') {
	                lightness = h;
	                dl = h[1] - h[0];
	            } else {
	                lightness = [h,h];
	                dl = 0;
	            }
	            return f;
	        };

	        f.scale = function () { return chroma$2.scale(f); };

	        f.hue(hue);

	        return f;
	    };

	    var Color$4 = Color_1;
	    var digits = '0123456789abcdef';

	    var floor$1 = Math.floor;
	    var random = Math.random;

	    var random_1 = function () {
	        var code = '#';
	        for (var i=0; i<6; i++) {
	            code += digits.charAt(floor$1(random() * 16));
	        }
	        return new Color$4(code, 'hex');
	    };

	    var type = type$p;
	    var log = Math.log;
	    var pow$1 = Math.pow;
	    var floor = Math.floor;
	    var abs$1 = Math.abs;


	    var analyze = function (data, key) {
	        if ( key === void 0 ) key=null;

	        var r = {
	            min: Number.MAX_VALUE,
	            max: Number.MAX_VALUE*-1,
	            sum: 0,
	            values: [],
	            count: 0
	        };
	        if (type(data) === 'object') {
	            data = Object.values(data);
	        }
	        data.forEach(function (val) {
	            if (key && type(val) === 'object') { val = val[key]; }
	            if (val !== undefined && val !== null && !isNaN(val)) {
	                r.values.push(val);
	                r.sum += val;
	                if (val < r.min) { r.min = val; }
	                if (val > r.max) { r.max = val; }
	                r.count += 1;
	            }
	        });

	        r.domain = [r.min, r.max];

	        r.limits = function (mode, num) { return limits(r, mode, num); };

	        return r;
	    };


	    var limits = function (data, mode, num) {
	        if ( mode === void 0 ) mode='equal';
	        if ( num === void 0 ) num=7;

	        if (type(data) == 'array') {
	            data = analyze(data);
	        }
	        var min = data.min;
	        var max = data.max;
	        var values = data.values.sort(function (a,b) { return a-b; });

	        if (num === 1) { return [min,max]; }

	        var limits = [];

	        if (mode.substr(0,1) === 'c') { // continuous
	            limits.push(min);
	            limits.push(max);
	        }

	        if (mode.substr(0,1) === 'e') { // equal interval
	            limits.push(min);
	            for (var i=1; i<num; i++) {
	                limits.push(min+((i/num)*(max-min)));
	            }
	            limits.push(max);
	        }

	        else if (mode.substr(0,1) === 'l') { // log scale
	            if (min <= 0) {
	                throw new Error('Logarithmic scales are only possible for values > 0');
	            }
	            var min_log = Math.LOG10E * log(min);
	            var max_log = Math.LOG10E * log(max);
	            limits.push(min);
	            for (var i$1=1; i$1<num; i$1++) {
	                limits.push(pow$1(10, min_log + ((i$1/num) * (max_log - min_log))));
	            }
	            limits.push(max);
	        }

	        else if (mode.substr(0,1) === 'q') { // quantile scale
	            limits.push(min);
	            for (var i$2=1; i$2<num; i$2++) {
	                var p = ((values.length-1) * i$2)/num;
	                var pb = floor(p);
	                if (pb === p) {
	                    limits.push(values[pb]);
	                } else { // p > pb
	                    var pr = p - pb;
	                    limits.push((values[pb]*(1-pr)) + (values[pb+1]*pr));
	                }
	            }
	            limits.push(max);

	        }

	        else if (mode.substr(0,1) === 'k') { // k-means clustering
	            /*
	            implementation based on
	            http://code.google.com/p/figue/source/browse/trunk/figue.js#336
	            simplified for 1-d input values
	            */
	            var cluster;
	            var n = values.length;
	            var assignments = new Array(n);
	            var clusterSizes = new Array(num);
	            var repeat = true;
	            var nb_iters = 0;
	            var centroids = null;

	            // get seed values
	            centroids = [];
	            centroids.push(min);
	            for (var i$3=1; i$3<num; i$3++) {
	                centroids.push(min + ((i$3/num) * (max-min)));
	            }
	            centroids.push(max);

	            while (repeat) {
	                // assignment step
	                for (var j=0; j<num; j++) {
	                    clusterSizes[j] = 0;
	                }
	                for (var i$4=0; i$4<n; i$4++) {
	                    var value = values[i$4];
	                    var mindist = Number.MAX_VALUE;
	                    var best = (void 0);
	                    for (var j$1=0; j$1<num; j$1++) {
	                        var dist = abs$1(centroids[j$1]-value);
	                        if (dist < mindist) {
	                            mindist = dist;
	                            best = j$1;
	                        }
	                        clusterSizes[best]++;
	                        assignments[i$4] = best;
	                    }
	                }

	                // update centroids step
	                var newCentroids = new Array(num);
	                for (var j$2=0; j$2<num; j$2++) {
	                    newCentroids[j$2] = null;
	                }
	                for (var i$5=0; i$5<n; i$5++) {
	                    cluster = assignments[i$5];
	                    if (newCentroids[cluster] === null) {
	                        newCentroids[cluster] = values[i$5];
	                    } else {
	                        newCentroids[cluster] += values[i$5];
	                    }
	                }
	                for (var j$3=0; j$3<num; j$3++) {
	                    newCentroids[j$3] *= 1/clusterSizes[j$3];
	                }

	                // check convergence
	                repeat = false;
	                for (var j$4=0; j$4<num; j$4++) {
	                    if (newCentroids[j$4] !== centroids[j$4]) {
	                        repeat = true;
	                        break;
	                    }
	                }

	                centroids = newCentroids;
	                nb_iters++;

	                if (nb_iters > 200) {
	                    repeat = false;
	                }
	            }

	            // finished k-means clustering
	            // the next part is borrowed from gabrielflor.it
	            var kClusters = {};
	            for (var j$5=0; j$5<num; j$5++) {
	                kClusters[j$5] = [];
	            }
	            for (var i$6=0; i$6<n; i$6++) {
	                cluster = assignments[i$6];
	                kClusters[cluster].push(values[i$6]);
	            }
	            var tmpKMeansBreaks = [];
	            for (var j$6=0; j$6<num; j$6++) {
	                tmpKMeansBreaks.push(kClusters[j$6][0]);
	                tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length-1]);
	            }
	            tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a,b){ return a-b; });
	            limits.push(tmpKMeansBreaks[0]);
	            for (var i$7=1; i$7 < tmpKMeansBreaks.length; i$7+= 2) {
	                var v = tmpKMeansBreaks[i$7];
	                if (!isNaN(v) && (limits.indexOf(v) === -1)) {
	                    limits.push(v);
	                }
	            }
	        }
	        return limits;
	    };

	    var analyze_1 = {analyze: analyze, limits: limits};

	    var Color$3 = Color_1;


	    var contrast = function (a, b) {
	        // WCAG contrast ratio
	        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
	        a = new Color$3(a);
	        b = new Color$3(b);
	        var l1 = a.luminance();
	        var l2 = b.luminance();
	        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
	    };

	    var Color$2 = Color_1;
	    var sqrt = Math.sqrt;
	    var pow = Math.pow;
	    var min = Math.min;
	    var max = Math.max;
	    var atan2 = Math.atan2;
	    var abs = Math.abs;
	    var cos = Math.cos;
	    var sin = Math.sin;
	    var exp = Math.exp;
	    var PI = Math.PI;

	    var deltaE = function(a, b, Kl, Kc, Kh) {
	        if ( Kl === void 0 ) Kl=1;
	        if ( Kc === void 0 ) Kc=1;
	        if ( Kh === void 0 ) Kh=1;

	        // Delta E (CIE 2000)
	        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
	        var rad2deg = function(rad) {
	            return 360 * rad / (2 * PI);
	        };
	        var deg2rad = function(deg) {
	            return (2 * PI * deg) / 360;
	        };
	        a = new Color$2(a);
	        b = new Color$2(b);
	        var ref = Array.from(a.lab());
	        var L1 = ref[0];
	        var a1 = ref[1];
	        var b1 = ref[2];
	        var ref$1 = Array.from(b.lab());
	        var L2 = ref$1[0];
	        var a2 = ref$1[1];
	        var b2 = ref$1[2];
	        var avgL = (L1 + L2)/2;
	        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
	        var C2 = sqrt(pow(a2, 2) + pow(b2, 2));
	        var avgC = (C1 + C2)/2;
	        var G = 0.5*(1-sqrt(pow(avgC, 7)/(pow(avgC, 7) + pow(25, 7))));
	        var a1p = a1*(1+G);
	        var a2p = a2*(1+G);
	        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
	        var C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
	        var avgCp = (C1p + C2p)/2;
	        var arctan1 = rad2deg(atan2(b1, a1p));
	        var arctan2 = rad2deg(atan2(b2, a2p));
	        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
	        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
	        var avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360)/2 : (h1p + h2p)/2;
	        var T = 1 - 0.17*cos(deg2rad(avgHp - 30)) + 0.24*cos(deg2rad(2*avgHp)) + 0.32*cos(deg2rad(3*avgHp + 6)) - 0.2*cos(deg2rad(4*avgHp - 63));
	        var deltaHp = h2p - h1p;
	        deltaHp = abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
	        deltaHp = 2*sqrt(C1p*C2p)*sin(deg2rad(deltaHp)/2);
	        var deltaL = L2 - L1;
	        var deltaCp = C2p - C1p;    
	        var sl = 1 + (0.015*pow(avgL - 50, 2))/sqrt(20 + pow(avgL - 50, 2));
	        var sc = 1 + 0.045*avgCp;
	        var sh = 1 + 0.015*avgCp*T;
	        var deltaTheta = 30*exp(-pow((avgHp - 275)/25, 2));
	        var Rc = 2*sqrt(pow(avgCp, 7)/(pow(avgCp, 7) + pow(25, 7)));
	        var Rt = -Rc*sin(2*deg2rad(deltaTheta));
	        var result = sqrt(pow(deltaL/(Kl*sl), 2) + pow(deltaCp/(Kc*sc), 2) + pow(deltaHp/(Kh*sh), 2) + Rt*(deltaCp/(Kc*sc))*(deltaHp/(Kh*sh)));
	        return max(0, min(100, result));
	    };

	    var Color$1 = Color_1;

	    // simple Euclidean distance
	    var distance = function(a, b, mode) {
	        if ( mode === void 0 ) mode='lab';

	        // Delta E (CIE 1976)
	        // see http://www.brucelindbloom.com/index.html?Equations.html
	        a = new Color$1(a);
	        b = new Color$1(b);
	        var l1 = a.get(mode);
	        var l2 = b.get(mode);
	        var sum_sq = 0;
	        for (var i in l1) {
	            var d = (l1[i] || 0) - (l2[i] || 0);
	            sum_sq += d*d;
	        }
	        return Math.sqrt(sum_sq);
	    };

	    var Color = Color_1;

	    var valid = function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        try {
	            new (Function.prototype.bind.apply( Color, [ null ].concat( args) ));
	            return true;
	        } catch (e) {
	            return false;
	        }
	    };

	    // some pre-defined color scales:
	    var chroma$1 = chroma_1;

	    var scale = scale$2;

	    var scales = {
	    	cool: function cool() { return scale([chroma$1.hsl(180,1,.9), chroma$1.hsl(250,.7,.4)]) },
	    	hot: function hot() { return scale(['#000','#f00','#ff0','#fff']).mode('rgb') }
	    };

	    /**
	        ColorBrewer colors for chroma.js

	        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
	        Pennsylvania State University.

	        Licensed under the Apache License, Version 2.0 (the "License");
	        you may not use this file except in compliance with the License.
	        You may obtain a copy of the License at
	        http://www.apache.org/licenses/LICENSE-2.0

	        Unless required by applicable law or agreed to in writing, software distributed
	        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	        CONDITIONS OF ANY KIND, either express or implied. See the License for the
	        specific language governing permissions and limitations under the License.
	    */

	    var colorbrewer = {
	        // sequential
	        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
	        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
	        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
	        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
	        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
	        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
	        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
	        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
	        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
	        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
	        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
	        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
	        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
	        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
	        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
	        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
	        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
	        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
	        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

	        // diverging

	        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
	        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
	        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
	        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
	        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
	        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
	        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
	        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
	        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

	        // qualitative

	        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
	        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
	        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
	        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
	        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
	        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
	        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
	        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
	    };

	    // add lowercase aliases for case-insensitive matches
	    for (var i = 0, list = Object.keys(colorbrewer); i < list.length; i += 1) {
	        var key = list[i];

	        colorbrewer[key.toLowerCase()] = colorbrewer[key];
	    }

	    var colorbrewer_1 = colorbrewer;

	    var chroma = chroma_1;

	    // feel free to comment out anything to rollup
	    // a smaller chroma.js built

	    // io --> convert colors

















	    // operators --> modify existing Colors










	    // interpolators












	    // generators -- > create new colors
	    chroma.average = average;
	    chroma.bezier = bezier_1;
	    chroma.blend = blend_1;
	    chroma.cubehelix = cubehelix;
	    chroma.mix = chroma.interpolate = mix$1;
	    chroma.random = random_1;
	    chroma.scale = scale$2;

	    // other utility methods
	    chroma.analyze = analyze_1.analyze;
	    chroma.contrast = contrast;
	    chroma.deltaE = deltaE;
	    chroma.distance = distance;
	    chroma.limits = analyze_1.limits;
	    chroma.valid = valid;

	    // scale
	    chroma.scales = scales;

	    // colors
	    chroma.colors = w3cx11_1;
	    chroma.brewer = colorbrewer_1;

	    var chroma_js = chroma;

	    return chroma_js;

	}));
} (chroma$1));

var chroma = chroma$1.exports;

const defaultOptions = {
    lightMax: 95,
    lightMin: 70,
    chromaMax: 20,
    chromaMin: 5,
};
// Based on https://stackoverflow.com/a/13532993
const shadeColor = (color, percent) => `#${[
    parseInt(color.substring(1, 3), 16),
    parseInt(color.substring(3, 5), 16),
    parseInt(color.substring(5, 7), 16),
]
    .map((c) => {
    let a = parseInt(((c * (100 + percent)) / 100).toString(), 10);
    const b = (a = a < 255 ? a : 255).toString(16);
    return b.length === 1 ? `0${b}` : b;
})
    .join('')}`;
// Details on hash algo https://stackoverflow.com/a/33647870
function getHash(str) {
    let hash = 0;
    let i = 0;
    const len = str.length;
    while (i < len) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) << 0;
        i += 1;
    }
    return hash;
}
function positiveHash(str) {
    return getHash(str) + 2147483647 + 1;
}
function darkIsContrast(c) {
    const hexcolor = c.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 141;
}
function calcWordColor(word, config) {
    const lightMax = config?.lightMax || 95;
    const lightMin = config?.lightMin || 70;
    const chromaMax = config?.chromaMax || 20;
    const chromaMin = config?.chromaMin || 5;
    const first = positiveHash(getHash(word).toString());
    const second = positiveHash(first.toString());
    const third = positiveHash(second.toString());
    const between = (hash, from, to) => (hash % (to - from)) + from;
    return chroma
        .lch(between(first, lightMin, lightMax) / 100, between(second, chromaMin, chromaMax) / 100, between(third, 0, 360))
        .hex();
}
/**
 * 计算默认的样式 背景色 边框 文本样式
 * @param nodeLabel
 * @param config
 * @returns Object
 */
function calculateDefaultNodeColors(nodeLabel, config = defaultOptions) {
    const bkg = calcWordColor(nodeLabel, config);
    const border = shadeColor(bkg, -20);
    const text = darkIsContrast(bkg) ? '#2A2C34' : '#FFFFFF';
    return {
        backgroundColor: bkg,
        borderColor: border,
        textColor: text,
    };
}

class Selector {
    tag = '';
    classes = [];
    constructor(tag, classes) {
        this.tag = tag;
        this.classes = classes ?? [];
    }
    toString = () => {
        return selectorArrayToString([this.tag].concat(this.classes));
    };
}
class StyleElement {
    selector;
    props;
    constructor(selector) {
        this.selector = selector;
        this.props = {};
    }
    /**
     * 从当前样式规则里找到对应的选择集样式
     * @param rules
     * @returns
     */
    applyRules = (rules) => {
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.matches(this.selector)) {
                this.props = { ...this.props, ...rule.props };
                this.props.caption = this.props.caption || this.props.defaultCaption;
            }
        }
        return this;
    };
    get = (attr) => {
        return this.props[attr] || '';
    };
}
class StyleRule {
    selector;
    props;
    constructor(selector1, props1) {
        this.selector = selector1;
        this.props = props1;
    }
    matches = (selector) => {
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
    matchesExact = (selector) => {
        return (this.matches(selector) &&
            this.selector.classes.length === selector.classes.length);
    };
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
const DEFAULT_SIZES = [
    {
        diameter: '10px',
    },
    {
        diameter: '20px',
    },
    {
        diameter: '50px',
    },
    {
        diameter: '65px',
    },
    {
        diameter: '80px',
    },
];
const DEFAULT_ARRAY_WIDTHS = [
    {
        'shaft-width': '1px',
    },
    {
        'shaft-width': '2px',
    },
    {
        'shaft-width': '3px',
    },
    {
        'shaft-width': '5px',
    },
    {
        'shaft-width': '8px',
    },
    {
        'shaft-width': '13px',
    },
    {
        'shaft-width': '25px',
    },
    {
        'shaft-width': '38px',
    },
];
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
    useGeneratedDefaultColors;
    rules;
    constructor(useGeneratedDefaultColors = false) {
        this.useGeneratedDefaultColors = useGeneratedDefaultColors;
        this.rules = [];
        try {
            this.loadRules();
        }
        catch (_error) {
            // e = _error
        }
    }
    parseSelector = function (key) {
        const tokens = selectorStringToArray(key);
        return new Selector(tokens[0], tokens.slice(1));
    };
    nodeSelector = function (node = { labels: null }) {
        const classes = node.labels != null ? node.labels : [];
        return new Selector('node', classes);
    };
    relationshipSelector = function (rel = { type: null }) {
        const classes = rel.type != null ? [rel.type] : [];
        return new Selector('relationship', classes);
    };
    findRule = function (selector, rules) {
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.matchesExact(selector)) {
                return rule;
            }
        }
        return undefined;
    };
    findAvailableDefaultColor = function (rules) {
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
    getDefaultNodeCaption = function (item) {
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
    calculateStyle = (selector) => {
        return new StyleElement(selector).applyRules(this.rules);
    };
    setDefaultNodeStyle = (selector, item) => {
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
            const calcColor = (label) => {
                const { backgroundColor, borderColor, textColor } = calculateDefaultNodeColors(label.classes[0]);
                return {
                    'border-color': borderColor,
                    'text-color-internal': textColor,
                    color: backgroundColor,
                };
            };
            this.changeForSelector(minimalSelector, this.useGeneratedDefaultColors
                ? calcColor(minimalSelector)
                : this.findAvailableDefaultColor(this.rules));
        }
        if (defaultCaption) {
            this.changeForSelector(minimalSelector, this.getDefaultNodeCaption(item));
        }
    };
    changeForSelector = (selector, props) => {
        let rule = this.findRule(selector, this.rules);
        if (rule == null) {
            rule = new StyleRule(selector, props);
            this.rules.push(rule);
        }
        rule.props = { ...rule.props, ...props };
        return rule;
    };
    destroyRule = (rule) => {
        const idx = this.rules.indexOf(rule);
        if (idx != null) {
            this.rules.splice(idx, 1);
        }
    };
    importGrass = (string) => {
        try {
            const rules = this.parse(string);
            this.loadRules(rules);
        }
        catch (_error) {
            // e = _error
        }
    };
    parse = function (string) {
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
    resetToDefault = () => {
        this.loadRules();
    };
    toSheet = () => {
        const sheet = {};
        this.rules.forEach((rule) => {
            sheet[rule.selector.toString()] = rule.props;
        });
        return sheet;
    };
    toString = () => {
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
    loadRules = (data) => {
        const localData = typeof data === 'object' ? data : DEFAULT_STYLE;
        this.rules = [];
        for (const key in localData) {
            const props = localData[key];
            this.rules.push(new StyleRule(this.parseSelector(key), props));
        }
    };
    defaultSizes = function () {
        return DEFAULT_SIZES;
    };
    defaultArrayWidths = function () {
        return DEFAULT_ARRAY_WIDTHS;
    };
    defaultColors = function () {
        return DEFAULT_COLORS;
    };
    interpolate = (str, item) => {
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
    forNode = (node = {}) => {
        const selector = this.nodeSelector(node);
        if ((node.labels != null ? node.labels.length : 0) > 0) {
            this.setDefaultNodeStyle(selector, node);
        }
        return this.calculateStyle(selector);
    };
    forRelationship = (rel) => {
        const selector = this.relationshipSelector(rel);
        return this.calculateStyle(selector);
    };
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
    simulation;
    simulationTimeout = null;
    constructor(render) {
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

const nodeEventHandlers = (selection, trigger, simulation) => {
    let initialDragPosition;
    let restartedSimulation = false;
    const tolerance = 25;
    const onNodeClick = (_event, node) => {
        trigger('nodeClicked', node);
    };
    const onNodeDblClick = (_event, node) => {
        trigger('nodeDblClicked', node);
    };
    const onNodeMouseOver = (_event, node) => {
        if (!node.fx && !node.fy) {
            node.hoverFixed = true;
            node.fx = node.x;
            node.fy = node.y;
        }
        trigger('nodeMouseOver', node);
    };
    const onNodeMouseOut = (_event, node) => {
        if (node.hoverFixed) {
            node.hoverFixed = false;
            node.fx = null;
            node.fy = null;
        }
        trigger('nodeMouseOut', node);
    };
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
    return selection
        .call(d3Drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
        .on('mouseover', onNodeMouseOver)
        .on('mouseout', onNodeMouseOut)
        .on('click', onNodeClick)
        .on('dblclick', onNodeDblClick);
};
const relationshipEventHandlers = (selection, trigger) => {
    const onRelationshipClick = (event, rel) => {
        event.stopPropagation();
        trigger('relationshipClicked', rel);
    };
    const onRelMouseOver = (_event, rel) => {
        trigger('relMouseOver', rel);
    };
    const onRelMouseOut = (_event, rel) => {
        trigger('relMouseOut', rel);
    };
    return selection
        .on('mousedown', onRelationshipClick)
        .on('mouseover', onRelMouseOver)
        .on('mouseout', onRelMouseOut);
};

const noOp = () => undefined;
class Renderer {
    onGraphChange;
    onTick;
    name;
    constructor({ onGraphChange = noOp, onTick = noOp, name, }) {
        this.onGraphChange = onGraphChange;
        this.onTick = onTick;
        this.name = name;
    }
}

const noop = () => undefined;
const nodeRingStrokeSize = 8;
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
            .attr('d', (d) => d.arrow.outline(d.shortCaptionLength ?? 0));
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
            .attr('x', (rel) => rel?.arrow?.midShaftPoint?.x ?? 0)
            .attr('y', (rel) => (rel?.arrow?.midShaftPoint?.y ?? 0) +
            parseFloat(viz.style.forRelationship(rel).get('font-size')) / 2 -
            1)
            .attr('transform', (rel) => {
            if (rel.naturalAngle < 90 || rel.naturalAngle > 270) {
                return `rotate(180 ${rel?.arrow?.midShaftPoint?.x ?? 0} ${rel?.arrow?.midShaftPoint?.y ?? 0})`;
            }
            else {
                return null;
            }
        })
            .text((rel) => rel.shortCaption ?? '');
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

const mapProperties = (_) => Object.assign({}, ...stringifyValues(_));
const stringifyValues = (obj) => Object.keys(obj).map((k) => ({
    [k]: obj[k] === null ? 'null' : optionalToString(obj[k]),
}));
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
                labelStats[label].properties = {
                    ...labelStats[label].properties,
                    ...node.propertyMap,
                };
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
            relTypeStats[rel.type].properties = {
                ...relTypeStats[rel.type].properties,
                ...rel.propertyMap,
            };
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
    getNodeNeighbours;
    graph;
    visualization;
    onGraphModelChange;
    onItemMouseOver;
    onItemSelected;
    onGraphInteraction;
    selectedItem;
    constructor(graph, visualization, getNodeNeighbours, onItemMouseOver, onItemSelected, onGraphModelChange, onGraphInteraction) {
        this.graph = graph;
        this.visualization = visualization;
        this.getNodeNeighbours = getNodeNeighbours;
        this.selectedItem = null;
        this.onItemMouseOver = onItemMouseOver;
        this.onItemSelected = onItemSelected;
        this.onGraphInteraction = onGraphInteraction ?? (() => undefined);
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
    deselectItem() {
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
        });
    }
    nodeClose(d) {
        this.graph.removeConnectedRelationships(d);
        this.graph.removeNode(d);
        this.deselectItem();
        this.visualization.update({
            updateNodes: true,
            updateRelationships: true,
            restartSimulation: true,
        });
        this.graphModelChanged();
        this.onGraphInteraction('NODE_DISMISSED');
    }
    nodeClicked(node) {
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
            });
        }
        else {
            this.deselectItem();
        }
    }
    nodeUnlock(d) {
        if (!d) {
            return;
        }
        d.fx = null;
        d.fy = null;
        this.deselectItem();
        this.onGraphInteraction('NODE_UNPINNED');
    }
    nodeDblClicked(d) {
        if (d.expanded) {
            this.nodeCollapse(d);
            return;
        }
        d.expanded = true;
        const graph = this.graph;
        const visualization = this.visualization;
        const graphModelChanged = this.graphModelChanged.bind(this);
        this.getNodeNeighbours(d, this.graph.findNodeNeighbourIds(d.id), ({ nodes, relationships }) => {
            graph.addExpandedNodes(d, mapNodes(nodes));
            graph.addRelationships(mapRelationships(relationships, graph));
            visualization.update({ updateNodes: true, updateRelationships: true });
            graphModelChanged();
        });
        this.onGraphInteraction('NODE_EXPAND');
    }
    nodeCollapse(d) {
        d.expanded = false;
        this.graph.collapseNode(d);
        this.visualization.update({ updateNodes: true, updateRelationships: true });
        this.graphModelChanged();
    }
    onNodeMouseOver(node) {
        if (!node.contextMenu) {
            this.onItemMouseOver({
                type: 'node',
                item: node,
            });
        }
    }
    onMenuMouseOver(itemWithMenu) {
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
        });
    }
    onRelationshipMouseOver(relationship) {
        this.onItemMouseOver({
            type: 'relationship',
            item: relationship,
        });
    }
    onRelationshipClicked(relationship) {
        if (!relationship.selected) {
            this.selectItem(relationship);
            this.onItemSelected({
                type: 'relationship',
                item: relationship,
            });
        }
        else {
            this.deselectItem();
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
            .on('nodeClose', this.nodeClose.bind(this))
            .on('nodeClicked', this.nodeClicked.bind(this))
            .on('nodeDblClicked', this.nodeDblClicked.bind(this))
            .on('nodeUnlock', this.nodeUnlock.bind(this));
        this.onItemMouseOut();
    }
}

const isObject = (val) => val !== null && typeof val === 'object';

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
                return isNaN(max) ? defaultValue : max;
            }
            return value;
        };
    }
    if (isObject(value)) {
        return () => {
            if (resultIsNumber) {
                const max = Math.max(value.width, value.height);
                return isNaN(max) ? defaultValue : max;
            }
            return [value.width, value.height];
        };
    }
    return () => defaultValue;
};
class CircularLayout {
    /** 布局中心 */
    center;
    /** 固定半径，若设置了 radius，则 startRadius 与 endRadius 不起效 */
    radius = null;
    /** 节点间距，若设置 nodeSpacing，则 radius 将被自动计算，即设置 radius 不生效 */
    nodeSpacing;
    /** 节点大小，配合 nodeSpacing，一起用于计算 radius。若不配置，节点大小默认为 30 */
    nodeSize = undefined;
    /** 起始半径 */
    startRadius = null;
    /** 终止半径 */
    endRadius = null;
    /** 起始角度 */
    startAngle = 0;
    /** 终止角度 */
    endAngle = 2 * Math.PI;
    /** 是否顺时针 */
    clockwise = true;
    /** 节点在环上分成段数（几个段将均匀分布），在 endRadius - startRadius != 0 时生效 */
    divisions = 1;
    /** 节点在环上排序的依据，可选: 'topology', 'degree', 'null' */
    ordering = null;
    /** how many 2*pi from first to last nodes */
    angleRatio = 1;
    nodes = [];
    edges = [];
    // private nodeMap: IndexMap = {};
    degrees = [];
    width = 300;
    height = 300;
    onLayoutEnd;
    constructor(options) {
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
        self.onLayoutEnd?.();
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

class GraphVisualization {
    measureSize;
    graphData;
    isFullscreen;
    layout;
    wheelZoomRequiresModKey;
    initialZoomToFit;
    root;
    baseGroup;
    rect;
    container;
    geometry;
    zoomBehavior;
    // 最小缩放
    zoomMinScaleExtent = ZOOM_MIN_SCALE;
    callbacks = {};
    graph;
    style;
    // 力仿真
    forceSimulation;
    // 环形布局
    circularlayout;
    // This flags that a panning is ongoing and won't trigger
    // 'canvasClick' event when panning(平移) ends.
    draw = false;
    isZoomClick = false;
    constructor(element, measureSize, graphData, 
    // public style: GraphStyleModel,
    isFullscreen, layout, onZoomEvent, onDisplayZoomWheelInfoMessage, wheelZoomRequiresModKey, initialZoomToFit) {
        this.measureSize = measureSize;
        this.graphData = graphData;
        this.isFullscreen = isFullscreen;
        this.layout = layout;
        this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
        this.initialZoomToFit = initialZoomToFit;
        this.root = d3Select(element);
        // 初始化配置
        this.initConfig(isFullscreen, layout, wheelZoomRequiresModKey);
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
        // 初始化布局控制逻辑
        this.initLayoutController();
    }
    // 初始化配置
    initConfig(isFullscreen, layout, wheelZoomRequiresModKey) {
        this.layout = layout;
        this.isFullscreen = isFullscreen;
        this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
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
    initLayoutController() {
        switch (this.layout) {
            case 'force':
                this.forceSimulationHandler();
                break;
            case 'cricular':
                this.cricularLayoutHandler();
                break;
        }
    }
    update(options) {
        if (options.updateNodes) {
            this.updateNodes();
        }
        if (options.updateRelationships) {
            this.updateRelationships();
        }
        if (options.restartSimulation ?? true) {
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
            .call(nodeEventHandlers, this.trigger, this.forceSimulation)
            // 如果被选中 那么添加对应的选择样式
            .classed('selected', (node) => node.selected);
        node.forEach((renderer) => nodeGroups.call(renderer.onGraphChange, this));
        this.layout === 'force' && this.forceSimulation.updateNodes(this.graph);
        this.layout === 'force' &&
            this.forceSimulation.updateRelationships(this.graph);
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
        this.layout === 'force' &&
            this.forceSimulation.updateRelationships(this.graph);
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
    zoomByType = (zoomType) => {
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
    zoomToFitViewport = () => {
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
    getZoomScaleFactorToFitWholeGraph = () => {
        const graphSize = 
        // this.container.node()返回当前选择集的第一个元素
        this.container.node()?.getBBox && this.container.node()?.getBBox();
        const availableWidth = this.root.node()?.clientWidth;
        const availableHeight = this.root.node()?.clientHeight;
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
    adjustZoomMinScaleExtentToFitGraph = (padding_factor = 0.75) => {
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
    setInitialZoom() {
        const count = this.graph.nodes().length;
        // chosen by *feel* (graph fitting guesstimate)
        const scale = -0.02364554 + 1.913 / (1 + (count / 12.7211) ** 0.8156444);
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
        return this.container.node()?.getBBox();
    }
    // init graph bind event
    initEventHandler(getNodeNeighbours, onItemMouseOver, onItemSelect, onGraphModelChange, onGraphInteraction) {
        const graphEventHandler = new GraphEventHandlerModel(this.graph, this, getNodeNeighbours, onItemMouseOver, onItemSelect, onGraphModelChange, onGraphInteraction);
        graphEventHandler.bindEventHandlers();
        return graphEventHandler;
    }
    on = (event, callback) => {
        if (isNullish(this.callbacks[event])) {
            this.callbacks[event] = [];
        }
        this.callbacks[event]?.push(callback);
        return this;
    };
    trigger = (event, ...args) => {
        const callbacksForEvent = this.callbacks[event] ?? [];
        // eslint-disable-next-line prefer-spread
        callbacksForEvent.forEach((callback) => callback.apply(null, args));
    };
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
        this.setInitialZoom();
        this.forceSimulation = new ForceSimulation(this.render.bind(this));
        this.precomputeAndStart();
    }
}

return GraphVisualization;

}));
