# How to read bearings and distances on a land title

**3 min read · Last reviewed 2026-09-26**

> **Review copy.** Edit this Markdown file directly if you want to change the article. When you are satisfied, open [Issue #20](https://github.com/spatialdom/website/issues/20) and change the label from `insight:review` to `insight:approved`.

Bearings and distances are the instructions that describe one boundary line after another. Once you understand how a single call works, a technical description becomes much less intimidating.

## Think of one call as an instruction to move

Suppose a description says: from Point 1 to Point 2, N 30° E, 20.00 m. Start at Point 1, face north, turn 30 degrees toward the east, and travel 20 meters. Point 2 is where you end. The following call begins there.

Philippine technical descriptions often use quadrant bearings: N or S first, an angle, then E or W. The first letter tells you whether the line starts from north or south; the last tells you which way it turns. The angle may include degrees, minutes, and seconds. Small-looking transcription changes can materially alter the direction, so preserve every letter, symbol, and decimal from the source.

## Due north, south, east, and west are the simple cases

Not every line needs an angle. A boundary may simply run due north, due south, due east, or due west. These are useful anchor lines when you are checking a sketch because their direction is unambiguous.

The harder part is usually not the mathematics. It is making sure the line you typed is the line the document actually states. Old records can mix narrative and tabular formats, and scans can blur degree marks, minute marks, or letters. If something looks strange, compare the title with another reliable survey record before 'correcting' it by intuition.

## The tie line is not just another side of the lot

A technical description may begin from a Bureau of Lands Location Monument (BLLM), municipal monument, or another recognized reference point and give a bearing and distance to Corner 1. That is the tie line. It tells you how the parcel relates to a reference; the succeeding lines describe the parcel boundary itself.

This distinction is why a set of boundary calls can reconstruct a parcel shape even when you do not yet know its real-world coordinates. DENR procedures explicitly treat the tie line together with the individual lot data when converting cadastral records, while Geoportal's lot plotter requires a tie point when the goal is geographic placement.

## The sequence matters as much as the numbers

Technical descriptions are ordered traverses. Point 1 goes to Point 2, Point 2 to Point 3, and so on until the final line returns to Point 1. Reordering otherwise correct calls changes the polygon. Omitting one line changes everything after it.

When you are checking a long description, use the point numbers as a checklist. Do not rely on the shape looking 'about right.' A neat polygon is not evidence that every call was entered correctly.

## A bearing does not tell you the whole coordinate system

A bearing describes direction relative to the reference basis used by the survey; it does not, by itself, tell you a map projection, datum, or absolute coordinate. Historical Philippine records may have been created under different reference systems and later transformed or integrated into PRS92.

For a simple shape check, you can work from the relative boundary calls. For actual map placement, survey reconstruction, or any decision that depends on where corners fall on the ground, use the approved records and professional geodetic context rather than assuming that a bearing-and-distance sketch is already georeferenced.

## Related Spatialdom product

[Try the bearing-and-distance sequence in Parcel Plotter](/parcel-plotter/)

## Sources and further reading

- [LMB Memorandum Circular No. 2015-002 — standard tabular format of technical descriptions](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/68545)
- [DENR Memorandum Circular No. 2010-06 — cadastral data and PRS92 procedures](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/49164)
- [Geoportal Philippines — GP Lot Plotter](https://www.geoportal.gov.ph/gpapps/lotplotter)
- [LRA — Encoded Technical Description accreditation process](https://lra.gov.ph/etd-accreditation-process/)

---

*For educational use only. Reading or plotting a technical description does not establish an official boundary or replace review by a licensed Geodetic Engineer when professional surveying is required.*
