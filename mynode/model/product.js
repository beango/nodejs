var util = require('util');

var Product;

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
  /**
    * Model: Product
    */
  //定义todo对象模型
  Product = new Schema({
    productID:{ type: Number },
    productName:String, 
    supplierID:Number, 
    categoryID:Number, 
    quantityPerUnit:String, 
    unitPrice:Number, 
    unitsInStock:Number, 
    unitsOnOrder:Number, 
    reorderLevel:Number, 
    discontinued:Boolean
  }, { collection: 'Product', versionKey: false});

  mongoose.model('Product', Product);

  fn();
}

exports.defineModels = defineModels; 