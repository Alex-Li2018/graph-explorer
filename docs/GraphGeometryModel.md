# class GraphGeometryModel

定义图谱的样式信息

## property

|属性|类型|描述|
| --- | --- | --- |
|style|GraphStyleModel|样式规则
|relationshipRouting|PairwiseArcsRelationshipRouting|
|canvas|HTMLCanvasElement|画布节点

## methods

|方法名|描述|
| --- | --- |
|formatNodeCaptions(nodes: NodeModel[]): void |
|formatRelationshipCaptions(relationships: RelationshipModel[]): void |
|setNodeRadii(nodes: NodeModel[]): void |
|onGraphChange(graph: GraphModel,options = { updateNodes: true, updateRelationships: true },): void|
|onTick(graph: GraphModel): void|

## class PairwiseArcsRelationshipRouting

## property

|属性|类型|描述|
| --- | --- | --- |
|style|GraphStyleModel|样式规则
|relationshipRouting|PairwiseArcsRelationshipRouting|
|canvas|HTMLCanvasElement|画布节点

## methods

|方法名|描述|
| --- | --- |
|formatNodeCaptions(nodes: NodeModel[]): void |