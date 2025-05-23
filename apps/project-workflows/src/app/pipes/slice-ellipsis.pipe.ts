import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sliceEllipsis',
})
export class SliceEllipsisPipe implements PipeTransform {
    transform(value: string, start: number, end: number): string {
        let text = value;
        const sliceLength = Math.abs(end - start);

        if (value.length >= sliceLength) {
            text = `${value.slice(start, end)} ...`;
        }

        return text;
    }
}
