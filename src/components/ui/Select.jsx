// options: [{ value, label }]. All other props (id, value, onChange...) go to the <select>.
export default function Select({ options, className = '', ...props }) {
    return (
        <select className={`field ${className}`.trim()} {...props}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}