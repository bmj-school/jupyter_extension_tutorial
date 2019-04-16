import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the tutorial xks extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'tutorial xks',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension tutorial xks is activated!');
  }
};

export default extension;
