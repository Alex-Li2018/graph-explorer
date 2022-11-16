# class GraphGeometryModel

定义图谱的几何模型

## property

|属性|类型|描述|
| --- | --- | --- |
|style|GraphStyleModel|样式信息
|relationshipRouting|PairwiseArcsRelationshipRouting|成对弧线布局
|canvas|HTMLCanvasElement|画布节点

## methods

|方法名|描述|
| --- | --- |
|formatNodeCaptions(nodes: NodeModel[]): void |格式化节点的名称
|formatRelationshipCaptions(relationships: RelationshipModel[]): void |格式化边的名称
|setNodeRadii(nodes: NodeModel[]): void |设置节点的半径
|onGraphChange(graph: GraphModel,options = { updateNodes: true, updateRelationships: true },): void|图谱数据变化触发事件
|onTick(graph: GraphModel): void|

## class PairwiseArcsRelationshipRouting

## property

|属性|类型|描述|
| --- | --- | --- |
|style|GraphStyleModel|样式规则
|canvas|HTMLCanvasElement|画布节点

## methods

|方法名|描述|
| --- | --- |
|measureRelationshipCaption(relationship: RelationshipModel,caption: string,): number |
|captionFitsInsideArrowShaftWidth(relationship: RelationshipModel): boolean |
|measureRelationshipCaptions(relationships: RelationshipModel[]): void |
|shortenCaption(relationship: RelationshipModel,caption: string,targetWidth: number,):[string, number] |