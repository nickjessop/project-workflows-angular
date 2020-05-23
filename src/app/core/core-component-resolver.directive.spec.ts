import { CoreComponentResolverDirective } from './core-component-resolver.directive';
import { inject } from '@angular/core/testing';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

describe('CoreComponentResolverDirective', () => {
    it('should create an instance', inject(
        [ComponentFactoryResolver, ViewContainerRef],
        (
            componentFactoryResolver: ComponentFactoryResolver,
            viewContainerRef: ViewContainerRef
        ) => {
            const directive = new CoreComponentResolverDirective(
                componentFactoryResolver,
                viewContainerRef
            );
            expect(directive).toBeTruthy();
        }
    ));
});
