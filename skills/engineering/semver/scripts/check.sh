#!/bin/sh
# The Check script of the semver Skill. It does the countable checks of a
# version, a branch name, or the ancestry of a commit, and prints one line:
#   valid: <what it found>      exit 0
#   invalid: <reason>           exit 1
# A usage or Git error goes to stderr with exit 2.
#
#   sh check.sh version <version>        SemVer 2.0.0 syntax (rules 2, 9, 10)
#   sh check.sh branch <name>            branch-name form of the 4 branch types
#   sh check.sh release <version> <v|none>
#       a version for a new release: X.Y.Z, above the last release tag
#   sh check.sh ancestor <commit> <branch>
#       the branch contains the commit

LC_ALL=C
export LC_ALL
set -f

usage() {
    echo "usage: sh check.sh version <version> | branch <name> | release <version> <v|none> | ancestor <commit> <branch>" >&2
    exit 2
}

valid() {
    printf 'valid: %s\n' "$1"
    exit 0
}

invalid() {
    printf 'invalid: %s\n' "$1"
    exit 1
}

is_number() {
    case $1 in '' | *[!0-9]*) return 1 ;; esac
}

# check_core <X.Y.Z>: sets REASON and returns 1 when the core is incorrect.
check_core() {
    case $1 in
    *.*.*) ;;
    *)
        REASON="$1 is not X.Y.Z: 3 numbers with a dot between each 2 (rule 2)."
        return 1
        ;;
    esac
    major=${1%%.*}
    rest=${1#*.}
    minor=${rest%%.*}
    patch=${rest#*.}
    for part in "$major" "$minor" "$patch"; do
        if ! is_number "$part"; then
            REASON="$1 is not X.Y.Z: 3 numbers with a dot between each 2 (rule 2)."
            return 1
        fi
        case $part in 0?*)
            REASON="$part in $1 has a leading zero. X, Y, and Z have no leading zeroes (rule 2)."
            return 1
            ;;
        esac
    done
}

# check_ids <kind> <rule> <ids>: checks the dot-separated identifiers of a
# pre-release or build-metadata part. Sets REASON and returns 1 on a problem.
check_ids() {
    kind=$1
    rule=$2
    ids=$3.
    while [ -n "$ids" ]; do
        id=${ids%%.*}
        ids=${ids#*.}
        if [ -z "$id" ]; then
            REASON="The $kind part has an empty identifier ($rule)."
            return 1
        fi
        case $id in *[!0-9A-Za-z-]*)
            REASON="The $kind identifier $id has a character other than 0-9, A-Z, a-z, and - ($rule)."
            return 1
            ;;
        esac
        if [ "$kind" = pre-release ] && is_number "$id"; then
            case $id in 0?*)
                REASON="The pre-release identifier $id has a leading zero ($rule)."
                return 1
                ;;
            esac
        fi
    done
}

# check_v <version>: a version has no `v`.
check_v() {
    case $1 in [vV]*)
        REASON="$1 has a \`v\`. A version has no \`v\`. The Tag prefix is only for the tag."
        return 1
        ;;
    esac
}

# check_version <version>: SemVer 2.0.0 syntax with optional pre-release and
# build metadata. Sets REASON and returns 1 on a problem.
check_version() {
    check_v "$1" || return 1
    # The build part starts at the first +, the pre-release part at the
    # first - before it.
    main=${1%%+*}
    core=${main%%-*}
    check_core "$core" || return 1
    if [ "$main" != "$core" ]; then
        check_ids pre-release "rule 9" "${main#*-}" || return 1
    fi
    if [ "$main" != "$1" ]; then
        check_ids "build metadata" "rule 10" "${1#*+}" || return 1
    fi
    return 0
}

# check_release_version <version>: X.Y.Z with no pre-release or build part.
check_release_version() {
    check_v "$1" || return 1
    case $1 in *[-+]*)
        REASON="$1 is not X.Y.Z. A release version has no pre-release or build part."
        return 1
        ;;
    esac
    check_core "$1"
}

# above <a> <b>: returns 0 when the X.Y.Z version a is above b.
above() {
    a_rest=${1#*.}
    b_rest=${2#*.}
    set -- "${1%%.*}" "${a_rest%%.*}" "${a_rest#*.}" \
        "${2%%.*}" "${b_rest%%.*}" "${b_rest#*.}"
    [ "$1" -ne "$4" ] && { [ "$1" -gt "$4" ]; return; }
    [ "$2" -ne "$5" ] && { [ "$2" -gt "$5" ]; return; }
    [ "$3" -gt "$6" ]
}

check_branch() {
    name=$1
    case $name in
    feature/* | bugfix/* | release/* | hotfix/*) ;;
    *) invalid "$name has no branch type. A branch name starts with feature/, bugfix/, release/, or hotfix/." ;;
    esac
    type=${name%%/*}
    rest=${name#*/}
    [ -n "$rest" ] || invalid "$name has no name after $type/."
    if [ "$type" = release ]; then
        check_release_version "$rest" ||
            invalid "$name is not release/X.Y.Z. $REASON"
    fi
    if [ "$type" = hotfix ]; then
        case $rest in *[0-9].[0-9]*)
            invalid "$name has a version. A hotfix branch has no version in its name, because the hotfix gets its version at Finish."
            ;;
        esac
    fi
    git check-ref-format --branch "$name" >/dev/null 2>&1 ||
        invalid "git check-ref-format --branch rejects $name."
    valid "$name is a correct $type branch name."
}

check_release() {
    version=$1
    prefix=$2
    [ "$prefix" = none ] && prefix=
    check_release_version "$version" || invalid "$REASON"
    tags=$(git tag --list) || {
        echo "check.sh: git tag --list failed" >&2
        exit 2
    }
    last=
    old_ifs=$IFS
    IFS='
'
    for tag in $tags; do
        case $tag in "$prefix"*) ;; *) continue ;; esac
        candidate=${tag#"$prefix"}
        check_release_version "$candidate" || continue
        if [ -z "$last" ] || above "$candidate" "$last"; then
            last=$candidate
            last_tag=$tag
        fi
    done
    IFS=$old_ifs
    [ -n "$last" ] ||
        valid "$version is X.Y.Z, and no release tag exists."
    above "$version" "$last" ||
        invalid "$version is not above the last release $last (tag $last_tag)."
    valid "$version is X.Y.Z and above the last release $last (tag $last_tag)."
}

check_ancestor() {
    git merge-base --is-ancestor "$1" "$2"
    case $? in
    0) valid "$2 contains $1." ;;
    1) invalid "$2 does not contain $1." ;;
    esac
    echo "check.sh: git merge-base --is-ancestor $1 $2 failed" >&2
    exit 2
}

case $1 in
version)
    [ $# -eq 2 ] || usage
    check_version "$2" || invalid "$REASON"
    valid "$2 is a correct SemVer 2.0.0 version."
    ;;
branch)
    [ $# -eq 2 ] || usage
    check_branch "$2"
    ;;
release)
    [ $# -eq 3 ] || usage
    case $3 in v | none) ;; *) usage ;; esac
    check_release "$2" "$3"
    ;;
ancestor)
    [ $# -eq 3 ] || usage
    check_ancestor "$2" "$3"
    ;;
*) usage ;;
esac
