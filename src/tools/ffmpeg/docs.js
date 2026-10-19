const docs = {
    about:
        'A searchable collection of ready-to-use FFmpeg commands for the jobs people do most: converting, compressing, resizing, cutting, extracting audio, making GIFs, adding subtitles, and more. Each command comes with a plain explanation of what its options do.',
    howItWorks: [
        'Search for a job or a word, or pick a group, to narrow the list. Every word you type must appear in the command, its title, or its explanation.',
        'Press the copy button to copy a command, then paste it into a terminal where FFmpeg is installed.',
        'Replace the placeholder file names (input.mp4, output.mp4, subs.srt, and so on) with your own files before you run it.',
        'Open “What the options mean” on a card to learn what each part of the command does.',
    ],
    notes: [
        'FFmpeg is a free command-line program. Devora does not run it for you: these are commands to copy into your own terminal.',
        'The order of the options matters. An option placed before -i applies to the input that follows it. An option placed after the input applies to the output.',
        '“-c copy” copies streams without re-encoding. It is fast and loses no quality, but it cannot change the picture or sound, and cuts can only start on a keyframe.',
        'Lower -crf numbers mean better quality and larger files. For H.264, 18 is almost lossless, 23 is the default, and 28 is clearly smaller with visible loss.',
        'FFmpeg asks before it overwrites an existing file. Add -y to overwrite without asking, or -n to never overwrite.',
        'Quote file names that contain spaces, for example -i "my video.mp4".',
        'Commands are written for macOS and Linux shells. On Windows PowerShell or Command Prompt, quoting rules differ, so you may need to change the quote marks and escape characters.',
        'Hardware encoders such as h264_nvenc need matching hardware and an FFmpeg build that includes them.',
    ],
    privacy:
        'This is a reference. Nothing you type is sent to a server or saved by Devora, and nothing is added to the page address.',
}

export default docs