# Classes

## Handlers

The idea of handlers are to *handle* a specific type of file.

For every type of file, there should be a class. If you need more than what are supplied, create an issue first and then a pull request.

Read about the one's below:

1. [Base Handler](###-base-handler)
    1. [Component Handler](###-component-handler)
    1. [Style Handler](###-style-handler)
    1. [Index Handler](###-index-handler)
1. [Configuration File](##-config)

### Base Handler
This class is used to extend the presets, and can be used to implement features in your own.

**`constructor`**`:[this]Handler`
`const MyObject = new BaseHandler(Options), where options is an Object

**`getConfig(ConfigObject)`**`:[this]Handler`

### Component Handler

Handles the component file.
+ parsing
+ conversions
+ tree
### Style Handler

### Index Handler

## Config

Used to handle the Configuration file. Makes sense for this to be a class.
