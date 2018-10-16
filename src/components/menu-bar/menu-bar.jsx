import classNames from 'classnames';
import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';

import Box from '../box/box.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import {openTipsLibrary} from '../../reducers/modals';
import {setPlayer} from '../../reducers/mode';
import {
    getIsUpdating,
    getIsShowingProject,
    requestNewProject,
    saveProject
} from '../../reducers/project-state';

import {
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';
import helpIcon from '../../lib/assets/icon--tutorials.svg';
import dropdownCaret from './dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './scratch-logo.svg';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, isRtl, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

class MenuBar extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClickNew',
            'handleClickSave',
            'handleCloseFileMenuAndThen',
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'restoreOptionMessage'
        ]);
    }
    componentDidUpdate (prevProps) {
        // if we're no longer showing the project (loading, or whatever), close menus
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            this.props.onRequestCloseFile();
            this.props.onRequestCloseEdit();
        }
    }
    handleClickNew () {
        const canSave = this.props.canUpdateProject; // logged in
        // if canSave===true, it's safe to replace current project, since we will auto-save first
        const readyToReplaceProject =
            canSave || confirm('Replace contents of the current project?'); // eslint-disable-line no-alert
        if (readyToReplaceProject) {
            this.props.onClickNew(canSave);
        }
    }
    handleClickSave () {
        this.props.onClickSave();
    }
    handleRestoreOption (restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleCloseFileMenuAndThen (fn) {
        return () => {
            this.props.onRequestCloseFile();
            fn();
        };
    }
    handleLanguageMouseUp (e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    restoreOptionMessage (deletedItem) {
        switch (deletedItem) {
        case 'Sprite':
            return (<FormattedMessage
                defaultMessage="Restore Sprite"
                description="Menu bar item for restoring the last deleted sprite."
                id="gui.menuBar.restoreSprite"
            />);
        case 'Sound':
            return (<FormattedMessage
                defaultMessage="Restore Sound"
                description="Menu bar item for restoring the last deleted sound."
                id="gui.menuBar.restoreSound"
            />);
        case 'Costume':
            return (<FormattedMessage
                defaultMessage="Restore Costume"
                description="Menu bar item for restoring the last deleted costume."
                id="gui.menuBar.restoreCostume"
            />);
        default: {
            return (<FormattedMessage
                defaultMessage="Restore"
                description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                id="gui.menuBar.restore"
            />);
        }
        }
    }
    render () {
        return (
            <Box
                className={classNames(
                    this.props.className,
                    styles.menuBar,
                    {[styles.saveInProgress]: this.props.isUpdating}
                )}
            >
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <a
                                href="https://scratch.mit.edu"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    alt="Scratch"
                                    className={styles.scratchLogo}
                                    draggable={false}
                                    src={scratchLogo}
                                />
                            </a>
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, styles.languageMenu)}
                        >
                            <div>
                                <img
                                    className={styles.languageIcon}
                                    src={languageIcon}
                                />
                                <img
                                    className={styles.languageCaret}
                                    src={dropdownCaret}
                                />
                            </div>
                            <LanguageSelector label={this.props.intl.formatMessage(ariaMessages.language)} />
                        </div>
                    </div>
                </div>
            </Box>
        );
    }
}

MenuBar.propTypes = {
    accountMenuOpen: PropTypes.bool,
    canUpdateProject: PropTypes.bool,
    className: PropTypes.string,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    loginMenuOpen: PropTypes.bool,
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickSave: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    startSaving: PropTypes.func,
    username: PropTypes.string
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        accountMenuOpen: accountMenuOpen(state),
        canUpdateProject: typeof user !== 'undefined',
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        loginMenuOpen: loginMenuOpen(state),
        sessionExists: state.session && typeof state.session.session !== 'undefined',
        username: user ? user.username : null
    };
};

const mapDispatchToProps = dispatch => ({
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onClickNew: canSave => dispatch(requestNewProject(canSave)),
    onClickSave: () => dispatch(saveProject()),
    onSeeCommunity: () => dispatch(setPlayer(true))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar));
