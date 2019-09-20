import Component from '@ember/component';
import layout from '../templates/components/syntax-test';
import { action } from '@ember/object';

export default Component.extend({
  layout,
  onClick: action(function() {
    // eslint-disable-next-line no-console
    console.log('onClick', ...arguments);
  })
});
