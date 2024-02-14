import RadioGroup from '../components/radio-group/radio-group.js';
import Checknote from '../components/check-note/checknote.js';

const ELEMENTS = [
    {tag: 'radio-group' , element: RadioGroup},
    {tag: 'check-note' , element: Checknote}
];


ELEMENTS.forEach(item => {
    customElements.define( item.tag , item.element );
});