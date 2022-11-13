# class ForceSimulation

力导向图

## property

|属性|类型|描述|
| --- | --- | --- |
|simulation|Simulation|力仿真模型

## methods

|方法名|描述|
| --- | --- |
|updateNodes(graph: GraphModel): void | 更新节点 节点模型
|updateRelationships(graph: GraphModel): void | 更新边
|precomputeAndStart(onEnd: () => void = () => undefined): void | 重新计算并开始
|restart(): void | 重新开始仿真