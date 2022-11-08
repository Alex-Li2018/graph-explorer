# class GraphModel

定义图片data的数据的类：node relationship

## property

|属性|类型|描述|
| --- | --- | --- |
|nodeMap|Object|node的映射
|_nodes|Array|node形成的数组
|relationshipMap|Object|边的映射
|_relationships|Array|边形成的数组
|expandedNodeMap|Object|展开到节点


## methods

|方法名|描述|
| --- | --- |
|nodes():NodeModel|返回当前图谱里所有的节点
|relationships():NodeModel|返回当前图谱里所有的节点
|addNodes(nodes: NodeModel[]): void|如果node id不存在那么直接将node push到_nodes中
|addExpandedNodes(node: NodeModel, nodes: NodeModel[]): void|添加展开的节点
|removeNode(node: NodeModel): void|从_nodes中删除节点
|collapseNode(node: NodeModel): void|关闭展开的节点
|updateNode(node: NodeModel): void|更新节点
|removeConnectedRelationships(node: NodeModel): void|移除链接边
|addRelationships(relationships: RelationshipModel[]): void|添加关系边
|addInternalRelationships(relationships: RelationshipModel[]): void|
|findNode(id: string): NodeModel|根据id查找节点
|findNodeNeighbourIds(id: string): string[]|查找与当前节点有联系的节点
|findRelationship(id: string): （RelationshipModel undefined）| 查找关系
|findAllRelationshipToNode(node: NodeModel): RelationshipModel[]  undefined|根据节点查询与节点有关系的边
|resetGraph(): void | 重置图谱


## class NodeModel

定义节点的数据模型

## property

|属性|类型|描述|
| --- | --- | --- |
|id|String|node的id
|labels|String|node的概念
|propertyList|Array|node的属性列表
|propertyMap|Object|node的属性映射
|radius|Number|节点的半径
|caption|NodeCaptionLine[]|名称有关的数据
|selected|Boolean|是否被选中
|expanded|Boolean|是否被展开
|minified|Boolean|
|contextMenu||
|x|number|画布上x的坐标
|y|number|画布上y的坐标
|fx|number|
|fy|number|
|hoverFixed|Boolean|
|initialPositionCalculated|Boolean|


## methods
|方法名|描述|
| --- | --- |
|toJSON(): NodeProperties|以对象的形式返回节点的属性|
|relationshipCount(graph: GraphModel): number|返回边的数量|
|hasRelationships(graph: GraphModel): boolean|判断此节点是否存在边|

## class RelationshipModel

定义关系的数据模型

## property

|属性|类型|描述|
| --- | --- | --- |
id|string|关系的id
propertyList|VizItemProperty[]|关系的属性
propertyMap|Record<string, string>|关系的属性
source|NodeModel|头节点
target|NodeModel|尾节点
type|string|关系类型
isNode|false|
isRelationship|true|
naturalAngle|number|
caption|string|
captionLength|number|
captionHeight|number|
captionLayout|RelationshipCaptionLayout|
shortCaption|string|
shortCaptionLength|number|
selected|boolean|
centreDistance|number|
internal|boolean
arrow|(ArcArrow | LoopArrow | StraightArrow | undefined)|

## methods
|方法名|描述|
| --- | --- |
|toJSON(): Record<string, string>|以对象的形式返回关系的属性|
|isLoop(): boolean|是否是自己指向自己|