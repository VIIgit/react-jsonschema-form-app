import YAML from 'yaml';

const YamlConverter = {
  name: 'YAML',
  toObject: function(yaml) {
    return YAML.parse(yaml);
  },
  toString: function(obj) {
    return YAML.stringify(obj, null, 2);
  },
  convertToString: (potentialYaml) => {
    var result = {stringified: undefined, errorMsg: undefined};
    try{
      YAML.parse(potentialYaml);
      result.stringified = potentialYaml;
    } catch (ex){
      result.errorMsg = ex.message;
    }
    
    return result;
  }
}

export default YamlConverter;