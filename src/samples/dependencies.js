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
            "$ref": "#/definitions/person"
          },
          "arrayOfConditionals": {
            "title": "Array of conditionals",
            "type": "array",
            "items": {
              "$ref": "#/definitions/person"
            }
          }
        },
        "definitions": {
          "person": {
            "title": "Person",
            "type": "object",
            "properties": {
              "anyPets": {
                "title": "Do you have any pets?",
                "type": "string",
                "enum": [
                  "No",
                  "Yes: One",
                  "Yes: More than one"
                ],
                "default": "No"
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
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "anyPets": {
                        "enum": [
                          "Yes: One"
                        ]
                      },
                      "petAge": {
                        "title" : "How old is your pet?",
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
                          "Yes: More than one"
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
          "anyPets": "No"
        }
      }
};
