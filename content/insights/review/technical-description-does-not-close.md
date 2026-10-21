# Why a land title technical description may not close

**3 min read · Last reviewed 2026-09-26**

> **Review copy.** Edit this Markdown file directly if you want to change the article. When you are satisfied, open [Issue #21](https://github.com/spatialdom/website/issues/21) and change the label from `insight:review` to `insight:approved`.

When the last plotted boundary line does not return to the starting corner, the parcel is 'open.' That gap is useful information—but it does not tell you, by itself, whether the mistake is in your encoding, the copy you received, an older record, or the underlying survey data.

## First, understand what closure is checking

Plotting bearings and distances is a traverse computation. Each line produces the next corner. Ideally, after the final call, the computed endpoint coincides with the starting point. The remaining difference is the closure error or misclosure.

This is an internal consistency test. It asks whether the sequence you entered returns to where it began. It does not authenticate the title, prove the lot is in the right place, or confirm that every monument on the ground agrees with the record.

## Most first checks should be boring—and exact

Before looking for a complicated explanation, compare the plot line by line with the source. Check N versus S, E versus W, degrees, minutes, seconds, decimal points, units, and the order of the points. Look for a line entered twice, a skipped line, or a tie line accidentally included as a parcel edge.

If you typed from OCR or from someone else's transcription, go back to the image or certified source. A single character can rotate a line into another quadrant. Never change a bearing or distance merely because a small adjustment makes the polygon close.

## If your encoding matches, the next question is which record you are looking at

Survey information can exist in several related records: the title, approved plan, lot data computation, lot description sheet, cadastral map, and original field notes. DENR rules for reconciling and reconstructing survey records explicitly allow these materials—and even adjoining lot information—to be compared when cadastral data are missing or damaged.

That is an important clue for users: a discrepancy in one copy should trigger comparison, not silent repair. If the matter is important, preserve the exact version you received, note where it came from, and compare it with authoritative survey records.

## Older records may carry rounding, conversion, or reconstruction history

Historical cadastral records were produced under different instruments, computational methods, and reference systems. Later government programs transformed and integrated cadastral data into PRS92. DENR procedures instruct offices to compare computed bearings and distances with technical descriptions and to reconstruct missing lot data when necessary.

This does not mean every open parcel is caused by datum transformation. It means the survey record has a history, and that history can matter. A browser tool should make the mismatch visible rather than pretending to know which value ought to be changed.

## A closed parcel can still be wrong

The inverse is also true: perfect closure is not proof of correctness. You can enter the wrong parcel, use the wrong tie point, swap a complete set of lines, or construct a geometrically closed figure that is not the property you intended.

So the useful question is not simply 'Does it close?' but 'Does this plotted result faithfully represent the authoritative source, and is it being used for the right purpose?'

## Escalate discrepancies that affect real decisions

For curiosity or preliminary review, an open plot can tell you exactly where to start checking. For a purchase, subdivision, construction, boundary dispute, titling transaction, or other consequential use, keep the original description unchanged and ask a licensed Geodetic Engineer to examine the relevant survey records.

A good plotting tool should help you detect uncertainty—not hide it. If Parcel Plotter shows a closure problem, treat that as a reason to inspect the source more closely, not as a button invitation to force the parcel shut.

## Related Spatialdom product

[Check the parcel and closure in Parcel Plotter](/parcel-plotter/)

## Sources and further reading

- [DENR Memorandum Circular No. 2010-06 — cadastral data transformation and verification procedures](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/49164)
- [DENR Administrative Order No. 2010-19 — reconciliation, indexing and reconstruction of survey records](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/55922)
- [LMB Memorandum Circular No. 2015-002 — standard technical description format](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/68545)
- [Republic Act No. 9200 — scope of Geodetic Engineering practice](https://lawphil.net/statutes/repacts/ra2003/ra_9200_2003.html)

---

*For educational and preliminary diagnostic use only. A closure result does not verify title validity or establish a legal boundary, and material discrepancies should be reviewed using the appropriate survey records by a licensed Geodetic Engineer.*
