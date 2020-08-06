module.exports = {
    schema: {
        "title": "Example - If-Then-Else",
        "type": "object",
        "description": "If-then-else examples https://json-schema.org/understanding-json-schema/reference/conditionals.html\ncombied with dependencies\n\nSelect different countries and see what happens",
        "properties": {
          "streetAddress": {
            "type": "string"
          },
          "country": {
            "type": "string",
            "oneOf": [
              {
                "const": "US",
                "title": "United States of America"
              },
              {
                "const": "NL",
                "title": "Netherlands"
              },
              {
                "const": "CH",
                "title": "Switzerland"
              },
              {
                "const": "AT",
                "title": "Austria"
              }
            ]
          }
        },
        "allOf": [
          {
            "if": {
              "properties": {
                "country": {
                  "const": "US"
                }
              }
            },
            "then": {
              "properties": {
                "streetAddress": {
                  "pattern": "[0-9]{5}(-[0-9]{4})?"
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "country": {
                  "const": "NL"
                }
              }
            },
            "then": {
              "properties": {
                "streetAddress": {
                  "pattern": "[0-9]{4} [A-Z]{2}"
                }
              }
            }
          }
        ],
        "dependencies": {
          "country": {
            "oneOf": [
              {
                "properties": {
                  "country": {
                    "enum": [
                      "US",
                      "NL"
                    ]
                  },
                  "streetAddress": {
                    "type": "string",
                    "description": "Coutry specific pattern"
                  }
                }
              },
              {
                "properties": {
                  "country": {
                    "enum": [
                      "AT"
                    ]
                  },
                  "region": {
                    "type": "string",
                    "default": "Vienna"
                  }
                }
              },
              {
                "properties": {
                  "country": {
                    "enum": [
                      "CH"
                    ]
                  },
                  "streetAddress": {
                    "type": "string"
                  },
                  "region": {
                    "type": "string",
                    "oneOf": [
                      {
                        "const": "ZH",
                        "title": "Zürich"
                      },
                      {
                        "const": "GE",
                        "title": "Geneva"
                      }
                    ],
                    "default": "GE"
                  }
                },
                "required": [
                  "region"
                ]
              }
            ]
          }
        }
      }
    ,
    uiSchema: {

    },
    formData: {
        "country": "US",
        "streetAddress": "16000 Pennsylvania Avenue NW"
      }
};
