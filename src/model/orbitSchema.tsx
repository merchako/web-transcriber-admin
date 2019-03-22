import { SchemaSettings } from '@orbit/data';

const SchemaObject =  {
    models: {
      project: {
        attributes: {
            projectName: {
                type: "string"
            },
            projectType: {
                type: "string"
            },
            paratextGuid: {
                type: "string"
            },
            paratextShortName: {
                type: "string"
            },
            languageBcp47: {
                type: "string"
            },
            fontFamily: {
                type: "string"
            },
            fontSize: {
                type: "string"
            },
            fontFeatures: {
                type: "string"
            },
            direction: {
                type: "string"
            },
            allowClaiming: {
                type: "boolean"
            },
            autoSync: {
                type: "boolean"
            }
        },
        relationships: {
            passages: {
                type: "hasMany",
                model: "passage",
                inverse: "project"
            },
            users: {
                type: "hasMany",
                model: "user"
            },
            settings: {
                type: "hasMany",
                model: "setting",
                inverse: "project"
            }
          }
        },
      passage: {
        attributes: {
            book: {
                type: "number"
            },
            set: {
                type: "number"
            },
            passageNum: {
                type: "number"
            },
            reference: {
                type: "string"
            },
            version: {
                type: "number"
            },
            title: {
                type: "string"
            },
            state: {
                type: "string"
            },
            audioUri: {
                type: "string"
            },
            audioLength: {
                type: "number"
            },
            audioPosition: {
                type: "number"
            },
            transcription: {
                type: "string"
            },
            hold: {
                type: "boolean"
            }
        },
        relationships: {
            project: {
                type: "hasOne",
                model: "project"
            },
            assignedTo: {
                type: "hasOne",
                model: "user"
            },
            lastTranscriber: {
                type: "hasOne",
                model: "user"
            },
            lastReviewer: {
                type: "hasOne",
                model: "user"
            },
            comments: {
                type: "hasMany",
                model: "comment",
                inverse: "passage"
            }
          }
        },
      user: {
        attributes: {
            fullName: {
                type: "string"
            },
            avatarUri: {
                type: "string"
            }
        },
        relationships: {
            settings: {
                type: "hasMany",
                model: "setting",
                inverse: "user"
            }
          }
        },
      Setting: {
        attributes: {
            context: {
                type: "string"
            },
            settingName: {
                type: "string"
            },
            settingValue: {
                type: "string"
            }
          }
        },
      thread: {
        attributes: {
            startLocation: {
                type: "number"
            },
            targetText: {
                type: "string"
            },
            commentText: {
                type: "string"
            },
            resolved: {
                type: "boolean"
            }
        },
        relationships: {
            author: {
                type: "hasOne",
                model: "user"
            },
            response: {
                type: "hasOne",
                model: "comment"
            }
          }
        },
      comment: {
        attributes: {
            commentText: {
                type: "string"
            }
        },
        relationships: {
            response: {
                type: "hasOne",
                model: "comment"
            }
          }
        }
      }
  };

  export default SchemaObject as SchemaSettings;