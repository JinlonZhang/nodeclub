var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

/*
 * type:
 * reply: xx 回复了你的话题
 * reply2: xx 在话题中回复了你
 * follow: xx 关注了你
 * at: xx ＠了你
 */

var PartnerSchema = new Schema({
  type: { type: String },
  url: { type: String },
  img_url : { type : String }
});

PartnerSchema.plugin(BaseModel);

mongoose.model('Partner', PartnerSchema);
