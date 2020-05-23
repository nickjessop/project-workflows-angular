import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sliceEllipsis',
})
export class SliceEllipsisPipe implements PipeTransform {
    transform(value: string, start: number, end: number): string {
        if (start >= end) {
            return value;
        }

        const text = value.slice(start, end);

        return `${text} ...`;
    }
}
