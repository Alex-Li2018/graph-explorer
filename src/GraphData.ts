// map graph data
import { GraphModel } from './models/Graph';
import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
import { BasicNode, BasicRelationship } from 'neo4j-arc/common';
import { optionalToString } from './utils';

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
