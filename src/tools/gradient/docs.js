const docs = {
    about:
        'Build a CSS gradient visually, then copy the code. Choose linear, radial, reflected, or diamond, add color stops, adjust the direction, and see the result update as you edit.',
    howItWorks: [
        'Pick a type. Linear blends colors along a straight line. Radial blends outward from a point. Reflected is a linear gradient mirrored around its center line. Diamond spreads from the center in a diamond shape.',
        'Add color stops. A stop is a color placed at a position from 0% to 100%, and the browser blends smoothly between neighboring stops. For reflected and diamond gradients, 0% is the center and 100% is the outer edge.',
        'Set the direction. For linear and reflected gradients, the angle sets the line: 0° points up, 90° points right, and angles increase clockwise. For radial gradients, choose a shape and where the center sits. Diamond has no direction settings.',
        'Copy the generated background declaration into your stylesheet.',
    ],
    example: {
        input: 'Linear, 135°\n#5b4bff at 0%\n#c147ff at 100%',
        output: 'background: linear-gradient(135deg, #5b4bff 0%, #c147ff 100%);',
    },
    notes: [
        'Colors are opaque 6-digit hex values. Transparency (alpha) is not supported.',
        'You can use 2 to 8 stops. Giving two stops the same position produces a hard edge instead of a blend.',
        'Stops are written to the CSS in position order, whatever order the rows are in.',
        'Reflected gradients are written as an ordinary linear gradient with the stops mirrored, so each stop appears twice in the CSS.',
        'CSS has no single diamond gradient, so the Diamond output layers four linear gradients, one per quadrant, that meet at the center. The layers overlap by 1px to hide the join, and the diamond stretches to match the shape of the element it is applied to.',
        'The output uses the standard background property, which current browsers support.',
        'Your gradient is not kept in the page address, so refreshing the page resets it. To keep or share one, use “Copy link”.',
    ],
    privacy:
        'The gradient is generated entirely in your browser and nothing is sent anywhere. “Copy link” copies a link that contains your gradient settings (colors, angle, and positions only) so you can share or reopen it. When you open such a link, the settings are loaded and then removed from the address bar.',
}

export default docs