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

var FriendshipCommunitySchema = new Schema({
  type: { type: String },
  url: { type: String}
});
FriendshipCommunitySchema.plugin(BaseModel);
FriendshipCommunitySchema.index({master_id: 1, has_read: -1, create_at: -1});

mongoose.model('FriendshipCommunity', FriendshipCommunitySchema);
