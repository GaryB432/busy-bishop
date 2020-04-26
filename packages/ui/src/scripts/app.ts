import '../styles/app.scss';

import { Greeter } from './greeter';

const greeter: Greeter = new Greeter('ui');

greeter.start(document.getElementById('app'));
