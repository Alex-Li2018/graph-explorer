import 'core-js/modules/es.object.to-string.js';
import 'core-js/modules/web.dom-collections.for-each.js';
import 'core-js/modules/es.array.filter.js';
import 'core-js/modules/es.array.join.js';
import { easeCubic } from 'd3-ease';
import { select } from 'd3-selection';
import { zoomIdentity, zoom } from 'd3-zoom';
import 'core-js/modules/es.array.slice.js';
import 'core-js/modules/es.array.map.js';
import _createForOfIteratorHelperLoose from '@babel/runtime/helpers/esm/createForOfIteratorHelperLoose';
import 'core-js/modules/es.array.from.js';
import 'core-js/modules/es.string.iterator.js';
import 'core-js/modules/es.array.sort.js';
import 'core-js/modules/es.regexp.to-string.js';
import 'core-js/modules/es.array.splice.js';
import 'core-js/modules/es.regexp.exec.js';
import 'core-js/modules/es.string.replace.js';
import { forceSimulation, forceManyBody, forceX, forceY, forceCollide, forceLink } from 'd3-force';

var MAX_PRECOMPUTED_TICKS = 300;
var EXTRA_TICKS_PER_RENDER = 10; // Friction.

var VELOCITY_DECAY = 0.4; // Temperature of the simulation. It's a value in the range [0,1] and it
// decreases over time. Can be seen as the probability that a node will move.

var DEFAULT_ALPHA = 1; // Temperature the simulation tries to converge to.

var DEFAULT_ALPHA_MIN = 0.05; // The lower this value, the lower the movement of nodes that aren't being
var LINK_DISTANCE = 45;
var FORCE_LINK_DISTANCE = function FORCE_LINK_DISTANCE(relationship) {
  return relationship.source.radius + relationship.target.radius + LINK_DISTANCE * 2;
};
var FORCE_COLLIDE_RADIUS = function FORCE_COLLIDE_RADIUS(node) {
  return node.radius + 25;
};
var FORCE_CHARGE = -400;
var FORCE_CENTER_X = 0.03;
var FORCE_CENTER_Y = 0.03;
var ZOOM_MIN_SCALE = 0.1;
var ZOOM_MAX_SCALE = 2;
var ZOOM_FIT_PADDING_PERCENT = 0.05;

var square = function square(l) {
  return l * l;
};

var intersectWithOtherCircle = function intersectWithOtherCircle(fixedPoint, radius, xCenter, polarity, homotheticCenter) {
  var gradient = fixedPoint.y / (fixedPoint.x - homotheticCenter);
  var hc = fixedPoint.y - gradient * fixedPoint.x;
  var A = 1 + square(gradient);
  var B = 2 * (gradient * hc - xCenter);
  var C = square(hc) + square(xCenter) - square(radius);
  var x = (-B + polarity * Math.sqrt(square(B) - 4 * A * C)) / (2 * A);
  var intersection = {
    x: x,
    y: (x - homotheticCenter) * gradient
  };
  return intersection;
};

var ArcArrow = function ArcArrow(startRadius, endRadius, endCentre, deflection, arrowWidth, headWidth, headLength, captionLayout) {
  this.deflection = void 0;
  this.midShaftPoint = void 0;
  this.outline = void 0;
  this.overlay = void 0;
  this.shaftLength = void 0;
  this.deflection = deflection;
  var deflectionRadians = this.deflection * Math.PI / 180;
  var startAttach = {
    x: Math.cos(deflectionRadians) * startRadius,
    y: Math.sin(deflectionRadians) * startRadius
  };
  var radiusRatio = startRadius / (endRadius + headLength);
  var homotheticCenter = -endCentre * radiusRatio / (1 - radiusRatio);
  var endAttach = intersectWithOtherCircle(startAttach, endRadius + headLength, endCentre, -1, homotheticCenter);
  var g1 = -startAttach.x / startAttach.y;
  var c1 = startAttach.y + square(startAttach.x) / startAttach.y;
  var g2 = -(endAttach.x - endCentre) / endAttach.y;
  var c2 = endAttach.y + (endAttach.x - endCentre) * endAttach.x / endAttach.y;
  var cx = (c1 - c2) / (g2 - g1);
  var cy = g1 * cx + c1;
  var arcRadius = Math.sqrt(square(cx - startAttach.x) + square(cy - startAttach.y));
  var startAngle = Math.atan2(startAttach.x - cx, cy - startAttach.y);
  var endAngle = Math.atan2(endAttach.x - cx, cy - endAttach.y);
  var sweepAngle = endAngle - startAngle;

  if (this.deflection > 0) {
    sweepAngle = 2 * Math.PI - sweepAngle;
  }

  this.shaftLength = sweepAngle * arcRadius;

  if (startAngle > endAngle) {
    this.shaftLength = 0;
  }

  var midShaftAngle = (startAngle + endAngle) / 2;

  if (this.deflection > 0) {
    midShaftAngle += Math.PI;
  }

  this.midShaftPoint = {
    x: cx + arcRadius * Math.sin(midShaftAngle),
    y: cy - arcRadius * Math.cos(midShaftAngle)
  };

  var startTangent = function startTangent(dr) {
    var dx = (dr < 0 ? 1 : -1) * Math.sqrt(square(dr) / (1 + square(g1)));
    var dy = g1 * dx;
    return {
      x: startAttach.x + dx,
      y: startAttach.y + dy
    };
  };

  var endTangent = function endTangent(dr) {
    var dx = (dr < 0 ? -1 : 1) * Math.sqrt(square(dr) / (1 + square(g2)));
    var dy = g2 * dx;
    return {
      x: endAttach.x + dx,
      y: endAttach.y + dy
    };
  };

  var angleTangent = function angleTangent(angle, dr) {
    return {
      x: cx + (arcRadius + dr) * Math.sin(angle),
      y: cy - (arcRadius + dr) * Math.cos(angle)
    };
  };

  var endNormal = function endNormal(dc) {
    var dx = (dc < 0 ? -1 : 1) * Math.sqrt(square(dc) / (1 + square(1 / g2)));
    var dy = dx / g2;
    return {
      x: endAttach.x + dx,
      y: endAttach.y - dy
    };
  };

  var endOverlayCorner = function endOverlayCorner(dr, dc) {
    var shoulder = endTangent(dr);
    var arrowTip = endNormal(dc);
    return {
      x: shoulder.x + arrowTip.x - endAttach.x,
      y: shoulder.y + arrowTip.y - endAttach.y
    };
  };

  var coord = function coord(point) {
    return point.x + "," + point.y;
  };

  var shaftRadius = arrowWidth / 2;
  var headRadius = headWidth / 2;
  var positiveSweep = startAttach.y > 0 ? 0 : 1;
  var negativeSweep = startAttach.y < 0 ? 0 : 1;

  this.outline = function (shortCaptionLength) {
    if (startAngle > endAngle) {
      return ['M', coord(endTangent(-headRadius)), 'L', coord(endNormal(headLength)), 'L', coord(endTangent(headRadius)), 'Z'].join(' ');
    }

    if (captionLayout === 'external') {
      var captionSweep = shortCaptionLength / arcRadius;

      if (this.deflection > 0) {
        captionSweep *= -1;
      }

      var startBreak = midShaftAngle - captionSweep / 2;
      var endBreak = midShaftAngle + captionSweep / 2;
      return ['M', coord(startTangent(shaftRadius)), 'L', coord(startTangent(-shaftRadius)), 'A', arcRadius - shaftRadius, arcRadius - shaftRadius, 0, 0, positiveSweep, coord(angleTangent(startBreak, -shaftRadius)), 'L', coord(angleTangent(startBreak, shaftRadius)), 'A', arcRadius + shaftRadius, arcRadius + shaftRadius, 0, 0, negativeSweep, coord(startTangent(shaftRadius)), 'Z', 'M', coord(angleTangent(endBreak, shaftRadius)), 'L', coord(angleTangent(endBreak, -shaftRadius)), 'A', arcRadius - shaftRadius, arcRadius - shaftRadius, 0, 0, positiveSweep, coord(endTangent(-shaftRadius)), 'L', coord(endTangent(-headRadius)), 'L', coord(endNormal(headLength)), 'L', coord(endTangent(headRadius)), 'L', coord(endTangent(shaftRadius)), 'A', arcRadius + shaftRadius, arcRadius + shaftRadius, 0, 0, negativeSweep, coord(angleTangent(endBreak, shaftRadius))].join(' ');
    } else {
      return ['M', coord(startTangent(shaftRadius)), 'L', coord(startTangent(-shaftRadius)), 'A', arcRadius - shaftRadius, arcRadius - shaftRadius, 0, 0, positiveSweep, coord(endTangent(-shaftRadius)), 'L', coord(endTangent(-headRadius)), 'L', coord(endNormal(headLength)), 'L', coord(endTangent(headRadius)), 'L', coord(endTangent(shaftRadius)), 'A', arcRadius + shaftRadius, arcRadius + shaftRadius, 0, 0, negativeSweep, coord(startTangent(shaftRadius))].join(' ');
    }
  };

  this.overlay = function (minWidth) {
    var radius = Math.max(minWidth / 2, shaftRadius);
    return ['M', coord(startTangent(radius)), 'L', coord(startTangent(-radius)), 'A', arcRadius - radius, arcRadius - radius, 0, 0, positiveSweep, coord(endTangent(-radius)), 'L', coord(endOverlayCorner(-radius, headLength)), 'L', coord(endOverlayCorner(radius, headLength)), 'L', coord(endTangent(radius)), 'A', arcRadius + radius, arcRadius + radius, 0, 0, negativeSweep, coord(startTangent(radius))].join(' ');
  };
};

var Point = /*#__PURE__*/function () {
  function Point(x, y) {
    this.x = void 0;
    this.y = void 0;
    this.x = x;
    this.y = y;
  }

  var _proto = Point.prototype;

  _proto.toString = function toString() {
    return this.x + " " + this.y;
  };

  return Point;
}();

var LoopArrow = function LoopArrow(nodeRadius, straightLength, spreadDegrees, shaftWidth, headWidth, headLength, captionHeight) {
  this.midShaftPoint = void 0;
  this.outline = void 0;
  this.overlay = void 0;
  this.shaftLength = void 0;
  var spread = spreadDegrees * Math.PI / 180;
  var r1 = nodeRadius;
  var r2 = nodeRadius + headLength;
  var r3 = nodeRadius + straightLength;
  var loopRadius = r3 * Math.tan(spread / 2);
  var shaftRadius = shaftWidth / 2;
  this.shaftLength = loopRadius * 3 + shaftWidth;

  var normalPoint = function normalPoint(sweep, radius, displacement) {
    var localLoopRadius = radius * Math.tan(spread / 2);
    var cy = radius / Math.cos(spread / 2);
    return new Point((localLoopRadius + displacement) * Math.sin(sweep), cy + (localLoopRadius + displacement) * Math.cos(sweep));
  };

  this.midShaftPoint = normalPoint(0, r3, shaftRadius + captionHeight / 2 + 2);

  var startPoint = function startPoint(radius, displacement) {
    return normalPoint((Math.PI + spread) / 2, radius, displacement);
  };

  var endPoint = function endPoint(radius, displacement) {
    return normalPoint(-(Math.PI + spread) / 2, radius, displacement);
  };

  this.outline = function () {
    var inner = loopRadius - shaftRadius;
    var outer = loopRadius + shaftRadius;
    return ['M', startPoint(r1, shaftRadius), 'L', startPoint(r3, shaftRadius), 'A', outer, outer, 0, 1, 1, endPoint(r3, shaftRadius), 'L', endPoint(r2, shaftRadius), 'L', endPoint(r2, -headWidth / 2), 'L', endPoint(r1, 0), 'L', endPoint(r2, headWidth / 2), 'L', endPoint(r2, -shaftRadius), 'L', endPoint(r3, -shaftRadius), 'A', inner, inner, 0, 1, 0, startPoint(r3, -shaftRadius), 'L', startPoint(r1, -shaftRadius), 'Z'].join(' ');
  };

  this.overlay = function (minWidth) {
    var displacement = Math.max(minWidth / 2, shaftRadius);
    var inner = loopRadius - displacement;
    var outer = loopRadius + displacement;
    return ['M', startPoint(r1, displacement), 'L', startPoint(r3, displacement), 'A', outer, outer, 0, 1, 1, endPoint(r3, displacement), 'L', endPoint(r2, displacement), 'L', endPoint(r2, -displacement), 'L', endPoint(r3, -displacement), 'A', inner, inner, 0, 1, 0, startPoint(r3, -displacement), 'L', startPoint(r1, -displacement), 'Z'].join(' ');
  };
};

var StraightArrow = function StraightArrow(startRadius, endRadius, centreDistance, shaftWidth, headWidth, headHeight, captionLayout) {
  this.length = void 0;
  this.midShaftPoint = void 0;
  this.outline = void 0;
  this.overlay = void 0;
  this.shaftLength = void 0;
  this.deflection = 0;
  this.length = centreDistance - (startRadius + endRadius);
  this.shaftLength = this.length - headHeight;
  var startArrow = startRadius;
  var endShaft = startArrow + this.shaftLength;
  var endArrow = startArrow + this.length;
  var shaftRadius = shaftWidth / 2;
  var headRadius = headWidth / 2;
  this.midShaftPoint = {
    x: startArrow + this.shaftLength / 2,
    y: 0
  };

  this.outline = function (shortCaptionLength) {
    if (captionLayout === 'external') {
      var startBreak = startArrow + (this.shaftLength - shortCaptionLength) / 2;
      var endBreak = endShaft - (this.shaftLength - shortCaptionLength) / 2;
      return ['M', startArrow, shaftRadius, 'L', startBreak, shaftRadius, 'L', startBreak, -shaftRadius, 'L', startArrow, -shaftRadius, 'Z', 'M', endBreak, shaftRadius, 'L', endShaft, shaftRadius, 'L', endShaft, headRadius, 'L', endArrow, 0, 'L', endShaft, -headRadius, 'L', endShaft, -shaftRadius, 'L', endBreak, -shaftRadius, 'Z'].join(' ');
    } else {
      return ['M', startArrow, shaftRadius, 'L', endShaft, shaftRadius, 'L', endShaft, headRadius, 'L', endArrow, 0, 'L', endShaft, -headRadius, 'L', endShaft, -shaftRadius, 'L', startArrow, -shaftRadius, 'Z'].join(' ');
    }
  };

  this.overlay = function (minWidth) {
    var radius = Math.max(minWidth / 2, shaftRadius);
    return ['M', startArrow, radius, 'L', endArrow, radius, 'L', endArrow, -radius, 'L', startArrow, -radius, 'Z'].join(' ');
  };
};

var measureTextWidthByCanvas = function measureTextWidthByCanvas(text, font, context) {
  context.font = font;
  return context.measureText(text).width;
};

var cacheTextWidth = function cacheTextWidth() {
  var CATCH_SIZE = 100000;
  var textMeasureMap = {};
  var lruKeyList = [];
  return function (key, calculate) {
    var cached = textMeasureMap[key];

    if (cached) {
      return cached;
    } else {
      var result = calculate();

      if (lruKeyList.length > CATCH_SIZE) {
        delete textMeasureMap[lruKeyList.splice(0, 1).toString()];
        lruKeyList.push(key);
      }

      return textMeasureMap[key] = result;
    }
  };
};

function measureText(text, fontFamily, fontSize, canvas2DContext) {
  var font = "normal normal normal " + fontSize + "px/normal " + fontFamily;
  return cacheTextWidth()("[" + font + "][" + text + "]", function () {
    return measureTextWidthByCanvas(text, font, canvas2DContext);
  });
}

var PairwiseArcsRelationshipRouting = /*#__PURE__*/function () {
  function PairwiseArcsRelationshipRouting(style) {
    this.style = void 0;
    this.canvas = void 0;
    this.style = style;
    this.canvas = document.createElement('canvas');
  }

  var _proto = PairwiseArcsRelationshipRouting.prototype;

  _proto.measureRelationshipCaption = function measureRelationshipCaption(relationship, caption) {
    var fontFamily = 'sans-serif';
    var padding = parseFloat(this.style.forRelationship(relationship).get('padding'));
    var canvas2DContext = this.canvas.getContext('2d');
    return measureText(caption, fontFamily, relationship.captionHeight, canvas2DContext) + padding * 2;
  };

  _proto.captionFitsInsideArrowShaftWidth = function captionFitsInsideArrowShaftWidth(relationship) {
    return parseFloat(this.style.forRelationship(relationship).get('shaft-width')) > relationship.captionHeight;
  };

  _proto.measureRelationshipCaptions = function measureRelationshipCaptions(relationships) {
    var _this = this;

    relationships.forEach(function (relationship) {
      relationship.captionHeight = parseFloat(_this.style.forRelationship(relationship).get('font-size'));
      relationship.captionLength = _this.measureRelationshipCaption(relationship, relationship.caption);
      relationship.captionLayout = _this.captionFitsInsideArrowShaftWidth(relationship) && !relationship.isLoop() ? 'internal' : 'external';
    });
  };

  _proto.shortenCaption = function shortenCaption(relationship, caption, targetWidth) {
    var shortCaption = caption || 'caption';

    while (true) {
      if (shortCaption.length <= 2) {
        return ['', 0];
      }

      shortCaption = shortCaption.substr(0, shortCaption.length - 2) + "\u2026";
      var width = this.measureRelationshipCaption(relationship, shortCaption);

      if (width < targetWidth) {
        return [shortCaption, width];
      }
    }
  };

  _proto.computeGeometryForNonLoopArrows = function computeGeometryForNonLoopArrows(nodePairs) {
    var square = function square(distance) {
      return distance * distance;
    };

    nodePairs.forEach(function (nodePair) {
      if (!nodePair.isLoop()) {
        var dx = nodePair.nodeA.x - nodePair.nodeB.x;
        var dy = nodePair.nodeA.y - nodePair.nodeB.y;
        var angle = (Math.atan2(dy, dx) / Math.PI * 180 + 360) % 360;
        var centreDistance = Math.sqrt(square(dx) + square(dy));
        nodePair.relationships.forEach(function (relationship) {
          relationship.naturalAngle = relationship.target === nodePair.nodeA ? (angle + 180) % 360 : angle;
          relationship.centreDistance = centreDistance;
        });
      }
    });
  };

  _proto.distributeAnglesForLoopArrows = function distributeAnglesForLoopArrows(nodePairs, relationships) {
    for (var _iterator = _createForOfIteratorHelperLoose(nodePairs), _step; !(_step = _iterator()).done;) {
      var nodePair = _step.value;

      if (nodePair.isLoop()) {
        var angles = [];
        var node = nodePair.nodeA;

        for (var _i = 0, _Array$from = Array.from(relationships); _i < _Array$from.length; _i++) {
          var relationship = _Array$from[_i];

          if (!relationship.isLoop()) {
            if (relationship.source === node) {
              angles.push(relationship.naturalAngle);
            }

            if (relationship.target === node) {
              angles.push(relationship.naturalAngle + 180);
            }
          }
        }

        angles = angles.map(function (a) {
          return (a + 360) % 360;
        }).sort(function (a, b) {
          return a - b;
        });

        if (angles.length > 0) {
          var end = void 0,
              start = void 0;
          var biggestGap = {
            start: 0,
            end: 0
          };

          for (var i = 0; i < angles.length; i++) {
            var angle = angles[i];
            start = angle;
            end = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1];

            if (end - start > biggestGap.end - biggestGap.start) {
              biggestGap.start = start;
              biggestGap.end = end;
            }
          }

          var separation = (biggestGap.end - biggestGap.start) / (nodePair.relationships.length + 1);

          for (var _i2 = 0; _i2 < nodePair.relationships.length; _i2++) {
            var _relationship = nodePair.relationships[_i2];
            _relationship.naturalAngle = (biggestGap.start + (_i2 + 1) * separation - 90) % 360;
          }
        } else {
          var _separation = 360 / nodePair.relationships.length;

          for (var _i3 = 0; _i3 < nodePair.relationships.length; _i3++) {
            var _relationship2 = nodePair.relationships[_i3];
            _relationship2.naturalAngle = _i3 * _separation;
          }
        }
      }
    }
  };

  _proto.layoutRelationships = function layoutRelationships(graph) {
    var nodePairs = graph.groupedRelationships();
    this.computeGeometryForNonLoopArrows(nodePairs);
    this.distributeAnglesForLoopArrows(nodePairs, graph.relationships());

    for (var _iterator2 = _createForOfIteratorHelperLoose(nodePairs), _step2; !(_step2 = _iterator2()).done;) {
      var nodePair = _step2.value;

      for (var _iterator3 = _createForOfIteratorHelperLoose(nodePair.relationships), _step3; !(_step3 = _iterator3()).done;) {
        var _relationship3 = _step3.value;
        delete _relationship3.arrow;
      }

      var middleRelationshipIndex = (nodePair.relationships.length - 1) / 2;
      var defaultDeflectionStep = 30;
      var maximumTotalDeflection = 150;
      var numberOfSteps = nodePair.relationships.length - 1;
      var totalDeflection = defaultDeflectionStep * numberOfSteps;
      var deflectionStep = totalDeflection > maximumTotalDeflection ? maximumTotalDeflection / numberOfSteps : defaultDeflectionStep;

      for (var i = 0; i < nodePair.relationships.length; i++) {
        var relationship = nodePair.relationships[i];
        var shaftWidth = parseFloat(this.style.forRelationship(relationship).get('shaft-width')) || 2;
        var headWidth = shaftWidth + 6;
        var headHeight = headWidth;

        if (nodePair.isLoop()) {
          relationship.arrow = new LoopArrow(relationship.source.radius, 40, defaultDeflectionStep, shaftWidth, headWidth, headHeight, relationship.captionHeight);
        } else {
          if (i === middleRelationshipIndex) {
            relationship.arrow = new StraightArrow(relationship.source.radius, relationship.target.radius, relationship.centreDistance, shaftWidth, headWidth, headHeight, relationship.captionLayout);
          } else {
            var deflection = deflectionStep * (i - middleRelationshipIndex);

            if (nodePair.nodeA !== relationship.source) {
              deflection *= -1;
            }

            relationship.arrow = new ArcArrow(relationship.source.radius, relationship.target.radius, relationship.centreDistance, deflection, shaftWidth, headWidth, headHeight, relationship.captionLayout);
          }
        }

        var _ref = relationship.arrow.shaftLength > relationship.captionLength ? [relationship.caption, relationship.captionLength] : this.shortenCaption(relationship, relationship.caption, relationship.arrow.shaftLength);

        relationship.shortCaption = _ref[0];
        relationship.shortCaptionLength = _ref[1];
      }
    }
  };

  return PairwiseArcsRelationshipRouting;
}();

var GraphGeometryModel = /*#__PURE__*/function () {
  function GraphGeometryModel(style) {
    this.relationshipRouting = void 0;
    this.style = void 0;
    this.canvas = void 0;
    this.style = style;
    this.relationshipRouting = new PairwiseArcsRelationshipRouting(this.style);
    this.canvas = document.createElement('canvas');
  }

  var _proto = GraphGeometryModel.prototype;

  _proto.formatNodeCaptions = function formatNodeCaptions(nodes) {
    var _this = this;

    var canvas2DContext = this.canvas.getContext('2d');

    if (canvas2DContext) {
      nodes.forEach(function (node) {
        return node.caption = fitCaptionIntoCircle(node, _this.style, canvas2DContext);
      });
    }
  };

  _proto.formatRelationshipCaptions = function formatRelationshipCaptions(relationships) {
    var _this2 = this;

    relationships.forEach(function (relationship) {
      var template = _this2.style.forRelationship(relationship).get('caption');

      relationship.caption = _this2.style.interpolate(template, relationship);
    });
  };

  _proto.setNodeRadii = function setNodeRadii(nodes) {
    var _this3 = this;

    nodes.forEach(function (node) {
      node.radius = parseFloat(_this3.style.forNode(node).get('diameter')) / 2;
    });
  };

  _proto.onGraphChange = function onGraphChange(graph, options) {
    if (options === void 0) {
      options = {
        updateNodes: true,
        updateRelationships: true
      };
    }

    if (!!options.updateNodes) {
      this.setNodeRadii(graph.nodes());
      this.formatNodeCaptions(graph.nodes());
    }

    if (!!options.updateRelationships) {
      this.formatRelationshipCaptions(graph.relationships());
      this.relationshipRouting.measureRelationshipCaptions(graph.relationships());
    }
  };

  _proto.onTick = function onTick(graph) {
    this.relationshipRouting.layoutRelationships(graph);
  };

  return GraphGeometryModel;
}();

var fitCaptionIntoCircle = function fitCaptionIntoCircle(node, style, canvas2DContext) {
  var fontFamily = 'sans-serif';
  var fontSize = parseFloat(style.forNode(node).get('font-size')); // Roughly calculate max text length the circle can fit by radius and font size

  var maxCaptionTextLength = Math.floor(Math.pow(node.radius, 2) * Math.PI / Math.pow(fontSize, 2));
  var template = style.forNode(node).get('caption');
  var nodeText = style.interpolate(template, node);
  var captionText = nodeText.length > maxCaptionTextLength ? nodeText.substring(0, maxCaptionTextLength) : nodeText;

  var measure = function measure(text) {
    return measureText(text, fontFamily, fontSize, canvas2DContext);
  };

  var whiteSpaceMeasureWidth = measure(' ');
  var words = captionText.split(' ');

  var emptyLine = function emptyLine(lineCount, lineIndex) {
    // Calculate baseline of the text
    var baseline = (1 + lineIndex - lineCount / 2) * fontSize; // The furthest distance between chord (top or bottom of the line) and circle centre

    var chordCentreDistance = lineIndex < lineCount / 2 ? baseline - fontSize / 2 : baseline + fontSize / 2;
    var maxLineWidth = Math.sqrt(Math.pow(node.radius, 2) - Math.pow(chordCentreDistance, 2)) * 2;
    return {
      node: node,
      text: '',
      baseline: baseline,
      remainingWidth: maxLineWidth
    };
  };

  var addShortenedNextWord = function addShortenedNextWord(line, word) {
    while (word.length > 2) {
      var newWord = word.substring(0, word.length - 2) + "\u2026";

      if (measure(newWord) < line.remainingWidth) {
        return line.text.split(' ').slice(0, -1).join(' ') + " " + newWord;
      }

      word = word.substring(0, word.length - 1);
    }

    return word + "\u2026";
  };

  var fitOnFixedNumberOfLines = function fitOnFixedNumberOfLines(lineCount) {
    var lines = [];
    var wordMeasureWidthList = words.map(function (word) {
      return measure("" + word);
    });
    var wordIndex = 0;

    for (var lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      var line = emptyLine(lineCount, lineIndex);

      while (wordIndex < words.length && wordMeasureWidthList[wordIndex] < line.remainingWidth - whiteSpaceMeasureWidth) {
        line.text = line.text + " " + words[wordIndex];
        line.remainingWidth -= wordMeasureWidthList[wordIndex] + whiteSpaceMeasureWidth;
        wordIndex++;
      }

      lines.push(line);
    }

    if (wordIndex < words.length) {
      lines[lineCount - 1].text = addShortenedNextWord(lines[lineCount - 1], words[wordIndex]);
    }

    return [lines, wordIndex];
  };

  var consumedWords = 0;
  var maxLines = node.radius * 2 / fontSize;
  var lines = [emptyLine(1, 0)]; // Typesetting for finding suitable lines to fit words

  for (var lineCount = 1; lineCount <= maxLines; lineCount++) {
    var _fitOnFixedNumberOfLi = fitOnFixedNumberOfLines(lineCount),
        candidateLines = _fitOnFixedNumberOfLi[0],
        candidateWords = _fitOnFixedNumberOfLi[1]; // If the lines don't have empty line(s), they're probably good fit for the typesetting


    if (!candidateLines.some(function (line) {
      return !line.text;
    })) {
      lines = candidateLines;
      consumedWords = candidateWords;
    }

    if (consumedWords >= words.length) {
      return lines;
    }
  }

  return lines;
};

function isNullish(x) {
  return x === null || x === undefined;
}

function circularLayout(nodes, center, radius) {
  var unlocatedNodes = nodes.filter(function (node) {
    return !node.initialPositionCalculated;
  });
  unlocatedNodes.forEach(function (node, i) {
    node.x = center.x + radius * Math.sin(2 * Math.PI * i / unlocatedNodes.length);
    node.y = center.y + radius * Math.cos(2 * Math.PI * i / unlocatedNodes.length);
    node.initialPositionCalculated = true;
  });
}

var oneRelationshipPerPairOfNodes = function oneRelationshipPerPairOfNodes(graph) {
  return Array.from(graph.groupedRelationships()).map(function (pair) {
    return pair.relationships[0];
  });
};

var ForceSimulation = /*#__PURE__*/function () {
  function ForceSimulation(render) {
    var _this = this;

    this.simulation = void 0;
    this.simulationTimeout = null;
    this.simulation = forceSimulation().velocityDecay(VELOCITY_DECAY).force('charge', forceManyBody().strength(FORCE_CHARGE)).force('centerX', forceX(0).strength(FORCE_CENTER_X)).force('centerY', forceY(0).strength(FORCE_CENTER_Y)).alphaMin(DEFAULT_ALPHA_MIN).on('tick', function () {
      _this.simulation.tick(EXTRA_TICKS_PER_RENDER);

      render();
    }).stop();
  }

  var _proto = ForceSimulation.prototype;

  _proto.updateNodes = function updateNodes(graph) {
    var nodes = graph.nodes();
    var radius = nodes.length * LINK_DISTANCE / (Math.PI * 2);
    var center = {
      x: 0,
      y: 0
    };
    circularLayout(nodes, center, radius);
    this.simulation.nodes(nodes).force('collide', forceCollide().radius(FORCE_COLLIDE_RADIUS));
  };

  _proto.updateRelationships = function updateRelationships(graph) {
    var relationships = oneRelationshipPerPairOfNodes(graph);
    this.simulation.force('link', forceLink(relationships).id(function (node) {
      return node.id;
    }).distance(FORCE_LINK_DISTANCE));
  };

  _proto.precomputeAndStart = function precomputeAndStart(onEnd) {
    var _this2 = this;

    if (onEnd === void 0) {
      onEnd = function onEnd() {
        return undefined;
      };
    }

    this.simulation.stop();
    var precomputeTicks = 0;
    var start = performance.now();

    while (performance.now() - start < 250 && precomputeTicks < MAX_PRECOMPUTED_TICKS) {
      this.simulation.tick(1);
      precomputeTicks += 1;

      if (this.simulation.alpha() <= this.simulation.alphaMin()) {
        break;
      }
    }

    this.simulation.restart().on('end', function () {
      onEnd();

      _this2.simulation.on('end', null);
    });
  };

  _proto.restart = function restart() {
    this.simulation.alpha(DEFAULT_ALPHA).restart();
  };

  return ForceSimulation;
}();

var ZoomType;

(function (ZoomType) {
  ZoomType["IN"] = "in";
  ZoomType["OUT"] = "out";
  ZoomType["FIT"] = "fit";
})(ZoomType || (ZoomType = {}));

var Visualization = /*#__PURE__*/function () {
  // This flags that a panning is ongoing and won't trigger
  // 'canvasClick' event when panning(平移) ends.
  function Visualization(element, measureSize, onZoomEvent, onDisplayZoomWheelInfoMessage, graph, style, isFullscreen, wheelZoomRequiresModKey, initialZoomToFit) {
    var _this = this;

    this.measureSize = void 0;
    this.graph = void 0;
    this.style = void 0;
    this.isFullscreen = void 0;
    this.wheelZoomRequiresModKey = void 0;
    this.initialZoomToFit = void 0;
    this.root = void 0;
    this.baseGroup = void 0;
    this.rect = void 0;
    this.container = void 0;
    this.geometry = void 0;
    this.zoomBehavior = void 0;
    this.zoomMinScaleExtent = ZOOM_MIN_SCALE;
    this.callbacks = {};
    this.forceSimulation = void 0;
    this.draw = false;
    this.isZoomClick = false;

    this.zoomByType = function (zoomType) {
      _this.draw = true;
      _this.isZoomClick = true;

      if (zoomType === ZoomType.IN) {
        _this.zoomBehavior.scaleBy(_this.root, 1.3);
      } else if (zoomType === ZoomType.OUT) {
        _this.zoomBehavior.scaleBy(_this.root, 0.7);
      } else if (zoomType === ZoomType.FIT) {
        _this.zoomToFitViewport();

        _this.adjustZoomMinScaleExtentToFitGraph(1);
      }
    };

    this.zoomToFitViewport = function () {
      var scaleAndOffset = _this.getZoomScaleFactorToFitWholeGraph();

      if (scaleAndOffset) {
        var scale = scaleAndOffset.scale,
            centerPointOffset = scaleAndOffset.centerPointOffset; // Do not zoom in more than zoom max scale for really small graphs

        _this.zoomBehavior.transform(_this.root, zoomIdentity.scale(Math.min(scale, ZOOM_MAX_SCALE)).translate(centerPointOffset.x, centerPointOffset.y));
      }
    };

    this.getZoomScaleFactorToFitWholeGraph = function () {
      var _this$container$node, _this$root$node, _this$root$node2;

      var graphSize = (_this$container$node = _this.container.node()) == null ? void 0 : _this$container$node.getBBox();
      var availableWidth = (_this$root$node = _this.root.node()) == null ? void 0 : _this$root$node.clientWidth;
      var availableHeight = (_this$root$node2 = _this.root.node()) == null ? void 0 : _this$root$node2.clientHeight;

      if (graphSize && availableWidth && availableHeight) {
        var graphWidth = graphSize.width;
        var graphHeight = graphSize.height;
        var graphCenterX = graphSize.x + graphWidth / 2;
        var graphCenterY = graphSize.y + graphHeight / 2;
        if (graphWidth === 0 || graphHeight === 0) return;
        var scale = (1 - ZOOM_FIT_PADDING_PERCENT) / Math.max(graphWidth / availableWidth, graphHeight / availableHeight);
        var centerPointOffset = {
          x: -graphCenterX,
          y: -graphCenterY
        };
        return {
          scale: scale,
          centerPointOffset: centerPointOffset
        };
      }

      return;
    };

    this.adjustZoomMinScaleExtentToFitGraph = function (padding_factor) {
      if (padding_factor === void 0) {
        padding_factor = 0.75;
      }

      var scaleAndOffset = _this.getZoomScaleFactorToFitWholeGraph();

      var scaleToFitGraphWithPadding = scaleAndOffset ? scaleAndOffset.scale * padding_factor : _this.zoomMinScaleExtent;

      if (scaleToFitGraphWithPadding <= _this.zoomMinScaleExtent) {
        _this.zoomMinScaleExtent = scaleToFitGraphWithPadding;

        _this.zoomBehavior.scaleExtent([scaleToFitGraphWithPadding, ZOOM_MAX_SCALE]);
      }
    };

    this.on = function (event, callback) {
      var _this$callbacks$event;

      if (isNullish(_this.callbacks[event])) {
        _this.callbacks[event] = [];
      }

      (_this$callbacks$event = _this.callbacks[event]) == null ? void 0 : _this$callbacks$event.push(callback);
      return _this;
    };

    this.trigger = function (event) {
      var _this$callbacks$event2;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var callbacksForEvent = (_this$callbacks$event2 = _this.callbacks[event]) != null ? _this$callbacks$event2 : [];
      callbacksForEvent.forEach(function (callback) {
        return callback.apply(null, args);
      });
    };

    this.measureSize = measureSize;
    this.graph = graph;
    this.style = style;
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
    this.initialZoomToFit = initialZoomToFit;
    this.root = select(element);
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey; // Remove the base group element when re-creating the visualization

    this.root.selectAll('g').remove();
    this.baseGroup = this.root.append('g').attr('transform', 'translate(0,0)');
    this.rect = this.baseGroup.append('rect').style('fill', 'none').style('pointer-events', 'all') // Make the rect cover the whole surface, center of the svg viewbox is in (0,0)
    .attr('x', function () {
      return -Math.floor(measureSize().width / 2);
    }).attr('y', function () {
      return -Math.floor(measureSize().height / 2);
    }).attr('width', '100%').attr('height', '100%').attr('transform', 'scale(1)') // Background click event
    // Check if panning is ongoing
    .on('click', function () {
      if (!_this.draw) {
        return _this.trigger('canvasClicked');
      }
    }); // node relation container

    this.container = this.baseGroup.append('g');
    this.geometry = new GraphGeometryModel(style);
    this.zoomBehavior = zoom().scaleExtent([this.zoomMinScaleExtent, ZOOM_MAX_SCALE]).on('zoom', function (e) {
      var isZoomClick = _this.isZoomClick;
      _this.draw = true;
      _this.isZoomClick = false;
      var currentZoomScale = e.transform.k;
      var limitsReached = {
        zoomInLimitReached: currentZoomScale >= ZOOM_MAX_SCALE,
        zoomOutLimitReached: currentZoomScale <= _this.zoomMinScaleExtent
      };
      onZoomEvent(limitsReached);
      return _this.container.transition().duration(isZoomClick ? 400 : 20).call(function (sel) {
        return isZoomClick ? sel.ease(easeCubic) : sel;
      }).attr('transform', String(e.transform));
    }) // This is the default implementation of wheelDelta function in d3-zoom v3.0.0
    // For some reasons typescript complains when trying to get it by calling zoomBehaviour.wheelDelta() instead
    // but it should be the same (and indeed it works at runtime).
    // https://github.com/d3/d3-zoom/blob/1bccd3fd56ea24e9658bd7e7c24e9b89410c8967/README.md#zoom_wheelDelta
    // Keps the zoom behavior constant for metam ctrl and shift key. Otherwise scrolling is faster with ctrl key.
    .wheelDelta(function (e) {
      return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);
    }).filter(function (e) {
      if (e.type === 'wheel') {
        var modKeySelected = e.metaKey || e.ctrlKey || e.shiftKey;

        if (_this.wheelZoomRequiresModKey && !modKeySelected) {
          onDisplayZoomWheelInfoMessage();
          return false;
        }
      }

      return true;
    });
    this.root.call(this.zoomBehavior) // Single click is not panning
    .on('click.zoom', function () {
      return _this.draw = false;
    }).on('dblclick.zoom', null);
    this.forceSimulation = new ForceSimulation(this.render.bind(this));
  }

  var _proto = Visualization.prototype;

  _proto.render = function render() {
    this.geometry.onTick(this.graph); // const nodeGroups = this.container
    //   .selectAll<SVGGElement, NodeModel>('g.node')
    //   .attr('transform', (d) => `translate(${d.x},${d.y})`);
    // nodeRenderer.forEach((renderer) => nodeGroups.call(renderer.onTick, this));
    // const relationshipGroups = this.container
    //   .selectAll<SVGGElement, RelationshipModel>('g.relationship')
    //   .attr(
    //     'transform',
    //     (d) =>
    //       `translate(${d.source.x} ${d.source.y}) rotate(${
    //         d.naturalAngle + 180
    //       })`,
    //   );
    // relationshipRenderer.forEach((renderer) =>
    //   relationshipGroups.call(renderer.onTick, this),
    // );
  };

  _proto.updateNodes = function updateNodes() {
    var nodes = this.graph.nodes(); // this.geometry.onGraphChange(this.graph, {
    //   updateNodes: true,
    //   updateRelationships: false,
    // });
    // const nodeGroups =

    this.container.select('g.layer.nodes').selectAll('g.node').data(nodes, function (d) {
      return d.id;
    }).join('g').attr('class', 'node').attr('aria-label', function (d) {
      return "graph-node" + d.id;
    }) // .call(nodeEventHandlers, this.trigger, this.forceSimulation.simulation)
    .classed('selected', function (node) {
      return node.selected;
    }); // nodeRenderer.forEach((renderer) =>
    //   nodeGroups.call(renderer.onGraphChange, this),
    // );
    // nodeMenuRenderer.forEach((renderer) =>
    //   nodeGroups.call(renderer.onGraphChange, this),
    // );

    this.forceSimulation.updateNodes(this.graph);
    this.forceSimulation.updateRelationships(this.graph);
  };

  _proto.updateRelationships = function updateRelationships() {
    var relationships = this.graph.relationships(); // this.geometry.onGraphChange(this.graph, {
    //   updateNodes: false,
    //   updateRelationships: true,
    // });
    // const relationshipGroups =

    this.container.select('g.layer.relationships').selectAll('g.relationship').data(relationships, function (d) {
      return d.id;
    }).join('g').attr('class', 'relationship') // .call(relationshipEventHandlers, this.trigger)
    .classed('selected', function (relationship) {
      return relationship.selected;
    }); // relationshipRenderer.forEach((renderer) =>
    //   relationshipGroups.call(renderer.onGraphChange, this),
    // );

    this.forceSimulation.updateRelationships(this.graph);
  };

  _proto.init = function init() {
    this.container.selectAll('g.layer').data(['relationships', 'nodes']).join('g').attr('class', function (d) {
      return "layer " + d;
    });
    this.updateNodes();
    this.updateRelationships();
    this.adjustZoomMinScaleExtentToFitGraph();
    this.setInitialZoom();
  };

  _proto.setInitialZoom = function setInitialZoom() {
    var count = this.graph.nodes().length; // chosen by *feel* (graph fitting guesstimate)

    var scale = -0.02364554 + 1.913 / (1 + Math.pow(count / 12.7211, 0.8156444));
    this.zoomBehavior.scaleBy(this.root, Math.max(0, scale));
  };

  _proto.precomputeAndStart = function precomputeAndStart() {
    var _this2 = this;

    this.forceSimulation.precomputeAndStart(function () {
      return _this2.initialZoomToFit && _this2.zoomByType(ZoomType.FIT);
    });
  };

  _proto.update = function update(options) {
    var _options$restartSimul;

    if (options.updateNodes) {
      this.updateNodes();
    }

    if (options.updateRelationships) {
      this.updateRelationships();
    }

    if ((_options$restartSimul = options.restartSimulation) != null ? _options$restartSimul : true) {
      this.forceSimulation.restart();
    }

    this.trigger('updated');
  };

  _proto.boundingBox = function boundingBox() {
    var _this$container$node2;

    return (_this$container$node2 = this.container.node()) == null ? void 0 : _this$container$node2.getBBox();
  };

  _proto.resize = function resize(isFullscreen, wheelZoomRequiresModKey) {
    var size = this.measureSize();
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
    this.rect.attr('x', function () {
      return -Math.floor(size.width / 2);
    }).attr('y', function () {
      return -Math.floor(size.height / 2);
    });
    this.root.attr('viewBox', [-Math.floor(size.width / 2), -Math.floor(size.height / 2), size.width, size.height].join(' '));
  };

  return Visualization;
}();

export { Visualization };
