const mongoose = require("mongoose")
const redis = require("redis")
const util = require("util");

const client = redis.createClient()
const exec = mongoose.Query.prototype.exec
client.hget = util.promisify(client.hget)

mongoose.Query.prototype.cashe = function (options = {}) {
    this.hashKey = JSON.stringify(options || '')
    this.useCashe = true;
    return this;
}

mongoose.Query.prototype.exec = async function () {

    if (!this.useCashe)
         return exec.apply(this,arguments);

    const key = JSON.stringify(Object.assign({},this.getQuery(),{collection: this.mongooseCollection.name}))
    // check if the key is cashing 
    const cashedData =  await client.hget(this.hashKey,key);
    // if true return it 
    if (cashedData){
        console.log("Cashing Data")
        const data = JSON.parse(cashedData);
        return Array.isArray(data) ? data.map(val => new this.model(val)) : new this.model(data)
    }
    console.log("Database Data")

    const result = await exec.apply(this,arguments);
    client.hset(this.hashKey,key,JSON.stringify(result));
    client.expire(this.hashKey, 10);

    return result;
}
