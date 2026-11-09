English guide clips for the showroom. Spoken brand is “Jew-eye”. Files are the delivered mp3s; do not re-encode them.

| File | When it plays |
| --- | --- |
| `welcome.mp3` | First load. If the browser blocks autoplay, **Play welcome** starts it. |
| `J03-01.mp3` | Hotspot `j03-01` opens (`onHotspotOpen`). |
| `J02-01.mp3` | Hotspot `j02-01` opens (`onHotspotOpen`). |
| `close.mp3` | The fact card is dismissed (Close, Escape, or the same ring again), or **Closing note** is pressed. |

`onCardClose` stops the current clip. A dismiss then starts `close.mp3`. Switching hotspots stops the previous clip and plays the next product clip, with no closing note in between. Only one clip plays at a time. Press **Welcome** or **Closing note** again while that clip is current to stop it.
