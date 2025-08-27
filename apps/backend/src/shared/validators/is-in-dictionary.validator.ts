import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DictionaryService } from '../../dictionary/dictionary.service';

@ValidatorConstraint({ name: 'isInDictionary', async: true })
@Injectable()
export class IsInDictionaryConstraint implements ValidatorConstraintInterface {
    constructor(private readonly dictionaryService: DictionaryService) {}

    async validate(value: any, args: ValidationArguments) {
        if (!value) return true;

        const [dictionaryName] = args.constraints;
        const dictionary = await this.dictionaryService.findByName(dictionaryName);

        if (!dictionary) return false;

        const valuesToCheck = Array.isArray(value) ? value : [value];

        return valuesToCheck.every(v => dictionary.values.includes(v));
    }

    defaultMessage(args: ValidationArguments) {
        const [dictionaryName] = args.constraints;
        return `Value "$value" not allowed in "${dictionaryName} dictionary"`;
    }
}

export function IsInDictionary(dictionaryName: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [dictionaryName],
            validator: IsInDictionaryConstraint,
        });
    };
}
