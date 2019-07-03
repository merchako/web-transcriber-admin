import React, { useState, useEffect } from 'react';
import { useGlobal } from 'reactn';
import { connect } from 'react-redux';
import { IState, IPlanTabsStrings } from '../model';
import localStrings from '../selector/localize';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import ScriptureTable from '../components/ScriptureTable';
import OtherTable from '../components/OtherTable';
import MediaTab from '../components/MediaTab';
import AssignmentTable from './AssignmentTable';
import { slug } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: theme.mixins.gutters({
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      flexDirection: 'column',
    }),
  })
);

interface IContainerProps {
  children: any;
}

function TabContainer(props: IContainerProps) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

interface IStateProps {
  t: IPlanTabsStrings;
}

interface IProps extends IStateProps {
  bookCol: number;
  changeTab?: (v: number) => void;
}

const ScrollableTabsButtonAuto = (props: IProps) => {
  const { t, changeTab, bookCol } = props;
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_tabName, setTabName] = useGlobal('tab');

  const handleChange = (event: any, value: number) => {
    setTab(value);
    if (changeTab) {
      changeTab(value);
    }
  };

  useEffect(() => {
    const tabNames = [
      slug(t.sectionsPassages),
      slug(t.media),
      slug(t.assignments),
      slug(t.transcriptions),
      slug(t.assignments),
    ];
    setTabName(tabNames[tab]);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [tab]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t.sectionsPassages} />
          <Tab label={t.media} />
          <Tab label={t.assignments} />
          <Tab label={t.transcriptions} />
        </Tabs>
      </AppBar>
      {tab === 0 && (
        <TabContainer>
          {bookCol !== -1 ? (
            <ScriptureTable {...props} />
          ) : (
            <OtherTable {...props} />
          )}
        </TabContainer>
      )}
      {tab === 1 && (
        <TabContainer>
          <MediaTab {...props} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <AssignmentTable {...props} />
        </TabContainer>
      )}
      {tab === 3 && <TabContainer>{t.transcriptions}</TabContainer>}
    </div>
  );
};

const mapStateToProps = (state: IState): IStateProps => ({
  t: localStrings(state, { layout: 'planTabs' }),
});

export default connect(mapStateToProps)(ScrollableTabsButtonAuto) as any;
