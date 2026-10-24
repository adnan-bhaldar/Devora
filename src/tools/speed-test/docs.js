const docs = {
    about:
        'Measure how fast your internet connection is right now: how quickly data comes to you (download), how quickly it leaves you (upload), and how long a message takes to travel to a server and back (ping). The dial, the numbers, and the little charts update live while the test runs.',
    howItWorks: [
        'Press Start test. The test goes through three stages: ping, then download, then upload. The stage bar at the top shows which one is running.',
        'For download and upload, the test moves test data between your device and Cloudflare’s speed servers, starting with small pieces and moving to bigger ones. Each piece is timed, and the speed is worked out from how much data arrived and how long it took.',
        'The dial and the big number show the speed of the stage that is running. The number rises as the test settles on a result, and it drops back to zero when the upload stage begins. The bars in each result tile are the individual measurements, one bar per piece of data.',
        'Ping is the time for a tiny message to reach the server and come back, in milliseconds (ms). Lower is better. Jitter is how much the ping changes from one message to the next, and a steady connection has low jitter.',
        '“Ping while downloading” and “Ping while uploading” show how much slower the connection responds when it is busy. A big jump here is why video calls and games lag when someone else is downloading.',
        'Unit switches between Mbps (megabits per second, the number internet providers advertise) and MB/s (megabytes per second, the number a download shows). One byte is eight bits, so 80 Mbps is 10 MB/s.',
        'Stop ends the test early and keeps what was measured so far. Copy results copies a short text summary.',
    ],
    notes: [
        'The test uses real data. On a fast connection it can use up to about 1.3 GB (more downloading than uploading). A slow connection uses much less, because each stage stops as soon as it has a clear result.',
        'Results change from run to run. Wi-Fi signal, other devices and apps using the connection, a VPN, and how busy the server and your provider are all affect them. For the most reliable number, use a cable, close other apps, and run the test two or three times.',
        'Your speed to Cloudflare’s servers is not always your speed to every website. It is a good measure of your own connection, not of a particular site.',
        'Packet loss is not measured, because it needs a special server that this tool does not use.',
        'A browser extension, ad blocker, or company network that blocks speed.cloudflare.com will make the test fail.',
    ],
    privacy:
        'This is the one Devora tool that talks to another server. The test sends test data to and from speed.cloudflare.com, so Cloudflare can see your IP address, as any website you visit can. Devora does not send your results to anyone, and the test is set not to report them to Cloudflare. Nothing is saved.',
}

export default docs