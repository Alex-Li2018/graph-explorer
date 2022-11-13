# class GraphVisualization

## property

|属性|类型|描述|
| --- | --- | --- |
|element|Elemnet string|根节点的dom
|measureSize|Function|测量画布节点的宽高
|onZoomEvent|Function|画布缩放回调
|onDisplayZoomWheelInfoMessage|Function|
|graphData|Object|图谱数据
|isFullscreen|Boolean|是否全屏幕
|wheelZoomRequiresModKey|Boolean|
|initialZoomToFit|Boolean|初始化缩放适配

## methods
|方法名|描述|
| --- | --- |
|render(): void|渲染函数|
|updateNodes(): void|更新节点|
|updateRelationships(): void|更新关系|
|zoomByType(): void||
|getZoomScaleFactorToFitWholeGraph(): void|获取最小的缩放比例来适配整个图谱|
|adjustZoomMinScaleExtentToFitGraph(): void|使用最小的缩放比例来适配图谱|
|on(): void|注册事件|
|trigger(): void|触发事件|
|init(): void|初始化|
|setInitialZoom(): void|设置初始的缩放|
|precomputeAndStart(): void||
|update(options: {updateNodes: boolean;updateRelationships: boolean;restartSimulation?: boolean;}): void |更新节点以及|
|boundingBox(): DOMRect ||
|resize(isFullscreen: boolean, wheelZoomRequiresModKey: boolean): void|重新设置svg尺寸|
