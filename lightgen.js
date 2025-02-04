/**
 * @file lightgen.js,
 * @author Dimitris Vainanidis,
 * @copyright Dimitris Vainanidis 2024
 */

"use strict"; 


let lightgen = {
    /**
     * Creates a static custom HTML Element
     * @param {object} component An object containing the appropriate information
     * @param {string} component.element The HTML tag for the custom element
     * @param {string[]} [component.attributes] The HTML attributes to take into account
     * @param {string} component.template The HTML template of the element in string format
     * @returns {object}
     */
    createStaticElement: component => {
        customElements.define(component.element, class extends HTMLElement {
            constructor() {
                super();
                this.elementAttributes = component.attributes ?? [];
                this.template = document.createElement("template");
                this.template.innerHTML = component.template ?? '';
                for (let stateVariable of this.elementAttributes) {
                    this.template.innerHTML = this.template.innerHTML.replaceAll(`{${stateVariable}}`, this.getAttribute(stateVariable));
                }
            } // end of constructor
            connectedCallback() {
                this.innerHTML = this.template.innerHTML;
            } // end of connectedCallback
        })
        return component;

    },

    /**
     * Creates a custom HTML Element
     * @param {object} component An object containing the appropriate information
     * @param {string} component.element The HTML tag for the custom element
     * @param {boolean} [component.shadowRoot] If the custom element uses shadowRoot or not
     * @param {string[]} [component.state] The HTML attributes (they may cause element to re-render on change)
     * @param {object} [component.defaultValues] Default values for all the HTML attributes
     * @param {string} component.template The HTML template of the element in string format
     * @param {function} [component.onRender] function to call on (re)render
     * @returns {object}
     */
    createDynamicElement: component => {
        
    customElements.define(component.element, class extends HTMLElement {
        constructor() {
            super();
            this.hasInitialized = false;
            this.stateVariables = component.state??[]; 
            this.defaultValues = component.defaultValues??{};
            this.template = document.createElement("template");
            this.template.innerHTML = (component.template??'')
                    .replaceAll(`{slot}`,this.innerHTML)
                    .replace(/<slot.{0,3}>/g,this.innerHTML); 
            // get, set for all state
            for (let stateVariable of this.stateVariables) {
                if (this[stateVariable]) {continue}     // if DOM object property/method exists
                Object.defineProperty(this, stateVariable, {
                    configurable: false,
                    get: function(){
                        return this.getAttribute(stateVariable)??this.defaultValues?.[stateVariable]??null;
                    },
                    set: function(value){
                        this.setAttribute(stateVariable,value);
                        return value;
                    },
                });
            }
            this.onRender = component.onRender;
            if (component.shadowRoot) { this.attachShadow({mode:"open"}) }
        } // end of constructor
        connectedCallback () {
            if (this.shadowRoot) { this.shadowRoot.appendChild(this.template.content.cloneNode(true)) }
            this.render("connectedCallback",null);
            this.hasInitialized = true;
        }

        static observedAttributes = component.state; //this.stateVariables does not work...
        attributeChangedCallback (attributeName, oldValue, newValue) {
            if (this.hasInitialized) {  // because the first time, attributeChangedCallback is called before connectedCallback
                this.render("attributeChanged",attributeName);
            }
        }

        render(reason,attributeName) {
            // console.trace("render called: ",reason,attributeName);
            let html = this.template.innerHTML;
            this.stateVariables.forEach(prop=>{
                html = this.replaceProp(html,prop);
            });
            (this.shadowRoot??this).innerHTML = html;
            this.onRender(this);
        }
        replaceProp(element,propName){
            let thisObject = this;     //this is not needed. to be tested... 
            return element.replaceAll(`{${propName}}`, thisObject.getAttribute(propName)??thisObject.defaultValues?.[propName]??'')
        }
    });
  
    return component;
} // end of GenerateCustomElement



}


