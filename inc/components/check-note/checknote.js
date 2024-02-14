const template = document.createElement('template');

template.innerHTML = `
    <span class="head"><slot></slot></span><button data-edit-all="false">edit</button>
    <div class="checknote--note--wrapper">
    </div>
    <button data-add >add</button><input data-input type="text"/>
`;

import sheet from '/inc/components/check-note/style.css' assert { type: 'css'}

export default class CheckNote extends HTMLElement {

    constructor() {
        super();

        this.#build();
		this.#edit();
    }

    // ########### Build Template ############
    #build(){
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.shadow.innerHTML = `
            <span class="head"><slot></slot></span>
                <button data-edit-all="false">edit</button>
                <div class="checknote--note--wrapper"></div>
            <button data-add >add</button><input data-input type="text"/>
        `;
    }

    #edit(){
        this.checknoteId = 1;

        this.wrapper = this.shadow.querySelector('.checknote--note--wrapper');
        this.add = this.shadow.querySelector('button[data-add]');
        this.edit = this.shadow.querySelector('button[data-edit-all]');
        this.textInput = this.shadow.querySelector('input[data-input]');
    }

    //Component Attributes
    static get observedAttribute() {
        return [ 'value', 'checkbox' ];
    }
    
    // attributes change 
    attributeChangedCallback( property, oldValue, newValue ){        
        if (oldValue === newValue) return;
        this[property] = newValue;
    }

    createCheckNotes(value){
        if(!value) return;
        
        if(value) {
            let textEdit = document.createElement('input');
            let checkbox = document.createElement('input');

            textEdit.setAttribute('type', 'text');
            textEdit.setAttribute('disabled', '');
            textEdit.setAttribute('data-text', 'text');
            textEdit.setAttribute('data-id', this.checknoteId);
            textEdit.setAttribute('value', value );

            checkbox.setAttribute('type', 'checkbox');    
            checkbox.setAttribute('data-id', this.checknoteId);    
            checkbox.setAttribute('data-can-remove', 'false');    
            
            this.textInput.value = '';

            this.wrapper.insertAdjacentElement( 'beforeEnd', textEdit );
            this.wrapper.insertAdjacentElement( 'beforeEnd', checkbox );   

            ++this.checknoteId;
        }
    }

    checkedStyle() {

    }

    changeCheckNoteEditState() {
        let inputs = this.shadowRoot.querySelectorAll('input[data-text]');
        let checkbox = this.shadowRoot.querySelectorAll('input[data-can-remove]');
            
        this.edit.dataset.editAll = this.edit.dataset.editAll  == 'false' ? 'true' : 'false';
        let currAtt = this.edit.dataset.editAll;


        if( currAtt == 'true' && inputs.length != 0 ){
            inputs.forEach(e => {
                e.removeAttribute('disabled');
            });
            checkbox.forEach(e => {
                e.dataset.canRemove = 'true';                
                e.addEventListener('click', () => {
                    if(e.dataset.canRemove == 'true'){
                        let id = e.dataset.id;
                        let toRemove = this.shadowRoot.querySelectorAll(`[data-id="${id}"]`);
                        toRemove.forEach(items => items.remove());
                        
                    }
                })
            });
        }


        if( currAtt == 'false' && inputs.length != 0 ){
            inputs.forEach(e => {
                if(!e.hasAttribute('disabled')) e.setAttribute('disabled', '');
            })
            checkbox.forEach(e => {
                e.dataset.canRemove = 'false';
            });
        }
    }

    attributeChangedCallback() {

    }

    connectedCallback() {
        this.add.addEventListener('click', () => {
            if(this.edit.dataset.editAll === 'false') this.createCheckNotes(this.textInput.value);
        }); 

        this.edit.addEventListener('click', ( ) => {
            this.changeCheckNoteEditState();
        });
        this.textInput.addEventListener('keypress', (event) => {
            if(event.key == "Enter" && this.edit.dataset.editAll === 'false') this.createCheckNotes(this.textInput.value);
        });
    }

}