const JsonConverter = {
  name: 'JSON',
  toObject: function(json) {
    return JSON.parse(json);
  },
  toString: function(obj) {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    return JSON.stringify(obj, null, 2);
  }
};

export default JsonConverter;