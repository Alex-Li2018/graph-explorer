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
|parseSelector():Selector|
|nodeSelector():Selector|
|relationshipSelector():Selector|
|findRule():StyleRule|
|findAvailableDefaultColor():DefaultColorType|
|getDefaultNodeCaption():{}|
|calculateStyle():StyleElement|
|setDefaultNodeStyle():void|
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

定义图谱的样式信息

## property

|属性|类型|描述|
| --- | --- | --- |
|tag|String|标签
|classes|Array|类名数组


## methods

|方法名|描述|
| --- | --- |
|toString():String|

## class StyleElement

定义图谱的样式信息

## property

|属性|类型|描述|
| --- | --- | --- |
|selector|Selector|
|props|Any|


## methods

|方法名|描述|
| --- | --- |
|applyRules():String|
|get():void|