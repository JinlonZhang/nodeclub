var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

/*
  合作伙伴的地址和图片
 */

var PartnerSchema = new Schema({
  name: { type: String },
  url: { type: String },
  img_url : { type : String }
});

PartnerSchema.plugin(BaseModel);
//PartnerSchema.index({unique: true});

mongoose.model('Partner', PartnerSchema);
