import module from '../module';
import controller from './app.controller';

controller.$inject = [];

const component = 'app';

const selector = 'app';

const template = ``;

module.component(
	component,
	{
		controller,
		template
	}
)

export { component, component as default }
