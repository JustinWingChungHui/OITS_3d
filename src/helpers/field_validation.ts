export interface FieldValidation {
    FieldName: string;
    ValidationMessageId: string;
    rules: ValidationRule[];
}

export interface ValidationRule {
    Type: ValidationType;
    Params?: any;
    CustomFunction?: (params?: any) => boolean;
}

export enum ValidationType {
    Required = 'Required',
    Minimum = 'Minimum',
    Maximum = 'Maximum',
    Custom = 'Custom',
}