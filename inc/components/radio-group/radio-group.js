import sheet from '/inc/components/radio-group/style.css' assert { type: 'css'}

export default class RadioGroup extends HTMLElement {
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
            <div class="radio-group--wrapper">    
                <label></label>
                <div class="input-wrapper"></div>
            </div>
        `;
    }

    #edit(){
        this.maxvalue = 5;

        this.wrapper = this.shadow.querySelector('.radio-group--wrapper');
        this.label = this.shadow.querySelector('label');        
    }


    // component Attributes
    static get observedAttributes() {
        return [ 'maxvalue', 'title' , 'class' , 'id', 'value'];
    }

    // attributes change
    attributeChangedCallback( property, oldValue, newValue ){        
        if (oldValue === newValue) return;
        this[property] = newValue;
    }

    // ceate and append Inputs
    #createRadio(){
        for( let i = 1; i <= this.maxvalue; i++){
            let input = document.createElement('input');
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", `${this.title}` );
            input.setAttribute("value", i);

            this.shadowRoot.querySelector('div[class="input-wrapper"]').insertAdjacentElement( 'beforeEnd', input );
        }
    }

    allInputs(){
        return this.shadowRoot.querySelectorAll('input');
    }

    setValueNumber(value){
        this.shadowRoot.createElement('span');
    }

    setRadoiGroupValue( value ){
        const inputs = this.allInputs();
        inputs.forEach(input => {
            input.checked = false;
        });

        if( value !== undefined ){
            for(let i = 0; i < value; i++){
                inputs[i].checked = true;
            }
        }
        
    }

    // conect Callback 
    connectedCallback(){
        this.#createRadio();
        this.setRadoiGroupValue(this.value);
        const inputs = this.allInputs();

        this.wrapper.classList.add( this.class ); 

        this.label.innerText = this.title;
        this.label.setAttribute('for', this.title);

        // set Radio states     
        inputs.forEach(input => {
            input.addEventListener("change", () => {
                this.setRadoiGroupValue(input.value); 
                this.setAttribute('value', input.value);
            });
        });
    }

}

