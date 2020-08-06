module.exports = {
    schema: {
      "title": "Example - Dependencies",
      "type": "object",
      "properties": {
        "simple": {
          "title": "Simple",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "credit_card": {
              "type": "number"
            }
          },
          "required": [
            "name"
          ],
          "dependencies": {
            "credit_card": {
              "properties": {
                "billing_address": {
                  "type": "string"
                }
              },
              "required": [
                "billing_address"
              ]
            }
          }
        },
        "conditional": {
          "title": "Conditional",
          "$ref": "#/definitions/pet"
        },
        "arrayOfConditionals": {
          "title": "Array of conditionals",
          "type": "array",
          "items": {
            "$ref": "#/definitions/pet"
          }
        }
      },
      "definitions": {
        "pet": {
          "title": "Pets",
          "type": "object",
          "properties": {
            "anyPets": {
              "title": "Do you have any pets?",
              "type": "string",
              "oneOf": [
                {
                  "const": "None",
                  "title": "No"
                },
                {
                  "const": "One",
                  "title": "Yes: One"
                },
                {
                  "const": "OnePlus",
                  "title": "More than one"
                }
              ],
              "default": "None"
            }
          },
          "required": [
            "anyPets"
          ],
          "dependencies": {
            "anyPets": {
              "oneOf": [
                {
                  "properties": {
                    "anyPets": {
                      "enum": [
                        "None"
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "anyPets": {
                      "enum": [
                        "One"
                      ]
                    },
                    "petAge": {
                      "title": "How old is your pet?",
                      "type": "number"
                    }
                  },
                  "required": [
                    "petAge"
                  ]
                },
                {
                  "properties": {
                    "anyPets": {
                      "enum": [
                        "OnePlus"
                      ]
                    },
                    "sellPet": {
                      "type": "boolean",
                      "title": "Do you want to get rid of any?"
                    }
                  },
                  "required": [
                    "sellPet"
                  ]
                }
              ]
            }
          }
        }
      }
    }
    ,
    uiSchema: {

    },
    formData: {
        "simple": {
          "name": "John Doe",
          "credit_card": 5005,
          "billing_address": "Street one"
        },
        "conditional": {
          "anyPets": "None"
        }
      }
};
