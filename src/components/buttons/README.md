Client Button Modules
======================

This folder can contain "client button" modules that are automatically registered on bot startup.

Registration mapping

- Key used in `client.buttons` = filename without the `.js` extension.

  - Example: `shop_info_ephemeral.js` -> `client.buttons.get('shop_info_ephemeral')`

Module contract

- Export an `execute` function (either as a plain object export or a class with `execute`):

  - signature: `async function execute(interaction, params)`

  - `interaction` is the Discord Interaction object from discord.js

  - `params` is an array of additional parameters parsed from the customId when routing.

    You can define conventions such as `['ephemeral', userId]`.

Behavior and examples

- Modules registered this way are called by `src/components/buttons/ButtonHandler.js` when the
  standard routing does not handle a customId, or directly via `client.buttons.get(name)`.

  - Example usage pattern inside your module:

    - Delegate to an existing handler class for consistent styling and logic (recommended):

      - e.g., call `new ShopButtonHandlers(client).handleShopInfo(interaction, ['ephemeral', userId])`

Notes

- Keep modules small and focused. Use existing builders in `src/components/builders` for consistent UI.

- The loader that registers these modules is `src/handlers/componentHandler.js`.

  It automatically registers any module with an exported `execute` function using the filename as the key.

- If you change the filename, the `client.buttons` key will change accordingly.

Testing

- There are unit tests under `tests/` that demonstrate mocking interactions and asserting the
  handler behavior. Follow the same approach when adding tests for your module.

If you want, I can add a template file `example_button_module.js` in this directory to use as a starter for new handlers.
