# class GraphStyleModel

定义图谱的样式信息

## property

|属性|类型|描述|
| --- | --- | --- |
|rules|Array|样式规则

## methods

|方法名|描述|
| --- | --- |
|loadRules():void|组装图谱里所有的样式信息
|parseSelector():Selector|获取node或relationship对应的选择器
|nodeSelector():Selector|node为tag label作为class的选择器
|relationshipSelector():Selector|
|findRule():StyleRule|选择对应的样式规则
|findAvailableDefaultColor():DefaultColorType|
|getDefaultNodeCaption():{}|
|calculateStyle():StyleElement|计算样式
|setDefaultNodeStyle():void|设置默认节点样式
|changeForSelector():StyleRule|
|destroyRule():void|
|importGrass():void|
|parse():void|
|resetToDefault():void|
|toSheet():void|
|toString():void|
|defaultSizes():DefaultSizeType[]|
|defaultArrayWidths():DefaultArrayWidthType[]|
|defaultColors():DefaultArrayWidthType[]|
|interpolate()|
|forNode():StyleElement|
|forRelationship():StyleElement|

## class Selector

定义

## property

|属性|类型|描述|
| --- | --- | --- |
|tag|String|标签 node relationship
|classes|Array|类名数组 数组


## methods

|方法名|描述|
| --- | --- |
|toString():String|返回tag和classes的字符串

## class StyleElement

定义样式规则

## property

|属性|类型|描述|
| --- | --- | --- |
|selector|Selector|选择器
|props|Any|样式信息


## methods

|方法名|描述|
| --- | --- |
|applyRules():String|
|get():void|