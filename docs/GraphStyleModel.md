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
|findRule(selector, rules):StyleRule|寻找对应的样式规则传入选择集以及样式
|findAvailableDefaultColor():DefaultColorType|
|getDefaultNodeCaption():{}|
|calculateStyle():StyleElement|计算样式
|setDefaultNodeStyle():void|设置默认节点样式
|changeForSelector():StyleRule|改变选择集对应的样式
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
|forNode():StyleElement|为node设置对应的样式
|forRelationship():StyleElement|为relationship设置对应的样式

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

定义样式元素

## property

|属性|类型|描述|
| --- | --- | --- |
|selector|Selector|选择器
|props|Any|样式信息


## methods

|方法名|描述|
| --- | --- |
|applyRules():String|应用样式
|get():void|获取样式


## class StyleRule

定义样式

## property

|属性|类型|描述|
| --- | --- | --- |
|selector|Selector|选择器
|props|Any|样式信息


## methods

|方法名|描述|
| --- | --- |
|matches(selector)|根据选择器匹配是否存在已有样式
|matchesExact(selector)|精确匹配是否存在对应的样式