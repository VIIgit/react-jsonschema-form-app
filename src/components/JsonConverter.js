import YAML from 'yaml';

const JsonConverter = {
  name: 'JSON',
  toObject: function(json) {
    return JSON.parse(json);
  },
  toString: function(obj) {
    return JSON.stringify(obj, null, 2);
  },
  convertToString: (potentialYaml) => {
    var result = {stringified: potentialYaml, errorMsg: undefined};
    if (potentialYaml.indexOf('{') < 0 && potentialYaml.indexOf('[') < 0 ){
      try{
        var yamlText = YAML.parse(potentialYaml);
        result.stringified = JSON.stringify(yamlText, null, 2);
      } catch (ex){
        result.errorMsg = ex.message;
      }
    }
    return result;
  }
}

export default JsonConverter;