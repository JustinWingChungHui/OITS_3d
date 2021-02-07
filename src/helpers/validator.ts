import { Vue } from 'vue-property-decorator';
import { FieldValidation, ValidationType }  from './field_validation';
import moment from 'moment';

class Validator {

    public View: Vue;
    public FieldValidations: FieldValidation[];

    constructor(view: Vue, fieldValidations: FieldValidation[]) {
        this.View = view;
        this.FieldValidations = fieldValidations;
    }


    public clearValidationMessages() {
        for (const fieldValidation of this.FieldValidations) {
            const valMessage = document.getElementById(fieldValidation.ValidationMessageId);
            if (valMessage) {
                valMessage.innerText = ``;
            }
        }
    }

    public IsValid(): boolean {
        let isValid = true;
        
        for (const fieldValidation of this.FieldValidations) {
            const value = this.View.$data[fieldValidation.FieldName];

            isValid = this.AreRulesValid(fieldValidation, value) && isValid;
        }

        return isValid;
    }

    private AreRulesValid(fieldValidation: FieldValidation, value: any): boolean {

        let isValid = true;
        for (const rule of fieldValidation.rules) {

            if (rule.Type === ValidationType.Custom) {
                if (!rule.CustomFunction) {
                    throw `Missing custom validation for ${fieldValidation.FieldName}`;
                }
                
                isValid = isValid && rule.CustomFunction(rule.Params);

            } else if  (rule.Type === ValidationType.Required) {
                isValid = isValid && this.Required(fieldValidation, value);

            } else if  (rule.Type === ValidationType.Minimum) {
                isValid = isValid && this.Minimum(fieldValidation, value, rule.Params);

            } else if  (rule.Type === ValidationType.Maximum) {
                isValid = isValid && this.Maximum(fieldValidation, value, rule.Params);
            }
        }

        return isValid;
    }

    private setValidationMessage(htmlElementId: string, message: string) {
        const htmlElement = document.getElementById(htmlElementId);

        if (htmlElement) {
            htmlElement.innerText = message;
        }
    }

    // eslint-disable-next-line
    private Required(fieldValidation: FieldValidation, value: any): boolean {

        let isValid = true;
        if (value === null || value === undefined) {
            isValid = false;
        } else {
            if (typeof value === 'string') {
                isValid = value.trim() !== '';
            }
        }

        if (isValid) {
            this.setValidationMessage(fieldValidation.ValidationMessageId, ``);
        } else {
            this.setValidationMessage(fieldValidation.ValidationMessageId, `Required`);
        }
        
        return isValid;
    }

    // eslint-disable-next-line
    private Minimum(fieldValidation: FieldValidation, value: any, minValue: any): boolean {


        let isValid = true;
        let formattedMinValue: string;

        if (typeof value === 'number') {
            isValid = (value as number) >= (minValue as number);
            formattedMinValue = minValue.toString();

        // Date
        } else if (Object.prototype.toString.call(value) === '[object Date]') {
            isValid = value > minValue;
            formattedMinValue = moment(minValue).format('YYYY MMM DD');

        } else {
            isValid = false;
            formattedMinValue = minValue.toString();
        }

        if (isValid) {
            this.setValidationMessage(fieldValidation.ValidationMessageId, ``);
        } else {
            this.setValidationMessage(fieldValidation.ValidationMessageId, `Must be at least ${formattedMinValue}`);
        }
        
        return isValid;
    }

    // eslint-disable-next-line
    private Maximum(fieldValidation: FieldValidation, value: any, maxValue: any): boolean {

        if (typeof maxValue !== 'number') {
            throw `Invalid parameter ${maxValue}`;
        }

        let isValid = true;
        if (typeof value !== 'number') {
            isValid = true;
        } else {
            isValid = (value as number) <= (maxValue as number);
        }

        if (isValid) {
            this.setValidationMessage(fieldValidation.ValidationMessageId, ``);
        } else {
            this.setValidationMessage(fieldValidation.ValidationMessageId, `Must be at most ${maxValue}`);
        }
        
        return isValid;
    }
}




export default Validator;