var util = require('util');
var mongoose = require('mongoose');

var Cate;

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
/**
* Model: Product
*/
//定义todo对象模型
var Cate = new Schema({
    categoryID:Number, 
    categoryName:String,
    description:String
}, { collection: 'Categories', versionKey: false});

mongoose.model('Cate', Cate);


exports.Cate = mongoose.model('Cate', Cate); 