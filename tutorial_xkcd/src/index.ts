import {
	JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
	IFrame, ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import { IMainMenu } from '@jupyterlab/mainmenu';

import {
	JSONExt
} from '@phosphor/coreutils';

import {
	Message
} from '@phosphor/messaging';

import {
	Widget, Menu
} from '@phosphor/widgets';

import '../style/index.css';


/**
 * An xckd comic viewer.
 */
class XkcdWidget extends Widget {
  /**
   * Construct a new xkcd widget.
   */
	constructor() {
		super();

		this.id = 'xkcd-jupyterlab';
		this.title.label = 'xkcd.com';
		this.title.closable = true;
		this.addClass('jp-xkcdWidget');

		this.img = document.createElement('img');
		this.img.className = 'jp-xkcdCartoon';
		this.node.appendChild(this.img);

		this.img.insertAdjacentHTML('afterend',
			`<div class="jp-xkcdAttribution">
        <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcdAttribution" target="_blank">
          <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
        </a>
      </div>`
		);
	}

  /**
   * The image element associated with the widget.
   */
	readonly img: HTMLImageElement;

  /**
   * Handle update requests for the widget.
   */
	onUpdateRequest(msg: Message): void {
		fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
			return response.json();
		}).then(data => {
			this.img.src = data.img;
			this.img.alt = data.title;
			this.img.title = data.alt;
		});
	}
};


/**
 * Activate the xckd widget extension.
 */
function activate(app: JupyterLab, mainMenu: IMainMenu, palette: ICommandPalette, restorer: ILayoutRestorer) {
	// console.log('JupyterLab extension jupyterlab_xkcd is activated!');

	// ************** XKCD **************
	// Declare a widget variable
	let widget: XkcdWidget;

	// Add an application command
	// const command: string = 'xkcd:open';
	// app.commands.addCommand(command, {
	//   label: 'Random xkcd comic',
	//   execute: () => {
	//     if (!widget) {
	//       // Create a new widget if one does not exist
	//       widget = new XkcdWidget();
	//       widget.update();
	//     }
	//     if (!tracker.has(widget)) {
	//       // Track the state of the widget for later restoration
	//       tracker.add(widget);
	//     }
	//     if (!widget.isAttached) {
	//       // Attach the widget to the main work area if it's not there
	//       app.shell.addToMainArea(widget);
	//     } else {
	//       // Refresh the comic in the widget
	//       widget.update();
	//     }
	//     // Activate the widget
	//     app.shell.activateById(widget.id);
	// 	}

		// // Add the command to the palette.
		// palette.addItem({ command, category: 'Tutorial' });

		// // Track and restore the widget state
		// let tracker = new InstanceTracker<Widget>({ namespace: 'xkcd' });
		// restorer.restore(tracker, {
		// 	command,
		// 	args: () => JSONExt.emptyObject,
		// 	name: () => 'xkcd'
		// });

	// ******* MENU ITEM *************
	// Create new commands, append to app.commands
	function appendNewCommand(item: any) {
		let iframe: IFrame = null;
		let command = `BookMark-${item.name}:show`;
		app.commands.addCommand(command, {

			label: item.name,
			execute: () => {
				if (item.target == '_blank') {
					let win = window.open(item.url, '_blank');
					win.focus();
				} else if (item.target == 'widget') {
					if (!iframe) {
						iframe = new IFrame();
						iframe.url = item.url;
						iframe.id = item.name;
						iframe.title.label = item.name;
						iframe.title.closable = true;
						iframe.node.style.overflowY = 'auto';
					}

					if (iframe == null || !iframe.isAttached) {
						app.shell.addToMainArea(iframe);
						app.shell.activateById(iframe.id);
					} else {
						app.shell.activateById(iframe.id);
					}
				}
			}



		});
		
	}
		BookMarks.forEach(item => appendNewCommand(item));

		console.log('Add bookmarks');
		

    let menu = Private.createMenu(app);
    mainMenu.addMenu(menu, {rank: 80});
    return Promise.resolve(void 0);

};


/**
 * Initialization data for the jupyterlab_xkcd extension.
 */
const extension: JupyterLabPlugin<void> = {
	id: 'jupyterlab_xkcd',
	autoStart: true,
	requires: [IMainMenu, ICommandPalette, ILayoutRestorer],
	activate: activate
};


export const BookMarks = [
	{
		name: 'Commons Marketplace',
		url: 'https://commons.oceanprotocol.com/',
		description: 'Custom extension to bookmark your MarketPlaces',
		target: 'widget'
	}
];


export default extension;


namespace Private {

	/**
	 * Creates a menu for the help plugin.
	 */
	export function createMenu(app: JupyterLab): Menu {

		const { commands } = app;
		let menu: Menu = new Menu({ commands });
		menu.title.label = 'Market Places';
		BookMarks.forEach(item => menu.addItem({ command: `BookMark-${item.name}:show` }));

		return menu;
	}
}