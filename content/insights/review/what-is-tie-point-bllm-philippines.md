# What is a tie point or BLLM, and why does it matter when locating a parcel?

**3 min read · Last reviewed 2026-10-18**

> **Review copy.** Edit this Markdown file directly if you want to change the article. When you are satisfied, open [Issue #51](https://github.com/spatialdom/website/issues/51) and change the label from `insight:review` to `insight:approved`.

A parcel's boundary bearings and distances can tell you its shape without telling you where to place it on a map. A tie point provides the connection to a reference location. In Philippine survey records, that reference may be a Bureau of Lands Location Monument (BLLM).

## Boundary lines describe shape; the tie line helps establish location

Imagine tracing four sides of a rectangle starting from a point you choose on a blank sheet. The rectangle can close perfectly, but you could draw the same shape anywhere on the page. A land title's boundary calls can have the same limitation when used without reliable control information.

A tie line connects a specified reference point to a lot corner, often corner 1. It is separate from the boundary traverse. If you mistakenly include the tie line as a property side, the computed shape and area can be wrong.

## What does BLLM mean?

BLLM stands for Bureau of Lands Location Monument. These are survey reference monuments used in cadastral and related land survey work. DENR's PRS92 guidance describes BLLMs and other existing survey monuments as part of the secondary geodetic control network when they are resurveyed or converted and meet the applicable accuracy requirements.

A BLLM name or number alone is not enough to guarantee that a coordinate you found online is the correct one for a particular survey. Check the cadastral survey identifier, reference records, coordinate system and datum. Historical plans may use control information that requires careful transformation or verification.

## Why a plot can look right but be misplaced

If the parcel's bearings and distances are correctly encoded but the reference point is wrong, the entire polygon may be shifted or rotated on a basemap. Closure will not reveal this error. Likewise, an old or uncertain tie point coordinate should not be treated as a recovered ground monument.

The Geoportal Philippines Lot Plotter asks users to choose a tie point and enter the tie-to-corner call. It also explicitly warns that its output is for viewing, not legal use. That distinction applies to other browser plotting tools as well.

## What to do when the tie point is missing or uncertain

You can still make a local, ungeoreferenced plot to understand the parcel's shape. Mark its location as unknown rather than forcing it onto a road or satellite image. For geographic placement, consult the approved plan and appropriate land survey records, and have a licensed Geodetic Engineer verify control and field evidence when necessary.

Parcel Plotter can help separate shape checking from georeferencing. It cannot independently recover a missing BLLM or establish the legal location of a boundary.

## Related Spatialdom product

[Explore a preliminary parcel plot](/parcel-plotter/)

## Sources and further reading

- [DENR DAO 2005-13 — Philippine Reference System of 1992](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/48061)
- [Geoportal Philippines — GP Lot Plotter](https://www.geoportal.gov.ph/gpapps/lotplotter)
- [RA 9200 — practice of Geodetic Engineering](https://lawphil.net/statutes/repacts/ra2003/ra_9200_2003.html)

---

*For education and preliminary visualization only. Official survey, title and legal questions require appropriate records and qualified professionals.*
