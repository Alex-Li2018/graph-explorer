import { NodeModel } from './Node';
import { RelationshipModel } from './Relationship';

export class GraphModel {
  _nodes: NodeModel[];
  _relationships: RelationshipModel[];
  nodeMap: Record<string, NodeModel>;
  relationshipMap: Record<string, RelationshipModel>;

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

  nodes(): NodeModel[] {
    return this._nodes;
  }

  relationships(): RelationshipModel[] {
    return this._relationships;
  }

  groupedRelationships(): NodePair[] {
    const groups: Record<string, NodePair> = {};
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

  addNodes(nodes: NodeModel[]): void {
    for (const node of nodes) {
      if (this.findNode(node.id) == null) {
        this.nodeMap[node.id] = node;
        this._nodes.push(node);
      }
    }
  }

  removeNode(node: NodeModel): void {
    if (this.findNode(node.id) != null) {
      delete this.nodeMap[node.id];
      this._nodes.splice(this._nodes.indexOf(node), 1);
    }
  }

  updateNode(node: NodeModel): void {
    if (this.findNode(node.id) != null) {
      this.removeNode(node);
      node.expanded = false;
      node.minified = true;
      this.addNodes([node]);
    }
  }

  removeConnectedRelationships(node: NodeModel): void {
    for (const r of Array.from(this.findAllRelationshipToNode(node))) {
      this.updateNode(r.source);
      this.updateNode(r.target);
      this._relationships.splice(this._relationships.indexOf(r), 1);
      delete this.relationshipMap[r.id];
    }
  }

  addRelationships(relationships: RelationshipModel[]): void {
    for (const relationship of Array.from(relationships)) {
      const existingRelationship = this.findRelationship(relationship.id);
      if (existingRelationship != null) {
        existingRelationship.internal = false;
      } else {
        relationship.internal = false;
        this.relationshipMap[relationship.id] = relationship;
        this._relationships.push(relationship);
      }
    }
  }

  addInternalRelationships(relationships: RelationshipModel[]): void {
    for (const relationship of Array.from(relationships)) {
      relationship.internal = true;
      if (this.findRelationship(relationship.id) == null) {
        this.relationshipMap[relationship.id] = relationship;
        this._relationships.push(relationship);
      }
    }
  }

  pruneInternalRelationships(): void {
    const relationships = this._relationships.filter(
      (relationship) => !relationship.internal,
    );
    this.relationshipMap = {};
    this._relationships = [];
    this.addRelationships(relationships);
  }

  findNode(id: string): NodeModel {
    return this.nodeMap[id];
  }

  findNodeNeighbourIds(id: string): string[] {
    return this._relationships
      .filter(
        (relationship) =>
          relationship.source.id === id || relationship.target.id === id,
      )
      .map((relationship) => {
        if (relationship.target.id === id) {
          return relationship.source.id;
        }
        return relationship.target.id;
      });
  }

  findRelationship(id: string): RelationshipModel | undefined {
    return this.relationshipMap[id];
  }

  findAllRelationshipToNode(node: NodeModel): RelationshipModel[] {
    return this._relationships.filter(
      (relationship) =>
        relationship.source.id === node.id ||
        relationship.target.id === node.id,
    );
  }

  getSelectedNode() {
    return this._nodes.filter((item) => item.selected);
  }

  getSelectedRelationship() {
    return this._relationships.filter((item) => item.selected);
  }

  resetGraph(): void {
    this.nodeMap = {};
    this._nodes = [];
    this.relationshipMap = {};
    this._relationships = [];
  }
}

export class NodePair {
  nodeA: NodeModel;
  nodeB: NodeModel;
  relationships: RelationshipModel[];
  constructor(node1: NodeModel, node2: NodeModel) {
    this.relationships = [];
    if (node1.id < node2.id) {
      this.nodeA = node1;
      this.nodeB = node2;
    } else {
      this.nodeA = node2;
      this.nodeB = node1;
    }
  }

  isLoop(): boolean {
    return this.nodeA === this.nodeB;
  }

  toString(): string {
    return `${this.nodeA.id}:${this.nodeB.id}`;
  }
}
