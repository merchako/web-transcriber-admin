import { KeyMap, Schema, SchemaSettings } from '@orbit/data';

export const keyMap = new KeyMap();

const schemaDefinition: SchemaSettings =  {
  models: {
    group: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        abbreviation: { type: 'string' },
      },
      relationships: {
        owner: { type: 'hasOne', model: 'organization', inverse: 'groups' },
        users: { type: 'hasMany', model: 'groupmembership', inverse: 'group' },
      },
    },
    groupmembership: {
      keys: { remoteId: {} },
      attributes: {
        userId: { type: 'number' },
        groupId: { type: 'number' },
      },
      relationships: {
        user: { type: 'hasOne', model: 'user', inverse: 'groupMemberships' },
        group: { type: 'hasOne', model: 'group', inverse: 'users' },
      }
    },
    integration: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        url: { type: 'string' },
      },
      relationships: {
        projectIntegrations: { type: 'hasMany', model: 'projectintegration', inverse: 'project' },
      },
    },
    organization: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        websiteUrl: { type: 'string' },
        logoUrl: { type: 'string' },
        publicByDefault: { type: 'boolean' },
        // ownerId: { type: 'number' },
      },
      relationships: {
        owner: { type: 'hasOne', model: 'user' },
        users: { type: 'hasMany', model: 'users'},
        groups: { type: 'hasMany', model: 'groupmembership'},
        userRoles: { type: 'hasMany', model: 'userrole'},
      }
    },
    organizationmembership: {
      keys: { remoteId: {} },
      attributes: {
        userId: { type: 'number' },
        organizationId: { type: 'number' },
      },
      relationships: {
        user: { type: 'hasOne', model: 'user' },
        organization: { type: 'hasOne', model: 'organization' },
      }
    },
    plan: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        projectId: { type: 'number' },
        planTypeId: { type: 'number' },
      },
      relationships: {
        project: { type: 'hasOne', model: 'project', inverse: 'plans'},
        plantype: { type: 'hasOne', model: 'plantype', inverse: 'plans' },
        sections: { type: 'hasMany', model: 'section', inverse: 'plan' },
      },
    },
    plantype: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
      relationships: {
        plans: { type: 'hasMany', model: 'plan', inverse: 'plantype' },
      },
    },
    project: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        projectTypeId: { type: 'number' },
        description: { type: 'string' },
        ownerId: { type: 'number' },
        organizationId: { type: 'number' },
        groupId: { type: 'number' },
        uilanguagebcp47: { type: 'string' },
        language: { type: 'string' },
        languageName: { type: 'string' },
        defaultFont: { type: 'string' },
        defaultFontSize: { type: 'string' },
        rtl: { type: 'boolean' },
        allowClaim: { type: 'boolean' },
        isPublic: { type: 'boolean' },
        dateCreated: { type: 'date' },
        dateUpdated: { type: 'date' },
        dateArchived: { type: 'date' },
      },
      relationships: {
        projecttype: { type: 'hasOne', model: 'projecttype', inverse: 'projects' },
        owner: { type: 'hasOne', model: 'user', inverse: 'projects' },
        organization: { type: 'hasOne', model: 'organization'},
        group: { type: 'hasOne', model: 'group' },
        projectIntegrations: { type: 'hasMany', model: 'projectintegration', inverse: 'project' },
        users: { type: 'hasMany', model: 'userpassage', inverse: 'project' },
        // sections: { type: 'hasMany', model: 'section', inverse: 'project' },
        plans: { type: 'hasMany', model: 'plan', inverse: 'project' },
      }
    },
    projectintegration: {
      keys: { remoteId: {} },
      attributes: {
        projectId: { type: 'number' },
        integrationId: { type: 'number' },
        settings: { type: 'string' },
      },
      relationships: {
        integration: { type: 'hasOne', model: 'integration', inverse: 'projectIntegrations' },
        project: { type: 'hasOne', model: 'project', inverse: 'projectIntegrations' },
      },
    },
    projecttype: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
      relationships: {
        projects: { type: 'hasMany', model: 'project', inverse: 'projecttype' },
      },
    },
    projectuser: {
      keys: { remoteId: {} },
      attributes: {
        userId: { type: 'number' },
        projectId: { type: 'number' },
        roleId: { type: 'number' },
        font:  { type: 'string' },
        fontSize: { type: 'string' },
      },
      relationships: {
        user: { type: 'hasOne', model: 'user' },
        project: { type: 'hasOne', model: 'project' },
        role: { type: 'hasOne', model: 'role' },
      },
    },
    role: {
      keys: { remoteId: {} },
      attributes: {
        roleName: { type: 'string' },
      },
      relationships: {
        userRoles: { type: 'hasMany', model: 'userrole', inverse: 'role' },
      },
    },
    section: {
      keys: { remoteId: {} },
      attributes: {
        sequencenum: { type: 'number' },
        name: { type: 'string' },
        state: { type: 'string' },
        planId: { type: 'number' },
      },
      relationships: {
        // projects: { type: 'hasMany', model: 'project', inverse: 'sections' },
        plan: { type: 'hasOne', model: 'plan', inverse: 'sections' },
        passages: { type: 'hasMany', model: 'passagesection', inverse: 'section' },
      },
    },
    passage: {
      keys: { remoteId: {} },
      attributes: {
        sequencenum: { type: 'number' },
        book: { type: 'string' },
        reference: { type: 'string' },
        position: { type: 'number' },
        state: { type: 'string' },
        hold: { type: 'boolean' },
        title: { type: 'string' },
        dateCreated: { type: 'date' },
        dateUpdated: { type: 'date' },
      },
      relationships: {
        mediafiles: { type: 'hasMany', model: 'mediafile', inverse: 'passage' },
        sections: { type: 'hasMany', model: 'passagesection', inverse: 'passage' },
      },
    },
    passagesection: {
      keys: { remoteId: {} },
      attributes: {
        passageId: { type: 'number' },
        sectionId: { type: 'number' },
      },
      relationships: {
        passage: { type: 'hasOne', model: 'passage', inverse: 'sections' },
        section: { type: 'hasOne', model: 'section', inverse: 'passages' },
      },
    },
    mediafile: {
      keys: { remoteId: {} },
      attributes: {
        passageId: { type: 'number' },
        versionNumber: { type: 'number' },
        artifactType: { type: 'string' },
        eafUrl: { type: 'string' },
        audioUrl: { type: 'string' },
        duration: { type: 'number' },
        contentType: { type: 'string' },
        audioQuality: { type: 'string' },
        textQuality: { type: 'string' },
        transcription: { type: 'string' },
        dateCreated: { type: 'date' },
        dateUpdated: { type: 'date' },
      },
      relationships: {
        passage: { type: 'hasOne', model: 'passage', inverse: 'mediafiles' },
      },
    },
    user: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
        avatarUrl: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        timezone: { type: 'string' },
        locale: { type: 'string' },
        isLocked: { type: 'boolean' },
        externalId: { type: 'string' },
        identityToken: { type: 'string' },
        uiLanguageBcp47: { type: 'string' },
        timerCountUp: { type: 'boolean' },
        playBackSpeed: { type: 'number' },
        progressBarTypeId: { type: 'number' },
        hotKeys: { type: 'string' },
        profileVisibilit: { type: 'number'},
        emailNotification: { type: 'boolean' },
        dateCreated: { type: 'date' },
        dateUpdated: { type: 'date' },
      },
      relationships: {
        projects: { type: 'hasMany', model: 'project', inverse: 'owner' },
        organizationMemberships: { type: 'hasMany', model: 'organizationMembership', inverse: 'user' },
        userRoles: { type: 'hasMany', model: 'userrole', inverse: 'user' },
        groupMemberships: { type: 'hasMany', model: 'groupmembership', inverse: 'user' },
      },
    },
    currentuser: {
      keys: { remoteId: {} },
      attributes: {
        name: { type: 'string' },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
        avatarUrl: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        timezone: { type: 'string' },
        locale: { type: 'string' },
        isLocked: { type: 'boolean' },
        auth0: { type: 'string' },
        // externalId: { type: 'string' },
        // identityToken: { type: 'string' },
        // uiLanguageBcp47: { type: 'string' },
        // timerCountUp: { type: 'boolean' },
        // playBackSpeed: { type: 'number' },
        // progressBarTypeId: { type: 'number' },
        // hotKeys: { type: 'string' },
        // profileVisibilit: { type: 'number'},
        // emailNotification: { type: 'boolean' },
        dateCreated: { type: 'date' },
        dateUpdated: { type: 'date' },
      },
      relationships: {
        projects: { type: 'hasMany', model: 'project' },
        organizationMemberships: { type: 'hasMany', model: 'organizationMembership' },
        userRoles: { type: 'hasMany', model: 'userrole' },
        groupMemberships: { type: 'hasMany', model: 'groupmembership' },
      },
    },
    userrole: {
      keys: { remoteId: {} },
      attributes: {
        userId: { type: 'number' },
        roleId: { type: 'number' },
        organizationId: { type: 'number' },
      },
      relationships: {
        user: { type: 'hasOne', model: 'user', inverse: 'userRoles' },
        role: { type: 'hasOne', model: 'role', inverse: 'userRoles' },
        organization: { type: 'hasOne', model: 'organization', inverse: 'userRoles' },
      },
    },
    userpassage: {
      keys: { remoteId: {} },
      attributes: {
        activityName: { type: 'string' },
        state: { type: 'string' },
        comment: { type: 'string' },
        datecreated: { type: 'date' },
        dateupdated: { type: 'date' },
      },
      relationships: {
        project: { type: 'hasOne', model: 'project', inverse: 'users' },
        assigned: { type: 'hasOne', model: 'user' },
      },
    },
  }
};

export const schema = new Schema(schemaDefinition);