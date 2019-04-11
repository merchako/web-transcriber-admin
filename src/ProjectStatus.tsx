import React, { useState } from 'react';
import { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Project from './model/project';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withData } from 'react-orbitjs';
import { QueryBuilder, Record } from '@orbit/data';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import SettingsIcon from '@material-ui/icons/SettingsTwoTone';
import TeamIcon from '@material-ui/icons/GroupWorkTwoTone';
import SetIcon from '@material-ui/icons/WidgetsTwoTone';
import TaskIcon from '@material-ui/icons/ListTwoTone';
import BackIcon from '@material-ui/icons/ArrowBack';
import MediaIcon from '@material-ui/icons/AudiotrackTwoTone'
import IntegrationIcon from '@material-ui/icons/UnarchiveTwoTone'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Chart from './Chart';
import ProjectSettings from './ProjectSettings';
import { CSSProperties } from 'jss/css';

const drawerWidth = 240;

interface IProps extends IRecordProps {
  classes: CSSProperties;
  theme: Theme;
}

class ProjectStatusData extends React.Component<IProps, object> {
  public render(): JSX.Element {
      return <ProjectStatus {...this.props} />
  }
}

export function ProjectStatus(props: any): JSX.Element {
  const { classes, theme, projects } = props;
  const [open, setOpen] = useState(true);
  const [project, setProject] = useGlobal('project');
  const currentProject = projects.filter((p: Project) => p.id === project)[0];
  const [view, setView] = useState('');
  const [content, setContent] = useState('chart');

  const handleDrawerOpen = () => { setOpen(true) };
  const handleDrawerClose = () => { setOpen(false) };
  const handleProjectItem = (e: any) => { setContent(e.target.innerText) }
  const handleCancel = () => { setView('/project') };

  const contentJsx = content.toLowerCase() === 'settings'? <ProjectSettings />:
    <Chart />;


  return view ===''? (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: false,
        })}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <IconButton >
            <BackIcon onClick={handleCancel} />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            {'SIL Transcriber Admin - Project'}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <Avatar className={classes.avatar} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: classNames({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Settings', 'Team', 'Sets', 'Tasks', 'Media', 'Integrations'].map((text, index) => (
            <ListItem button key={text} onClick={handleProjectItem}>
              <ListItemIcon>{index === 0 ? <SettingsIcon /> : (
                index === 1 ? <TeamIcon /> : (
                  index === 2 ? <SetIcon /> : (
                    index === 3 ? <TaskIcon /> : (
                      index === 4 ? <MediaIcon /> : <IntegrationIcon />
                    )
                  )
                )
              )
              }</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <h2 className={classes.dialogHeader}>
          {(currentProject && currentProject.attributes.name) || 'Project A'}
        </h2>

        {contentJsx}
      </main>
    </div>
  ): <Redirect to={view} />;
};


ProjectStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    background: '#FFE599',
    color: 'black',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});


const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators({
    }, dispatch),
});

interface IRecordProps {
  projects: () => Array<Record>;
}

const mapRecordsToProps = {
  projects: (q: QueryBuilder) => q.findRecords('project'),
}

export default withStyles(styles, { withTheme: true })(
  withData(mapRecordsToProps)(
      connect(mapStateToProps, mapDispatchToProps)(ProjectStatusData) as any
      ) as any
  ) as any;