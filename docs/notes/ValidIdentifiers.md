# Valid JavaScript identifiers and name sanitization

JavaScript identifiers can include Unicode letters, Unicode numbers, `_` and `$`. The first character cannot be a number. That seems simple except for the Unicode part and that the definition of "numbers" is unclear. I'm not sure about letters either, but haven't found any problems yet.

For example, the following assignments are valid in the NodeJS REPL:

- `let 日本語 = 'Japanese for Japanese language'`
- `let rrugë = 'Albanian for street'`
- `let شجرة = 'Arabic for tree'`
- `let x६ = 'x + Devangari 6'`
- `let x六 = 'x + Han 6'`
- `let x௬ = 'x + Tamil 6'`
- `let x𒐗 = 'x + cuneiform 3'`

But `x¹` (superscript 1), `x𝋠` (Mayan 0), and `x𝋬` (Mayan 12) aren't, even though all three glyphs are classified as numbers (specifically, other numbers -- `\p{No}`) in Unicode.

The distinction seems to be that `\p{Nd}` (unicode decimals) and `\p{Nl}` (unicode numeric letters) are valid, but `\p{No}` (superscript, subscript, number that is not decimal) isn't, or isn't consistently, valid.

Therefore, identifier validation rules are applied as follows:

- Replace all characters that match `/[^\p{L}\p{Nd}\p{Nl}_$]/gui` with `_` -- note this is a negative match (`[^...]`).
- If the first character matches `/^[^\p{L}_$]/ui`, replace it with `_` -- note this is a negative match

In the rules above:

- `\p{L}` is the character class for Unicode letters of all types, including ideographic scripts
- `\p{Nd}` is the character class for decimal digit numbers (any script except ideographic scripts)
- `\p{Nl}` is the character class for numeric letters (Roman numerals, etc.)

I have not tested these rules exhaustively. They aim to be reasonably permissive but may be too permissive or not permissive enough. I'm not going to write (or copy from [StackOverflow](https://stackoverflow.com/questions/2008279/validate-a-javascript-function-name/9392578#9392578)) an 11,000+ character regular expression to try to be perfect. If you name something `function`, it will pass these rules, but JavaScript will say, "Nope!"

Also, you may be able to write an API spec with Hittite object names in cuneiform, but just because you can doesn't mean you should.