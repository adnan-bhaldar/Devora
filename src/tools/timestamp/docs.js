const docs = {
    about:
        'Convert a Unix timestamp to a readable date, or a date to a Unix timestamp. A Unix timestamp is the number of seconds (or milliseconds) that have passed since 1 January 1970 at 00:00:00 UTC, a starting point called the epoch. Logs, databases, APIs, and tokens often store time this way.',
    howItWorks: [
        'To read a timestamp, type it into “Timestamp to date”. The unit is detected from the number of digits (10 digits are seconds, 13 are milliseconds, 16 are microseconds, 19 are nanoseconds), or you can choose it yourself.',
        'You get the date in UTC, in the time zone you chose, in a readable form, as an HTTP or email date, and as a time relative to now (such as “3 hours ago”).',
        'To get a timestamp, type a date into “Date to timestamp” as year-month-day with an optional time, such as 2026-03-15 09:30:00. You get the seconds, the milliseconds, and the UTC form.',
        'Without an offset the date is read in the chosen time zone. Add Z (UTC) or an offset such as +05:30 to the end to set the zone in the date itself.',
        '“Use now” fills in the current time, and the box at the top shows the current Unix time as it ticks.',
    ],
    notes: [
        'Unix time is always in UTC. A timestamp has no time zone, so the same number is the same moment everywhere. The time zone only changes how the date is shown.',
        'Auto-detect uses the number of digits before any decimal point: up to 11 digits are seconds, 12 to 14 are milliseconds, 15 to 17 are microseconds, and 18 or more are nanoseconds. Choose a unit yourself if a number is shorter or longer than usual.',
        'Decimal timestamps such as 1700000000.5 are accepted. JavaScript dates only count whole milliseconds, so anything finer is dropped.',
        'Negative timestamps are dates before 1970. The tool shows years 1 to 9999.',
        'Daylight saving time: a time that happens twice when the clocks go back is read as the first one. A time that does not exist when the clocks jump forward is moved an hour later, with a message.',
        'Leap seconds are not counted in Unix time, so a day is always 86,400 seconds.',
        'Time zone names such as Asia/Kolkata come from your browser, which keeps them up to date.',
        '“Relative” is measured from the clock in your browser.',
    ],
    privacy:
        'All conversions happen in your browser. The timestamps and dates you type are not sent to a server, not saved by Devora, and not placed in the page address. “Copy link” shares only the time zone and unit.',
}

export default docs