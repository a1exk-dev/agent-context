# Cases where two sources do not agree

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When two sources do not agree

Use this table:

| Case | What to do |
|---|---|
| The plain-language check to use words that the reader knows, and the approved words of the STE rules | When you select words, use the approved words and the technical words that `ste-rules.md` permits. ASD-STE100 is tier 2. The plain-language checks of this skill do not contain that rule. They tell you to use `ste-rules.md` when you select words. |
| The STE modal verbs, and the text "give freedom where many approaches work" of the Agent Skills specification | `agent-skills-spec.md` does not copy that text. Use CAN or a condition that you write in the sentence. The STE modal verbs are tier 2, and the recommendations of the Agent Skills specification are tier 4. |
| The plain-language check "Use a neutral and direct tone" and CAUTION | Before a step with a risk of damage, use CAUTION, as `ste-rules.md` tells you. CAUTION shows a risk of damage. Use no other emphasis. |
| The rule "Write each pointer as a sentence that gives the file" and the rule "Do not write a pointer to a file that only has a pointer to a different file" | A reference file can give the name of a different reference file that a pointer in `SKILL.md` also identifies. When a reference file gives this name, write the file name without its folder. The two reference files are in the same folder. When the sentence tells the agent to read or obey the different reference file, also write the condition. A sentence of this type does not identify a file that only has a pointer to a different file. |
| The file-size limits in `loading-rules.md` and `agent-skills-spec.md`, and a file-size limit from a different source | When a different source gives a file-size limit, use only the limits in `loading-rules.md` and `agent-skills-spec.md`. These limits are applicable to all target platforms. |
| The rule "Copy the format of the entries" for the glossary and `MEMORY.md`, and the STE rule "Do not omit words" | Copy the format of the entries. The project selects the format of the glossary and `MEMORY.md`. If no definition in the entries starts with the term, start the new definition without the term. |
| The term Rule for a type of file, in `SKILL.md` or in the glossary, and the base-list term "rule" | When you write the word for a requirement in a text, use "rule". When you write the word for the type of file, use the term Rule. The STE rules and the base list use "rule" for a requirement. The capital letter shows the term for the type of file. This case replaces the first sentence of "When the glossary gives a base-list word a different meaning" in `technical-terms.md` for the word "rule". |
| STE rule 1.12 "When an approved verb gives the same instruction as a technical verb, use the approved verb" and the technical verb "edit" | Keep "edit". The verb "edit" tells the reader to keep the file, and the term "edit job" uses the verb "edit". |
| The term Skill in the glossary or the base-list term "skill", and the words "this skill" | Write "this skill" for the skill that you use now. The description of this skill uses these words. Write "Skill" for a Skill that you write or edit. |
| The plain-language check "Put procedure steps in the sequence of the task" and the rule "Put a new pointer in a section whose heading gives the condition of the pointer" | Keep the pointer in its own section after the steps. The pointer rule is tier 1. You can keep a pointer in a numbered step of the main task of a Skill. That step gives the condition. |
| STE rule 5.4 "put the condition at the start of the sentence" and the plain-language check "Do not write the condition of the heading again in each rule of the section" | A heading that gives the condition obeys rule 5.4 for the rules of its section. Do not write that condition again in each rule. Write that condition again only in a pointer and in a step that persons other than the user can see. |

If this table does not give the case, obey the higher tier in the sequence of the tiers in `SKILL.md`. When you obey that tier, write a warning that gives the case and the tier. Then the user can add the case to this table.
