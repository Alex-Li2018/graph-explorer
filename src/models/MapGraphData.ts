// map graph data
import { GraphModel } from './Graph';
import { NodeModel } from './Node';
import { RelationshipModel } from './Relationship';
import { BasicNode, BasicRelationship } from '../types';
import { optionalToString } from '../utils/utils';

const stringifyValues = (obj: any) =>
  Object.keys(obj).map((k) => ({
    [k]: obj[k] === null ? 'null' : optionalToString(obj[k]),
  }));
const mapProperties = (_: any) => Object.assign({}, ...stringifyValues(_));

export function createGraph(
  nodes: BasicNode[],
  relationships: BasicRelationship[],
): GraphModel {
  const graph = new GraphModel();
  graph.addNodes(mapNodes(nodes));
  graph.addRelationships(mapRelationships(relationships, graph));
  return graph;
}

export function mapNodes(nodes: BasicNode[]): NodeModel[] {
  return nodes.map(
    (node) =>
      new NodeModel(
        node.id,
        node.labels,
        mapProperties(node.properties),
        node.propertyTypes,
      ),
  );
}

export function mapRelationships(
  relationships: BasicRelationship[],
  graph: GraphModel,
): RelationshipModel[] {
  return relationships.map((rel) => {
    const source = graph.findNode(rel.startNodeId);
    const target = graph.findNode(rel.endNodeId);
    return new RelationshipModel(
      rel.id,
      source,
      target,
      rel.type,
      mapProperties(rel.properties),
      rel.propertyTypes,
    );
  });
}
