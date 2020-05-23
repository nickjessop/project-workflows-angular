##Typography Sizes
Base size: 16px

Ratio: 1.125 (Major Second)

Use the following mixins with the font-size attribute.
```
font-size: ms(1);
```

| Mixin         | Font Size (em)    | Font Size (px)    |                           
| ------------- | -------------     | -------------     |
| ms(-3)        | 0.702em           | 11.24px           |
| ms(-2)        | 0.79em            | 12.64px           |
| ms(-1)        | 0.889em           | 14.22px           |
| ms(0)         | 1em               | 16.00px           |
| ms(1)         | 1.125em           | 18.00px           |
| ms(2)         | 1.266em           | 20.25px           |
| ms(3)         | 1.424em           | 22.78px           |
| ms(4)         | 1.602em           | 25.63px           |
| `ms(5)`       | 1.802em           | 28.83px           |
| ms(6)         | 2.027em           | 32.44px           |
| `ms(7)`       | 2.281em           | 36.49px           |
| ms(8)         | 2.566em           | 41.05px           |

*Avoid using greyed out mixins. The 1.125 ratio creates close sizes which are good at the smaller end
of the scale, but we need to create space between sizes as they increase.*

##Spacing

Use a class name in combination with a class number as seen in the charts below. Example: mr-0 would give
a right margin of 4px.

```
margin-right: 4px;
```

The most common spacing used throughout the interface will be the #2 class of 16px.

| Class #       | Size (em)         | Size (px)         |                           
| ------------- | -------------     | -------------     |
| 0             | 0.25em            | 4px               |
| 1             | 0.5em             | 8px               |
| 2             | 1em               | 16px              |
| 3             | 1.5em             | 24px              |
| 4             | 2em               | 32px              |
| 5             | 3em               | 48px              |

| Class Name    | Class Name     | Attribute              |      
| ------------- | -------------  | ---------------------- |
| mr            | margin right   | margin-right: X;       |
| ml            | margin left    | margin-left: X;        |
| mt            | margin top     | margin-top: X;         |
| mb            | margin bottom  | margin-bottom: X;      |  
| ma            | margin all     | margin: X;             |    
| mx            | margin x-axis  | margin: 0 X;           |
| my            | margin y-axis  | margin: X 0;           |
| pr            | padding right  | padding-right: X;      |
| pl            | padding left   | padding-left: X;       |
| pt            | padding top    | padding-top: X;        |
| pb            | padding bottom | padding-bottom: X;     |  
| pa            | padding all    | padding: X;            |    
| px            | padding x-axis | padding: 0 X;          |
| py            | padding y-axis | padding: X 0;          |
