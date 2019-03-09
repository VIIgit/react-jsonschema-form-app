import YAML from 'yaml';

const YamlConverter = {
  name: 'YAML',
  toObject: function(yaml) {
    return YAML.parse(yaml);
  },
  toString: function(obj) {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    return YAML.stringify(obj, null, 2);
  }
}

export default YamlConverter;