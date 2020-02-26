# (S)CSS guidelines

> “Every line of code should appear to be written by a single person, no matter the number of contributors.” —@mdo

## General
### Don’ts

- Avoid using HTML tags in CSS selectors
  - E.g. Prefer `.o-modal {}` over `div.o-modal {}`
  - Always prefer using a class over HTML tags (with some exceptions like CSS resets)
- Don't use ids in selectors
  - `#header` is overly specific compared to, for example `.header` and is much harder to override
  - Read more about the headaches associated with IDs in CSS [here](http://csswizardry.com/2011/09/when-using-ids-can-be-a-pain-in-the-class/).
- Don’t NEST more than 3 levels deep
  - Nesting selectors increases specificity, meaning that overriding any CSS set therein needs to be targeted with an even more specific selector. This quickly becomes a significant maintenance issue.
- Avoid using nesting for anything other than pseudo selectors and state selectors.
  - E.g. nesting `:hover`, `:focus`, `::before`, etc. is OK, but nesting selectors inside selectors should be avoided.
- Don't USE `!important`
  - Ever.
  - If you must, leave a comment, and prioritise resolving specificity issues before resorting to `!important`.
  - `!important` greatly increases the power of a CSS declaration, making it extremely tough to override in the future. It’s only possible to override with another `!important` declaration later in the cascade.
- Don’t use `margin-top`.
  - Vertical margins [collapse](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing). Always prefer `padding-top` or`margin-bottom` on preceding elements
- Avoid shorthand properties (unless you really need them)
  - It can be tempting to use, for instance, `background: #fff` instead of `background-color: #fff`, but doing so overrides other values encapsulated by the shorthand property. (In this case, `background-image` and its associative properties are set to “none.”
  - This applies to all properties with a shorthand: border, margin, padding, font, etc.
- Avoid shorthand for at-rule import at component level.
  - It is okay using shorthand for at-rule import in abstract such as `@import "mixins`
  - If you use at-rule import in component, you should supply with its extension, prefer `@import "button.scss";` over `@import "button";`
- Don't use of at-rule extend, use at-rule mixins instead.

### Spacing

- Four spaces for indenting code
- Put spaces after `:` in property declarations
  - E.g. `color: red;` instead of `color:red;`
- Put spaces before `{` in rule declarations
  - E.g. `.o-modal {` instead of `.o-modal{`
- Write your declaration one line per property
- Add a line break after `}` closing rule declarations
- When grouping selectors, keep individual selectors on a single line
- When declare multiple value, keep them readable by line
- Place closing braces `}` on a new line
- Add a new line at the end of .scss files
- Trim excess whitespace

### Formatting

- All selectors are lower case, hyphen separated aka “spinal case” eg. `.my-class-name`
- Always prefer Sass’s double-slash `//` commenting, even for block comments
- Avoid specifying units for zero values, e.g. `margin: 0;` instead of `margin: 0px;`
- Always add a semicolon to the end of a property/value declaration
- Use leading zeros for decimal values `opacity: 0.4;` instead of `opacity: .4;`
- Put spaces before and after child selector `div > span` instead of `div>span`
- Use shorthand property only to reset cascade
- Object namespace should named as simple as posible following below convention placed by order:
    | No. | Shorthand | Description |
    |---|---|---|
    | 0 | m | Margin |
    | 1 | p | Padding |
    | 2 | t | Top |
    | 3 | r | Right |
    | 4 | b | Bottom |
    | 5 | l | Left |
    | 6 | x | X-axis (left and right) |
    | 7 | y | Y-axis (top and bottom) |
    | 8 | n | Negative (margin only) |
    | 9 | 0 | 0 reset |
    | 10 | 1 | --space-1 (default .25em) |
    | 11 | 2 | --space-2 (default .5em) |
    | 12 | 3 | --space-3 (default 1em) |
    | 13 | 4 | --space-4 (default 1.5em) |
    | 14 | 5 | --space-4 (default 2em) |

----------

## Sass Specifics
### Internal order of a .scss file

1. Imports
2. Variables
3. Base Styles
4. Experiment Styles

Example:

```scss
//------------------------------
// Modal
//------------------------------

@import "../constants";
@import "../helpers";

$u-modal-namespace: "c-modal" !default;
$u-modal-padding: 32px;

$u-modal-background: #fff !default;
$u-modal-background-alt: color(gray, x-light) !default;

.o-modal { ... }

// Many lines later...

// EXPERIMENT: experiment-rule-name
.o-modal--experiment { ... }
// END EXPERIMENT: experiment-rule-name
```

### Variables

- Define all variables at the top of the file after the imports
- Namespace local variables with the filename (SASS has no doc level scope)
  - eg `business_contact.scss` →`$u-business_contact_font_size: 14px;`
- Local variables should be `$o-snake_lowercase`
- Global constants should be `$O-SNAKE_ALL_CAPS`

### Color

- Use the defined color constants via the color function
- Use **Sass** function to define color palette as variables. Avoid define new color in local variable.
- Lowercase all **hex** values `#fffff`
- Use opacity instead of **hexa**
- Limit alpha values to a maximum of two decimal places. Always use a leading zero.

Example:

```scss
// Bad
.c-link {
  color: #007ee5;
  border-color: #FFF;
  background-color: rgba(#FFF, .0625);
}

// Good
.c-link {
  color: color(blue);
  border-color: #ffffff;
  background-color: rgba(#ffffff, 0.1);
}
```

### Experiments

Wrap experiment styles with comments:

```scss
// EXPERIMENT: experiment-rule-name
._-stuff { ... }
// END EXPERIMENT: experiment-rule-name
```

----------

## Rule Ordering

Properties and nested declarations should appear in the following order, with line breaks between groups:

1. Any `@` rules
2. Layout and box-model properties
  - margin, padding, box-sizing, overflow, position, display, width/height, etc.
3. Typographic properties
  - E.g. font-*, line-height, letter-spacing, text-*, etc.
4. Stylistic properties
  - color, background-*, animation, border, etc.
5. UI properties
  - appearance, cursor, user-select, pointer-events, etc.
6. Pseudo-elements
  - ::after, ::before, ::selection, etc.
7. Pseudo-selectors
  - :hover, :focus, :active, etc.
8. Modifier classes
9. Nested elements

Here’s a comprehensive example:

```scss
.c-btn {
    @extend %link--plain;

    display: inline-block;
    padding: 6px 12px;

    text-align: center;
    font-weight: 600;

    background-color: color(blue);
    border-radius: 3px;
    color: white;

    &::before {
        content: '';
    }

    &:focus, &:hover {
        box-shadow: 0 0 0 1px color(blue, .3);
    }

    &--big {
        padding: 12px 24px;
    }

    > .c-icon {
        margin-right: 6px;
    }

    .u-l-flex-col & {
        margin: 0;
    }
}
```

----------

## Nesting

- As a general rule of thumb, avoid nesting selectors more than 3 levels deep
- Prefer using nesting as a convenience to extend the parent selector over targeting nested elements. For example:
  ```scss
  .namesapce-block {
      padding: 24px;

      &--mini {
          padding: 12px;
      }
  }
  ```

Nesting can be really easily avoided by smart class naming (with the help of BEM) and avoiding bare tag selectors.

----------

## BEM

Block: Unique, meaningful names for a logical unit of style. Avoid excessive shorthand.
- Good: `.alert-box` or `.recents-intro` or `.button`
- Bad: `.feature` or `.content` or `.btn`

Element: styles that only apply to children of a block. Elements can also be blocks themselves. Class name is a concatenation of the block name, two underscores and the element name. Examples:
- `.alert-box__close`
- `.expanding-section__section`

Modifier: override or extend the base styles of a block or element with modifier styles. Class name is a concatenation of the block (or element) name, two hyphens and the modifier name. Examples:
- `.alert-box--success`
- `.expanding-section--expanded`

### BEM Best practices

Don't `@extend` block modifiers with the block base.
- Good: `<div class="my-block my-block--modifier">`
- Bad: `<div class="my-block--modifier">`

Don't create elements inside elements. If you find yourself needing this, consider converting your element into a block.
- Bad: `.alert-box__close__button`

Choose your modifiers wisely. These two rules have very different meaning:

```scss
.namesapce-block--modifier .namesapce-block__element { color: red; }
.namesapce-block__element--modifier { color: red; }
```

----------

## Selector Naming

- Try to use [BEM-based](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) naming for your class selectors
  - When using modifier classes, always require the base/unmodified class is present
- Use Sass’s nesting to manage BEM selectors like so:
  ```scss
  .namesapce-block {
      &--modifier { // compiles to .block--modifier
          text-align: center;
      }

      &__element { // compiles to .block__element
          color: red;

          &--modifier { // compiles to .block__element--modifier
              color: blue;
          }
      }
  }
  ```

----------

## Namespaced Classes

There are a few reserved namespaces for classes to provide common and globally-available abstractions. This namespaces also applied to variables.
Certain namespace (Utilities, Objects, Hacks) remain [immutable](https://csswizardry.com/2015/03/immutable-css/) by never reassigning them and adding caveats. 

- `.o-` for objects. Objects are usually common design patterns (like the Flag object). Modifying these classes could have severe knock-on effects.
- `.c-` for components. Components are designed pieces of UI—think: buttons, inputs, modals, and banners.
- `.u-` for helpers and utilities. Utility classes are usually single-purpose and have high priority. Things like floating elements, trimming margins, etc.
- `.is-, .has-` for stateful classes, a la [SMACSS](https://smacss.com/book/type-state). Use these classes for temporary, optional, or short-lived states and styles.
- `._` for hacks. Classes with a hack namespace should be used when you need to force a style with `!important` or increasing specificity, should be temporary, and should not be bound onto. This namespace should also be used for experiment classes.
- `.t-` for theme classes. Pages with unique styles or overrides for any objects or components should make use of theme classes.

----------

## Separation of Concerns (One Thing Well™)

You should always try to spot common code—padding, font sizes, layout patterns—and abstract them to reusable, namespaced classes that can be chained to elements and have a single responsibility. Doing so helps prevent overrides and duplicated rules, and encourages a separation of concerns.

```scss
// Bad code
// HTML:
// <div class="modal compact">...</div>
.namesapce-modal {
    padding: 32px;
    background-color: color(gray, x-light);

    &.namesapce-compact {
        padding: 24px;
    }
}

// Good code
// HTML:
// <div class="c-modal u-l-island">...</div>
// <div class="c-modal u-l-isle">...</div>

// components/_modal.scss
.c-modal {
    background-color: color(gray, x-light);
}

// helpers/_layout.scss
.u-island {
    padding: 32px;
}

.u-isle {
    padding: 24px;
}
```

----------

## Media Queries

Media queries should be within the CSS selector as per SMACSS

```scss
.type-selector {
      float: left;

      @media only screen and (max-width: 767px) {
        float: none;
      }
}
```

Create variables for frequently used breakpoints

```scss
$O-SCREEN_SM_MAX: "max-width: 767px";

.type-selector {
      float: left;

      @media only screen and ($O-SCREEN_SM_MAX) {
        float: none;
      }
}
```
This catalog is proof of concept where web component is based upon.

