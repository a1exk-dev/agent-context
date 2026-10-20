# Commit Skill

## Configuration
  1. Check if docs/agents/commit-policy.md exists
    1.1 If - yes, than read optional commit settings from there
    1.2 If - no, than question user about optional settings for Conventional Commits and save them in docs/agents/commit-policy.md, optional settings to consider:
      1.2.1 Does operator wants scope to be added to a commit type: 
  2. Full list of types to put in docs/agents/commit-policy.md if it don't exist there:
    * 'build',
    * 'chore',
    * 'ci',
    * 'docs',
    * 'feat',
    * 'fix',
    * 'perf',
    * 'refactor',
    * 'revert',
    * 'style',
    * 'test'
    Operator is allowed to add his own types if they are needed.
  3. Ask operator if he wants "!" for breaking changes, and add this setting for the commit policy.
  4. Skill should always read docs/agents/commit-policy.md before doing anything 

## Basic principles
  * We strictly follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
  * Apply the commit format and approval policy to every commit, including merge commits; this policy overrides skill defaults.
  * Skill can be executed by an agents

## Pre merge
Before last commit delete ./prototypes/skills/git-commit.md file
