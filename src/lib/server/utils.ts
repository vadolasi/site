import { stat } from "node:fs/promises"
import { join } from "node:path"
import Git from "nodegit"

export async function getFileDates(relativePath: string) {
  const repoPath = process.cwd()
  const absolutePath = join(repoPath, relativePath.slice(1))
  const filePath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath

  try {
    const repo = await Git.Repository.open(repoPath)
    const walker = repo.createRevWalk()
    walker.pushHead()
    walker.sorting(2)

    const dates: Date[] = []

    while (true) {
      try {
        const oid = await walker.next()
        const commit = await Git.Commit.lookup(repo, oid)
        const tree = await commit.getTree()

        try {
          const entry = await tree.entryByPath(filePath)
          const parents = await commit.getParents(2)
          let changed = false

          if (parents.length === 0) {
            changed = true
          } else {
            for (const parent of parents) {
              const parentTree = await parent.getTree()
              try {
                const parentEntry = await parentTree.entryByPath(filePath)
                if (parentEntry.sha() !== entry.sha()) {
                  changed = true
                  break
                }
              } catch {
                changed = true
                break
              }
            }
          }

          if (changed) {
            dates.push(commit.date())
          }
        } catch {
          // File not in this commit
        }
      } catch {
        break
      }
    }

    if (dates.length > 0) {
      return {
        created: dates[dates.length - 1],
        updated: dates[0]
      }
    }
  } catch {
    // ignore
  }

  const stats = await stat(absolutePath)
  return {
    created: stats.birthtime,
    updated: stats.mtime
  }
}
