/**
 * Trie (Prefix Tree) for strings.
 * Complexity:
 * - insert(s): O(|s|)
 * - search(s): O(|s|)
 * - startsWith(prefix): O(|prefix| + k) to produce k matches (bounded by traversal)
 */

export type TrieNode = {
  children: Map<string, TrieNode>
  end: boolean
  word?: string
}

export type Trie = {
  root: TrieNode
  insert: (word: string) => void
  search: (word: string) => boolean
  startsWith: (prefix: string) => string[]
}

export function buildTrie(words: string[]): Trie {
  const root: TrieNode = { children: new Map(), end: false }

  const insert = (word: string) => {
    let node = root
    for (const ch of word.toLowerCase()) {
      if (!node.children.has(ch)) {
        node.children.set(ch, { children: new Map(), end: false })
      }
      node = node.children.get(ch)!
    }
    node.end = true
    node.word = word
  }

  const search = (word: string) => {
    let node = root
    for (const ch of word.toLowerCase()) {
      const nxt = node.children.get(ch)
      if (!nxt) return false
      node = nxt
    }
    return !!node.end
  }

  const startsWith = (prefix: string) => {
    let node = root
    for (const ch of prefix.toLowerCase()) {
      const nxt = node.children.get(ch)
      if (!nxt) return []
      node = nxt
    }
    const out: string[] = []
    const dfs = (n: TrieNode) => {
      if (n.end && n.word) out.push(n.word)
      for (const nxt of n.children.values()) dfs(nxt)
    }
    dfs(node)
    return out
  }

  for (const w of words) insert(w)

  return { root, insert, search, startsWith }
}
