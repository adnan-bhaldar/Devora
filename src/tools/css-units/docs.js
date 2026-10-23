const docs = {
    about:
        'Convert a size from one CSS unit to another: pixels, rem, em, percent, points, picas, inches, centimeters, millimeters, quarter-millimeters, and the viewport units vw, vh, vmin, and vmax. Set the font sizes and window size that the relative units depend on, then copy the result.',
    howItWorks: [
        'Type a number, choose the unit it is in, and choose the unit you want. The result updates as you type. Swap flips the two units and keeps your number.',
        'Every unit is first turned into CSS pixels and then into the unit you chose. The absolute units have fixed sizes: 1 in is 96 px, 1 cm is 96 ÷ 2.54 px, 1 mm is 96 ÷ 25.4 px, 1 Q is a quarter of a millimeter, 1 pt is 96 ÷ 72 px, and 1 pc is 16 px.',
        'The relative units depend on the settings. rem uses the root font size (the font size of the html element). em and % use the font size of the parent element. vw and vh are 1% of the window width and height, vmin is 1% of the smaller side, and vmax is 1% of the larger side.',
        'The font size settings are always available because the table at the bottom uses them. The window size settings appear when a viewport unit is chosen. Turn on “Show all units” to see the same number in every unit at once, each with its own copy button.',
        'The table at the bottom lists common pixel sizes as rem, em, points, and percent, using your current settings.',
    ],
    notes: [
        'The browser default font size is 16 px, so 1 rem is usually 16 px. If your site changes the root font size, or the person has set a larger text size in their browser, rem values scale with it. That is the reason to use rem for text.',
        'CSS inches, centimeters, and points are fixed ratios of the CSS pixel. They are not the physical size on a screen, and a printed page may differ from what you see.',
        'em depends on the element’s own parent, which can differ from place to place on a page. Use the “Parent font size” setting for the element you are converting.',
        'Viewport units use the window size you enter. The real window can be a different size, and on phones the browser toolbars can change the height of vh.',
        'Results are rounded to the number of decimal places you choose (0 to 6), and trailing zeros are removed. Rounding means a result converted back may differ slightly from your original number.',
        'Numbers can be negative, have a decimal point (or a decimal comma), and use e-notation such as 1e3. The largest number allowed is 1,000,000,000.',
        '“Copy link” shares the two units and the settings, never the number you typed.',
    ],
    privacy:
        'Everything is calculated in your browser. The number you type is not sent anywhere, and Devora does not save it.',
}

export default docs