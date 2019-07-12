import React, { useState, useEffect } from 'react';
import { useGlobal } from 'reactn';
import { connect } from 'react-redux';
import {
  IState,
  Group,
  GroupMembership,
  Project,
  User,
  OrganizationMembership,
  IGroupSettingsStrings,
} from '../model';
import localStrings from '../selector/localize';
import { withData, WithDataProps } from 'react-orbitjs';
import { Schema, QueryBuilder, TransformBuilder } from '@orbit/data';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TextField,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactSelect, { OptionType } from '../components/ReactSelect';
import SnackBar from './SnackBar';
import { related, makeAbbr } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    grow: {
      flexGrow: 1,
    },
    paper: {
      paddingLeft: theme.spacing(4),
    },
    group: {
      paddingBottom: theme.spacing(3),
    },
    label: {
      display: 'flex',
      // color: theme.palette.primary.dark,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    dense: {
      marginTop: 16,
    },
    actions: theme.mixins.gutters({
      paddingBottom: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    }),
    button: {
      margin: theme.spacing(1),
    },
    addButton: {
      marginRight: theme.spacing(2),
    },
    icon: {
      marginLeft: theme.spacing(1),
    },
  })
);

interface IStateProps {
  t: IGroupSettingsStrings;
}

interface IRecordProps {
  groups: Array<Group>;
  groupMemberships: Array<GroupMembership>;
  projects: Array<Project>;
  users: Array<User>;
  orgMemberships: Array<OrganizationMembership>;
}

interface IProps extends IStateProps, IRecordProps, WithDataProps {}

export function GroupSettings(props: IProps) {
  const {
    groups,
    groupMemberships,
    projects,
    users,
    orgMemberships,
    updateStore,
    t,
  } = props;
  const classes = useStyles();
  const [group, setGroup] = useGlobal<string | null>('group');
  const [organization] = useGlobal<string>('organization');
  const [schema] = useGlobal<Schema>('schema');
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [message, setMessage] = useState(<></>);
  const [secondary] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<string | null>(null);
  const [orgPeople, setOrgPeople] = useState(Array<OptionType>());

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e: any) => {
    setAbbreviation(e.target.value);
  };
  const handleMessageReset = () => {
    setMessage(<></>);
  };
  const handleSave = () => {
    updateStore((t: TransformBuilder) =>
      t.replaceRecord({
        type: 'group',
        id: group,
        attributes: {
          name: name,
          abbreviation: abbreviation,
        },
      } as Group)
    );
    setGroup(null);
  };
  const handleRemoveMember = (userId: string) => () => {
    const ids = groupMemberships
      .filter(
        gm => related(gm, 'group') === group && related(gm, 'user') === userId
      )
      .map(gm => gm.id);
    if (ids.length > 0) {
      updateStore(t => t.removeRecord({ type: 'groupmembership', id: ids[0] }));
    }
  };

  const showDialog = (visible: boolean) => () => {
    setOpen(visible);
  };

  const handleCommit = (value: string) => {
    setCurrentPerson(value);
  };

  const handleAddMember = () => {
    setOpen(false);
    const groupMemberRec: GroupMembership = {
      type: 'groupmembership',
    } as any;
    schema.initializeRecord(groupMemberRec);
    updateStore(t => t.addRecord(groupMemberRec));
    updateStore(t =>
      t.replaceRelatedRecord(
        { type: 'groupmembership', id: groupMemberRec.id },
        'user',
        { type: 'user', id: currentPerson }
      )
    );
    updateStore(t =>
      t.replaceRelatedRecord(
        { type: 'groupmembership', id: groupMemberRec.id },
        'group',
        { type: 'group', id: group }
      )
    );
  };

  useEffect(() => {
    const curGroup = groups.filter((p: Group) => p.id === group);
    if (curGroup.length === 1) {
      const attr = curGroup[0].attributes;
      setName(attr.name);
      setAbbreviation(attr.abbreviation ? attr.abbreviation : '');
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [group, groups]);

  useEffect(() => {
    const allOrgUserIds = orgMemberships
      .filter(om => related(om, 'organization') === organization)
      .map(om => related(om, 'user'));
    const groupUserIds = groupMemberships
      .filter(gm => related(gm, 'group') === group)
      .map(gm => related(gm, 'user'));
    setOrgPeople(
      users
        .filter(
          u =>
            u.attributes &&
            allOrgUserIds.indexOf(u.id) !== -1 &&
            groupUserIds.indexOf(u.id) === -1
        )
        .sort((i, j) => (i.attributes.name < j.attributes.name ? -1 : 1))
        .map(u => {
          return { label: u.attributes.name, value: u.id } as OptionType;
        })
    );
  }, [orgMemberships, groupMemberships, users, organization, group]);

  const projectItems = projects
    .filter(p => related(p, 'group') === group)
    .sort((i, j) => (i.attributes.name < j.attributes.name ? -1 : 1))
    .map(p => (
      <ListItem>
        <ListItemText
          primary={p.attributes.name}
          secondary={secondary ? p.attributes.languageName : null}
        />
      </ListItem>
    ));

  const memberIds = groupMemberships
    .filter(gm => related(gm, 'group') === group)
    .map(gm => related(gm, 'user'));

  const memberItems = users
    .filter(u => u.attributes && memberIds.indexOf(u.id) !== -1)
    .sort((i, j) => (i.attributes.name < j.attributes.name ? -1 : 1))
    .map(u => (
      <ListItem>
        <ListItemAvatar>
          {u.attributes.avatarUrl ? (
            <Avatar alt={u.attributes.name} src={u.attributes.avatarUrl} />
          ) : (
            <Avatar>{makeAbbr(u.attributes.name)}</Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={u.attributes.name}
          secondary={secondary ? u.attributes.email : null}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="Delete"
            onClick={handleRemoveMember(u.id)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));

  return (
    <div className={classes.container}>
      <div className={classes.paper}>
        <FormControl>
          <FormGroup className={classes.group}>
            <FormControlLabel
              control={
                <TextField
                  id="name"
                  label={t.name}
                  className={classes.textField}
                  value={name}
                  onChange={handleNameChange}
                  margin="normal"
                  style={{ width: 400 }}
                  variant="filled"
                  required={true}
                />
              }
              label=""
            />
            <FormControlLabel
              control={
                <TextField
                  id="abbreviation"
                  label={t.abbreviation}
                  className={classes.textField}
                  value={abbreviation}
                  onChange={handleDescriptionChange}
                  margin="normal"
                  variant="filled"
                  required={false}
                />
              }
              label=""
            />
          </FormGroup>
          <FormLabel className={classes.label}>{t.projects}</FormLabel>
          <FormGroup className={classes.group}>
            <List dense={true}>{projectItems}</List>
          </FormGroup>
          <FormLabel className={classes.label}>
            {t.members} <div className={classes.grow}>{'\u00A0'}</div>
            <IconButton
              size="small"
              className={classes.addButton}
              onClick={showDialog(true)}
            >
              <AddIcon />
            </IconButton>
          </FormLabel>
          <FormGroup className={classes.group}>
            <List dense={true}>{memberItems}</List>
          </FormGroup>
        </FormControl>
        <div className={classes.actions}>
          <Button
            key="save"
            aria-label={t.save}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSave}
          >
            {t.save}
            <SaveIcon className={classes.icon} />
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={showDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{t.addGroupMember}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t.addMemberInstruction}</DialogContentText>
          <ReactSelect suggestions={orgPeople} onCommit={handleCommit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={showDialog(false)} color="primary">
            {t.cancel}
          </Button>
          <Button onClick={handleAddMember} color="primary">
            {t.add}
          </Button>
        </DialogActions>
      </Dialog>
      <SnackBar {...props} message={message} reset={handleMessageReset} />
    </div>
  );
}

const mapStateToProps = (state: IState): IStateProps => ({
  t: localStrings(state, { layout: 'groupSettings' }),
});

const mapRecordsToProps = {
  groups: (q: QueryBuilder) => q.findRecords('group'),
  groupMemberships: (q: QueryBuilder) => q.findRecords('groupmembership'),
  projects: (q: QueryBuilder) => q.findRecords('project'),
  users: (q: QueryBuilder) => q.findRecords('user'),
  orgMemberships: (q: QueryBuilder) => q.findRecords('organizationmembership'),
};

export default withData(mapRecordsToProps)(connect(mapStateToProps)(
  GroupSettings
) as any) as any;