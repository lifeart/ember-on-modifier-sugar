ember-on-modifier-sugar
==============================================================================

This addon provides syntax sugar for `on` and `fn` modifiers usage.


```hbs
<button (click)={{this.onClick "Hello"}} >
  ClickMe
</button>
```

to

```hbs
<button  {{on "click" (fn this.onClick "Hello")}} >
  ClickMe
</button>
```

also, string angular-like notation supported:


```hbs
<button (click)="this.onClick(1, null, true, false, undefined, 'str')">
  ClickMe
</button>
```

will be transformed to

```hbs
<button {{on "click" (fn this.onClick 1 null true false undefined "str") }}>
  ClickMe
</button>
```

Simple expressions, like

```hbs
<button (click)="this.onClick()">
  ClickMe
</button>
```

will be transformed to

```hbs
<button {{on "click" this.onClick}}>
  ClickMe
</button>
```

---

Restrictions
----

This is `Not` JavaScript! This code will not work:

```hbs
<button 
    (click)="this.onClick();"
    (click)="this.onClick(...attrs)"
    (click)="this.onClick(...attrs, 3 + 2)"
    (click)="this.onClick(...attrs, this.hello())"
    (click)="this.onClick(...attrs, (helper (anover helper)))"
>
  ClickMe
</button>

```


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.10 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-on-modifier-sugar
```


Usage
------------------------------------------------------------------------------

Just install it and use simple event bindings!

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
